export type TonTransferRequest = {
  destination: string;
  amount: string;
  asset: string;
  comment?: string;
};

export function buildTonTransferRequest(input: TonTransferRequest) {
  return {
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [
      {
        address: input.destination,
        amount: input.amount,
        payload: input.comment ?? "WorkPay escrow funding"
      }
    ]
  };
}
