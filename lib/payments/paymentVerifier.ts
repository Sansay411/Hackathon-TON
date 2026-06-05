import type { TonTransactionVerifier, TransactionVerificationResult } from "@/lib/ton/transactions";

export interface PaymentVerifier {
  verifyDealFunding(input: {
    dealId: string;
    txHash: string;
    escrowWallet: string;
    amount: string;
    asset: string;
  }): Promise<TransactionVerificationResult>;
}

export class TonPaymentVerifier implements PaymentVerifier {
  constructor(private readonly verifier: TonTransactionVerifier) {}

  verifyDealFunding(input: {
    dealId: string;
    txHash: string;
    escrowWallet: string;
    amount: string;
    asset: string;
  }) {
    return this.verifier.verifyFunding({
      expectedDestination: input.escrowWallet,
      expectedAmount: input.amount,
      expectedAsset: input.asset,
      txHash: input.txHash
    });
  }
}
