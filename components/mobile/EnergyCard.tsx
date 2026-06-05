import Link from "next/link";
import { Zap } from "lucide-react";

export function EnergyCard({ balance = 20 }: { balance?: number }) {
  return (
    <Link className="block rounded-[28px] bg-[#182014] p-5 text-white shadow-[0_18px_38px_rgba(17,24,15,0.22)]" href="/energy">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-[#c8ff45]">Energy</p>
          <p className="mt-1 text-3xl font-black">{balance}</p>
        </div>
        <div className="rounded-2xl bg-[#c8ff45] p-3 text-[#182014]">
          <Zap className="h-6 w-6" />
        </div>
      </div>
      <p className="mt-3 text-xs font-medium text-white/70">20 free Energy resets monthly. Applying spends Energy.</p>
    </Link>
  );
}
