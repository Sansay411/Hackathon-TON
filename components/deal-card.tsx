import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import type { Deal } from "@/lib/domain/types";

export function DealCard({ deal }: { deal: Deal }) {
  return (
    <Link href={`/deals/${deal.id}`} className="block rounded-lg border bg-card p-4 shadow-sm transition hover:border-primary/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{deal.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{deal.description}</p>
        </div>
        <StatusBadge status={deal.status} />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-medium">
          {deal.priceAmount} {deal.priceToken}
        </span>
        <span className="text-muted-foreground">{deal.deadline ?? "No deadline"}</span>
      </div>
    </Link>
  );
}
