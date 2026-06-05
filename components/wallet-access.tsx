"use client";

import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { useTonWallet } from "@tonconnect/ui-react";
import { useTelegram } from "@/components/telegram-provider";
import { truncateTonAddress } from "@/lib/ton/address";
import { getTonNetwork } from "@/lib/ton/network";

export function useWalletAccess() {
  const wallet = useTonWallet();
  const { isTelegram } = useTelegram();
  const walletAddress = wallet?.account.address ?? null;
  const network = getTonNetwork();

  return {
    walletAddress,
    isTelegram,
    network,
    isConnected: Boolean(walletAddress),
    compactAddress: walletAddress ? truncateTonAddress(walletAddress) : null,
    statusLabel: walletAddress ? `${network} wallet connected` : "Connect TON wallet to continue.",
    telegramLabel: isTelegram ? "Inside Telegram" : "Outside Telegram"
  };
}

export function WalletGateLink({
  href,
  className,
  blockedLabel = "Connect TON wallet to continue.",
  children
}: {
  href: Route;
  className: string;
  blockedLabel?: string;
  children: ReactNode;
}) {
  const { isConnected } = useWalletAccess();

  if (isConnected) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} disabled type="button">
      {blockedLabel}
    </button>
  );
}

export function WalletGateButton({
  className,
  blockedLabel = "Connect TON wallet to continue.",
  connectedLabel = "Continue"
}: {
  className: string;
  blockedLabel?: string;
  connectedLabel?: string;
}) {
  const { isConnected } = useWalletAccess();

  return (
    <button className={className} disabled={!isConnected} type="button">
      {isConnected ? connectedLabel : blockedLabel}
    </button>
  );
}

export function WalletGateNotice() {
  const { statusLabel, telegramLabel, isTelegram } = useWalletAccess();

  return (
    <div className="rounded-[20px] bg-white p-3 text-xs font-semibold leading-5 text-[#66735c]">
      <p className="font-black text-[#182014]">Wallet gate</p>
      <p>{statusLabel}</p>
      {!isTelegram ? <p className="mt-1 font-black">{telegramLabel}</p> : null}
    </div>
  );
}
