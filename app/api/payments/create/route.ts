import { apiError, apiOk } from "@/lib/api/errors";
import { getVerifiedProfile, walletRequiredError } from "@/lib/api/profile";
import { paymentCreateSchema } from "@/lib/api/validation";
import { buildTonTransferRequest, tonToNano } from "@/lib/ton/transactionBuilder";

export async function POST(request: Request) {
  const parsed = paymentCreateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return apiError("bad_request", "Invalid payment create payload.", 400);
  }

  const profileResult = await getVerifiedProfile(parsed.data.initData);
  if (profileResult.status === "telegram_required") {
    return apiError("telegram_required", profileResult.message, 400);
  }
  if (profileResult.status === "setup_required") {
    return apiError("setup_required", profileResult.message, 503);
  }
  if (profileResult.status === "unauthorized") {
    return apiError("unauthorized", profileResult.message, 401);
  }
  if (!profileResult.profile.walletAddress) {
    return apiError(walletRequiredError().error, walletRequiredError().message, 403);
  }

  if (process.env.NEXT_PUBLIC_TON_NETWORK === "mainnet" && process.env.NEXT_PUBLIC_ENABLE_MAINNET !== "true") {
    return apiError("bad_request", "Mainnet payment creation is disabled.", 400);
  }

  if (parsed.data.asset !== "TON") {
    return apiError("setup_required", "Only direct TON transfer preparation is enabled. Use STON.fi after provider setup for token swaps.", 503);
  }

  const escrowWallet = process.env.ESCROW_WALLET_ADDRESS;
  if (!escrowWallet) {
    return apiError("setup_required", "ESCROW_WALLET_ADDRESS is required before preparing a real TON payment.", 503);
  }

  const amountNano = tonToNano(parsed.data.amount);
  const reference = `workpay:${parsed.data.dealId}`;

  return apiOk({
    provider: {
      status: "ready",
      missing: []
    },
    payment: {
      dealId: parsed.data.dealId,
      payerWallet: profileResult.profile.walletAddress,
      escrowWallet,
      asset: "TON",
      amount: parsed.data.amount,
      amountNano,
      network: process.env.NEXT_PUBLIC_TON_NETWORK === "mainnet" ? "mainnet" : "testnet",
      reference
    },
    transaction: buildTonTransferRequest({
      destination: escrowWallet,
      amount: amountNano,
      asset: "TON",
      comment: reference
    }),
    auditEvent: "payment_started"
  });
}
