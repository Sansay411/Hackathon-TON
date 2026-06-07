import type { TonNetwork } from "@/lib/ton/types";

// Omniston is STON.fi's public RFQ / smart-settlement protocol. The quote API is
// an open WebSocket endpoint that does not require an API key, so WorkPay can
// request real TON -> USDT quotes out of the box. Set STONFI_ENABLED=false to
// force the honest "setup required" state (e.g. in restricted environments).
export const OMNISTON_API_URL = process.env.OMNISTON_API_URL || "wss://omni-ws.ston.fi";

// Omniston resolvers provide liquidity on TON mainnet. Quotes are real mainnet
// price discovery and are shown as a settlement reference even when the rest of
// the app runs against testnet for payment preparation.
export const STONFI_QUOTE_NETWORK: TonNetwork = "mainnet";

export function isStonfiEnabled(): boolean {
  return process.env.STONFI_ENABLED !== "false";
}

// How long the server waits for the first resolver quote before giving up.
export const STONFI_QUOTE_TIMEOUT_MS = Number(process.env.STONFI_QUOTE_TIMEOUT_MS || 15000);
