import type { TonTransactionReference } from "@/lib/ton/types";

export type TransactionVerificationResult =
  | { status: "verified"; transaction: TonTransactionReference }
  | { status: "not_found" }
  | { status: "mismatch"; reason: string };

export interface TonTransactionVerifier {
  verifyFunding(params: {
    expectedDestination: string;
    expectedAmount: string;
    expectedAsset: string;
    txHash: string;
  }): Promise<TransactionVerificationResult>;
}
