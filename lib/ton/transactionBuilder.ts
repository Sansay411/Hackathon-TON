export type TonTransferRequest = {
  destination: string;
  amount: string;
  asset: string;
  comment?: string;
  from?: string;
};

export function buildTonTransferRequest(input: TonTransferRequest) {
  return {
    validUntil: Math.floor(Date.now() / 1000) + 600,
    network: process.env.NEXT_PUBLIC_TON_NETWORK === "mainnet" ? "-239" : "-3",
    from: input.from,
    messages: [
      {
        address: input.destination,
        amount: input.amount
      }
    ],
    workpayReference: input.comment ?? "WorkPay escrow funding"
  };
}

export function tonToNano(amount: string) {
  if (!/^\d+(\.\d{1,9})?$/.test(amount)) {
    throw new Error("Invalid TON amount");
  }
  const [whole, fraction = ""] = amount.split(".");
  const normalizedFraction = fraction.padEnd(9, "0");
  return (BigInt(whole) * 1_000_000_000n + BigInt(normalizedFraction)).toString();
}
