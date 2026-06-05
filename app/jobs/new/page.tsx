import { DealForm } from "@/components/deal-form";
import { MobileShell } from "@/components/mobile/MobileShell";

export default function NewJobPage() {
  return (
    <MobileShell>
      <div className="space-y-5">
        <header>
          <p className="text-sm font-black text-[#229ED9]">Client flow</p>
          <h1 className="mt-1 text-[34px] font-black leading-none tracking-normal">Create job</h1>
          <p className="mt-2 text-sm font-medium leading-6 text-[#66735c]">Mira review is required before publishing a job.</p>
        </header>
        <DealForm />
        <p className="rounded-[24px] bg-[#fbfff5] p-4 text-sm font-semibold text-[#66735c] shadow-sm">
          Publish stays disabled in production until required fields and Mira review pass server validation.
        </p>
      </div>
    </MobileShell>
  );
}
