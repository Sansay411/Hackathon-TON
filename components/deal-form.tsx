"use client";

import { useState } from "react";
import { Bot, CalendarDays, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { MiraIntentPanel } from "@/components/mira-intent-panel";
import type { MiraIntentType } from "@/lib/mira/intent";

export function DealForm({ intentType = "deal_review", intentId = "draft" }: { intentType?: MiraIntentType; intentId?: string }) {
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [token, setToken] = useState("TON");
  const [deadline, setDeadline] = useState("");
  const [showMira, setShowMira] = useState(false);

  return (
    <div className="space-y-4">
      <form className="space-y-4 rounded-[34px] border border-[#dfe3e8] bg-white p-5 shadow-[0_18px_44px_rgba(0,101,142,0.10)]">
        <label className="block space-y-2">
          <span className="text-sm font-black text-[#171c20]">{t.dealForm.dealTitle}</span>
          <input className="h-12 w-full rounded-[20px] border border-[#dfe3e8] bg-[#f6faff] px-4 py-3 text-sm font-semibold outline-none placeholder:text-[#64748b] focus:border-[#229ED9]" onChange={(event) => setTitle(event.target.value)} placeholder={t.dealForm.dealTitlePlaceholder} value={title} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-black text-[#171c20]">{t.dealForm.description}</span>
          <textarea className="min-h-32 w-full rounded-[20px] border border-[#dfe3e8] bg-[#f6faff] px-4 py-3 text-sm font-semibold outline-none placeholder:text-[#64748b] focus:border-[#229ED9]" onChange={(event) => setDescription(event.target.value)} placeholder={t.dealForm.descriptionPlaceholder} value={description} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-2">
            <span className="text-sm font-black text-[#171c20]">{t.dealForm.price}</span>
            <input className="h-12 w-full rounded-[20px] border border-[#dfe3e8] bg-[#f6faff] px-4 py-3 text-sm font-semibold outline-none placeholder:text-[#64748b] focus:border-[#229ED9]" inputMode="decimal" onChange={(event) => setPrice(event.target.value)} placeholder="250" value={price} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-black text-[#171c20]">{t.dealForm.token}</span>
            <select className="h-12 w-full rounded-[20px] border border-[#dfe3e8] bg-[#f6faff] px-4 py-3 text-sm font-semibold outline-none shadow-sm focus:border-[#229ED9]" onChange={(event) => setToken(event.target.value)} value={token}>
              <option>TON</option>
              <option>USDT</option>
            </select>
          </label>
        </div>
        <label className="block space-y-2">
          <span className="text-sm font-black text-[#171c20]">{t.dealForm.deadline}</span>
          <div className="flex items-center rounded-[20px] border border-[#dfe3e8] bg-[#f6faff] px-4 shadow-sm focus-within:border-[#229ED9]">
            <CalendarDays className="h-4 w-4 text-[#64748b]" />
            <input className="h-12 w-full bg-transparent px-3 py-3 text-sm font-semibold outline-none" onChange={(event) => setDeadline(event.target.value)} type="date" value={deadline} />
          </div>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-black text-[#171c20]">{t.dealForm.freelancerField}</span>
          <input className="h-12 w-full rounded-[20px] border border-[#dfe3e8] bg-[#f6faff] px-4 py-3 text-sm font-semibold outline-none placeholder:text-[#64748b] focus:border-[#229ED9]" placeholder={t.dealForm.freelancerPlaceholder} />
        </label>

        <div className="rounded-[26px] bg-[#00658e] p-4 text-white shadow-[0_16px_30px_rgba(0,101,142,0.18)]">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-[#acedff]" />
            <p className="font-black">{t.dealForm.aiPreview}</p>
          </div>
          <p className="mt-2 text-sm font-medium leading-6 text-white/75">{t.dealForm.aiPreviewBody}</p>
        </div>

        <Button className="h-12 w-full rounded-[22px] bg-[#229ED9] py-3 font-black text-white shadow-[0_14px_24px_rgba(34,158,217,0.20)] hover:bg-[#168bc2]" onClick={() => setShowMira(true)} type="button">
          <ShieldCheck className="h-4 w-4" />
          {t.dealForm.reviewWithAi}
        </Button>
      </form>

      {showMira ? (
        <MiraIntentPanel
          input={{
            type: intentType,
            id: intentId,
            title,
            description,
            budgetAmount: price,
            budgetToken: token,
            deadline
          }}
        />
      ) : null}
    </div>
  );
}
