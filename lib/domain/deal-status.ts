export const dealStatuses = [
  "draft",
  "ai_reviewed",
  "waiting_payment",
  "swap_pending",
  "funded",
  "in_progress",
  "submitted",
  "approved",
  "release_pending",
  "completed",
  "disputed",
  "cancelled"
] as const;

export type DealStatus = (typeof dealStatuses)[number];

const transitions: Record<DealStatus, readonly DealStatus[]> = {
  draft: ["ai_reviewed", "cancelled"],
  ai_reviewed: ["waiting_payment", "draft", "cancelled"],
  waiting_payment: ["swap_pending", "funded", "cancelled"],
  swap_pending: ["funded", "waiting_payment", "cancelled"],
  funded: ["in_progress", "disputed", "cancelled"],
  in_progress: ["submitted", "disputed"],
  submitted: ["approved", "in_progress", "disputed"],
  approved: ["release_pending", "disputed"],
  release_pending: ["completed", "disputed"],
  completed: [],
  disputed: ["cancelled"],
  cancelled: []
};

export function canTransitionDeal(from: DealStatus, to: DealStatus) {
  return transitions[from].includes(to);
}

export function assertDealTransition(from: DealStatus, to: DealStatus) {
  if (!canTransitionDeal(from, to)) {
    throw new Error(`Invalid deal status transition from ${from} to ${to}`);
  }
}
