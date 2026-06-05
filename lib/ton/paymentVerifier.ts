export type TonPaymentVerificationInput = {
  txHash: string;
  expectedEscrowWallet: string;
  expectedAmount: string;
  expectedAsset: string;
  network: "testnet" | "mainnet";
};

export type TonPaymentVerificationResult =
  | { status: "confirmed"; txHash: string }
  | { status: "not_found" }
  | { status: "mismatch"; reason: string }
  | { status: "provider_not_configured"; reason: string };

export interface TonPaymentVerifier {
  verify(input: TonPaymentVerificationInput): Promise<TonPaymentVerificationResult>;
}

export class ProviderBackedTonPaymentVerifier implements TonPaymentVerifier {
  async verify(): Promise<TonPaymentVerificationResult> {
    return {
      status: "provider_not_configured",
      reason: "Configure TonAPI or Toncenter before enabling payment confirmation."
    };
  }
}
