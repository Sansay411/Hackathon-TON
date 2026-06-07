import type { AssetId } from "@ston-fi/omniston-sdk";

export type StonfiTokenSymbol = "TON" | "USDT";

export type StonfiToken = {
  symbol: StonfiTokenSymbol;
  label: string;
  decimals: number;
  // null for the native Toncoin, jetton master address otherwise.
  jettonMaster: string | null;
};

// Mainnet jetton master for Tether USD (USD₮) on TON.
const USDT_MAINNET_MASTER = "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs";

export const STONFI_TOKENS: Record<StonfiTokenSymbol, StonfiToken> = {
  TON: { symbol: "TON", label: "TON", decimals: 9, jettonMaster: null },
  USDT: { symbol: "USDT", label: "USDT", decimals: 6, jettonMaster: USDT_MAINNET_MASTER }
};

export function getStonfiToken(symbol: string): StonfiToken | null {
  const upper = symbol?.toUpperCase();
  if (upper === "TON" || upper === "USDT") {
    return STONFI_TOKENS[upper];
  }
  return null;
}

// Builds the Omniston AssetId for a known token symbol.
export function toOmnistonAssetId(token: StonfiToken): AssetId {
  if (token.jettonMaster) {
    return { chain: { $case: "ton", value: { kind: { $case: "jetton", value: token.jettonMaster } } } };
  }
  return { chain: { $case: "ton", value: { kind: { $case: "native", value: {} } } } };
}

// Converts a human decimal amount (e.g. "50", "21.7") to integer base units as a
// string, without floating point error. Returns null for invalid input.
export function toBaseUnits(amount: string, decimals: number): string | null {
  const trimmed = amount.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return null;
  }
  const [whole, fraction = ""] = trimmed.split(".");
  const paddedFraction = (fraction + "0".repeat(decimals)).slice(0, decimals);
  const combined = `${whole}${paddedFraction}`.replace(/^0+(?=\d)/, "");
  return combined === "" ? "0" : combined;
}

// Converts integer base units to a human-readable decimal string with up to
// `maxFractionDigits` significant fractional digits (trailing zeros trimmed).
export function fromBaseUnits(baseUnits: string, decimals: number, maxFractionDigits = 4): string {
  if (!/^\d+$/.test(baseUnits)) {
    return "0";
  }
  const padded = baseUnits.padStart(decimals + 1, "0");
  const whole = padded.slice(0, padded.length - decimals);
  let fraction = padded.slice(padded.length - decimals);
  fraction = fraction.slice(0, maxFractionDigits).replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
}
