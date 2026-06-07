"use client";

import { useState } from "react";
import { CheckCircle2, Zap } from "lucide-react";
import type { JobApplication } from "@/lib/domain/types";
import { useWalletAccess } from "@/components/wallet-access";
import { useTelegram } from "@/components/telegram-provider";
import { useLanguage } from "@/components/language-provider";

export function ApplicationCard({ application }: { application: JobApplication }) {
  const [result, setResult] = useState<string | null>(null);
  const { walletAddress, isConnected, isTelegram } = useWalletAccess();
  const { initData } = useTelegram();
  const { t } = useLanguage();

  return (
    <section className="rounded-[28px] bg-[#ffffff] p-4 shadow-[0_14px_34px_rgba(17,24,15,0.09)]">
      <div className="flex items-center justify-between">
          <p className="font-black">{t.applicationCard.application}</p>
          <span className="rounded-full bg-[#e6f7ff] px-3 py-1 text-xs font-black">{application.status}</span>
        </div>
      <p className="mt-2 text-sm font-semibold leading-5 text-[#64748b]">{application.proposalText}</p>
      <div className="mt-4 flex items-center justify-between text-sm font-black">
        <span className="flex items-center gap-1">
          <Zap className="h-4 w-4 text-[#229ED9]" />
          {application.energyCost} {t.energyCard.label}
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-4 w-4 text-[#229ED9]" />
          AI {application.aiScore ?? 0}/100
        </span>
      </div>
      <button
        className="mt-4 w-full rounded-[20px] bg-[#e6f7ff] px-4 py-3 text-sm font-black text-[#171c20]"
        onClick={async () => {
          if (!isConnected || !walletAddress || !isTelegram) {
            setResult(t.walletGate.connectToContinue);
            return;
          }

          const response = await fetch(`/api/applications/${application.id}/accept`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ initData, walletAddress })
          });
          const payload = (await response.json()) as { ok?: boolean; data?: { dealId?: string }; error?: { message?: string } };
          if (!response.ok || !payload.ok) {
            setResult(payload.error?.message ?? t.walletGate.connectToContinue);
            return;
          }
          setResult(payload.data?.dealId ? `${t.applicationCard.dealCreatedPrefix} ${payload.data.dealId}` : t.applicationCard.noDealId);
        }}
        disabled={!isConnected || !isTelegram}
        type="button"
      >
        {isConnected && isTelegram ? t.applicationCard.accept : t.walletGate.connectToContinue}
      </button>
      {!isTelegram ? <p className="mt-2 text-xs font-black text-[#64748b]">{t.applicationCard.openInsideTelegram}</p> : null}
      {result ? <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-black text-[#229ED9]">{result}</p> : null}
    </section>
  );
}
