import type { StonfiQuote, StonfiQuoteRequest } from "@/lib/stonfi/types";

export async function requestStonfiQuote(request: StonfiQuoteRequest): Promise<StonfiQuote | { status: "setup_required"; message: string }> {
  if (!isStonfiConfigured()) {
    return { status: "setup_required", message: "STON.fi Omniston packages and API configuration are required before requesting real quotes." };
  }
  throw new Error(`STON.fi quote provider is configured but no Omniston quote client is wired for ${request.network}.`);
}

export function isStonfiConfigured() {
  return Boolean(process.env.STONFI_API_URL && process.env.STONFI_ENABLED === "true");
}
