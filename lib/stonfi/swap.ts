import type { StonfiQuoteRequest } from "@/lib/stonfi/types";

export async function createStonfiSwap(request: StonfiQuoteRequest) {
  if (!process.env.STONFI_API_URL || process.env.STONFI_ENABLED !== "true") {
    return { status: "setup_required" as const, message: "Configure STON.fi Omniston before creating real swap transactions." };
  }
  throw new Error(`STON.fi swap builder is configured but no Omniston transaction builder is wired for ${request.offerAsset}.`);
}
