export type EscrowReleaseRequest = {
  dealId: string;
  escrowWallet: string;
  receiverWallet: string;
  amount: string;
  asset: string;
};

export type EscrowReleaseResult =
  | { status: "submitted"; txHash: string }
  | { status: "requires_signature"; message: string };

export interface EscrowReleaseService {
  prepareRelease(request: EscrowReleaseRequest): Promise<EscrowReleaseResult>;
}
