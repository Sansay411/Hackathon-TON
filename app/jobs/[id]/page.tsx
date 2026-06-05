import Link from "next/link";
import { ShieldAlert, Zap } from "lucide-react";
import { AiReviewCard } from "@/components/mobile/AiReviewCard";
import { MobileShell } from "@/components/mobile/MobileShell";
import { demoJobs } from "@/lib/demo/data";
import type { AiReview } from "@/lib/domain/types";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = demoJobs.find((item) => item.id === id) ?? demoJobs[0];
  const review: AiReview = {
    clarityScore: job.aiScore ?? 72,
    riskLevel: job.aiRisk ?? "medium",
    missingItems: job.aiMissingItems,
    disputeRisks: ["Scope changes must be confirmed before extra work starts."],
    suggestedTerms: [job.aiSuggestedTerms ?? "Define deliverables and acceptance criteria before funding."]
  };

  return (
    <MobileShell>
      <div className="space-y-5">
        <section className="rounded-[34px] bg-[#182014] p-5 text-white shadow-[0_22px_44px_rgba(17,24,15,0.26)]">
          <p className="text-sm font-black text-[#c8ff45]">{job.category}</p>
          <h1 className="mt-2 text-[30px] font-black leading-tight">{job.title}</h1>
          <p className="mt-3 text-sm font-medium leading-6 text-white/70">{job.description}</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[22px] bg-white/10 p-3">
              <p className="text-xs text-white/60">Budget</p>
              <p className="mt-1 text-xl font-black">{job.budgetAmount} {job.budgetToken}</p>
            </div>
            <div className="rounded-[22px] bg-white/10 p-3">
              <p className="text-xs text-white/60">Deadline</p>
              <p className="mt-1 text-xl font-black">{job.deadline ?? "Open"}</p>
            </div>
          </div>
        </section>
        <AiReviewCard review={review} label="Mira job review" />
        <section className="rounded-[30px] bg-[#fbfff5] p-5 shadow-[0_14px_34px_rgba(17,24,15,0.09)]">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#229ED9]" />
            <p className="font-black">Apply cost: 1 Energy</p>
          </div>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#66735c]">Applying spends Energy server-side. Duplicate applications are blocked.</p>
          <Link className="mt-4 block rounded-[22px] bg-[#c8ff45] px-4 py-3 text-center font-black text-[#182014]" href="/applications">
            Apply with Energy
          </Link>
        </section>
        <section className="rounded-[26px] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[#229ED9]" />
            <p className="font-black">Wallet required for active deal actions</p>
          </div>
          <p className="mt-2 text-sm font-semibold text-[#66735c]">Browsing is allowed without wallet. Applying, accepting, funding and reputation require TON wallet identity.</p>
        </section>
      </div>
    </MobileShell>
  );
}
