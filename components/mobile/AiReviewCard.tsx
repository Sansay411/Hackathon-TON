import { Bot } from "lucide-react";
import type { AiReview } from "@/lib/domain/types";
import { AiRiskBadge } from "@/components/mobile/AiRiskBadge";

export function AiReviewCard({ review, label = "Mira AI review" }: { review: AiReview; label?: string }) {
  const risk = (review.riskLevel[0].toUpperCase() + review.riskLevel.slice(1)) as "Low" | "Medium" | "High";
  const isRealAiConfigured = Boolean(process.env.DEEPSEEK_API_KEY || process.env.MIRA_API_KEY);
  return (
    <section className="rounded-[30px] bg-[#ffffff] p-5 shadow-[0_14px_34px_rgba(17,24,15,0.09)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-[#229ED9]">{label}</p>
          <h2 className="mt-1 text-2xl font-black">{review.clarityScore}/100 clarity</h2>
        </div>
        <div className="rounded-2xl bg-[#171c20] p-3 text-[#e6f7ff]">
          <Bot className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4">
        <AiRiskBadge risk={risk} />
      </div>
      <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-[#64748b]">
        {isRealAiConfigured ? "Mira connected" : "Development provider"}
      </p>
      <div className="mt-4 space-y-2 text-sm font-semibold text-[#64748b]">
        {review.suggestedTerms.slice(0, 3).map((term) => <p key={term}>{term}</p>)}
      </div>
    </section>
  );
}
