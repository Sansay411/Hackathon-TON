"use client";

import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, WalletCards } from "lucide-react";
import { truncateTonAddress } from "@/lib/ton/address";
import { useTelegram } from "@/components/telegram-provider";
import { useLanguage } from "@/components/language-provider";
import { getTonNetwork } from "@/lib/ton/network";

export function WalletConnectCard() {
  const wallet = useTonWallet();
  const { initData, isTelegram } = useTelegram();
  const { t } = useLanguage();
  const network = getTonNetwork();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const walletAddress = wallet?.account.address ?? null;
  const lastSavedWallet = useRef<string | null>(null);

  const saveWalletAddress = useCallback(async () => {
    if (!walletAddress) {
      return;
    }

    setStatus("saving");
    setMessage("");

    const response = await fetch("/api/wallet/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ initData, walletAddress, network })
    });

    const payload = (await response.json()) as { ok?: boolean; data?: { profile?: { walletAddress?: string | null } }; error?: { message?: string } };
    if (!response.ok || !payload.ok || !payload.data?.profile?.walletAddress) {
      setStatus("error");
      setMessage(payload.error?.message ?? t.walletExtra.saveFailed);
      return;
    }

    setStatus("saved");
    setMessage(`${t.walletExtra.savedPrefix} ${truncateTonAddress(payload.data.profile.walletAddress)}`);
    lastSavedWallet.current = walletAddress;
  }, [initData, network, walletAddress, t.walletExtra.saveFailed, t.walletExtra.savedPrefix]);

  useEffect(() => {
    if (!walletAddress || walletAddress === lastSavedWallet.current) {
      return;
    }

    void saveWalletAddress();
  }, [saveWalletAddress, walletAddress]);

  return (
    <section className="rounded-[28px] border border-white/70 bg-[#ffffff] p-5 shadow-[0_14px_34px_rgba(17,24,15,0.09)]">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-[#229ED9] p-3 text-white">
          <WalletCards className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black text-[#64748b]">{t.wallet.tonWallet}</p>
          <h2 className="mt-1 break-words text-xl font-black">
            {walletAddress ? truncateTonAddress(walletAddress) : t.wallet.notConnected}
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#64748b]">
            {walletAddress ? `${t.wallet.connectedOn} ${network}` : `${network} ${t.wallet.required}`}
          </p>
          <p className="mt-1 text-xs font-black text-[#64748b]">{isTelegram ? t.wallet.telegramSession : t.wallet.secureSession}</p>
        </div>
      </div>
      <div className="mt-4">
        <TonConnectButton />
      </div>
      <div className="mt-4 rounded-[20px] bg-[#f6faff] p-3 text-xs font-semibold leading-5 text-[#64748b]">
        <p className="font-black text-[#171c20]">{t.wallet.identity}</p>
        <p className="mt-1">{t.wallet.identityBody}</p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          className="rounded-[20px] bg-[#00658e] px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!walletAddress || status === "saving" || status === "saved"}
          onClick={saveWalletAddress}
          type="button"
        >
          {status === "saving" ? t.common.saving : status === "saved" ? t.common.saved : t.wallet.saveWallet}
        </button>
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${walletAddress ? "bg-[#e6f7ff] text-[#00658e]" : "bg-[#f0f4f9] text-[#64748b]"}`}>
          {status === "saved" ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
          {walletAddress ? (status === "saved" ? t.common.linked : t.common.connected) : t.wallet.connectWallet}
        </span>
      </div>
      {message ? <p className={`mt-3 text-xs font-black ${status === "error" ? "text-[#9f1239]" : "text-[#229ED9]"}`}>{message}</p> : null}
    </section>
  );
}
