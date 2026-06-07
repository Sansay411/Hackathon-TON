import Link from "next/link";
import { Share2, ShieldCheck } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";

export default async function DealReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const title = "Landing Page Design";
  const status = "waiting_payment";
  const shareText = `WorkPay Deal: ${title}\nStatus: ${status}\nPowered by TON`;

  return (
    <MobileShell>
      <div className="space-y-5">
        <section className="rounded-[34px] bg-[#00658e] p-5 text-white shadow-[0_22px_44px_rgba(0,101,142,0.22)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-[#acedff]">Receipt</p>
              <h1 className="mt-1 text-3xl font-black">{title}</h1>
            </div>
            <ShieldCheck className="h-8 w-8 text-[#acedff]" />
          </div>
          <p className="mt-3 text-sm font-medium text-white/70">Deal ID: {id}</p>
        </section>

        <section className="rounded-[30px] border border-[#dfe3e8] bg-white p-5 shadow-[0_14px_34px_rgba(0,101,142,0.08)]">
          <ReceiptRow label="Client" value="Demo Client" />
          <ReceiptRow label="Freelancer" value="Alex Morgan" />
          <ReceiptRow label="Amount" value="20 USDT" />
          <ReceiptRow label="Status" value={status} />
          <ReceiptRow label="Funding tx" value="Not confirmed" />
          <ReceiptRow label="Release tx" value="Not released" />
        </section>

        <section className="rounded-[30px] border border-[#dfe3e8] bg-white p-5 shadow-[0_14px_34px_rgba(0,101,142,0.08)]">
          <h2 className="text-xl font-black">TON proof</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#64748b]">
            Proof appears after backend verifies real TON funding and release transactions. No fake confirmations are shown.
          </p>
        </section>

        <Link className="flex items-center justify-center gap-2 rounded-[22px] bg-[#229ED9] px-4 py-3 font-black text-white" href={`https://t.me/share/url?text=${encodeURIComponent(shareText)}`}>
          <Share2 className="h-4 w-4" />
          Share receipt
        </Link>
      </div>
    </MobileShell>
  );
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#dfe3e8] py-3 last:border-b-0">
      <span className="text-sm font-bold text-[#64748b]">{label}</span>
      <span className="text-right text-sm font-black">{value}</span>
    </div>
  );
}
