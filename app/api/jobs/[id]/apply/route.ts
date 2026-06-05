import { apiError, apiOk } from "@/lib/api/errors";
import { applyJobSchema } from "@/lib/api/validation";
import { demoApplications, demoJobs, demoProfile } from "@/lib/demo/data";
import { assertCanSpendEnergy, calculateApplicationEnergyCost } from "@/lib/energy/service";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = applyJobSchema.safeParse(await request.json());
  if (!parsed.success) {
    return apiError("bad_request", "Invalid application payload.", 400);
  }
  const job = demoJobs.find((item) => item.id === id);
  if (!job) {
    return apiError("not_found", "Job not found.", 404);
  }
  if (demoApplications.some((application) => application.jobId === id && application.freelancerId === demoProfile.id)) {
    return apiError("conflict", "You already applied to this job.", 409);
  }
  const energyCost = calculateApplicationEnergyCost({ rating: demoProfile.rating ?? 0, premiumJob: job.budgetAmount === "450" });
  try {
    assertCanSpendEnergy(demoProfile, energyCost);
  } catch (error) {
    return apiError("conflict", error instanceof Error ? error.message : "Not enough Energy.", 409);
  }
  return apiOk({
    application: { id: "application-demo-new", jobId: id, proposalText: parsed.data.proposalText, energyCost },
    auditEvents: ["application_created", "energy_spent"]
  });
}
