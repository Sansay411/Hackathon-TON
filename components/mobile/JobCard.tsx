import Link from "next/link";
import type { Route } from "next";
import { CalendarDays, Zap } from "lucide-react";
import type { MarketplaceJob } from "@/lib/domain/types";
import { AiRiskBadge } from "@/components/mobile/AiRiskBadge";

export function JobCard({ job }: { job: MarketplaceJob }) {
  const href = `/jobs/${job.id}` as Route;
  return (
    <Link className="block rounded-[28px] border border-[#dfe3e8] bg-white p-4 shadow-[0_14px_34px_rgba(0,101,142,0.08)]" href={href}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black text-[#229ED9]">{job.category}</p>
          <h3 className="mt-1 text-lg font-black leading-tight">{job.title}</h3>
        </div>
        <AiRiskBadge risk={capitalizeRisk(job.aiRisk ?? "medium")} />
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-[#64748b]">{job.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-black">
          {job.budgetAmount} {job.budgetToken}
        </span>
        <span className="flex items-center gap-1 font-bold text-[#64748b]">
          <CalendarDays className="h-4 w-4" />
          {job.deadline ?? "Flexible"}
        </span>
      </div>
      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#e6f7ff] px-3 py-1 text-xs font-black text-[#00658e]">
        <Zap className="h-3.5 w-3.5" /> Apply: 1 Energy
      </div>
    </Link>
  );
}

function capitalizeRisk(risk: "low" | "medium" | "high") {
  return (risk[0].toUpperCase() + risk.slice(1)) as "Low" | "Medium" | "High";
}
