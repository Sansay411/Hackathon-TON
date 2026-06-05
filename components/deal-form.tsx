"use client";

import { Bot, CalendarDays, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DealForm() {
  return (
    <form className="space-y-4 rounded-[34px] border border-white/70 bg-[#fbfff5] p-5 shadow-[0_18px_44px_rgba(17,24,15,0.11)]">
      <label className="block space-y-2">
        <span className="text-sm font-black text-[#182014]">Deal title</span>
        <input className="h-12 w-full rounded-[20px] border border-white bg-white px-4 py-3 text-sm font-semibold outline-none shadow-sm placeholder:text-[#9daa90] focus:border-[#229ED9]" placeholder="Landing page redesign" />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-black text-[#182014]">Description</span>
        <textarea className="min-h-32 w-full rounded-[20px] border border-white bg-white px-4 py-3 text-sm font-semibold outline-none shadow-sm placeholder:text-[#9daa90] focus:border-[#229ED9]" placeholder="Scope, acceptance criteria, timeline, revision policy" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-2">
          <span className="text-sm font-black text-[#182014]">Price</span>
          <input className="h-12 w-full rounded-[20px] border border-white bg-white px-4 py-3 text-sm font-semibold outline-none shadow-sm placeholder:text-[#9daa90] focus:border-[#229ED9]" placeholder="250" inputMode="decimal" />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-black text-[#182014]">Token</span>
          <select className="h-12 w-full rounded-[20px] border border-white bg-white px-4 py-3 text-sm font-semibold outline-none shadow-sm focus:border-[#229ED9]" defaultValue="TON">
            <option>TON</option>
            <option>USDT</option>
          </select>
        </label>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-black text-[#182014]">Deadline</span>
        <div className="flex items-center rounded-[20px] border border-white bg-white px-4 shadow-sm focus-within:border-[#229ED9]">
          <CalendarDays className="h-4 w-4 text-[#66735c]" />
          <input className="h-12 w-full bg-transparent px-3 py-3 text-sm font-semibold outline-none" type="date" />
        </div>
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-black text-[#182014]">Freelancer wallet or Telegram username</span>
        <input className="h-12 w-full rounded-[20px] border border-white bg-white px-4 py-3 text-sm font-semibold outline-none shadow-sm placeholder:text-[#9daa90] focus:border-[#229ED9]" placeholder="@designer or TON wallet" />
      </label>

      <div className="rounded-[26px] bg-[#182014] p-4 text-white shadow-[0_16px_30px_rgba(17,24,15,0.18)]">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-[#c8ff45]" />
          <p className="font-black">AI review preview</p>
        </div>
        <p className="mt-2 text-sm font-medium leading-6 text-white/75">Mira will check clarity, deadline, deliverables, and dispute risk before funding.</p>
      </div>

      <Button className="h-12 w-full rounded-[22px] bg-[#c8ff45] py-3 font-black text-[#182014] shadow-[0_14px_24px_rgba(17,24,15,0.16)] hover:bg-[#baf238]" type="button">
        <ShieldCheck className="h-4 w-4" />
        Review with AI
      </Button>
    </form>
  );
}
