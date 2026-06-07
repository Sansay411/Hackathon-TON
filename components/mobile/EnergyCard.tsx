"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function EnergyCard({ balance = 20 }: { balance?: number }) {
  const { t } = useLanguage();
  return (
    <Link className="block rounded-[28px] bg-[#00658e] p-5 text-white shadow-[0_18px_38px_rgba(0,101,142,0.2)]" href="/energy">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-[#acedff]">{t.energyCard.label}</p>
          <p className="mt-1 text-3xl font-black">{balance}</p>
        </div>
        <div className="rounded-2xl bg-[#229ED9] p-3 text-white">
          <Zap className="h-6 w-6" />
        </div>
      </div>
      <p className="mt-3 text-xs font-medium text-white/70">{t.energyCard.resetsNote}</p>
    </Link>
  );
}
