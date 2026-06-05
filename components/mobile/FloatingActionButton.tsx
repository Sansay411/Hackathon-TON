import Link from "next/link";
import { Plus } from "lucide-react";

export function FloatingActionButton({ isActive = false }: { isActive?: boolean }) {
  return (
    <Link
      aria-label="Create deal"
      className={`absolute left-1/2 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-8 items-center justify-center rounded-full text-[#11180f] shadow-[0_16px_28px_rgba(17,24,15,0.22)] ring-8 ring-[#d8efb1] transition ${isActive ? "bg-white" : "bg-[#c8ff45]"}`}
      href="/deals/new"
    >
      <Plus className="h-7 w-7 text-[#11180f]" strokeWidth={2.6} />
    </Link>
  );
}
