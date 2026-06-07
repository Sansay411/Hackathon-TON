import { apiError, apiOk } from "@/lib/api/errors";
import { getVerifiedProfile } from "@/lib/api/profile";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const initData = new URL(request.url).searchParams.get("initData");
  const profileResult = await getVerifiedProfile(initData);
  if (profileResult.status === "telegram_required") {
    return apiError("telegram_required", profileResult.message, 400);
  }
  if (profileResult.status === "setup_required") {
    return apiError("setup_required", profileResult.message, 503);
  }
  if (profileResult.status === "unauthorized") {
    return apiError("unauthorized", profileResult.message, 401);
  }

  const supabase = createSupabaseServiceRoleClient();
  if (!supabase) {
    return apiError("setup_required", "Supabase service role is required for wallet balance.", 503);
  }

  let balanceTon = profileResult.profile.tonBalance;
  const { data: balanceRow } = await supabase.from("profiles").select("ton_balance").eq("id", profileResult.profile.id).maybeSingle();
  if (balanceRow && typeof balanceRow.ton_balance !== "undefined") {
    balanceTon = Number(balanceRow.ton_balance ?? 0);
  }

  const { data } = await supabase
    .from("balance_transactions")
    .select("id, profile_id, amount, asset, type, reason, tx_hash, created_at")
    .eq("profile_id", profileResult.profile.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return apiOk({
    balanceTon,
    walletAddress: profileResult.profile.walletAddress,
    transactions: data ?? []
  });
}
