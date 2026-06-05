import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Bot, CheckCircle2, LockKeyhole, Search, Send, Sparkles, WalletCards } from "lucide-react";
import { DealCard } from "@/components/mobile/DealCard";
import { DemoSeedButton } from "@/components/mobile/DemoSeedButton";
import { EnergyCard } from "@/components/mobile/EnergyCard";
import { JobCard } from "@/components/mobile/JobCard";
import { MobileShell } from "@/components/mobile/MobileShell";
import { Onboarding } from "@/components/mobile/Onboarding";
import { StatsCard } from "@/components/mobile/StatsCard";
import { WalletMiniCard } from "@/components/mobile/WalletMiniCard";
import { WorkPayHero } from "@/components/mobile/WorkPayHero";
import { demoJobs, demoProfile } from "@/lib/demo/data";

export default function HomePage() {
  return (
    <MobileShell>
      <div className="space-y-5">
        <WorkPayHero />
        <DemoSeedButton />
        <Onboarding />
        <WalletMiniCard />
        <EnergyCard balance={demoProfile.energyBalance} />
        <StatsCard />

        <section className="grid grid-cols-3 gap-3">
          <QuickAction href="/deals/new" icon={<Send className="h-5 w-5" />} label="Create" />
          <QuickAction href="/marketplace" icon={<Search className="h-5 w-5" />} label="Jobs" />
          <QuickAction href="/wallet" icon={<WalletCards className="h-5 w-5" />} label="Wallet" />
        </section>

        <DealCard />

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">Recommended jobs</h2>
            <Link className="text-xs font-black text-[#229ED9]" href="/marketplace">View all</Link>
          </div>
          {demoJobs.slice(0, 2).map((job) => <JobCard key={job.id} job={job} />)}
        </section>

        <section className="rounded-[30px] border border-white/70 bg-[#fbfff5] p-5 shadow-[0_14px_34px_rgba(17,24,15,0.09)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-[#229ED9]">Live deal pulse</p>
              <h2 className="mt-1 text-2xl font-black">Landing Page Design</h2>
            </div>
            <span className="rounded-full bg-[#c8ff45] px-3 py-1 text-xs font-black text-[#182014]">Funded</span>
          </div>
          <div className="mt-5 space-y-3">
            <PulseRow done label="AI terms reviewed" />
            <PulseRow done label="TON escrow prepared" />
            <PulseRow label="Waiting for delivery" />
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-[26px] border border-white/70 bg-[#fbfff5] p-4 shadow-[0_12px_30px_rgba(17,24,15,0.08)]">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#182014] text-[#c8ff45]">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-sm font-black">AI risk review</p>
            <p className="mt-1 text-xs font-medium leading-5 text-[#66735c]">AI checks terms before funding.</p>
          </div>
          <div className="rounded-[26px] border border-white/70 bg-[#fbfff5] p-4 shadow-[0_12px_30px_rgba(17,24,15,0.08)]">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#c8ff45] text-[#182014]">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <p className="text-sm font-black">TON-secured deals</p>
            <p className="mt-1 text-xs font-medium leading-5 text-[#66735c]">Funds release after approval.</p>
          </div>
        </section>
        <section className="rounded-[26px] border border-white/70 bg-[#fbfff5] p-4 shadow-[0_12px_30px_rgba(17,24,15,0.08)]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#229ED9] text-white">
            <WalletCards className="h-5 w-5" />
          </div>
          <p className="text-sm font-black">STON.fi token payments</p>
          <p className="mt-1 text-xs font-medium leading-5 text-[#66735c]">Pay with supported TON ecosystem tokens once provider configuration is added.</p>
        </section>
        <section className="rounded-[30px] bg-[#182014] p-5 text-white shadow-[0_18px_38px_rgba(17,24,15,0.22)]">
          <p className="text-sm font-black text-[#c8ff45]">How WorkPay moves</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Step label="Review" />
            <Step label="Fund" />
            <Step label="Release" />
          </div>
        </section>

        <Link className="flex items-center justify-between rounded-[26px] bg-[#182014] p-4 text-white shadow-[0_16px_30px_rgba(17,24,15,0.2)]" href="/deals/new">
          <div>
            <p className="text-sm font-black">Ready to protect a deal?</p>
            <p className="mt-1 text-xs font-medium text-white/70">Start with clear terms and verified funding.</p>
          </div>
          <ArrowRight className="h-5 w-5 text-[#c8ff45]" />
        </Link>
      </div>
    </MobileShell>
  );
}

function QuickAction({ href, icon, label }: { href: Route; icon: React.ReactNode; label: string }) {
  return (
    <Link className="rounded-[24px] border border-white/70 bg-[#fbfff5] p-4 text-center shadow-[0_12px_30px_rgba(17,24,15,0.08)]" href={href}>
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c8ff45] text-[#182014]">{icon}</span>
      <p className="mt-2 text-xs font-black">{label}</p>
    </Link>
  );
}

function PulseRow({ label, done = false }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] bg-white p-3 shadow-sm">
      <span className={`flex h-8 w-8 items-center justify-center rounded-full ${done ? "bg-[#229ED9] text-white" : "bg-[#c8ff45] text-[#182014]"}`}>
        {done ? <CheckCircle2 className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </span>
      <p className="text-sm font-black">{label}</p>
    </div>
  );
}

function Step({ label }: { label: string }) {
  return (
    <div className="rounded-[20px] bg-white/10 p-3 text-center">
      <p className="text-xs font-black text-white">{label}</p>
    </div>
  );
}
