import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Clock3 } from "lucide-react";
import { AiRiskBadge } from "@/components/mobile/AiRiskBadge";

type DealListCardProps = {
  dealId: string;
  title: string;
  description: string;
  amount: string;
  status: string;
  risk: "Low" | "Medium" | "High";
};

export function DealListCard({ dealId, title, description, amount, status, risk }: DealListCardProps) {
  const href = `/deals/${dealId}` as Route;

  return (
    <Link className="block rounded-[28px] border border-white/70 bg-[#fbfff5] p-4 shadow-[0_14px_34px_rgba(17,24,15,0.09)]" href={href}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black tracking-normal text-[#182014]">{title}</h3>
          <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-[#66735c]">{description}</p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-[#229ED9] shadow-sm">{status}</span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xl font-black">{amount}</span>
        <AiRiskBadge risk={risk} />
      </div>
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-xs font-bold text-[#66735c]">
        <span className="flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5" />
          UI placeholder
        </span>
        <ArrowRight className="h-4 w-4 text-[#229ED9]" />
      </div>
    </Link>
  );
}
