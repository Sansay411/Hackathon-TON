import { AlertCircle, ArrowLeftRight, LockKeyhole, WalletCards } from "lucide-react";

export function PaymentPanel() {
  const tonConfigured = Boolean(process.env.TONAPI_KEY || process.env.TONCENTER_API_KEY);
  const stonfiConfigured = Boolean(process.env.STONFI_API_URL);

  return (
    <section className="rounded-[30px] border border-white/70 bg-[#ffffff] p-5 shadow-[0_14px_34px_rgba(17,24,15,0.09)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-[#229ED9]">Escrow funding</p>
          <h2 className="mt-1 text-2xl font-black">Payment setup</h2>
        </div>
        <div className="rounded-2xl bg-[#171c20] p-3 text-[#e6f7ff]">
          <LockKeyhole className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        <PaymentRail icon={<WalletCards className="h-4 w-4" />} title="Direct TON payment" status={tonConfigured ? "Provider configured" : "Missing TONAPI_KEY or TONCENTER_API_KEY"} />
        <PaymentRail icon={<ArrowLeftRight className="h-4 w-4" />} title="STON.fi swap payment" status={stonfiConfigured ? "Provider configured" : "STON.fi setup required"} />
      </div>
      <div className="mt-4 rounded-[20px] bg-white p-3 text-xs font-semibold leading-5 text-[#64748b]">
        <p className="flex items-center gap-2 font-black text-[#171c20]">
          <AlertCircle className="h-4 w-4 text-[#229ED9]" />
          Honest payment state
        </p>
        <p className="mt-2">No deal can become funded until backend verifies a real TON or Jetton transaction. No manual confirmation is available.</p>
        <p className="mt-2">{stonfiConfigured ? "Token selector and quote action are enabled in the STON.fi section." : "Add STON.fi provider configuration to enable token swap payments."}</p>
      </div>
    </section>
  );
}

function PaymentRail({ icon, title, status }: { icon: React.ReactNode; title: string; status: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[20px] bg-white px-3 py-3 text-sm shadow-sm">
      <div className="flex items-center gap-2 font-black text-[#171c20]">
        <span className="text-[#229ED9]">{icon}</span>
        {title}
      </div>
      <span className="max-w-32 text-right text-xs font-black text-[#64748b]">{status}</span>
    </div>
  );
}
