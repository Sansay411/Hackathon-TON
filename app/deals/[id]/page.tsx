"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ReceiptText, ShieldCheck } from "lucide-react";
import { DealTimeline } from "@/components/mobile/DealTimeline";
import { MobileShell } from "@/components/mobile/MobileShell";
import { MiraIntentPanel } from "@/components/mira/MiraIntentPanel";
import { SmartSettlementCard } from "@/components/stonfi/SmartSettlementCard";
import { PaymentStatusCard } from "@/components/mobile/PaymentStatusCard";
import { useLanguage } from "@/components/language-provider";
import { demoDealScenario } from "@/lib/demo/data";

export default function DealDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { t } = useLanguage();
  const deal = { ...demoDealScenario, id };

  return (
    <MobileShell>
      <div className="space-y-5">
        <header className="relative overflow-hidden rounded-[34px] bg-[#00658e] p-5 text-white shadow-[0_22px_44px_rgba(0,101,142,0.24)]">
          <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[#85cfff]/25" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-[#acedff]">{t.dealDetail.eyebrow}</p>
              <h1 className="mt-2 text-[28px] font-black leading-tight tracking-normal">{deal.title}</h1>
              <p className="mt-2 text-sm font-medium leading-6 text-white/70">{t.dealDetail.dealWord} {id} {t.dealDetail.summaryNote}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 text-[#acedff]">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[22px] bg-white/10 p-3">
              <p className="text-xs text-white/60">{t.dealDetail.amount}</p>
              <p className="mt-1 text-xl font-black">{deal.amount} {deal.token}</p>
            </div>
            <div className="rounded-[22px] bg-white/10 p-3">
              <p className="text-xs text-white/60">{t.dealDetail.status}</p>
              <p className="mt-1 text-xl font-black">{t.deals.statuses.waiting}</p>
            </div>
          </div>
        </header>

        <MiraIntentPanel
          input={{
            type: "deal_review",
            id,
            title: deal.title,
            description: deal.description,
            budgetAmount: deal.amount,
            budgetToken: deal.token,
            deadline: deal.deadline,
            deliverables: deal.deliverables,
            acceptanceCriteria: deal.acceptanceCriteria,
            riskContextShort: deal.riskContextShort
          }}
        />

        <SmartSettlementCard dealId={id} settlementAmount="50" payAsset="TON" settlementAsset="USDT" />
        <PaymentStatusCard dealId={id} amount={deal.amount} asset={deal.token} />
        <DealTimeline />
        <Link className="flex items-center justify-center gap-2 rounded-[22px] bg-[#229ED9] px-4 py-3 font-black text-white" href={`/deals/${id}/receipt`}>
          <ReceiptText className="h-4 w-4" />
          {t.dealDetail.openReceipt}
        </Link>
      </div>
    </MobileShell>
  );
}
