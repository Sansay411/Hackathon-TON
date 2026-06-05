import { FreelancerProfileCard } from "@/components/mobile/FreelancerProfileCard";
import { MobileShell } from "@/components/mobile/MobileShell";
import { demoProfile } from "@/lib/demo/data";

export default function PublicProfilePage() {
  return (
    <MobileShell>
      <FreelancerProfileCard profile={demoProfile} />
    </MobileShell>
  );
}
