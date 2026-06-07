"use client";

import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import type { StonfiQuoteResult } from "@/lib/stonfi/types";

function formatQuoteTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return `${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")} UTC`;
}

export function StonfiQuoteCard({ quote }: { quote: StonfiQuoteResult }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-[22px] border border-[#dfe3e8] bg-[#f6faff] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-wide text-[#229ED9]">{t.smartSettlement.liveQuote}</p>
        <p className="text-xs font-semibold text-[#64748b]">{formatQuoteTime(quote.timestamp)}</p>
      </div>

      <div className="mt-3 flex items-center gap-2 text-lg font-black text-[#171c20]">
        <span>{quote.route[0]}</span>
        <ArrowRight className="h-4 w-4 text-[#229ED9]" />
        <span>{quote.route[quote.route.length - 1]}</span>
      </div>

      <div className="mt-3 grid gap-2 text-sm">
        <QuoteRow label={t.smartSettlement.youPay} value={`~${quote.inputAmount} ${quote.fromAsset}`} strong />
        <QuoteRow label={t.smartSettlement.freelancerReceives} value={`${quote.outputAmount} ${quote.toAsset}`} strong />
        {quote.minReceived ? <QuoteRow label={t.smartSettlement.minReceived} value={`${quote.minReceived} ${quote.toAsset}`} /> : null}
        <QuoteRow label={t.smartSettlement.provider} value={quote.provider} />
        {quote.resolver ? <QuoteRow label={t.smartSettlement.resolver} value={quote.resolver} /> : null}
        <QuoteRow label={t.smartSettlement.quoteTime} value={formatQuoteTime(quote.timestamp)} />
      </div>
    </div>
  );
}

function QuoteRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-semibold text-[#64748b]">{label}</span>
      <span className={`text-right ${strong ? "text-base font-black text-[#171c20]" : "font-semibold text-[#171c20]"}`}>{value}</span>
    </div>
  );
}
