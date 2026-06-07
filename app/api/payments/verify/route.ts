import { apiError, apiOk } from "@/lib/api/errors";
import { getVerifiedProfile, walletRequiredError } from "@/lib/api/profile";
import { paymentVerifySchema } from "@/lib/api/validation";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { ProviderBackedTonPaymentVerifier } from "@/lib/ton/paymentVerifier";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = paymentVerifySchema.safeParse(await request.json());
  if (!parsed.success) {
    return apiError("bad_request", "Invalid payment verify payload.", 400);
  }

  if (parsed.data.network === "mainnet" && process.env.NEXT_PUBLIC_ENABLE_MAINNET !== "true") {
    return apiError("bad_request", "Mainnet payment verification is disabled.", 400);
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
    return apiError("setup_required", "ESCROW_WALLET_ADDRESS is required before verifying a TON payment.", 503);
  }

  const verifier = new ProviderBackedTonPaymentVerifier();
  const expectedAmount = getExpectedDemoAmount(parsed.data.dealId);
  const expectedAsset = "TON";
  const result = await verifier.verify({
    txHash: parsed.data.txHash,
    expectedEscrowWallet: escrowWallet,
    expectedSenderWallet: parsed.data.walletAddress ?? profileResult.profile.walletAddress,
    expectedAmount,
    expectedAsset,
    expectedComment: `workpay:${parsed.data.dealId}`,
    network: parsed.data.network
  });

  if (result.status === "provider_not_configured") {
    return apiError("setup_required", result.reason, 503);
  }

  const balanceUpdate =
    result.status === "confirmed" && parsed.data.dealId === "wallet-readiness"
      ? await recordVerifiedDeposit({
          profileId: profileResult.profile.id,
          txHash: result.txHash,
          amount: expectedAmount,
          network: parsed.data.network
        })
      : null;

  return apiOk({
    dealId: parsed.data.dealId,
    network: parsed.data.network,
    expectedAmount,
    expectedAsset,
    verification: result,
    balanceUpdate
  });
}

function getExpectedDemoAmount(dealId: string): string {
  if (dealId === "wallet-readiness") {
    return "1";
  }
  return "20";
}

async function recordVerifiedDeposit(input: { profileId: string; txHash: string; amount: string; network: "testnet" | "mainnet" }) {
  const supabase = createSupabaseServiceRoleClient();
  if (!supabase) {
    return { status: "setup_required", message: "Supabase service role is required to record wallet balance." };
  }

  const { data: existing } = await supabase
    .from("balance_transactions")
    .select("id")
    .eq("tx_hash", input.txHash)
    .maybeSingle();
  if (existing) {
    return { status: "already_recorded" };
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("ton_balance").eq("id", input.profileId).single();
  if (profileError) {
    return { status: "setup_required", message: "Supabase ton_balance migration is required before recording wallet balance." };
  }
  const nextBalance = Number(profile?.ton_balance ?? 0) + Number(input.amount);
  const { error: updateError } = await supabase.from("profiles").update({ ton_balance: nextBalance }).eq("id", input.profileId);
  if (updateError) {
    return { status: "setup_required", message: "Wallet balance update failed in Supabase." };
  }
  const { error: ledgerError } = await supabase.from("balance_transactions").insert({
    profile_id: input.profileId,
    amount: input.amount,
    asset: "TON",
    type: "ton_deposit",
    reason: "Verified TON wallet top-up",
    tx_hash: input.txHash,
    metadata: { network: input.network, source: "toncenter" }
  });
  if (ledgerError) {
    return { status: "setup_required", message: "Balance ledger migration is required before recording wallet balance." };
  }

  return { status: "recorded", balanceTon: nextBalance };
}
