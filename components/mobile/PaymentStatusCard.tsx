"use client";

import { useState } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { ArrowLeftRight, LockKeyhole, WalletCards } from "lucide-react";
import { useTelegram } from "@/components/telegram-provider";
import { useLanguage } from "@/components/language-provider";
import { WalletGateButton, WalletGateNotice } from "@/components/wallet-access";
import { StonfiQuoteCard } from "@/components/stonfi/StonfiQuoteCard";
import { isStonfiQuoteResult, type StonfiQuoteResponse, type StonfiQuoteResult, type StonfiQuoteState } from "@/lib/stonfi/types";

type PaymentStatusCardProps = {
  dealId: string;
  amount: string;
  asset: string;
};

type PaymentCreateResponse = {
  ok?: boolean;
  data?: {
    transaction?: Parameters<ReturnType<typeof useTonConnectUI>[0]["sendTransaction"]>[0];
  };
  error?: { code?: string; message?: string };
};

type PaymentVerifyResponse = {
  ok?: boolean;
  data?: {
    verification?: { status?: string; reason?: string };
  };
  error?: { code?: string; message?: string };
};

type StonfiQuoteApiResponse = {
  ok?: boolean;
  data?: { quote?: unknown };
  error?: { code?: string; message?: string };
};

type StonfiSwapApiResponse = {
  ok?: boolean;
  data?: {
    transaction?: Parameters<ReturnType<typeof useTonConnectUI>[0]["sendTransaction"]>[0];
  };
  error?: { code?: string; message?: string };
};

export function PaymentStatusCard({ dealId, amount, asset }: PaymentStatusCardProps) {
  const [tonConnectUI] = useTonConnectUI();
  const { initData } = useTelegram();
  const { t } = useLanguage();
  const [tab, setTab] = useState<"direct" | "stonfi">("direct");
  const [status, setStatus] = useState<string>(t.paymentCard.awaitingTx);
  const [txHash, setTxHash] = useState("");
  const [busy, setBusy] = useState(false);
  const [stonfiState, setStonfiState] = useState<StonfiQuoteState>("idle");
  const [stonfiQuote, setStonfiQuote] = useState<StonfiQuoteResult | null>(null);
  const [stonfiMessage, setStonfiMessage] = useState<string | null>(null);

  async function requestStonfiQuote() {
    setBusy(true);
    setStonfiState("loading");
    setStonfiMessage(null);
    setStonfiQuote(null);
    try {
      const response = await fetch("/api/stonfi/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromAsset: "TON", toAsset: "USDT", settlementAmount: amount, network: "mainnet", dealId })
      });
      const payload = (await response.json()) as StonfiQuoteApiResponse;
      if (response.status === 503) {
        setStonfiState("setup_required");
        setStonfiMessage(payload.error?.message ?? t.smartSettlement.errSetup);
        return;
      }
      if (!response.ok || !payload.ok || !payload.data?.quote) {
        setStonfiState("error");
        setStonfiMessage(payload.error?.message ?? t.smartSettlement.errQuote);
        return;
      }

      const quote = payload.data.quote as StonfiQuoteResponse;
      if (isStonfiQuoteResult(quote)) {
        setStonfiQuote(quote);
        setStonfiState("ready");
        return;
      }

      setStonfiState(quote.state === "setup_required" ? "setup_required" : "error");
      setStonfiMessage(quote.message);
    } catch (error) {
      setStonfiState("error");
      setStonfiMessage(error instanceof Error ? error.message : t.smartSettlement.errQuote);
    } finally {
      setBusy(false);
    }
  }

  async function buildAndSendStonfiSwap() {
    if (!stonfiQuote?.quoteId) {
      setStonfiMessage("Quote id is required before building a STON.fi swap transaction.");
      return;
    }

    setBusy(true);
    setStonfiMessage(null);
    try {
      const response = await fetch("/api/stonfi/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData, dealId, quoteId: stonfiQuote.quoteId, network: "mainnet" })
      });
      const payload = (await response.json()) as StonfiSwapApiResponse;
      if (!response.ok || !payload.ok || !payload.data?.transaction) {
        setStonfiMessage(payload.error?.message ?? "STON.fi swap transaction is not ready.");
        return;
      }
      await tonConnectUI.sendTransaction(payload.data.transaction);
      setStatus(t.paymentCard.walletAcceptedVerify);
      setStonfiMessage("Wallet approved the STON.fi transaction. WorkPay still waits for escrow verification.");
    } catch (error) {
      setStonfiMessage(error instanceof Error ? error.message : t.paymentCard.walletRejected);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-[30px] border border-[#dfe3e8] bg-white p-5 shadow-[0_14px_34px_rgba(0,101,142,0.08)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-[#229ED9]">{t.paymentCard.title}</p>
          <h2 className="mt-1 text-2xl font-black">{t.paymentCard.escrowProof}</h2>
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
        <StatusRow icon={<WalletCards className="h-4 w-4" />} label={t.paymentCard.directTonPayment} value={t.paymentCard.tonCenterVerify} />
        <StatusRow icon={<ArrowLeftRight className="h-4 w-4" />} label={t.paymentCard.stonfiSwapPayment} value={t.paymentCard.omnistonSetupRequired} />
        <StatusRow icon={<LockKeyhole className="h-4 w-4" />} label={t.paymentCard.escrowStatus} value={status} />
      </div>

      {tab === "direct" ? (
        <div className="mt-4 rounded-[20px] bg-[#f6faff] p-3 text-xs font-semibold leading-5 text-[#64748b]">
          <p className="font-black text-[#171c20]">{t.paymentCard.directTon}</p>
          <p>{t.paymentCard.directTonBodyVerify}</p>
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
                setStatus(t.paymentCard.walletAcceptedVerify);
              } catch (error) {
                setStatus(error instanceof Error ? error.message : t.paymentCard.walletRejected);
              } finally {
                setBusy(false);
              }
            }}
          />

          <div className="mt-3 grid gap-2">
            <input
              className="h-11 rounded-2xl border border-[#dfe3e8] bg-white px-3 text-sm font-semibold text-[#171c20] outline-none"
              onChange={(event) => setTxHash(event.target.value)}
              placeholder={t.paymentCard.txHashPlaceholder}
              value={txHash}
            />
            <button
              className="rounded-2xl border border-[#229ED9] bg-white px-4 py-3 text-sm font-black text-[#00658e] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={busy || txHash.trim().length < 40}
              onClick={async () => {
                setBusy(true);
                setStatus(t.paymentCard.verifyingTonCenter);
                try {
                  const response = await fetch("/api/payments/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ initData, dealId, txHash, expectedAmount: amount, expectedAsset: asset, network: "testnet" })
                  });
                  const payload = (await response.json()) as PaymentVerifyResponse;
                  const verification = payload.data?.verification;
                  if (!response.ok || !payload.ok) {
                    setStatus(payload.error?.message ?? t.paymentCard.tonCenterVerificationFailed);
                    return;
                  }
                  setStatus(verification?.status === "confirmed" ? t.paymentCard.tonCenterConfirmed : verification?.reason ?? verification?.status ?? t.paymentCard.notConfirmed);
                } catch (error) {
                  setStatus(error instanceof Error ? error.message : t.paymentCard.tonCenterRequestFailed);
                } finally {
                  setBusy(false);
                }
              }}
              type="button"
            >
              {t.paymentCard.verifyWithTonCenter}
            </button>
          </div>
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
            <div className="rounded-2xl bg-white p-3 text-xs font-semibold leading-5 text-[#64748b]">
              {t.smartSettlement.intro}
            </div>
            {stonfiQuote ? <StonfiQuoteCard quote={stonfiQuote} /> : null}
            <button
              className="w-full rounded-2xl bg-[#229ED9] px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busy}
              onClick={requestStonfiQuote}
              type="button"
            >
              {stonfiState === "loading" ? t.smartSettlement.gettingQuote : stonfiQuote ? t.smartSettlement.refreshQuote : t.smartSettlement.getQuote}
            </button>
            {stonfiQuote ? (
              <WalletGateButton
                className="w-full rounded-2xl border border-[#229ED9] bg-white px-4 py-3 text-sm font-black text-[#00658e] disabled:cursor-not-allowed disabled:opacity-50"
                connectedLabel="Build STON.fi swap with wallet"
                onClick={buildAndSendStonfiSwap}
              />
            ) : null}
            {stonfiMessage ? <p className="rounded-2xl bg-[#fff4f4] px-3 py-2 text-xs font-black text-[#c0392b]">{stonfiMessage}</p> : null}
            <p className="text-xs font-semibold leading-5 text-[#94a3b8]">{t.smartSettlement.noteNoSwap}</p>
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
