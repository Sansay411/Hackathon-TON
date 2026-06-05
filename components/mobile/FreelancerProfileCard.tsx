import Link from "next/link";
import { Github, Globe, Star } from "lucide-react";
import type { Profile } from "@/lib/domain/types";

export function FreelancerProfileCard({ profile }: { profile: Profile }) {
  return (
    <section className="rounded-[34px] bg-[#fbfff5] p-5 shadow-[0_18px_44px_rgba(17,24,15,0.12)]">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#182014] text-lg font-black text-[#c8ff45]">AM</div>
        <div>
          <h1 className="text-2xl font-black">{profile.firstName} {profile.lastName}</h1>
          <p className="text-sm font-semibold text-[#66735c]">@{profile.telegramUsername}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Badge icon={<Star className="h-4 w-4" />} text={`${profile.rating ?? 0} rating`} />
        <Badge icon={<Globe className="h-4 w-4" />} text={`${profile.completedDealsCount ?? 0} deals`} />
      </div>
      <p className="mt-4 text-sm font-semibold leading-6 text-[#66735c]">{profile.bio}</p>
      <div className="mt-4 flex gap-2">
        <Link className="rounded-full bg-[#c8ff45] px-3 py-2 text-xs font-black" href="/profile/demo-profile">Portfolio</Link>
        <span className="rounded-full bg-white px-3 py-2 text-xs font-black"><Github className="inline h-3.5 w-3.5" /> GitHub</span>
      </div>
    </section>
  );
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black">{icon}{text}</span>;
}
