import Link from "next/link";
import { Plus } from "lucide-react";

export function FloatingActionButton({ isActive = false }: { isActive?: boolean }) {
  return (
    <Link
      aria-label="Create deal"
      className={`absolute left-1/2 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-8 items-center justify-center rounded-full text-white shadow-[0_16px_28px_rgba(0,101,142,0.24)] ring-8 ring-[#f6faff] transition ${isActive ? "bg-[#00658e]" : "bg-[#229ED9]"}`}
      href="/deals/new"
    >
      <Plus className="h-7 w-7 text-white" strokeWidth={2.6} />
    </Link>
  );
}
