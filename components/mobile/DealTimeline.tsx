"use client";

import { Check, Circle } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

const timeline = [
  { key: "created", state: "done" },
  { key: "reviewed", state: "done" },
  { key: "waitingPayment", state: "current" },
  { key: "fundedOnTon", state: "pending" },
  { key: "workSubmitted", state: "pending" },
  { key: "paymentReleased", state: "pending" }
] as const;

export function DealTimeline() {
  const { t } = useLanguage();
  return (
    <section className="rounded-[30px] border border-white/70 bg-[#ffffff] p-5 shadow-[0_14px_34px_rgba(17,24,15,0.09)]">
      <h2 className="text-2xl font-black">{t.timeline.title}</h2>
      <ol className="mt-5 space-y-4">
        {timeline.map((item, index) => (
          <li className="flex gap-3" key={item.key}>
            <div className="flex flex-col items-center">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full ${item.state === "pending" ? "bg-white text-[#b7c6a6]" : item.state === "current" ? "bg-[#e6f7ff] text-[#171c20]" : "bg-[#229ED9] text-white"}`}>
                {item.state === "pending" ? <Circle className="h-3 w-3" /> : <Check className="h-4 w-4" />}
              </span>
              {index < timeline.length - 1 ? <span className="mt-2 h-6 w-px bg-white" /> : null}
            </div>
            <div className="pt-1">
              <p className="font-black">{t.timeline[item.key]}</p>
              <p className="text-xs font-semibold text-[#64748b]">{item.state === "current" ? t.timeline.currentStep : item.state === "done" ? t.timeline.completed : t.timeline.pending}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
