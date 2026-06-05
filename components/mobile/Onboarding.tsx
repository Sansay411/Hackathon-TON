import Link from "next/link";
import { WalletCards } from "lucide-react";
import { LanguageSelect } from "@/components/mobile/LanguageSelect";
import { RoleSelect } from "@/components/mobile/RoleSelect";

export function Onboarding() {
  const steps = ["Language", "Role", "Wallet", "Profile", "Jobs"];

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] bg-[#fbfff5] p-4 shadow-[0_12px_30px_rgba(17,24,15,0.08)]">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div className="flex flex-1 flex-col items-center gap-2" key={step}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${index < 2 ? "bg-[#229ED9] text-white" : "bg-[#c8ff45] text-[#182014]"}`}>
                {index + 1}
              </span>
              <span className="text-[10px] font-black text-[#66735c]">{step}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-[34px] bg-[#fbfff5] p-5 shadow-[0_18px_44px_rgba(17,24,15,0.12)]">
        <p className="text-sm font-black text-[#229ED9]">Step 1</p>
        <h2 className="mt-1 text-2xl font-black">Choose language</h2>
        <div className="mt-4">
          <LanguageSelect />
        </div>
      </section>
      <section className="rounded-[34px] bg-[#182014] p-5 text-white shadow-[0_18px_44px_rgba(17,24,15,0.2)]">
        <p className="text-sm font-black text-[#c8ff45]">Step 2</p>
        <h2 className="mt-1 text-3xl font-black">WorkPay</h2>
        <p className="mt-2 text-sm font-medium text-white/70">Secure freelance work on TON.</p>
      </section>
      <section className="rounded-[34px] bg-[#fbfff5] p-5 shadow-[0_18px_44px_rgba(17,24,15,0.12)]">
        <p className="text-sm font-black text-[#229ED9]">Step 3</p>
        <h2 className="mt-1 text-2xl font-black">Choose your role</h2>
        <div className="mt-4">
          <RoleSelect />
        </div>
      </section>
      <section className="rounded-[34px] bg-[#fbfff5] p-5 shadow-[0_18px_44px_rgba(17,24,15,0.12)]">
        <WalletCards className="h-7 w-7 text-[#229ED9]" />
        <h2 className="mt-3 text-2xl font-black">Connect TON Wallet</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#66735c]">
          Your TON wallet is your WorkPay identity for funding, payments and reputation.
        </p>
        <Link className="mt-4 block rounded-[22px] bg-[#c8ff45] px-4 py-3 text-center font-black text-[#182014]" href="/wallet">
          Connect Wallet
        </Link>
      </section>
      <section className="rounded-[34px] bg-[#fbfff5] p-5 shadow-[0_18px_44px_rgba(17,24,15,0.12)]">
        <h2 className="text-2xl font-black">Complete profile</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#66735c]">Add skills, portfolio links and hourly rate so clients can trust your application.</p>
        <Link className="mt-4 block rounded-[22px] bg-[#182014] px-4 py-3 text-center font-black text-white" href="/profile">
          Open Profile
        </Link>
      </section>
      <section className="rounded-[34px] bg-[#fbfff5] p-5 shadow-[0_18px_44px_rgba(17,24,15,0.12)]">
        <h2 className="text-2xl font-black">Browse or create jobs</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#66735c]">Freelancers apply with Energy. Clients accept an application to create a protected deal.</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link className="rounded-[20px] bg-[#c8ff45] px-4 py-3 text-center text-sm font-black text-[#182014]" href="/marketplace">Browse jobs</Link>
          <Link className="rounded-[20px] bg-[#229ED9] px-4 py-3 text-center text-sm font-black text-white" href="/jobs/new">Create job</Link>
        </div>
      </section>
    </div>
  );
}
