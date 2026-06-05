import type { TonNetwork } from "@/lib/ton/types";

export function getTonNetwork(): TonNetwork {
  return process.env.NEXT_PUBLIC_TON_NETWORK === "mainnet" ? "mainnet" : "testnet";
}

export function getTonConnectManifestUrl() {
  const manifestUrl = process.env.NEXT_PUBLIC_TONCONNECT_MANIFEST_URL?.replace(/\/+$/, "");
  if (manifestUrl) {
    return manifestUrl;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");
  if (appUrl) {
    return `${appUrl}/tonconnect-manifest.json`;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/tonconnect-manifest.json`;
  }

  return "http://localhost:3000/tonconnect-manifest.json";
}

export const tonExplorers: Record<TonNetwork, string> = {
  testnet: "https://testnet.tonviewer.com",
  mainnet: "https://tonviewer.com"
};
