"use client";

import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { useTonWallet } from "@tonconnect/ui-react";
import { useTelegram } from "@/components/telegram-provider";
import { useLanguage } from "@/components/language-provider";
import { truncateTonAddress } from "@/lib/ton/address";
import { getTonNetwork } from "@/lib/ton/network";

export function useWalletAccess() {
  const wallet = useTonWallet();
  const { isTelegram } = useTelegram();
  const { t } = useLanguage();
  const walletAddress = wallet?.account.address ?? null;
  const network = getTonNetwork();

  return {
    walletAddress,
    isTelegram,
    network,
    isConnected: Boolean(walletAddress),
    compactAddress: walletAddress ? truncateTonAddress(walletAddress) : null,
    statusLabel: walletAddress ? `${network} ${t.walletGate.connectedSuffix}` : t.walletGate.connectToContinue,
    telegramLabel: isTelegram ? t.walletGate.insideTelegram : t.walletGate.outsideTelegram
  };
}

export function WalletGateLink({
  href,
  className,
  blockedLabel,
  children
}: {
  href: Route;
  className: string;
  blockedLabel?: string;
  children: ReactNode;
}) {
  const { isConnected } = useWalletAccess();
  const { t } = useLanguage();

  if (isConnected) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} disabled type="button">
      {blockedLabel ?? t.walletGate.connectToContinue}
    </button>
  );
}

export function WalletGateButton({
  className,
  blockedLabel,
  connectedLabel,
  onClick
}: {
  className: string;
  blockedLabel?: string;
  connectedLabel?: string;
  onClick?: () => void | Promise<void>;
}) {
  const { isConnected } = useWalletAccess();
  const { t } = useLanguage();

  return (
    <button className={className} disabled={!isConnected} onClick={onClick} type="button">
      {isConnected ? connectedLabel ?? t.walletGate.continue : blockedLabel ?? t.walletGate.connectToContinue}
    </button>
  );
}

export function WalletGateNotice() {
  const { statusLabel, telegramLabel, isTelegram } = useWalletAccess();
  const { t } = useLanguage();

  return (
    <div className="rounded-[20px] bg-white p-3 text-xs font-semibold leading-5 text-[#64748b]">
      <p className="font-black text-[#171c20]">{t.walletGate.gate}</p>
      <p>{statusLabel}</p>
      {!isTelegram ? <p className="mt-1 font-black">{telegramLabel}</p> : null}
    </div>
  );
}
