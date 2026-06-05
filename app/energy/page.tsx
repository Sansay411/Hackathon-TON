import { Zap } from "lucide-react";
import { EnergyCard } from "@/components/mobile/EnergyCard";
import { EmptyState } from "@/components/mobile/EmptyState";
import { MobileShell } from "@/components/mobile/MobileShell";
import { demoEnergyTransactions, demoProfile } from "@/lib/demo/data";
import { energyPackages } from "@/lib/energy/service";

export default function EnergyPage() {
  return (
    <MobileShell>
      <div className="space-y-5">
        <header>
          <p className="text-sm font-black text-[#229ED9]">Monetization</p>
          <h1 className="mt-1 text-[34px] font-black leading-none tracking-normal">Energy</h1>
          <p className="mt-2 text-sm font-medium leading-6 text-[#66735c]">Freelancers spend Energy to apply. Purchases require TON or Stars payment setup.</p>
        </header>
        <EnergyCard balance={demoProfile.energyBalance} />
        <section className="grid grid-cols-2 gap-3">
          {energyPackages.map((item) => (
            <div className="rounded-[24px] bg-[#fbfff5] p-4 shadow-sm" key={item.energy}>
              <Zap className="h-5 w-5 text-[#229ED9]" />
              <p className="mt-3 text-xl font-black">{item.label}</p>
              <p className="mt-1 text-xs font-semibold text-[#66735c]">Payment setup required</p>
            </div>
          ))}
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-black">History</h2>
          {demoEnergyTransactions.length === 0 ? (
            <EmptyState title="No Energy history" body="Monthly grants, applications and purchases will appear here." action="Browse jobs" href="/marketplace" />
          ) : demoEnergyTransactions.map((transaction) => (
            <div className="rounded-[24px] bg-[#fbfff5] p-4 shadow-sm" key={transaction.id}>
              <div className="flex items-center justify-between">
                <p className="font-black">{transaction.reason}</p>
                <span className="font-black">{transaction.amount > 0 ? "+" : ""}{transaction.amount}</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-[#66735c]">{transaction.type}</p>
            </div>
          ))}
        </section>
      </div>
    </MobileShell>
  );
}
