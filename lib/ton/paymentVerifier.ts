import { tonToNano } from "@/lib/ton/transactionBuilder";
import { userFriendlyToRawAddress } from "@/lib/ton/address";

export type TonPaymentVerificationInput = {
  txHash: string;
  expectedEscrowWallet: string;
  expectedSenderWallet: string;
  expectedAmount: string;
  expectedAsset: string;
  expectedComment: string;
  network: "testnet" | "mainnet";
};

export type TonPaymentVerificationResult =
  | { status: "confirmed"; txHash: string; amountNano: string; source?: string; comment?: string }
  | { status: "not_found"; reason?: string }
  | { status: "mismatch"; reason: string }
  | { status: "provider_not_configured"; reason: string };

export interface TonPaymentVerifier {
  verify(input: TonPaymentVerificationInput): Promise<TonPaymentVerificationResult>;
}

type TonCenterV3Message = {
  hash?: string;
  source?: string;
  destination?: string;
  value?: string;
  message_content?: {
    decoded?: { comment?: string; text?: string; type?: string } | null;
  } | null;
};

type TonCenterV3Transaction = {
  hash?: string;
  account?: string;
  in_msg?: TonCenterV3Message | null;
  out_msgs?: TonCenterV3Message[] | null;
};

const TEXT_COMMENT = "text_comment";

function extractComment(msg: TonCenterV3Message | null | undefined): string | undefined {
  if (!msg?.message_content?.decoded) return undefined;
  const decoded = msg.message_content.decoded;
  if (decoded.comment) return decoded.comment;
  if (decoded.text) return decoded.text;
  if (decoded.type === TEXT_COMMENT && typeof decoded.text === "string") return decoded.text;
  return undefined;
}

function normalizeTxHash(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const hexMatch = /^[a-fA-F0-9]{64}$/.test(trimmed);
  if (hexMatch) return trimmed.toLowerCase();
  const b64Match = /^[A-Za-z0-9+/=_-]{43,44}$/.test(trimmed);
  if (b64Match) {
    try {
      const padded = trimmed.replace(/-/g, "+").replace(/_/g, "/");
      const withPad = padded + "===".slice((padded.length + 3) % 4);
      const buf = typeof Buffer !== "undefined"
        ? Buffer.from(withPad, "base64")
        : Uint8Array.from(atob(withPad), (c) => c.charCodeAt(0));
      if (buf.length !== 32) return null;
      return Array.from(buf).map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
      return null;
    }
  }
  return null;
}

function expectedNano(amount: string): bigint {
  return BigInt(tonToNano(amount));
}

function compareDestination(value: string, expectedRaw: string): boolean {
  if (value === expectedRaw) return true;
  const fromValue = userFriendlyToRawAddress(value);
  return fromValue !== null && fromValue === expectedRaw;
}

function compareAddress(value: string | undefined, expectedRaw: string): boolean {
  if (!value) return false;
  if (value.toUpperCase() === expectedRaw.toUpperCase()) return true;
  const fromValue = userFriendlyToRawAddress(value);
  return fromValue !== null && fromValue.toUpperCase() === expectedRaw.toUpperCase();
}

function getBaseUrl(network: "testnet" | "mainnet"): string {
  return network === "mainnet"
    ? "https://toncenter.com/api/v3"
    : "https://testnet.toncenter.com/api/v3";
}

async function fetchJson(url: string, apiKey: string, signal: AbortSignal): Promise<{ status: number; body: unknown }> {
  const r = await fetch(url, { headers: { "X-API-Key": apiKey }, signal });
  let body: unknown = null;
  try {
    body = await r.json();
  } catch {
    body = null;
  }
  return { status: r.status, body };
}

export class ProviderBackedTonPaymentVerifier implements TonPaymentVerifier {
  private readonly apiKey?: string;
  private readonly abortTimeoutMs: number;

  constructor(opts: { apiKey?: string; abortTimeoutMs?: number } = {}) {
    this.apiKey = opts.apiKey ?? process.env.TONCENTER_API_KEY;
    this.abortTimeoutMs = opts.abortTimeoutMs ?? 10_000;
  }

  async verify(input: TonPaymentVerificationInput): Promise<TonPaymentVerificationResult> {
    if (!this.apiKey) {
      return {
        status: "provider_not_configured",
        reason: "TONCENTER_API_KEY is not set. Configure a TON Center key to enable payment verification."
      };
    }
    if (input.expectedAsset.toUpperCase() !== "TON") {
      return {
        status: "mismatch",
        reason: `Only native TON verification is supported in this build; asset was '${input.expectedAsset}'.`
      };
    }

    const expectedRaw = userFriendlyToRawAddress(input.expectedEscrowWallet);
    if (!expectedRaw) {
      return {
        status: "mismatch",
        reason: "Escrow wallet address is not a valid TON address."
      };
    }
    const expectedSenderRaw = userFriendlyToRawAddress(input.expectedSenderWallet);
    if (!expectedSenderRaw) {
      return {
        status: "mismatch",
        reason: "Connected wallet address is not a valid TON address."
      };
    }

    const txHash = normalizeTxHash(input.txHash);
    if (!txHash) {
      return {
        status: "mismatch",
        reason: "Transaction hash must be 32 bytes encoded as hex or base64."
      };
    }

    const baseUrl = getBaseUrl(input.network);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.abortTimeoutMs);
    try {
      const txRes = await fetchJson(
        `${baseUrl}/transactions?hash=${txHash}&limit=1`,
        this.apiKey,
        controller.signal
      );
      if (txRes.status === 401 || txRes.status === 403) {
        return {
          status: "provider_not_configured",
          reason: `TONCenter rejected the API key (HTTP ${txRes.status}).`
        };
      }
      if (txRes.status >= 500) {
        return {
          status: "not_found",
          reason: `TONCenter upstream error (HTTP ${txRes.status}); treat as not found for safety.`
        };
      }
      const txBody = txRes.body as { transactions?: TonCenterV3Transaction[] } | null;
      const txList = txBody?.transactions ?? [];
      if (txList.length === 0) {
        return { status: "not_found" };
      }
      const tx = txList[0];

      if (tx.in_msg) {
        const result = matchInbound(tx.in_msg, expectedRaw, expectedSenderRaw, expectedNano(input.expectedAmount), input.expectedComment);
        if (result) {
          return finalize(input.txHash, tx.in_msg, result);
        }
      }

      const outHashes = (tx.out_msgs ?? []).map((m) => m.hash).filter((h): h is string => typeof h === "string");
      for (const msgHash of outHashes) {
        const landed = await fetchJson(
          `${baseUrl}/transactionsByMessage?msg_hash=${encodeURIComponent(msgHash)}&direction=in&limit=1`,
          this.apiKey,
          controller.signal
        );
        if (landed.status >= 500) continue;
        const body = landed.body as { transactions?: TonCenterV3Transaction[] } | null;
        const landedTx = body?.transactions?.[0];
        if (!landedTx?.in_msg) continue;
        const landedAmount = landedTx.in_msg.value;
        if (!landedAmount) continue;
        if (compareDestination(landedTx.in_msg.destination ?? "", expectedRaw)) {
          try {
            const comment = extractComment(landedTx.in_msg);
            if (
              BigInt(landedAmount) >= expectedNano(input.expectedAmount) &&
              compareAddress(landedTx.in_msg.source, expectedSenderRaw) &&
              comment === input.expectedComment
            ) {
              return finalize(input.txHash, landedTx.in_msg, { amount: landedAmount, destinationMatch: true });
            }
          } catch {
            continue;
          }
        }
      }

      return {
        status: "mismatch",
        reason: "No inbound message matched escrow wallet, connected sender wallet, expected amount, and WorkPay reference."
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown error";
      return {
        status: "not_found",
        reason: `Verification request failed: ${message}`
      };
    } finally {
      clearTimeout(timer);
    }
  }
}

function matchInbound(
  msg: TonCenterV3Message,
  expectedRaw: string,
  expectedSenderRaw: string,
  expectedNanoBig: bigint,
  expectedComment: string
): { amount: string; destinationMatch: boolean } | null {
  const destination = msg.destination ?? "";
  if (!compareDestination(destination, expectedRaw)) return null;
  if (!compareAddress(msg.source, expectedSenderRaw)) return null;
  if (extractComment(msg) !== expectedComment) return null;
  const value = msg.value;
  if (!value) return null;
  try {
    if (BigInt(value) < expectedNanoBig) return null;
    return { amount: value, destinationMatch: true };
  } catch {
    return null;
  }
}

function finalize(
  originalHash: string,
  msg: TonCenterV3Message,
  detail: { amount: string; destinationMatch: boolean }
): TonPaymentVerificationResult {
  return {
    status: "confirmed",
    txHash: originalHash,
    amountNano: detail.amount,
    source: msg.source,
    comment: extractComment(msg)
  };
}
