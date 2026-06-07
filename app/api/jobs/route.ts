import { apiError, apiOk } from "@/lib/api/errors";
import { jobSelect, legacyJobSelect, mapJobRow } from "@/lib/api/jobs";
import { jobCreateSchema } from "@/lib/api/validation";
import { demoJobs } from "@/lib/demo/data";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createSupabaseServiceRoleClient();
  if (supabase) {
    const result = await supabase.from("jobs").select(jobSelect).order("created_at", { ascending: false });
    let data: Record<string, unknown>[] | null = result.data;
    let error = result.error;
    if (error?.message.includes("deliverables") || error?.message.includes("acceptance_criteria")) {
      const legacy = await supabase.from("jobs").select(legacyJobSelect).order("created_at", { ascending: false });
      data = legacy.data;
      error = legacy.error;
    }
    if (!error && data && data.length > 0) {
      return apiOk({ jobs: data.map((row) => mapJobRow(row)) });
    }
  }
  return apiOk({ jobs: demoJobs });
}

export async function POST(request: Request) {
  const parsed = jobCreateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return apiError("bad_request", "Invalid job payload.", 400);
  }
  return apiOk({ job: { id: "draft-job", ...parsed.data, status: "draft" }, auditEvent: "job_created" }, 201);
}
