import { apiOk } from "@/lib/api/errors";
import { demoJobs } from "@/lib/demo/data";
import { createMiraProvider } from "@/lib/mira/provider";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = demoJobs.find((item) => item.id === id) ?? demoJobs[0];
  const review = await createMiraProvider().reviewDeal({
    title: job.title,
    description: job.description,
    priceAmount: job.budgetAmount,
    priceToken: job.budgetToken,
    deadline: job.deadline
  });
  return apiOk({ review, auditEvent: "job_ai_reviewed" });
}
