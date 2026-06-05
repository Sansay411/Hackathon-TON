import { ArrowLeftRight, ShieldCheck, WalletCards } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PaymentStatusCard } from "@/components/mobile/PaymentStatusCard";
import { WalletMiniCard } from "@/components/mobile/WalletMiniCard";

export default function WalletPage() {
  return (
    <MobileShell>
      <div className="space-y-5">
        <header>
          <p className="text-sm font-black text-[#229ED9]">TON account</p>
          <h1 className="mt-1 text-[34px] font-black leading-none tracking-normal">Wallet</h1>
          <p className="mt-2 text-sm font-medium leading-6 text-[#66735c]">Connect wallet, prepare funding, and track escrow readiness.</p>
        </header>

        <section className="relative overflow-hidden rounded-[34px] bg-[#182014] p-5 text-white shadow-[0_22px_44px_rgba(17,24,15,0.28)]">
          <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#c8ff45]/20" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-[#c8ff45]">Testnet mode</p>
              <h2 className="mt-2 text-3xl font-black">TON ready</h2>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 text-[#c8ff45]">
              <WalletCards className="h-7 w-7" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[22px] bg-white/10 p-3">
              <p className="text-xs text-white/60">Escrow</p>
              <p className="mt-1 text-lg font-black">Prepared</p>
            </div>
            <div className="rounded-[22px] bg-white/10 p-3">
              <p className="text-xs text-white/60">Network</p>
              <p className="mt-1 text-lg font-black">Testnet</p>
            </div>
          </div>
        </section>

        <WalletMiniCard />
        <PaymentStatusCard />

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-[26px] border border-white/70 bg-[#fbfff5] p-4 shadow-[0_12px_30px_rgba(17,24,15,0.08)]">
            <ShieldCheck className="mb-3 h-5 w-5 text-[#229ED9]" />
            <p className="text-sm font-black">Verified only</p>
            <p className="mt-1 text-xs font-medium leading-5 text-[#66735c]">No manual payment confirmation.</p>
          </div>
          <div className="rounded-[26px] border border-white/70 bg-[#fbfff5] p-4 shadow-[0_12px_30px_rgba(17,24,15,0.08)]">
            <ArrowLeftRight className="mb-3 h-5 w-5 text-[#229ED9]" />
            <p className="text-sm font-black">STON.fi</p>
            <p className="mt-1 text-xs font-medium leading-5 text-[#66735c]">Swap route prepared for future funding.</p>
          </div>
        </section>
      </div>
    </MobileShell>
  );
}
