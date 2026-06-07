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
    <Link className="block rounded-2xl border border-[#dfe3e8] bg-white p-4 shadow-[0_8px_24px_rgba(0,101,142,0.06)]" href={href}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black tracking-normal text-[#171c20]">{title}</h3>
          <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-[#64748b]">{description}</p>
        </div>
        <span className="shrink-0 rounded-full bg-[#e6f7ff] px-3 py-1 text-xs font-black text-[#00658e]">{status}</span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xl font-black">{amount}</span>
        <AiRiskBadge risk={risk} />
      </div>
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#f6faff] px-3 py-2 text-xs font-bold text-[#64748b]">
        <span className="flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5" />
          UI placeholder
        </span>
        <ArrowRight className="h-4 w-4 text-[#229ED9]" />
      </div>
    </Link>
  );
}
