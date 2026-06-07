import type { TonNetwork } from "@/lib/ton/types";

export type StonfiQuoteRequest = {
  fromAsset: "TON" | string;
  toAsset: "USDT" | string;
  // Either fix what the payer sends (inputAmount) or what the freelancer should
  // receive as settlement (settlementAmount / targetOutputAmount). WorkPay fixes
  // the settlement amount so the freelancer always receives the agreed USDT.
  inputAmount?: string;
  targetOutputAmount?: string;
  settlementAmount?: string;
  settlementAsset?: string;
  network: TonNetwork;
  dealId?: string;
};

export type StonfiQuoteResult = {
  provider: "STON.fi Omniston";
  fromAsset: string;
  toAsset: string;
  inputAmount: string;
  outputAmount: string;
  route: string[];
  priceImpact?: string;
  minReceived?: string;
  quoteId?: string;
  validUntil?: string;
  timestamp: string;
  // ISO timestamp of the on-wire resolver quote.
  network: TonNetwork;
  resolver?: string;
  raw?: unknown;
};

export type StonfiQuoteState =
  | "idle"
  | "loading"
  | "ready"
  | "setup_required"
  | "error";

export type StonfiQuoteFailure = {
  state: "setup_required" | "error" | "unsupported_network" | "no_quote";
  message: string;
};

export type StonfiQuoteResponse = StonfiQuoteResult | StonfiQuoteFailure;

export function isStonfiQuoteResult(value: StonfiQuoteResponse): value is StonfiQuoteResult {
  return (value as StonfiQuoteResult).provider === "STON.fi Omniston";
}
