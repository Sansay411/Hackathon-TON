import { apiError, apiOk } from "@/lib/api/errors";
import { getVerifiedProfile, walletRequiredError } from "@/lib/api/profile";
import { walletConnectSchema } from "@/lib/api/validation";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = walletConnectSchema.safeParse(await request.json());
  if (!parsed.success) {
    return apiError("bad_request", "Invalid accept payload.", 400);
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
    return apiError("setup_required", "Supabase service role is required for application acceptance.", 503);
  }

  const { data: application } = await supabase
    .from("job_applications")
    .select("id, job_id, freelancer_id, status, jobs(id, client_id, title, description, budget_amount, budget_token, deadline)")
    .eq("id", id)
    .single();
  if (!application || !application.jobs) {
    return apiError("not_found", "Application not found.", 404);
  }
  const job = Array.isArray(application.jobs) ? application.jobs[0] : application.jobs;
  if (job.client_id !== profileResult.profile.id) {
    return apiError("forbidden", "Only the job owner can accept applications.", 403);
  }
  if (application.freelancer_id === profileResult.profile.id) {
    return apiError("forbidden", "Freelancer cannot accept their own application as client.", 403);
  }
  if (application.status !== "submitted" && application.status !== "shortlisted") {
    return apiError("conflict", "This application cannot be accepted.", 409);
  }

  const { data: deal, error: dealError } = await supabase
    .from("deals")
    .insert({
      client_id: profileResult.profile.id,
      freelancer_id: application.freelancer_id,
      job_id: application.job_id,
      application_id: application.id,
      title: job.title,
      description: job.description,
      price_amount: job.budget_amount,
      price_token: job.budget_token,
      deadline: job.deadline,
      status: "waiting_payment",
      settlement_asset: job.budget_token
    })
    .select("id, status")
    .single();

  if (dealError || !deal) {
    return apiError("server_error", "Deal could not be created from application.", 500);
  }

  await supabase.from("job_applications").update({ status: "accepted" }).eq("id", application.id);
  await supabase.from("jobs").update({ status: "matched" }).eq("id", application.job_id);
  await supabase.from("deal_events").insert({
    deal_id: deal.id,
    actor_id: profileResult.profile.id,
    event_type: "deal_created",
    to_status: "waiting_payment",
    metadata: { applicationId: application.id, jobId: application.job_id }
  });

  return apiOk({ application: { id: application.id, status: "accepted" }, dealId: deal.id, auditEvents: ["deal_created"] }, 201);
}
