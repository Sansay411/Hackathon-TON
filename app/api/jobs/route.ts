import { apiError, apiOk } from "@/lib/api/errors";
import { jobCreateSchema } from "@/lib/api/validation";
import { demoJobs } from "@/lib/demo/data";

export async function GET() {
  return apiOk({ jobs: demoJobs });
}

export async function POST(request: Request) {
  const parsed = jobCreateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return apiError("bad_request", "Invalid job payload.", 400);
  }
  return apiOk({ job: { id: "draft-job", ...parsed.data, status: "draft" }, auditEvent: "job_created" }, 201);
}
