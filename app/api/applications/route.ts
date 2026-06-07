import { apiOk } from "@/lib/api/errors";
import { applicationSelect, mapApplicationRow } from "@/lib/api/jobs";
import { demoApplications } from "@/lib/demo/data";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createSupabaseServiceRoleClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("job_applications")
      .select(applicationSelect)
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return apiOk({ applications: data.map((row) => mapApplicationRow(row)) });
    }
  }
  return apiOk({ applications: demoApplications });
}
