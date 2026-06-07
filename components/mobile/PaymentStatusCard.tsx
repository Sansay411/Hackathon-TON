"use client";

import { useState } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { ArrowLeftRight, LockKeyhole, WalletCards } from "lucide-react";
import { useTelegram } from "@/components/telegram-provider";
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
  const [tab, setTab] = useState<"direct" | "stonfi">("direct");
  const [status, setStatus] = useState("Awaiting verified TON tx");
  const [busy, setBusy] = useState(false);

  return (
    <section className="rounded-[30px] border border-[#dfe3e8] bg-white p-5 shadow-[0_14px_34px_rgba(0,101,142,0.08)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-[#229ED9]">Payment status</p>
          <h2 className="mt-1 text-2xl font-black">Escrow prepared</h2>
        </div>
        <div className="rounded-2xl bg-[#00658e] p-3 text-white">
          <LockKeyhole className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-[18px] bg-[#f6faff] p-1">
        <button className={`rounded-2xl px-3 py-2 text-sm font-black ${tab === "direct" ? "bg-white text-[#171c20] shadow-sm" : "text-[#64748b]"}`} onClick={() => setTab("direct")} type="button">
          Direct TON
        </button>
        <button className={`rounded-2xl px-3 py-2 text-sm font-black ${tab === "stonfi" ? "bg-white text-[#171c20] shadow-sm" : "text-[#64748b]"}`} onClick={() => setTab("stonfi")} type="button">
          STON.fi Swap
        </button>
      </div>
      <div className="mt-5 grid gap-3">
        <StatusRow icon={<WalletCards className="h-4 w-4" />} label="Direct TON payment" value="Backend prepared only when escrow is configured" />
        <StatusRow icon={<ArrowLeftRight className="h-4 w-4" />} label="STON.fi swap payment" value="STON.fi setup required" />
        <StatusRow icon={<LockKeyhole className="h-4 w-4" />} label="Escrow status" value={status} />
      </div>
      {tab === "direct" ? (
        <div className="mt-4 rounded-[20px] bg-[#f6faff] p-3 text-xs font-semibold leading-5 text-[#64748b]">
          <p className="font-black text-[#171c20]">Direct TON</p>
          <p>Creates a real TonConnect transaction only when `ESCROW_WALLET_ADDRESS` is configured. Wallet approval is not funding confirmation.</p>
          <WalletGateButton
            className="mt-3 w-full rounded-2xl bg-[#229ED9] px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
            connectedLabel={busy ? "Opening wallet..." : `Prepare ${amount} ${asset}`}
            onClick={async () => {
              setBusy(true);
              setStatus("Preparing transaction");
              try {
                const response = await fetch("/api/payments/create", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ initData, dealId, amount, asset, paymentMode: "direct_ton" })
                });
                const payload = (await response.json()) as PaymentCreateResponse;
                if (!response.ok || !payload.ok || !payload.data?.transaction) {
                  setStatus(payload.error?.message ?? "Payment setup required");
                  return;
                }
                await tonConnectUI.sendTransaction(payload.data.transaction);
                setStatus("Wallet accepted transaction. Backend verification still required.");
              } catch (error) {
                setStatus(error instanceof Error ? error.message : "Wallet rejected or failed transaction.");
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
              From token
              <select className="mt-2 h-11 w-full rounded-2xl border border-[#dfe3e8] bg-[#ffffff] px-3 font-black text-[#171c20]" defaultValue="TON">
                <option>TON</option>
                <option>USDT</option>
              </select>
            </label>
            <div className="rounded-2xl bg-[#f6faff] p-3 text-xs font-semibold text-[#64748b]">
              STON.fi setup required. Install and configure Omniston provider before requesting real quotes.
            </div>
            <button className="w-full cursor-not-allowed rounded-2xl bg-[#dfe3e8] px-4 py-3 text-sm font-black text-[#64748b]" disabled type="button">
              Swap setup required
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
