import { DealForm } from "@/components/deal-form";
import { MobileShell } from "@/components/mobile/MobileShell";

export default function NewDealPage() {
  return (
    <MobileShell>
      <div className="space-y-5">
        <header>
          <p className="text-sm font-black text-[#229ED9]">Protected agreement</p>
          <h1 className="mt-1 text-[34px] font-black leading-none tracking-normal">Create deal</h1>
          <p className="mt-2 text-sm font-medium leading-6 text-[#66735c]">Define terms before Mira review and TON escrow funding.</p>
        </header>
        <DealForm />
      </div>
    </MobileShell>
  );
}
