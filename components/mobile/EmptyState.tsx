import Link from "next/link";
import type { Route } from "next";
import { Inbox } from "lucide-react";

export function EmptyState({ title, body, action, href }: { title: string; body: string; action: string; href: Route }) {
  return (
    <section className="rounded-[30px] bg-[#fbfff5] p-5 text-center shadow-[0_14px_34px_rgba(17,24,15,0.09)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#c8ff45] text-[#182014]">
        <Inbox className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-xl font-black">{title}</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#66735c]">{body}</p>
      <Link className="mt-4 inline-flex rounded-[20px] bg-[#182014] px-5 py-3 text-sm font-black text-white" href={href}>
        {action}
      </Link>
    </section>
  );
}
