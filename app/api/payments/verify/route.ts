import { apiError, apiOk } from "@/lib/api/errors";
import { paymentVerifySchema } from "@/lib/api/validation";
import { ProviderBackedTonPaymentVerifier } from "@/lib/ton/paymentVerifier";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = paymentVerifySchema.safeParse(await request.json());
  if (!parsed.success) {
    return apiError("bad_request", "Invalid payment verify payload.", 400);
  }

  if (process.env.NEXT_PUBLIC_TON_NETWORK === "mainnet" && process.env.NEXT_PUBLIC_ENABLE_MAINNET !== "true") {
    return apiError("bad_request", "Mainnet payment verification is disabled.", 400);
  }

  const escrowWallet = process.env.ESCROW_WALLET_ADDRESS;
  if (!escrowWallet) {
    return apiError("setup_required", "ESCROW_WALLET_ADDRESS is required before verifying a TON payment.", 503);
  }

  const verifier = new ProviderBackedTonPaymentVerifier();
  const result = await verifier.verify({
    txHash: parsed.data.txHash,
    expectedEscrowWallet: escrowWallet,
    expectedAmount: parsed.data.expectedAmount,
    expectedAsset: parsed.data.expectedAsset,
    network: parsed.data.network
  });

  if (result.status === "provider_not_configured") {
    return apiError("setup_required", result.reason, 503);
  }

  return apiOk({
    dealId: parsed.data.dealId,
    network: parsed.data.network,
    expectedAmount: parsed.data.expectedAmount,
    expectedAsset: parsed.data.expectedAsset,
    verification: result
  });
}
