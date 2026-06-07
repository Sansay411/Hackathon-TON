import { beginCell } from "@ton/core";

export type TonTransferRequest = {
  destination: string;
  amount: string;
  asset: string;
  comment?: string;
};

export function buildTonTransferRequest(input: TonTransferRequest) {
  const comment = input.comment ?? "WorkPay escrow funding";
  return {
    validUntil: Math.floor(Date.now() / 1000) + 600,
    network: process.env.NEXT_PUBLIC_TON_NETWORK === "mainnet" ? -239 : -3,
    messages: [
      {
        address: input.destination,
        amount: input.amount,
        payload: buildTextCommentPayload(comment)
      }
    ]
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

export function buildTextCommentPayload(comment: string) {
  return beginCell().storeUint(0, 32).storeStringTail(comment).endCell().toBoc().toString("base64");
}
