import { ArrowLeftRight, LockKeyhole, WalletCards } from "lucide-react";
import { WalletGateButton, WalletGateNotice } from "@/components/wallet-access";

export function PaymentStatusCard() {
  const tonConfigured = Boolean(process.env.TONAPI_KEY || process.env.TONCENTER_API_KEY);
  const stonfiConfigured = Boolean(process.env.STONFI_API_URL);

  return (
    <section className="rounded-[30px] border border-white/70 bg-[#fbfff5] p-5 shadow-[0_14px_34px_rgba(17,24,15,0.09)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-[#229ED9]">Payment status</p>
          <h2 className="mt-1 text-2xl font-black">Escrow prepared</h2>
        </div>
        <div className="rounded-2xl bg-[#182014] p-3 text-[#c8ff45]">
          <LockKeyhole className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        <StatusRow icon={<WalletCards className="h-4 w-4" />} label="Direct TON payment" value={tonConfigured ? "Verifier configured" : "TonAPI/Toncenter missing"} />
        <StatusRow icon={<ArrowLeftRight className="h-4 w-4" />} label="STON.fi swap payment" value={stonfiConfigured ? "Quote ready" : "STON.fi setup required"} />
        <StatusRow icon={<LockKeyhole className="h-4 w-4" />} label="Escrow status" value="Awaiting verified TON tx" />
      </div>
      <div className="mt-4 rounded-[20px] bg-white p-3 text-xs font-semibold leading-5 text-[#66735c]">
        <p className="font-black text-[#182014]">Next setup step</p>
        <p>{tonConfigured ? "Connect escrow contract verification and release flow." : "Add TONAPI_KEY or TONCENTER_API_KEY to enable backend payment verification."}</p>
        <p className="mt-2">{stonfiConfigured ? "Show token selector, quote and swap action." : "STON.fi setup required. Add STON.fi provider configuration to enable token swap payments."}</p>
      </div>
      <div className="mt-4 rounded-[20px] bg-white p-3">
        {stonfiConfigured ? (
          <div className="space-y-3">
            <label className="block text-xs font-black text-[#66735c]">
              Payment token
              <select className="mt-2 h-11 w-full rounded-2xl border border-[#e6efd8] bg-[#fbfff5] px-3 font-black text-[#182014]" defaultValue="TON">
                <option>TON</option>
                <option>USDT</option>
              </select>
            </label>
            <div className="rounded-2xl bg-[#f2f8e9] p-3 text-xs font-semibold text-[#66735c]">
              Quote area ready. Request quote when STON.fi provider is connected.
            </div>
            <WalletGateButton className="w-full rounded-2xl bg-[#229ED9] px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60" connectedLabel="Prepare swap transaction" />
          </div>
        ) : (
          <div className="text-xs font-semibold leading-5 text-[#66735c]">
            <p className="font-black text-[#182014]">STON.fi setup required</p>
            <p>Add STON.fi provider configuration to enable token swap payments.</p>
          </div>
        )}
      </div>
      <WalletGateNotice />
    </section>
  );
}

function StatusRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[20px] bg-white px-3 py-3 text-sm shadow-sm">
      <div className="flex items-center gap-2 font-semibold text-[#66735c]">
        <span className="text-[#229ED9]">{icon}</span>
        {label}
      </div>
      <span className="text-right font-black text-[#182014]">{value}</span>
    </div>
  );
}
