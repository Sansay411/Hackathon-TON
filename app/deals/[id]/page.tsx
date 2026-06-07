import Link from "next/link";
import { Bot, ReceiptText, ShieldCheck } from "lucide-react";
import { AiRiskBadge } from "@/components/mobile/AiRiskBadge";
import { DealTimeline } from "@/components/mobile/DealTimeline";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PaymentStatusCard } from "@/components/mobile/PaymentStatusCard";
import type { AiReview } from "@/lib/domain/types";

const review: AiReview = {
  clarityScore: 82,
  riskLevel: "medium",
  missingItems: ["Final copy handoff format", "Revision deadline"],
  disputeRisks: ["Scope changes must be confirmed before extra work starts."],
  suggestedTerms: [
    "Deliver a responsive landing page with source files.",
    "Include two revision rounds before approval.",
    "Client acceptance should be based on the agreed sections and wallet CTA."
  ]
};

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <MobileShell>
      <div className="space-y-5">
        <header className="relative overflow-hidden rounded-[34px] bg-[#00658e] p-5 text-white shadow-[0_22px_44px_rgba(0,101,142,0.24)]">
          <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[#85cfff]/25" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-[#acedff]">Deal summary</p>
              <h1 className="mt-2 text-[28px] font-black leading-tight tracking-normal">Landing Page Design</h1>
              <p className="mt-2 text-sm font-medium leading-6 text-white/70">Deal {id} is prepared for TON-native escrow verification.</p>
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
              <p className="mt-1 text-xl font-black">Waiting</p>
            </div>
          </div>
        </header>

        <section className="rounded-[30px] border border-[#dfe3e8] bg-white p-5 shadow-[0_14px_34px_rgba(0,101,142,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-[#229ED9]">Mira AI review</p>
              <h2 className="mt-1 text-2xl font-black">{review.clarityScore}/100 clarity</h2>
            </div>
            <div className="rounded-2xl bg-[#00658e] p-3 text-white">
              <Bot className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex">
            <AiRiskBadge risk="Medium" />
          </div>
          <div className="mt-4 space-y-2 text-sm font-semibold text-[#64748b]">
            {review.suggestedTerms.slice(0, 3).map((term) => (
              <p key={term}>{term}</p>
            ))}
          </div>
        </section>

        <PaymentStatusCard dealId={id} amount="20" asset="TON" />
        <DealTimeline />
        <Link className="flex items-center justify-center gap-2 rounded-[22px] bg-[#229ED9] px-4 py-3 font-black text-white" href={`/deals/${id}/receipt`}>
          <ReceiptText className="h-4 w-4" />
          Open receipt
        </Link>
      </div>
    </MobileShell>
  );
}
