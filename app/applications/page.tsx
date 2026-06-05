import { ApplicationCard } from "@/components/mobile/ApplicationCard";
import { EmptyState } from "@/components/mobile/EmptyState";
import { MobileShell } from "@/components/mobile/MobileShell";
import { demoApplications } from "@/lib/demo/data";

export default function ApplicationsPage() {
  return (
    <MobileShell>
      <div className="space-y-5">
        <header>
          <p className="text-sm font-black text-[#229ED9]">Freelancer flow</p>
          <h1 className="mt-1 text-[34px] font-black leading-none tracking-normal">Applications</h1>
          <p className="mt-2 text-sm font-medium leading-6 text-[#66735c]">Energy spend, AI proposal quality and client decisions are tracked here.</p>
        </header>
        {demoApplications.length === 0 ? (
          <EmptyState title="No applications yet" body="Apply to a marketplace job with Energy to see proposals here." action="Browse jobs" href="/marketplace" />
        ) : (
          demoApplications.map((application) => <ApplicationCard key={application.id} application={application} />)
        )}
      </div>
    </MobileShell>
  );
}
