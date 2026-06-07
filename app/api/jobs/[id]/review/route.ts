import { apiOk } from "@/lib/api/errors";
import { jobSelect, legacyJobSelect, mapJobRow } from "@/lib/api/jobs";
import { demoJobs } from "@/lib/demo/data";
import { createMiraProvider } from "@/lib/mira/provider";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createSupabaseServiceRoleClient();
  const result = supabase ? await supabase.from("jobs").select(jobSelect).eq("id", id).maybeSingle() : { data: null, error: null };
  let data: Record<string, unknown> | null = result.data;
  const error = result.error;
  if (supabase && (error?.message.includes("deliverables") || error?.message.includes("acceptance_criteria"))) {
    const legacy = await supabase.from("jobs").select(legacyJobSelect).eq("id", id).maybeSingle();
    data = legacy.data;
  }
  const job = data ? mapJobRow(data) : demoJobs.find((item) => item.id === id) ?? demoJobs[0];
  const review = await createMiraProvider().reviewDeal({
    title: job.title,
    description: job.description,
    priceAmount: job.budgetAmount,
    priceToken: job.budgetToken,
    deadline: job.deadline
  });
  return apiOk({ review, auditEvent: "job_ai_reviewed" });
}
