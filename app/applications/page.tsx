"use client";

import { useLanguage } from "@/components/language-provider";
import { ApplicationCard } from "@/components/mobile/ApplicationCard";
import { EmptyState } from "@/components/mobile/EmptyState";
import { MobileShell } from "@/components/mobile/MobileShell";
import { demoApplications } from "@/lib/demo/data";

export default function ApplicationsPage() {
  const { t } = useLanguage();

  return (
    <MobileShell>
      <div className="space-y-5">
        <header>
          <p className="text-sm font-black text-[#229ED9]">{t.applications.eyebrow}</p>
          <h1 className="mt-1 text-[34px] font-black leading-none tracking-normal">{t.applications.title}</h1>
          <p className="mt-2 text-sm font-medium leading-6 text-[#64748b]">{t.applications.description}</p>
        </header>
        {demoApplications.length === 0 ? (
          <EmptyState title={t.applications.emptyTitle} body={t.applications.emptyBody} action={t.applications.browseJobs} href="/marketplace" />
        ) : (
          demoApplications.map((application) => <ApplicationCard key={application.id} application={application} />)
        )}
      </div>
    </MobileShell>
  );
}
