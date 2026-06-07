"use client";

import { useState } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { ArrowLeftRight, LockKeyhole, WalletCards } from "lucide-react";
import { useTelegram } from "@/components/telegram-provider";
import { useLanguage } from "@/components/language-provider";
import { WalletGateButton, WalletGateNotice } from "@/components/wallet-access";

type PaymentStatusCardProps = {
  dealId: string;
  amount: string;
  asset: string;
};

type PaymentCreateResponse = {
  ok?: boolean;
  data?: {
    transaction?: Parameters<ReturnType<typeof useTonConnectUI>[0]["sendTransaction"]>[0];
    payment?: { reference?: string };
  };
  error?: { code?: string; message?: string };
};

export function PaymentStatusCard({ dealId, amount, asset }: PaymentStatusCardProps) {
  const [tonConnectUI] = useTonConnectUI();
  const { initData } = useTelegram();
  const { t } = useLanguage();
  const [tab, setTab] = useState<"direct" | "stonfi">("direct");
  const [status, setStatus] = useState<string>(t.paymentCard.awaitingTx);
  const [busy, setBusy] = useState(false);

  return (
    <section className="rounded-[30px] border border-[#dfe3e8] bg-white p-5 shadow-[0_14px_34px_rgba(0,101,142,0.08)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-[#229ED9]">{t.paymentCard.title}</p>
          <h2 className="mt-1 text-2xl font-black">{t.paymentCard.escrowPrepared}</h2>
        </div>
        <div className="rounded-2xl bg-[#00658e] p-3 text-white">
          <LockKeyhole className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-[18px] bg-[#f6faff] p-1">
        <button className={`rounded-2xl px-3 py-2 text-sm font-black ${tab === "direct" ? "bg-white text-[#171c20] shadow-sm" : "text-[#64748b]"}`} onClick={() => setTab("direct")} type="button">
          {t.paymentCard.directTon}
        </button>
        <button className={`rounded-2xl px-3 py-2 text-sm font-black ${tab === "stonfi" ? "bg-white text-[#171c20] shadow-sm" : "text-[#64748b]"}`} onClick={() => setTab("stonfi")} type="button">
          {t.paymentCard.stonfiSwap}
        </button>
      </div>
      <div className="mt-5 grid gap-3">
        <StatusRow icon={<WalletCards className="h-4 w-4" />} label={t.paymentCard.directTonPayment} value={t.paymentCard.awaitingEscrowSetup} />
        <StatusRow icon={<ArrowLeftRight className="h-4 w-4" />} label={t.paymentCard.stonfiSwapPayment} value={t.paymentCard.stonfiSetupRequired} />
        <StatusRow icon={<LockKeyhole className="h-4 w-4" />} label={t.paymentCard.escrowStatus} value={status} />
      </div>
      {tab === "direct" ? (
        <div className="mt-4 rounded-[20px] bg-[#f6faff] p-3 text-xs font-semibold leading-5 text-[#64748b]">
          <p className="font-black text-[#171c20]">{t.paymentCard.directTon}</p>
          <p>{t.paymentCard.directTonBody}</p>
          <WalletGateButton
            className="mt-3 w-full rounded-2xl bg-[#229ED9] px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
            connectedLabel={busy ? t.paymentCard.openingWallet : `${t.paymentCard.prepare} ${amount} ${asset}`}
            onClick={async () => {
              setBusy(true);
              setStatus(t.paymentCard.preparing);
              try {
                const response = await fetch("/api/payments/create", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ initData, dealId, amount, asset, paymentMode: "direct_ton" })
                });
                const payload = (await response.json()) as PaymentCreateResponse;
                if (!response.ok || !payload.ok || !payload.data?.transaction) {
                  setStatus(payload.error?.message ?? t.paymentCard.paymentSetupRequired);
                  return;
                }
                await tonConnectUI.sendTransaction(payload.data.transaction);
                setStatus(t.paymentCard.walletAccepted);
              } catch (error) {
                setStatus(error instanceof Error ? error.message : t.paymentCard.walletRejected);
              } finally {
                setBusy(false);
              }
            }}
          />
        </div>
      ) : (
        <div className="mt-4 rounded-[20px] bg-[#f6faff] p-3">
          <div className="space-y-3">
            <label className="block text-xs font-black text-[#64748b]">
              {t.paymentCard.fromToken}
              <select className="mt-2 h-11 w-full rounded-2xl border border-[#dfe3e8] bg-[#ffffff] px-3 font-black text-[#171c20]" defaultValue="TON">
                <option>TON</option>
                <option>USDT</option>
              </select>
            </label>
            <div className="rounded-2xl bg-[#f6faff] p-3 text-xs font-semibold text-[#64748b]">
              {t.paymentCard.stonfiOmniston}
            </div>
            <button className="w-full cursor-not-allowed rounded-2xl bg-[#dfe3e8] px-4 py-3 text-sm font-black text-[#64748b]" disabled type="button">
              {t.paymentCard.swapSetupRequired}
            </button>
          </div>
        </div>
      )}
      <WalletGateNotice />
    </section>
  );
}

function StatusRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[20px] bg-white px-3 py-3 text-sm shadow-sm">
      <div className="flex items-center gap-2 font-semibold text-[#64748b]">
        <span className="text-[#229ED9]">{icon}</span>
        {label}
      </div>
      <span className="text-right font-black text-[#171c20]">{value}</span>
    </div>
  );
}
