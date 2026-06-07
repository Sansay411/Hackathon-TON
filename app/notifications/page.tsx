"use client";

import { useLanguage } from "@/components/language-provider";
import { EmptyState } from "@/components/mobile/EmptyState";
import { MobileShell } from "@/components/mobile/MobileShell";

export default function NotificationsPage() {
  const { t } = useLanguage();

  return (
    <MobileShell>
      <div className="space-y-5">
        <header>
          <p className="text-sm font-black text-[#229ED9]">{t.notifications.eyebrow}</p>
          <h1 className="mt-1 text-[34px] font-black leading-none tracking-normal">{t.notifications.title}</h1>
        </header>
        <EmptyState
          title={t.notifications.emptyTitle}
          body={t.notifications.emptyBody}
          action={t.notifications.openJobs}
          href="/marketplace"
        />
      </div>
    </MobileShell>
  );
}
