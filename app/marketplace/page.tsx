import { Search } from "lucide-react";
import { EnergyCard } from "@/components/mobile/EnergyCard";
import { EmptyState } from "@/components/mobile/EmptyState";
import { JobCard } from "@/components/mobile/JobCard";
import { MobileShell } from "@/components/mobile/MobileShell";
import { demoJobs, demoProfile } from "@/lib/demo/data";

const categories = ["All", "Design", "Telegram", "Backend", "TON"];

export default function MarketplacePage() {
  return (
    <MobileShell>
      <div className="space-y-5">
        <header>
          <p className="text-sm font-black text-[#229ED9]">Freelance marketplace</p>
          <h1 className="mt-1 text-[34px] font-black leading-none tracking-normal">Jobs</h1>
          <p className="mt-2 text-sm font-medium leading-6 text-[#66735c]">Find protected freelance work and apply with Energy.</p>
        </header>
        <EnergyCard balance={demoProfile.energyBalance} />
        <label className="flex h-14 items-center gap-3 rounded-[24px] bg-[#fbfff5] px-4 shadow-[0_12px_30px_rgba(17,24,15,0.08)]">
          <Search className="h-5 w-5 text-[#66735c]" />
          <input className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#829078]" placeholder="Search jobs" />
        </label>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {categories.map((category, index) => (
            <button className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${index === 0 ? "bg-[#182014] text-[#c8ff45]" : "bg-[#fbfff5] text-[#66735c]"}`} key={category} type="button">
              {category}
            </button>
          ))}
        </div>
        <section className="space-y-3">
          {demoJobs.length === 0 ? (
            <EmptyState title="No jobs yet" body="Create the first job or load demo data to show marketplace flow." action="Create job" href="/jobs/new" />
          ) : (
            demoJobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </section>
      </div>
    </MobileShell>
  );
}
