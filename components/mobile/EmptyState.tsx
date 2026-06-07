import Link from "next/link";
import type { Route } from "next";
import { Inbox } from "lucide-react";

export function EmptyState({ title, body, action, href }: { title: string; body: string; action: string; href: Route }) {
  return (
    <section className="rounded-3xl border border-[#dfe3e8] bg-white p-5 text-center shadow-[0_10px_30px_rgba(0,101,142,0.07)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f7ff] text-[#00658e]">
        <Inbox className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-xl font-black">{title}</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#64748b]">{body}</p>
      <Link className="mt-4 inline-flex rounded-2xl bg-[#229ED9] px-5 py-3 text-sm font-black text-white" href={href}>
        {action}
      </Link>
    </section>
  );
}
