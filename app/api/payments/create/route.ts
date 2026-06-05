import { apiError, apiOk } from "@/lib/api/errors";
import { paymentCreateSchema, walletConnectSchema } from "@/lib/api/validation";
import { isLikelyTonAddress } from "@/lib/ton/address";

const createPaymentSchema = paymentCreateSchema.merge(walletConnectSchema);

export async function POST(request: Request) {
  const parsed = createPaymentSchema.safeParse(await request.json());
  if (!parsed.success) {
    return apiError("bad_request", "Invalid payment create payload.", 400);
  }
  if (!isLikelyTonAddress(parsed.data.walletAddress)) {
    return apiError("forbidden", "Connect TON wallet to continue.", 403);
  }

  const tonConfigured = Boolean(process.env.TONAPI_KEY || process.env.TONCENTER_API_KEY);
  if (!tonConfigured) {
    return apiError("payment_setup_required", "Real TON payment provider is required before preparing a payment.", 503);
  }

  return apiOk({
    provider: {
      status: "ready",
      missing: []
    },
    auditEvent: "payment_started"
  });
}
