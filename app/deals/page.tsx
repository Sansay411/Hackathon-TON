"use client";

import { Search } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { DealHighlightCard } from "@/components/mobile/DealHighlightCard";
import { DealListCard } from "@/components/mobile/DealListCard";
import { EmptyState } from "@/components/mobile/EmptyState";
import { MobileShell } from "@/components/mobile/MobileShell";

export default function DealsPage() {
  const { t } = useLanguage();
  const sampleDeals: {
    dealId: string;
    title: string;
    description: string;
    amount: string;
    status: string;
    risk: "Low" | "Medium" | "High";
  }[] = [
    {
      dealId: "brand-sprint",
      title: t.deals.sampleBrand,
      description: t.deals.sampleBrandBody,
      amount: "320 TON",
      status: t.deals.statuses.waiting,
      risk: "Medium" as const
    },
    {
      dealId: "telegram-bot",
      title: t.deals.sampleBot,
      description: t.deals.sampleBotBody,
      amount: "120 USDT",
      status: t.deals.statuses.completed,
      risk: "Low" as const
    }
  ];

  return (
    <MobileShell>
      <div className="space-y-5">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black text-[#229ED9]">{t.deals.eyebrow}</p>
            <h1 className="mt-1 text-[34px] font-black leading-none tracking-normal">{t.deals.title}</h1>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00658e] text-sm font-black text-white ring-4 ring-white/70">WP</div>
        </header>

        <label className="flex h-14 items-center gap-3 rounded-[24px] border border-[#dfe3e8] bg-white px-4 shadow-[0_12px_30px_rgba(0,101,142,0.08)]">
          <Search className="h-5 w-5 text-[#64748b]" />
          <input className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#64748b]" placeholder={t.deals.search} />
        </label>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {t.deals.tabs.map((tab, index) => (
            <button
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-black shadow-sm ${index === 0 ? "bg-[#00658e] text-white" : "bg-white text-[#64748b]"}`}
              key={tab}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        {sampleDeals.length === 0 ? (
          <EmptyState title={t.deals.noDealsTitle} body={t.deals.noDealsBody} action={t.deals.createJob} href="/jobs/new" />
        ) : (
          <DealHighlightCard />
        )}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">{t.deals.recent}</h2>
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[#64748b]">{t.common.liveFlow}</span>
          </div>
          {sampleDeals.map((deal) => <DealListCard key={deal.dealId} {...deal} />)}
        </section>
      </div>
    </MobileShell>
  );
}
