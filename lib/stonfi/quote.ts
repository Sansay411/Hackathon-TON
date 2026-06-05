import type { StonfiQuote, StonfiQuoteRequest } from "@/lib/stonfi/types";

export async function requestStonfiQuote(request: StonfiQuoteRequest): Promise<StonfiQuote | { status: "setup_required"; message: string }> {
  if (!process.env.STONFI_API_URL) {
    return { status: "setup_required", message: "STON.fi API URL is not configured." };
  }
  return {
    offerAsset: request.offerAsset,
    askAsset: request.askAsset,
    offerAmount: request.amount,
    expectedAskAmount: "0",
    route: []
  };
}
