"use client";

import { Search } from "lucide-react";
import { EnergyCard } from "@/components/mobile/EnergyCard";
import { EmptyState } from "@/components/mobile/EmptyState";
import { JobCard } from "@/components/mobile/JobCard";
import { MobileShell } from "@/components/mobile/MobileShell";
import { useLanguage } from "@/components/language-provider";
import { demoJobs, demoProfile } from "@/lib/demo/data";

export default function MarketplacePage() {
  const { t } = useLanguage();

  return (
    <MobileShell>
      <div className="space-y-5">
        <header>
          <p className="text-sm font-black text-[#229ED9]">{t.marketplace.eyebrow}</p>
          <h1 className="mt-1 text-[34px] font-black leading-none tracking-normal">{t.marketplace.title}</h1>
          <p className="mt-2 text-sm font-medium leading-6 text-[#64748b]">{t.marketplace.description}</p>
        </header>
        <EnergyCard balance={demoProfile.energyBalance} />
        <label className="flex h-14 items-center gap-3 rounded-[24px] border border-[#dfe3e8] bg-white px-4 shadow-[0_12px_30px_rgba(0,101,142,0.08)]">
          <Search className="h-5 w-5 text-[#64748b]" />
          <input className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#64748b]" placeholder={t.marketplace.search} />
        </label>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {t.marketplace.categories.map((category, index) => (
            <button className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${index === 0 ? "bg-[#00658e] text-white" : "bg-white text-[#64748b]"}`} key={category} type="button">
              {category}
            </button>
          ))}
        </div>
        <section className="space-y-3">
          {demoJobs.length === 0 ? (
            <EmptyState title={t.marketplace.noJobsTitle} body={t.marketplace.noJobsBody} action={t.marketplace.createJob} href="/jobs/new" />
          ) : (
            demoJobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </section>
      </div>
    </MobileShell>
  );
}
