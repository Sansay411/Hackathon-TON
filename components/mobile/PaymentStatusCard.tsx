"use client";

import { useEffect, useState } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { ArrowLeftRight, LockKeyhole, WalletCards } from "lucide-react";
import { useTelegram } from "@/components/telegram-provider";
import { WalletGateButton, WalletGateNotice, useWalletAccess } from "@/components/wallet-access";
import { StonfiQuoteCard } from "@/components/stonfi/StonfiQuoteCard";
import { isStonfiQuoteResult, type StonfiQuoteResponse, type StonfiQuoteResult, type StonfiQuoteState } from "@/lib/stonfi/types";
import { sanitizeTonConnectTransaction, type TonConnectTransaction } from "@/lib/ton/tonconnect";

type PaymentStatusCardProps = {
  dealId: string;
  amount: string;
  asset: string;
};

type PaymentCreateResponse = {
  ok?: boolean;
  data?: {
    transaction?: TonConnectTransaction;
  };
  error?: { code?: string; message?: string };
};

type PaymentVerifyResponse = {
  ok?: boolean;
  data?: {
    verification?: { status?: string; reason?: string };
    balanceUpdate?: { status?: string; balanceTon?: number; message?: string } | null;
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
    transaction?: TonConnectTransaction;
  };
  error?: { code?: string; message?: string };
};

type PaymentReadiness = {
  escrowWalletConfigured: boolean;
  tonCenterConfigured: boolean;
  omnistonConfigured: boolean;
  mainnetEnabled: boolean;
};

type PaymentReadinessResponse = {
  ok?: boolean;
  data?: PaymentReadiness;
};

export function PaymentStatusCard({ dealId, amount, asset }: PaymentStatusCardProps) {
  const [tonConnectUI] = useTonConnectUI();
  const { initData } = useTelegram();
  const { isConnected } = useWalletAccess();
  const [tab, setTab] = useState<"direct" | "stonfi">("direct");
  const [status, setStatus] = useState<string>("Wallet required");
  const [txHash, setTxHash] = useState("");
  const [busy, setBusy] = useState(false);
  const [stonfiState, setStonfiState] = useState<StonfiQuoteState>("idle");
  const [stonfiQuote, setStonfiQuote] = useState<StonfiQuoteResult | null>(null);
  const [stonfiMessage, setStonfiMessage] = useState<string | null>(null);
  const [readiness, setReadiness] = useState<PaymentReadiness | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/payments/readiness")
      .then(async (response) => (await response.json()) as PaymentReadinessResponse)
      .then((payload) => {
        if (!cancelled) {
          setReadiness(payload.data ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReadiness(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
        setStonfiMessage(payload.error?.message ?? "Omniston is not configured. Add OMNISTON_API_URL to enable STON.fi quote.");
        return;
      }
      if (!response.ok || !payload.ok || !payload.data?.quote) {
        setStonfiState("error");
        setStonfiMessage(payload.error?.message ?? "STON.fi quote is unavailable.");
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
      setStonfiMessage(error instanceof Error ? error.message : "STON.fi quote is unavailable.");
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
      await tonConnectUI.sendTransaction(sanitizeTonConnectTransaction(payload.data.transaction));
      setStatus("Transaction sent");
      setStonfiMessage("Wallet approved the STON.fi transaction. WorkPay still waits for escrow verification.");
    } catch (error) {
      setStonfiMessage(error instanceof Error ? error.message : "Wallet rejected transaction.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-[30px] border border-[#dfe3e8] bg-white p-5 shadow-[0_14px_34px_rgba(0,101,142,0.08)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-[#229ED9]">Payment demo</p>
          <h2 className="mt-1 text-2xl font-black">TON escrow proof</h2>
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
          STON.fi
        </button>
      </div>

      <PaymentReadinessPanel isConnected={isConnected} readiness={readiness} />

      <div className="mt-5 grid gap-3">
        <StatusRow icon={<WalletCards className="h-4 w-4" />} label="Direct TON" value={readiness?.escrowWalletConfigured ? "Ready" : "Setup required"} />
        <StatusRow icon={<ArrowLeftRight className="h-4 w-4" />} label="STON.fi quote" value={readiness?.omnistonConfigured ? "Quote available" : "Public default endpoint"} />
        <StatusRow icon={<LockKeyhole className="h-4 w-4" />} label="Escrow status" value={status} />
      </div>

      {tab === "direct" ? (
        <div className="mt-4 rounded-[20px] bg-[#f6faff] p-3 text-xs font-semibold leading-5 text-[#64748b]">
          <p className="font-black text-[#171c20]">Direct TON</p>
          <p>Create a real TonConnect transfer to the escrow wallet. Wallet approval is not payment confirmation.</p>
          {!readiness?.escrowWalletConfigured ? (
            <p className="mt-2 rounded-2xl bg-[#fff4f4] px-3 py-2 font-black text-[#c0392b]">ESCROW_WALLET_ADDRESS is not configured. Direct TON payment cannot be created.</p>
          ) : null}
          <WalletGateButton
            className="mt-3 w-full rounded-2xl bg-[#229ED9] px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
            connectedLabel={busy ? "Opening wallet..." : `Create TON transfer (${amount} ${asset})`}
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
                  setStatus(payload.error?.message ?? "Setup required");
                  return;
                }
                await tonConnectUI.sendTransaction(sanitizeTonConnectTransaction(payload.data.transaction));
                setStatus("Wallet transaction sent. Paste the transaction hash below and verify with TONCenter.");
              } catch (error) {
                setStatus(error instanceof Error ? error.message : "Wallet rejected transaction.");
              } finally {
                setBusy(false);
              }
            }}
          />

          <div className="mt-3 grid gap-2">
            <input
              className="h-11 rounded-2xl border border-[#dfe3e8] bg-white px-3 text-sm font-semibold text-[#171c20] outline-none"
              onChange={(event) => setTxHash(event.target.value)}
              placeholder="Paste transaction hash"
              value={txHash}
            />
            {!readiness?.tonCenterConfigured ? (
              <p className="rounded-2xl bg-[#fff4f4] px-3 py-2 text-xs font-black text-[#c0392b]">TONCENTER_API_KEY is not configured. Verification is unavailable.</p>
            ) : null}
            <button
              className="rounded-2xl border border-[#229ED9] bg-white px-4 py-3 text-sm font-black text-[#00658e] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={busy || !readiness?.tonCenterConfigured || txHash.trim().length < 40}
              onClick={async () => {
                setBusy(true);
                setStatus("Verifying with TONCenter");
                try {
                  const response = await fetch("/api/payments/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ initData, dealId, txHash, walletAddress: undefined, network: "testnet" })
                  });
                  const payload = (await response.json()) as PaymentVerifyResponse;
                  const verification = payload.data?.verification;
                  const balanceUpdate = payload.data?.balanceUpdate;
                  if (!response.ok || !payload.ok) {
                    setStatus(payload.error?.message ?? "Verification unavailable");
                    return;
                  }
                  setStatus(
                    verification?.status === "confirmed"
                      ? balanceUpdate?.balanceTon != null
                        ? `TONCenter confirmed. Balance: ${balanceUpdate.balanceTon} TON`
                        : "TONCenter confirmed payment"
                      : verification?.reason ?? verification?.status ?? "Not confirmed"
                  );
                } catch (error) {
                  setStatus(error instanceof Error ? error.message : "TONCenter request failed");
                } finally {
                  setBusy(false);
                }
              }}
              type="button"
            >
              Verify with TONCenter
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-[20px] bg-[#f6faff] p-3">
          <div className="space-y-3">
            <label className="block text-xs font-black text-[#64748b]">
              Payment token
              <select className="mt-2 h-11 w-full rounded-2xl border border-[#dfe3e8] bg-[#ffffff] px-3 font-black text-[#171c20]" defaultValue="TON">
                <option>TON</option>
              </select>
            </label>
            <div className="rounded-2xl bg-white p-3 text-xs font-semibold leading-5 text-[#64748b]">
              STON.fi Smart Settlement uses mainnet liquidity. Testnet demo supports live quote only.
            </div>
            {stonfiQuote ? <StonfiQuoteCard quote={stonfiQuote} /> : null}
            <button
              className="w-full rounded-2xl bg-[#229ED9] px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busy}
              onClick={requestStonfiQuote}
              type="button"
            >
              {stonfiState === "loading" ? "Getting quote..." : stonfiQuote ? "Refresh STON.fi Quote" : "Get STON.fi Quote"}
            </button>
            {stonfiQuote ? (
              <WalletGateButton
                className="w-full rounded-2xl border border-[#229ED9] bg-white px-4 py-3 text-sm font-black text-[#00658e] disabled:cursor-not-allowed disabled:opacity-50"
                connectedLabel={readiness?.mainnetEnabled ? "Build STON.fi swap with wallet" : "Live quote works. Swap signing requires mainnet mode."}
                onClick={buildAndSendStonfiSwap}
              />
            ) : null}
            {stonfiMessage ? <p className="rounded-2xl bg-[#fff4f4] px-3 py-2 text-xs font-black text-[#c0392b]">{stonfiMessage}</p> : null}
            <p className="text-xs font-semibold leading-5 text-[#94a3b8]">Quote only. WorkPay never marks a swap completed or a deal funded from STON.fi UI status.</p>
          </div>
        </div>
      )}
      <WalletGateNotice />
    </section>
  );
}

function PaymentReadinessPanel({ readiness, isConnected }: { readiness: PaymentReadiness | null; isConnected: boolean }) {
  return (
    <div className="mt-4 rounded-[20px] bg-[#f6faff] p-3 text-xs font-semibold leading-5 text-[#64748b]">
      <p className="font-black text-[#171c20]">Payment readiness</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <ReadinessFlag label="ESCROW_WALLET_ADDRESS" value={readiness?.escrowWalletConfigured} />
        <ReadinessFlag label="TONCENTER_API_KEY" value={readiness?.tonCenterConfigured} />
        <ReadinessFlag label="OMNISTON_API_URL" value={readiness?.omnistonConfigured} />
        <ReadinessFlag label="Mainnet enabled" value={readiness?.mainnetEnabled} />
        <ReadinessFlag label="Connected wallet" value={isConnected} />
      </div>
    </div>
  );
}

function ReadinessFlag({ label, value }: { label: string; value?: boolean }) {
  return (
    <div className="rounded-2xl bg-white px-3 py-2">
      <p className="text-[10px] font-black uppercase text-[#94a3b8]">{label}</p>
      <p className={`mt-0.5 font-black ${value ? "text-[#0f7b48]" : "text-[#c0392b]"}`}>{value ? "yes" : "no"}</p>
    </div>
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
