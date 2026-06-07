import { apiError, apiOk } from "@/lib/api/errors";
import { getVerifiedProfile, walletRequiredError } from "@/lib/api/profile";
import { stonfiSwapSchema } from "@/lib/api/validation";
import { createStonfiSwap } from "@/lib/stonfi/swap";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = stonfiSwapSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("bad_request", "Invalid STON.fi swap request.", 400);
  }

  if (parsed.data.network !== "mainnet") {
    return apiError("setup_required", "STON.fi Omniston swap execution is available on mainnet only. Testnet wallets can use direct TON test payments.", 503);
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

  const escrowWallet = process.env.ESCROW_WALLET_ADDRESS;
  if (!escrowWallet) {
    return apiError("setup_required", "ESCROW_WALLET_ADDRESS is required before building a STON.fi settlement transaction.", 503);
  }

  const result = await createStonfiSwap({
    quoteId: parsed.data.quoteId,
    sourceWallet: profileResult.profile.walletAddress,
    settlementWallet: escrowWallet
  });

  switch (result.status) {
    case "ready":
      return apiOk({
        provider: "STON.fi Omniston",
        dealId: parsed.data.dealId,
        transaction: result.transaction,
        note: "Wallet approval starts the swap only; WorkPay still verifies escrow receipt separately."
      });
    case "setup_required":
      return apiError("setup_required", result.message, 503);
    case "error":
      return apiError("server_error", result.message, 502);
  }
}
