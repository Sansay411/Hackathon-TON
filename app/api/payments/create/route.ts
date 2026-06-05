import { apiError, apiOk } from "@/lib/api/errors";
import { paymentCreateSchema } from "@/lib/api/validation";
import { buildTonTransferRequest } from "@/lib/ton/transactionBuilder";

export async function POST(request: Request) {
  const parsed = paymentCreateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return apiError("bad_request", "Invalid payment create payload.", 400);
  }
  return apiOk({
    payment: { id: "payment-demo-created", status: "waiting_wallet_signature", ...parsed.data },
    tonConnect: buildTonTransferRequest({
      destination: "EQ_WORKPAY_ESCROW_TESTNET_PLACEHOLDER",
      amount: parsed.data.amount,
      asset: parsed.data.asset,
      comment: `WorkPay deal ${parsed.data.dealId}`
    }),
    auditEvent: "payment_started"
  });
}
