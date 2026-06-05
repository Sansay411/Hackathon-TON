import { Search } from "lucide-react";
import { DealHighlightCard } from "@/components/mobile/DealHighlightCard";
import { DealListCard } from "@/components/mobile/DealListCard";
import { EmptyState } from "@/components/mobile/EmptyState";
import { MobileShell } from "@/components/mobile/MobileShell";

// Placeholder UI state only. Replace with Supabase-backed deal data when auth and RLS are finalized.
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
    title: "Brand identity sprint",
    description: "Logo refresh, compact design system, and final export package.",
    amount: "320 TON",
    status: "Waiting",
    risk: "Medium" as const
  },
  {
    dealId: "telegram-bot",
    title: "Telegram bot launch",
    description: "Mini App bot onboarding, command menu, and launch polish.",
    amount: "120 USDT",
    status: "Completed",
    risk: "Low" as const
  }
];

const tabs = ["All", "Funded", "Waiting", "Completed", "Disputed"];

export default function DealsPage() {
  return (
    <MobileShell>
      <div className="space-y-5">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black text-[#229ED9]">WorkPay dashboard</p>
            <h1 className="mt-1 text-[34px] font-black leading-none tracking-normal">My Deals</h1>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#182014] text-sm font-black text-[#c8ff45] ring-4 ring-white/70">WP</div>
        </header>

        <label className="flex h-14 items-center gap-3 rounded-[24px] border border-white/70 bg-[#fbfff5] px-4 shadow-[0_12px_30px_rgba(17,24,15,0.08)]">
          <Search className="h-5 w-5 text-[#66735c]" />
          <input className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#829078]" placeholder="Search deals" />
        </label>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {tabs.map((tab, index) => (
            <button
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-black shadow-sm ${index === 0 ? "bg-[#182014] text-[#c8ff45]" : "bg-[#fbfff5] text-[#66735c]"}`}
              key={tab}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        {sampleDeals.length === 0 ? (
          <EmptyState title="No deals yet" body="Accept an application or create a job to start a protected WorkPay deal." action="Create job" href="/jobs/new" />
        ) : (
          <DealHighlightCard />
        )}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">Recent deals</h2>
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[#66735c]">Demo UI</span>
          </div>
          {sampleDeals.map((deal) => <DealListCard key={deal.dealId} {...deal} />)}
        </section>
      </div>
    </MobileShell>
  );
}
