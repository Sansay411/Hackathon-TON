import Link from "next/link";
import { Bot, ReceiptText, ShieldCheck } from "lucide-react";
import { AiRiskBadge } from "@/components/mobile/AiRiskBadge";
import { DealTimeline } from "@/components/mobile/DealTimeline";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PaymentStatusCard } from "@/components/mobile/PaymentStatusCard";
import { createMiraProvider } from "@/lib/mira/provider";

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await createMiraProvider().reviewDeal({
    title: "Landing Page Design",
    description: "Design and deliver a responsive landing page with clear acceptance criteria, source files, and two revision rounds.",
    priceAmount: "20",
    priceToken: "USDT",
    deadline: "2026-06-20"
  });

  return (
    <MobileShell>
      <div className="space-y-5">
        <header className="relative overflow-hidden rounded-[34px] bg-[#182014] p-5 text-white shadow-[0_22px_44px_rgba(17,24,15,0.28)]">
          <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[#c8ff45]/20" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-[#c8ff45]">Deal summary</p>
              <h1 className="mt-2 text-[28px] font-black leading-tight tracking-normal">Landing Page Design</h1>
              <p className="mt-2 text-sm font-medium leading-6 text-white/70">Deal {id} is prepared for TON-native escrow verification.</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 text-[#c8ff45]">
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
              <p className="mt-1 text-xl font-black">Waiting</p>
            </div>
          </div>
        </header>

        <section className="rounded-[30px] border border-white/70 bg-[#fbfff5] p-5 shadow-[0_14px_34px_rgba(17,24,15,0.09)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-[#229ED9]">Mira AI review</p>
              <h2 className="mt-1 text-2xl font-black">{review.clarityScore}/100 clarity</h2>
            </div>
            <div className="rounded-2xl bg-[#182014] p-3 text-[#c8ff45]">
              <Bot className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex">
            <AiRiskBadge risk="Medium" />
          </div>
          <div className="mt-4 space-y-2 text-sm font-semibold text-[#66735c]">
            {review.suggestedTerms.slice(0, 3).map((term) => (
              <p key={term}>{term}</p>
            ))}
          </div>
        </section>

        <PaymentStatusCard />
        <DealTimeline />
        <Link className="flex items-center justify-center gap-2 rounded-[22px] bg-[#c8ff45] px-4 py-3 font-black text-[#182014]" href={`/deals/${id}/receipt`}>
          <ReceiptText className="h-4 w-4" />
          Open receipt
        </Link>
      </div>
    </MobileShell>
  );
}
