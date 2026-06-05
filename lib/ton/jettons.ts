import type { TonNetwork } from "@/lib/ton/types";

export const supportedJettons: Record<TonNetwork, { symbol: string; address: string | null; decimals: number }[]> = {
  testnet: [
    { symbol: "TON", address: null, decimals: 9 },
    { symbol: "USDT", address: "testnet-usdt-placeholder", decimals: 6 }
  ],
  mainnet: [
    { symbol: "TON", address: null, decimals: 9 },
    { symbol: "USDT", address: "EQCxE6m3...", decimals: 6 }
  ]
};
