import { Omniston, type ChainAddress, type TonTransaction } from "@ston-fi/omniston-sdk";
import { OMNISTON_API_URL } from "@/lib/stonfi/config";
import { sanitizeTonConnectTransaction, type TonConnectTransaction } from "@/lib/ton/tonconnect";

export type StonfiSwapBuildRequest = {
  quoteId: string;
  sourceWallet: string;
  settlementWallet: string;
};

export type StonfiSwapBuildResult =
  | {
      status: "ready";
      transaction: TonConnectTransaction;
    }
  | {
      status: "setup_required" | "error";
      message: string;
    };

export async function createStonfiSwap(request: StonfiSwapBuildRequest): Promise<StonfiSwapBuildResult> {
  if (process.env.NEXT_PUBLIC_ENABLE_MAINNET !== "true") {
    return {
      status: "setup_required",
      message: "STON.fi Omniston swap builds mainnet transactions only. Set NEXT_PUBLIC_ENABLE_MAINNET=true after mainnet demo approval."
    };
  }

  const omniston = new Omniston({ apiUrl: OMNISTON_API_URL });

  try {
    const transaction = await omniston.tonBuildSwap({
      quoteId: request.quoteId,
      transferSrcAddress: tonAddress(request.sourceWallet),
      traderDstAddress: tonAddress(request.settlementWallet),
      gasExcessAddress: tonAddress(request.sourceWallet),
      refundSrcAddress: tonAddress(request.sourceWallet),
      useRecommendedSlippage: true
    });

    return {
      status: "ready",
      transaction: toTonConnectTransaction(transaction)
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unable to build STON.fi swap transaction."
    };
  } finally {
    closeOmniston(omniston);
  }
}

function tonAddress(address: string): ChainAddress {
  return { chain: { $case: "ton", value: address } };
}

function toTonConnectTransaction(transaction: TonTransaction): TonConnectTransaction {
  return sanitizeTonConnectTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: transaction.messages.map((message) => ({
      address: message.targetAddress,
      amount: message.sendAmount,
      payload: hexToBase64(message.payload),
      stateInit: message.jettonWalletStateInit ? hexToBase64(message.jettonWalletStateInit) : undefined
    }))
  });
}

function hexToBase64(value: string): string | undefined {
  const normalized = value.trim().replace(/^0x/, "");
  if (!normalized) {
    return undefined;
  }
  return Buffer.from(normalized, "hex").toString("base64");
}

function closeOmniston(omniston: Omniston): void {
  const closable = omniston as unknown as { close?: () => void };
  if (typeof closable.close === "function") {
    try {
      closable.close();
    } catch {
      // ignore close errors
    }
  }
}
