import { cn } from "@/lib/utils";
import type { DealStatus } from "@/lib/domain/deal-status";

const tone: Record<DealStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  ai_reviewed: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
  waiting_payment: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  swap_pending: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  funded: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  in_progress: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  submitted: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  approved: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  release_pending: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  completed: "bg-emerald-600 text-white",
  disputed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground"
};

export function StatusBadge({ status }: { status: DealStatus }) {
  return (
    <span className={cn("inline-flex rounded-md px-2 py-1 text-xs font-medium", tone[status])}>
      {status.replaceAll("_", " ")}
    </span>
  );
}
