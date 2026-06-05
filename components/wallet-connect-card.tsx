"use client";

import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { WalletCards } from "lucide-react";
import { getTonNetwork } from "@/lib/ton/network";
import { truncateTonAddress } from "@/lib/ton/address";

export function WalletConnectCard() {
  const wallet = useTonWallet();

  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <WalletCards className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">TON wallet</h2>
            <p className="text-sm text-muted-foreground">
              {wallet ? truncateTonAddress(wallet.account.address) : `${getTonNetwork()} escrow funding`}
            </p>
          </div>
        </div>
        <TonConnectButton />
      </div>
    </section>
  );
}
