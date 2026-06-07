"use client";

import { useState } from "react";
import { ArrowLeftRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useWalletAccess } from "@/components/wallet-access";
import { StonfiQuoteCard } from "@/components/stonfi/StonfiQuoteCard";
import { isStonfiQuoteResult, type StonfiQuoteResponse, type StonfiQuoteResult, type StonfiQuoteState } from "@/lib/stonfi/types";

type QuoteApiResponse = {
  ok?: boolean;
  data?: { quote?: unknown };
  error?: { code?: string; message?: string };
};

export function SmartSettlementCard({
  dealId,
  settlementAmount,
  payAsset = "TON",
  settlementAsset = "USDT"
}: {
  dealId: string;
  settlementAmount: string;
  payAsset?: string;
  settlementAsset?: string;
}) {
  const { t } = useLanguage();
  const { isConnected } = useWalletAccess();
  const [state, setState] = useState<StonfiQuoteState>("idle");
  const [quote, setQuote] = useState<StonfiQuoteResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [readyToSign, setReadyToSign] = useState(false);

  async function requestQuote() {
    setState("loading");
    setMessage(null);
    setReadyToSign(false);
    try {
      const response = await fetch("/api/stonfi/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromAsset: payAsset, toAsset: settlementAsset, settlementAmount, network: "mainnet", dealId })
      });
      const payload = (await response.json()) as QuoteApiResponse;

      if (response.status === 503) {
        setState("setup_required");
        setMessage(payload.error?.message ?? t.smartSettlement.errSetup);
        return;
      }
      if (!response.ok || !payload.ok || !payload.data?.quote) {
        setState("error");
        setMessage(payload.error?.message ?? t.smartSettlement.errQuote);
        return;
      }

      const data = payload.data.quote as StonfiQuoteResponse;
      if (isStonfiQuoteResult(data)) {
        setQuote(data);
        setState("ready");
        return;
      }

      if (data.state === "setup_required") {
        setState("setup_required");
        setMessage(data.message || t.smartSettlement.errSetup);
      } else if (data.state === "unsupported_network") {
        setState("error");
        setMessage(t.smartSettlement.errNetwork);
      } else if (data.state === "no_quote") {
        setState("error");
        setMessage(t.smartSettlement.errNoQuote);
      } else {
        setState("error");
        setMessage(data.message || t.smartSettlement.errQuote);
      }
    } catch {
      setState("error");
      setMessage(t.smartSettlement.errQuote);
    }
  }

  return (
    <section className="rounded-[30px] border border-[#dfe3e8] bg-white p-5 shadow-[0_14px_34px_rgba(0,101,142,0.08)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-[#229ED9]">{t.smartSettlement.eyebrow}</p>
          <h2 className="mt-1 text-2xl font-black">{t.smartSettlement.poweredBy}</h2>
        </div>
        <div className="rounded-2xl bg-[#00658e] p-3 text-white">
          <Sparkles className="h-6 w-6" />
        </div>
      </div>

      <p className="mt-3 text-sm font-semibold leading-6 text-[#64748b]">{t.smartSettlement.intro}</p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <SummaryTile label={t.smartSettlement.dealAmount} value={`${settlementAmount} ${settlementAsset}`} />
        <SummaryTile label={t.smartSettlement.payWith} value={payAsset} />
        <SummaryTile label={t.smartSettlement.settlementAsset} value={settlementAsset} />
      </div>

      {state === "ready" && quote ? (
        <div className="mt-4 space-y-3">
          <StonfiQuoteCard quote={quote} />
          <button
            className="w-full rounded-2xl bg-[#229ED9] px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => setReadyToSign(true)}
            disabled={!isConnected}
            type="button"
          >
            {isConnected ? t.smartSettlement.continueTonConnect : t.walletGate.connectToContinue}
          </button>
          {readyToSign ? (
            <p className="rounded-2xl bg-[#eafff3] px-3 py-2 text-xs font-black text-[#0f7b48]">{t.smartSettlement.readyToSign}</p>
          ) : null}
          <button
            className="w-full rounded-2xl border border-[#dfe3e8] bg-white px-4 py-2 text-xs font-black text-[#00658e]"
            onClick={requestQuote}
            type="button"
          >
            {t.smartSettlement.refreshQuote}
          </button>
        </div>
      ) : (
        <button
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#229ED9] px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
          onClick={requestQuote}
          disabled={state === "loading"}
          type="button"
        >
          <ArrowLeftRight className="h-4 w-4" />
          {state === "loading" ? t.smartSettlement.gettingQuote : t.smartSettlement.getQuote}
        </button>
      )}

      {(state === "error" || state === "setup_required") && message ? (
        <p className="mt-3 rounded-2xl bg-[#fff4f4] px-3 py-2 text-xs font-black text-[#c0392b]">{message}</p>
      ) : null}

      <p className="mt-3 text-xs font-semibold leading-5 text-[#94a3b8]">{t.smartSettlement.noteNoSwap}</p>
    </section>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-[#f6faff] p-3">
      <p className="text-[11px] font-semibold text-[#64748b]">{label}</p>
      <p className="mt-1 text-sm font-black text-[#171c20]">{value}</p>
    </div>
  );
}
