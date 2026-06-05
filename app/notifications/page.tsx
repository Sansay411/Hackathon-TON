import { EmptyState } from "@/components/mobile/EmptyState";
import { MobileShell } from "@/components/mobile/MobileShell";

export default function NotificationsPage() {
  return (
    <MobileShell>
      <div className="space-y-5">
        <header>
          <p className="text-sm font-black text-[#229ED9]">Updates</p>
          <h1 className="mt-1 text-[34px] font-black leading-none tracking-normal">Notifications</h1>
        </header>
        <EmptyState
          title="No notifications"
          body="Job reviews, applications, deal status changes and payment setup alerts will appear here."
          action="Open jobs"
          href="/marketplace"
        />
      </div>
    </MobileShell>
  );
}
