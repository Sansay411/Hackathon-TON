"use client";

import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { WalletCards } from "lucide-react";
import { truncateTonAddress } from "@/lib/ton/address";
import { useTelegram } from "@/components/telegram-provider";
import { getTonNetwork } from "@/lib/ton/network";

export function WalletConnectCard() {
  const wallet = useTonWallet();
  const { isTelegram } = useTelegram();
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

    const response = await fetch("/api/profile/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ walletAddress })
    });

    const payload = (await response.json()) as { ok?: boolean; data?: { profile?: { walletAddress?: string | null } }; error?: { message?: string } };
    if (!response.ok || !payload.ok || !payload.data?.profile?.walletAddress) {
      setStatus("error");
      setMessage(payload.error?.message ?? "Wallet save failed");
      return;
    }

    setStatus("saved");
    setMessage(`Saved ${truncateTonAddress(payload.data.profile.walletAddress)}`);
    lastSavedWallet.current = walletAddress;
  }, [walletAddress]);

  useEffect(() => {
    if (!walletAddress || walletAddress === lastSavedWallet.current) {
      return;
    }

    void saveWalletAddress();
  }, [saveWalletAddress, walletAddress]);

  return (
    <section className="rounded-[28px] border border-white/70 bg-[#fbfff5] p-5 shadow-[0_14px_34px_rgba(17,24,15,0.09)]">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-[#229ED9] p-3 text-white">
          <WalletCards className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black text-[#66735c]">TON wallet</p>
          <h2 className="mt-1 break-words text-xl font-black">
            {walletAddress ? truncateTonAddress(walletAddress) : "Not connected"}
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#66735c]">
            {walletAddress ? `${network} connected wallet` : `${network} required for apply, accept and payment actions`}
          </p>
          <p className="mt-1 text-xs font-black text-[#66735c]">{isTelegram ? "Inside Telegram" : "Outside Telegram"}</p>
        </div>
      </div>
      <div className="mt-4">
        <TonConnectButton />
      </div>
      <div className="mt-4 rounded-[20px] bg-white p-3 text-xs font-semibold leading-5 text-[#66735c]">
        <p className="font-black text-[#182014]">Profile sync</p>
        <p className="mt-1">Save the connected address to your WorkPay profile so deal actions can use the same TON identity.</p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          className="rounded-[20px] bg-[#182014] px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!walletAddress || status === "saving"}
          onClick={saveWalletAddress}
          type="button"
        >
          {status === "saving" ? "Saving..." : "Save to profile"}
        </button>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${walletAddress ? "bg-[#c8ff45] text-[#182014]" : "bg-[#f1f5ea] text-[#66735c]"}`}>
          {walletAddress ? "Connected" : "Setup required"}
        </span>
      </div>
      {message ? <p className={`mt-3 text-xs font-black ${status === "error" ? "text-[#9f1239]" : "text-[#229ED9]"}`}>{message}</p> : null}
    </section>
  );
}
