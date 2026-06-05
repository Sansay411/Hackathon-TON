import type { TonNetwork } from "@/lib/ton/types";

export type StonfiQuoteRequest = {
  network: TonNetwork;
  offerAsset: string;
  askAsset: string;
  amount: string;
};

export type StonfiQuote = {
  offerAsset: string;
  askAsset: string;
  offerAmount: string;
  expectedAskAmount: string;
  route: string[];
};

export interface StonfiLiquidityProvider {
  quote(request: StonfiQuoteRequest): Promise<StonfiQuote>;
  createSwap(request: StonfiQuoteRequest): Promise<{ trackingId: string; payload: unknown }>;
  getTradeStatus(trackingId: string): Promise<"pending" | "confirmed" | "failed">;
}
