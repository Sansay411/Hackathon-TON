import { beginCell } from "@ton/core";

export type TonConnectMessage = {
  address: string;
  amount: string;
  payload?: string;
  stateInit?: string;
};

export type TonConnectTransaction = {
  validUntil: number;
  messages: TonConnectMessage[];
};

export type DirectTonTransferParams = {
  address: string;
  amountNano: string;
  comment?: string;
  validForSeconds?: number;
};

export function sanitizeTonConnectTransaction(input: unknown): TonConnectTransaction {
  const source = input as { validUntil?: unknown; messages?: unknown };
  const validUntil = typeof source.validUntil === "number" ? source.validUntil : Math.floor(Date.now() / 1000) + 600;
  const messages = Array.isArray(source.messages) ? source.messages : [];

  return {
    validUntil,
    messages: messages.map((message) => sanitizeMessage(message))
  };
}

export function createDirectTonTransferTransaction(params: DirectTonTransferParams): TonConnectTransaction {
  return sanitizeTonConnectTransaction({
    validUntil: Math.floor(Date.now() / 1000) + (params.validForSeconds ?? 600),
    messages: [
      {
        address: params.address,
        amount: params.amountNano,
        payload: params.comment ? createTextCommentPayload(params.comment) : undefined
      }
    ]
  });
}

export function createTextCommentPayload(comment: string): string {
  return beginCell().storeUint(0, 32).storeStringTail(comment).endCell().toBoc().toString("base64");
}

function sanitizeMessage(input: unknown): TonConnectMessage {
  const source = input as Partial<Record<keyof TonConnectMessage, unknown>>;
  const message: TonConnectMessage = {
    address: typeof source.address === "string" ? source.address : "",
    amount: typeof source.amount === "string" ? source.amount : String(source.amount ?? "0")
  };

  if (typeof source.payload === "string" && source.payload.length > 0) {
    message.payload = source.payload;
  }
  if (typeof source.stateInit === "string" && source.stateInit.length > 0) {
    message.stateInit = source.stateInit;
  }

  return message;
}
