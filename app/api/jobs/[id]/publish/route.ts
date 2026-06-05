import { apiError, apiOk } from "@/lib/api/errors";
import { demoJobs } from "@/lib/demo/data";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = demoJobs.find((item) => item.id === id);
  if (!job) {
    return apiError("not_found", "Job not found.", 404);
  }
  if (!job.aiScore) {
    return apiError("conflict", "Run Mira review before publishing.", 409);
  }
  return apiOk({ job: { ...job, status: "published" }, auditEvent: "job_published" });
}
