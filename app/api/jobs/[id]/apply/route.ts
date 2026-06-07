import { apiError, apiOk } from "@/lib/api/errors";
import { getVerifiedProfile, walletRequiredError } from "@/lib/api/profile";
import { applyJobSchema } from "@/lib/api/validation";
import { assertCanSpendEnergy, calculateApplicationEnergyCost } from "@/lib/energy/service";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = applyJobSchema.safeParse(await request.json());
  if (!parsed.success) {
    return apiError("bad_request", "Invalid application payload.", 400);
  }

  const profileResult = await getVerifiedProfile(parsed.data.initData);
  if (profileResult.status === "telegram_required") {
    return apiError("telegram_required", profileResult.message, 400);
  }
  if (profileResult.status === "setup_required") {
    return apiError("setup_required", profileResult.message, 503);
  }
  if (profileResult.status === "unauthorized") {
    return apiError("unauthorized", profileResult.message, 401);
  }
  if (!profileResult.profile.walletAddress) {
    return apiError(walletRequiredError().error, walletRequiredError().message, 403);
  }

  const supabase = createSupabaseServiceRoleClient();
  if (!supabase) {
    return apiError("setup_required", "Supabase service role is required for applications.", 503);
  }

  const { data: job } = await supabase.from("jobs").select("id, client_id, status, budget_amount").eq("id", id).single();
  if (!job) {
    return apiError("not_found", "Job not found.", 404);
  }
  if (job.client_id === profileResult.profile.id) {
    return apiError("forbidden", "Clients cannot apply to their own job.", 403);
  }
  if (job.status !== "published" && job.status !== "ai_reviewed") {
    return apiError("conflict", "This job is not open for applications.", 409);
  }

  const { data: duplicate } = await supabase
    .from("job_applications")
    .select("id")
    .eq("job_id", id)
    .eq("freelancer_id", profileResult.profile.id)
    .maybeSingle();
  if (duplicate) {
    return apiError("conflict", "You already applied to this job.", 409);
  }

  const energyCost = calculateApplicationEnergyCost({ rating: profileResult.profile.rating, premiumJob: Number(job.budget_amount) >= 450 });
  try {
    assertCanSpendEnergy(profileResult.profile, energyCost);
  } catch (error) {
    return apiError("conflict", error instanceof Error ? error.message : "Not enough Energy.", 409);
  }

  const { data: application, error: applicationError } = await supabase
    .from("job_applications")
    .insert({
      job_id: id,
      freelancer_id: profileResult.profile.id,
      proposal_text: parsed.data.proposalText,
      energy_cost: energyCost
    })
    .select("id, job_id, proposal_text, energy_cost, status")
    .single();

  if (applicationError || !application) {
    return apiError("conflict", "Application could not be created. You may have already applied.", 409);
  }

  await supabase
    .from("profiles")
    .update({ energy_balance: profileResult.profile.energyBalance - energyCost })
    .eq("id", profileResult.profile.id);

  await supabase.from("energy_transactions").insert({
    profile_id: profileResult.profile.id,
    amount: -energyCost,
    type: "application_spend",
    reason: "Applied to job",
    related_job_id: id,
    related_application_id: application.id
  });

  return apiOk({
    application,
    energyBalance: profileResult.profile.energyBalance - energyCost,
    auditEvents: ["application_created", "energy_spent"]
  }, 201);
}
