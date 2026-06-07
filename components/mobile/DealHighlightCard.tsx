import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { AiRiskBadge } from "@/components/mobile/AiRiskBadge";

export function DealHighlightCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#00658e] p-5 text-white shadow-[0_18px_38px_rgba(0,101,142,0.20)]">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#85cfff]/25" />
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[#acedff]">Active escrow</p>
          <h2 className="mt-2 text-2xl font-black tracking-normal">Landing Page Design</h2>
        </div>
        <div className="rounded-2xl bg-white/10 p-3 text-[#acedff]">
          <ShieldCheck className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-[22px] bg-white/10 p-3">
          <p className="text-xs text-white/60">Amount</p>
          <p className="mt-1 text-xl font-black">20 USDT</p>
        </div>
        <div className="rounded-[22px] bg-white/10 p-3">
          <p className="text-xs text-white/60">Status</p>
          <p className="mt-1 text-xl font-black">Funded</p>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <AiRiskBadge risk="Low" />
        <Link className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#00658e]" href="/deals/foundation-preview">
          View Deal
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
