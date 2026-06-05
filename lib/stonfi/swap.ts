import type { StonfiQuoteRequest } from "@/lib/stonfi/types";

export async function createStonfiSwap(request: StonfiQuoteRequest) {
  if (!process.env.STONFI_API_URL) {
    return { status: "setup_required" as const, message: "Configure STON.fi before creating swaps." };
  }
  return { status: "prepared" as const, trackingId: `stonfi_${request.offerAsset}_${Date.now()}`, payload: {} };
}
