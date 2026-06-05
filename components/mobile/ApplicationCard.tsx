"use client";

import { useState } from "react";
import { CheckCircle2, Zap } from "lucide-react";
import type { JobApplication } from "@/lib/domain/types";
import { useWalletAccess } from "@/components/wallet-access";

export function ApplicationCard({ application }: { application: JobApplication }) {
  const [result, setResult] = useState<string | null>(null);
  const { walletAddress, isConnected, isTelegram } = useWalletAccess();

  return (
    <section className="rounded-[28px] bg-[#fbfff5] p-4 shadow-[0_14px_34px_rgba(17,24,15,0.09)]">
      <div className="flex items-center justify-between">
          <p className="font-black">Application</p>
          <span className="rounded-full bg-[#c8ff45] px-3 py-1 text-xs font-black">{application.status}</span>
        </div>
      <p className="mt-2 text-sm font-semibold leading-5 text-[#66735c]">{application.proposalText}</p>
      <div className="mt-4 flex items-center justify-between text-sm font-black">
        <span className="flex items-center gap-1">
          <Zap className="h-4 w-4 text-[#229ED9]" />
          {application.energyCost} Energy
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-4 w-4 text-[#229ED9]" />
          AI {application.aiScore ?? 0}/100
        </span>
      </div>
      <button
        className="mt-4 w-full rounded-[20px] bg-[#c8ff45] px-4 py-3 text-sm font-black text-[#182014]"
        onClick={async () => {
          if (!isConnected || !walletAddress || !isTelegram) {
            setResult("Connect TON wallet to continue.");
            return;
          }

          const response = await fetch(`/api/applications/${application.id}/accept`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ walletAddress })
          });
          const payload = (await response.json()) as { ok?: boolean; data?: { dealId?: string }; error?: { message?: string } };
          if (!response.ok || !payload.ok) {
            setResult(payload.error?.message ?? "Connect TON wallet to continue.");
            return;
          }
          setResult(payload.data?.dealId ? `Deal created: ${payload.data.dealId}` : "Deal creation route returned no id");
        }}
        disabled={!isConnected || !isTelegram}
        type="button"
      >
        {isConnected && isTelegram ? "Accept application and create deal" : "Connect TON wallet to continue."}
      </button>
      {!isTelegram ? <p className="mt-2 text-xs font-black text-[#66735c]">Open inside Telegram to use Mini App actions.</p> : null}
      {result ? <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-black text-[#229ED9]">{result}</p> : null}
    </section>
  );
}
