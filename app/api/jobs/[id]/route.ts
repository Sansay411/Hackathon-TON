import { apiError, apiOk } from "@/lib/api/errors";
import { jobSelect, legacyJobSelect, mapJobRow } from "@/lib/api/jobs";
import { demoJobs } from "@/lib/demo/data";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createSupabaseServiceRoleClient();
  if (supabase) {
    const result = await supabase.from("jobs").select(jobSelect).eq("id", id).maybeSingle();
    let data: Record<string, unknown> | null = result.data;
    const error = result.error;
    if (error?.message.includes("deliverables") || error?.message.includes("acceptance_criteria")) {
      const legacy = await supabase.from("jobs").select(legacyJobSelect).eq("id", id).maybeSingle();
      data = legacy.data;
    }
    if (data) {
      return apiOk({ job: mapJobRow(data) });
    }
  }
  const job = demoJobs.find((item) => item.id === id);
  if (!job) {
    return apiError("not_found", "Job not found.", 404);
  }
  return apiOk({ job });
}
