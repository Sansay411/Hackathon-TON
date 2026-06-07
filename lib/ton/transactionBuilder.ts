import { createDirectTonTransferTransaction, createTextCommentPayload } from "@/lib/ton/tonconnect";

export type TonTransferRequest = {
  destination: string;
  amount: string;
  asset: string;
  comment?: string;
};

export function buildTonTransferRequest(input: TonTransferRequest) {
  const comment = input.comment ?? "WorkPay escrow funding";
  return createDirectTonTransferTransaction({
    address: input.destination,
    amountNano: input.amount,
    comment
  });
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
  return createTextCommentPayload(comment);
}
