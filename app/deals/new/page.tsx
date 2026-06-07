"use client";

import { DealForm } from "@/components/deal-form";
import { MobileShell } from "@/components/mobile/MobileShell";
import { useLanguage } from "@/components/language-provider";

export default function NewDealPage() {
  const { t } = useLanguage();
  return (
    <MobileShell>
      <div className="space-y-5">
        <header>
          <p className="text-sm font-black text-[#229ED9]">{t.dealForm.eyebrowDeal}</p>
          <h1 className="mt-1 text-[34px] font-black leading-none tracking-normal">{t.dealForm.titleDeal}</h1>
          <p className="mt-2 text-sm font-medium leading-6 text-[#64748b]">{t.dealForm.subtitleDeal}</p>
        </header>
        <DealForm />
      </div>
    </MobileShell>
  );
}
