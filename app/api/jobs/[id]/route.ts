import { apiError, apiOk } from "@/lib/api/errors";
import { demoJobs } from "@/lib/demo/data";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = demoJobs.find((item) => item.id === id);
  if (!job) {
    return apiError("not_found", "Job not found.", 404);
  }
  return apiOk({ job });
}
