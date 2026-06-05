import { BadgeCheck, Star, Trophy, UserRound } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { truncateTonAddress } from "@/lib/ton/address";
import { demoProfile } from "@/lib/demo/data";

export default function ProfilePage() {
  return (
    <MobileShell>
      <div className="space-y-5">
        <section className="rounded-[34px] border border-white/70 bg-[#fbfff5] p-5 shadow-[0_18px_44px_rgba(17,24,15,0.12)]">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#182014] text-[#c8ff45] ring-4 ring-white">
              <UserRound className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-black text-[#229ED9]">WorkPay profile</p>
              <h1 className="text-2xl font-black leading-tight">Telegram user</h1>
              <p className="text-sm font-semibold text-[#66735c]">Reputation will come from completed TON deals.</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <Stat label="Deals" value="0" />
            <Stat label="Rating" value="New" />
            <Stat label="Paid" value="$0" />
          </div>
          <div className="mt-4 rounded-[20px] bg-white p-3">
            <p className="text-xs font-black text-[#66735c]">TON wallet</p>
            <p className="mt-1 text-sm font-black">{demoProfile.walletAddress ? truncateTonAddress(demoProfile.walletAddress) : "Not connected"}</p>
            <p className="mt-1 text-xs font-semibold text-[#66735c]">Connect and save your TON wallet to unlock active deal actions.</p>
          </div>
        </section>

        <section className="rounded-[30px] bg-[#182014] p-5 text-white shadow-[0_22px_44px_rgba(17,24,15,0.24)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-[#c8ff45]">Reputation layer</p>
              <h2 className="mt-1 text-2xl font-black">On-chain trust</h2>
            </div>
            <Trophy className="h-7 w-7 text-[#c8ff45]" />
          </div>
          <p className="mt-3 text-sm font-medium leading-6 text-white/70">Completed deals will become a verifiable work history once real escrow settlement is live.</p>
        </section>

        <div className="grid gap-3">
          <ProfileRow icon={<BadgeCheck className="h-5 w-5" />} title="Telegram identity" value="Pending verified auth" />
          <ProfileRow icon={<Star className="h-5 w-5" />} title="Client score" value="No completed deals yet" />
          <ProfileRow icon={<Trophy className="h-5 w-5" />} title="Freelancer rank" value="Start with first deal" />
        </div>
      </div>
    </MobileShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-white p-3 text-center shadow-sm">
      <p className="text-lg font-black">{value}</p>
      <p className="text-xs font-bold text-[#66735c]">{label}</p>
    </div>
  );
}

function ProfileRow({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[24px] border border-white/70 bg-[#fbfff5] p-4 shadow-[0_12px_30px_rgba(17,24,15,0.08)]">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#c8ff45] p-3 text-[#182014]">{icon}</div>
        <div>
          <p className="font-black">{title}</p>
          <p className="text-xs font-semibold text-[#66735c]">{value}</p>
        </div>
      </div>
    </div>
  );
}
