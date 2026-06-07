"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { AiRiskBadge } from "@/components/mobile/AiRiskBadge";
import type { ParsedMiraReview } from "@/lib/mira/intent";

export function MiraReviewResult({ parsed }: { parsed: ParsedMiraReview }) {
  const { t } = useLanguage();
  const [rawOpen, setRawOpen] = useState(false);

  if (!parsed.ok) {
    return (
      <div className="mt-4 rounded-2xl border border-[#f0c0c8] bg-[#fff5f6] p-4">
        <p className="text-xs font-black uppercase tracking-[0.5px] text-[#9f1239]">{t.mira.unstructured}</p>
        <pre className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-5 text-[#171c20]">{parsed.raw}</pre>
      </div>
    );
  }

  const { review } = parsed;

  return (
    <div className="mt-4 space-y-4 rounded-2xl border border-[#dfe3e8] bg-[#f9fcff] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.5px] text-[#64748b]">{t.mira.clarityScore}</p>
          <p className="mt-1 text-2xl font-black text-[#171c20]">
            {review.clarityScore !== null ? `${review.clarityScore}/100` : t.mira.none}
          </p>
        </div>
        {review.riskLevel ? <AiRiskBadge risk={review.riskLevel} /> : null}
      </div>

      <ReviewList title={t.mira.missingItems} items={review.missingItems} />
      <ReviewList title={t.mira.suggestedTerms} items={review.suggestedTerms} />
      <ReviewList title={t.mira.disputeChecklist} items={review.disputeChecklist} />

      {review.finalRecommendation ? (
        <div>
          <p className="text-xs font-black uppercase tracking-[0.5px] text-[#64748b]">{t.mira.finalRecommendation}</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-[#171c20]">{review.finalRecommendation}</p>
        </div>
      ) : null}

      <div>
        <button
          className="text-xs font-black text-[#00658e] underline"
          onClick={() => setRawOpen((open) => !open)}
          type="button"
        >
          {t.mira.rawResponse}
        </button>
        {rawOpen ? (
          <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-2xl bg-white px-3 py-2 text-xs font-medium leading-5 text-[#64748b]">{parsed.raw}</pre>
        ) : null}
      </div>
    </div>
  );
}

function ReviewList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.5px] text-[#64748b]">{title}</p>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm font-semibold leading-5 text-[#171c20]">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
