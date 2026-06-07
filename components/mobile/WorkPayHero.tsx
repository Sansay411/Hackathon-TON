import Link from "next/link";
import { Bot, Coins, Gem, Sparkles, ShieldCheck, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WorkPayHero() {
  return (
    <section className="relative overflow-hidden rounded-[34px] border border-[#dfe3e8] bg-white p-5 shadow-[0_24px_54px_rgba(0,101,142,0.12)]">
      <div className="pointer-events-none absolute -right-16 -top-16 text-[132px] font-black leading-none text-[#c7e7ff]/45">wp</div>
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[22px] bg-[#00658e] text-white shadow-[0_12px_26px_rgba(0,101,142,0.24)]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-black text-[#171c20]">WorkPay</p>
            <p className="text-xs font-medium text-[#64748b]">Protected by TON</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[#e6f7ff] px-3 py-1 text-xs font-black text-[#00658e]">Testnet</span>
      </div>

      <div className="relative z-10 mt-8">
        <h1 className="max-w-[300px] text-[34px] font-black leading-[1.02] tracking-normal text-[#171c20]">
          Secure Freelance Deals on TON
        </h1>
        <p className="mt-4 max-w-[300px] text-[15px] font-semibold leading-6 text-[#64748b]">
          Secure freelance marketplace inside Telegram, powered by TON.
        </p>
      </div>

      <div className="relative z-10 mt-6 rounded-[30px] bg-[#f6faff] p-3 ring-1 ring-[#dfe3e8]">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00658e] text-sm font-black text-white ring-4 ring-white">CL</div>
          <div className="-ml-7 flex h-12 w-12 items-center justify-center rounded-full bg-[#229ED9] text-sm font-black text-white ring-4 ring-white">FR</div>
          <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#171c20] shadow-sm">
            <Gem className="h-5 w-5 text-[#00658e]" />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1.05fr] gap-3">
          <div className="rounded-[24px] bg-[#00658e] p-4 text-white shadow-[0_16px_30px_rgba(0,101,142,0.18)]">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-[#85cfff]" />
              <span className="text-xs font-black">AI review</span>
            </div>
            <p className="mt-3 text-xs font-medium leading-5 text-white/75">Low risk terms</p>
          </div>

          <div className="rounded-[24px] border border-[#dfe3e8] bg-white p-4 shadow-[0_16px_34px_rgba(0,101,142,0.10)]">
          <div className="flex items-center justify-between">
            <Coins className="h-5 w-5 text-[#229ED9]" />
            <span className="rounded-full bg-[#e6f7ff] px-2 py-1 text-[11px] font-black text-[#00658e]">Funded</span>
          </div>
          <p className="mt-4 text-xs font-bold text-[#64748b]">Escrow</p>
          <p className="text-xl font-black">20 USDT</p>
          </div>
        </div>

        <div className="mt-3 inline-flex rounded-full bg-[#229ED9] px-4 py-2 text-xs font-black text-white shadow-[0_12px_24px_rgba(34,158,217,0.28)]">
          Protected by TON
        </div>
        <Sparkles className="absolute right-6 top-20 h-5 w-5 text-[#229ED9]" />
      </div>

      <div className="relative z-10 mt-5 grid grid-cols-2 gap-3">
        <Button asChild className="h-12 rounded-[22px] bg-[#00658e] font-black text-white shadow-[0_12px_24px_rgba(0,101,142,0.2)] hover:bg-[#00506f]">
          <Link href="/deals">Get Started</Link>
        </Button>
        <Button className="h-12 rounded-[22px] border-[#229ED9] bg-[#229ED9] font-black text-white hover:bg-[#168bc2]" variant="outline">
          <WalletCards className="h-4 w-4" />
          Connect Wallet
        </Button>
      </div>
    </section>
  );
}
