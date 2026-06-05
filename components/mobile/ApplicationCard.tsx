"use client";

import { useState } from "react";
import { CheckCircle2, Zap } from "lucide-react";
import type { JobApplication } from "@/lib/domain/types";

export function ApplicationCard({ application }: { application: JobApplication }) {
  const [result, setResult] = useState<string | null>(null);
  return (
    <section className="rounded-[28px] bg-[#fbfff5] p-4 shadow-[0_14px_34px_rgba(17,24,15,0.09)]">
      <div className="flex items-center justify-between">
        <p className="font-black">Application</p>
        <span className="rounded-full bg-[#c8ff45] px-3 py-1 text-xs font-black">{application.status}</span>
      </div>
      <p className="mt-2 text-sm font-semibold leading-5 text-[#66735c]">{application.proposalText}</p>
      <div className="mt-4 flex items-center justify-between text-sm font-black">
        <span className="flex items-center gap-1">
          <Zap className="h-4 w-4 text-[#229ED9]" />
          {application.energyCost} Energy
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-4 w-4 text-[#229ED9]" />
          AI {application.aiScore ?? 0}/100
        </span>
      </div>
      <button
        className="mt-4 w-full rounded-[20px] bg-[#c8ff45] px-4 py-3 text-sm font-black text-[#182014]"
        onClick={async () => {
          const response = await fetch(`/api/applications/${application.id}/accept`, { method: "POST" });
          const payload = (await response.json()) as { data?: { dealId?: string } };
          setResult(payload.data?.dealId ? `Deal created: ${payload.data.dealId}` : "Deal creation route returned no id");
        }}
        type="button"
      >
        Accept application and create deal
      </button>
      {result ? <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-black text-[#229ED9]">{result}</p> : null}
    </section>
  );
}
