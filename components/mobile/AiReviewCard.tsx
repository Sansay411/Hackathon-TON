"use client";

import { Bot } from "lucide-react";
import type { AiReview } from "@/lib/domain/types";
import { AiRiskBadge } from "@/components/mobile/AiRiskBadge";
import { useLanguage } from "@/components/language-provider";

export function AiReviewCard({ review, label }: { review: AiReview; label?: string }) {
  const { t } = useLanguage();
  const risk = (review.riskLevel[0].toUpperCase() + review.riskLevel.slice(1)) as "Low" | "Medium" | "High";
  const isRealAiConfigured = Boolean(process.env.NEXT_PUBLIC_MIRA_CONFIGURED);
  return (
    <section className="rounded-[30px] bg-[#ffffff] p-5 shadow-[0_14px_34px_rgba(17,24,15,0.09)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-[#229ED9]">{label ?? t.aiReview.defaultLabel}</p>
          <h2 className="mt-1 text-2xl font-black">{review.clarityScore}/100 {t.aiReview.clarity}</h2>
        </div>
        <div className="rounded-2xl bg-[#171c20] p-3 text-[#e6f7ff]">
          <Bot className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4">
        <AiRiskBadge risk={risk} />
      </div>
      <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-[#64748b]">
        {isRealAiConfigured ? t.aiReview.miraConnected : t.aiReview.devProvider}
      </p>
      <div className="mt-4 space-y-2 text-sm font-semibold text-[#64748b]">
        {review.suggestedTerms.slice(0, 3).map((term) => <p key={term}>{term}</p>)}
      </div>
      <ReviewBlock title={t.mira.missingItems} items={review.missingItems} />
      <ReviewBlock title={t.mira.disputeChecklist} items={review.disputeRisks} />
    </section>
  );
}

function ReviewBlock({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <div className="mt-4">
      <p className="text-xs font-black uppercase tracking-[0.5px] text-[#64748b]">{title}</p>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm font-semibold leading-5 text-[#171c20]">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
