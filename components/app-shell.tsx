import Link from "next/link";
import { BriefcaseBusiness, Plus, WalletCards } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen pb-24">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-4 sm:px-6">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-normal">
            WorkPay
          </Link>
          <nav className="flex items-center gap-2">
            <Link className="rounded-md border bg-card p-2" href="/deals" aria-label="Deals">
              <BriefcaseBusiness className="h-5 w-5" />
            </Link>
            <Link className="rounded-md border bg-card p-2" href="/deals/new" aria-label="New deal">
              <Plus className="h-5 w-5" />
            </Link>
            <span className="rounded-md border bg-card p-2" aria-label="Wallet">
              <WalletCards className="h-5 w-5" />
            </span>
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}
