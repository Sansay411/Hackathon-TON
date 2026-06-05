import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function DealCard() {
  return (
    <Link className="block rounded-[30px] bg-[#182014] p-5 text-white shadow-[0_22px_44px_rgba(17,24,15,0.26)]" href="/deals/foundation-preview">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-[#c8ff45]">Active deal</p>
          <h3 className="mt-1 text-2xl font-black">Landing Page Design</h3>
        </div>
        <ShieldCheck className="h-7 w-7 text-[#c8ff45]" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-[22px] bg-white/10 p-3">
          <p className="text-xs text-white/60">Amount</p>
          <p className="mt-1 text-xl font-black">20 USDT</p>
        </div>
        <div className="rounded-[22px] bg-white/10 p-3">
          <p className="text-xs text-white/60">Status</p>
          <p className="mt-1 text-xl font-black">Waiting</p>
        </div>
      </div>
    </Link>
  );
}
