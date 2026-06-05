"use client";

import { useTonWallet } from "@tonconnect/ui-react";
import { WalletCards } from "lucide-react";
import { truncateTonAddress } from "@/lib/ton/address";
import { getTonNetwork } from "@/lib/ton/network";
import { useTelegram } from "@/components/telegram-provider";

export function WalletMiniCard() {
  const wallet = useTonWallet();
  const { isTelegram } = useTelegram();
  const network = getTonNetwork();

  return (
    <div className="rounded-[26px] border border-white/70 bg-[#fbfff5] p-4 shadow-[0_12px_30px_rgba(17,24,15,0.08)]">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#229ED9] p-3 text-white">
          <WalletCards className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-black text-[#66735c]">TON wallet</p>
          <p className="text-sm font-black">{wallet ? truncateTonAddress(wallet.account.address) : "Not connected"}</p>
          <p className="text-[11px] font-semibold text-[#66735c]">
            {wallet ? `${network} connected` : `${network} setup required for active deal actions`}
          </p>
          <p className="text-[11px] font-black text-[#66735c]">{isTelegram ? "Inside Telegram" : "Outside Telegram"}</p>
        </div>
      </div>
    </div>
  );
}
