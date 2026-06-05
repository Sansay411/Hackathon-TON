export type EscrowReleasePreparation = {
  dealId: string;
  escrowWallet: string;
  receiverWallet: string;
  amount: string;
  asset: string;
};

export interface TonEscrowReleaseService {
  prepareRelease(input: EscrowReleasePreparation): Promise<{ status: "requires_signature"; payload: unknown }>;
}

export class PreparedTonEscrowReleaseService implements TonEscrowReleaseService {
  async prepareRelease(input: EscrowReleasePreparation) {
    return {
      status: "requires_signature" as const,
      payload: {
        dealId: input.dealId,
        message: "Release transaction must be signed and then verified on TON."
      }
    };
  }
}
