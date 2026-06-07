import type { StonfiQuoteRequest } from "@/lib/stonfi/types";

// Swap EXECUTION (building and sending the settlement transaction) is the next
// step after a quote. WorkPay never fakes a successful swap: until the on-chain
// transaction builder + TonConnect signing flow is wired, this returns an honest
// setup-required state.
export async function createStonfiSwap(request: StonfiQuoteRequest) {
  return {
    status: "setup_required" as const,
    message: `STON.fi swap execution for ${request.fromAsset} -> ${request.toAsset} is not wired yet. Quotes are live; transaction signing is the next step.`
  };
}
