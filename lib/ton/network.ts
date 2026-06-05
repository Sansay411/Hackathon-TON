import type { TonNetwork } from "@/lib/ton/types";

export function getTonNetwork(): TonNetwork {
  return process.env.NEXT_PUBLIC_TON_NETWORK === "mainnet" ? "mainnet" : "testnet";
}

export function getTonConnectManifestUrl() {
  return (
    process.env.NEXT_PUBLIC_TONCONNECT_MANIFEST_URL ??
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/tonconnect-manifest.json`
  );
}

export const tonExplorers: Record<TonNetwork, string> = {
  testnet: "https://testnet.tonviewer.com",
  mainnet: "https://tonviewer.com"
};
