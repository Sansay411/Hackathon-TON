import { apiError, apiOk } from "@/lib/api/errors";
import { getVerifiedProfile, walletRequiredError } from "@/lib/api/profile";
import { walletConnectSchema } from "@/lib/api/validation";
import { assertDealTransition } from "@/lib/domain/deal-status";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = walletConnectSchema.safeParse(await request.json());
  if (!parsed.success) {
    return apiError("bad_request", "Invalid approve payload.", 400);
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

  const supabase = createSupabaseServiceRoleClient();
  if (!supabase) {
    return apiError("setup_required", "Supabase service role is required to approve deals.", 503);
  }

  const { data: deal } = await supabase.from("deals").select("id, client_id, status").eq("id", id).single();
  if (!deal) {
    return apiError("not_found", "Deal not found.", 404);
  }
  if (deal.client_id !== profileResult.profile.id) {
    return apiError("forbidden", "Only the client can approve this deal.", 403);
  }

  try {
    assertDealTransition(deal.status, "approved");
    assertDealTransition("approved", "release_pending");
  } catch (error) {
    return apiError("conflict", error instanceof Error ? error.message : "Invalid deal status transition.", 409);
  }

  await supabase.from("deals").update({ status: "release_pending" }).eq("id", id);
  await supabase.from("deal_events").insert([
    { deal_id: id, actor_id: profileResult.profile.id, event_type: "deal_approved", from_status: deal.status, to_status: "approved" },
    { deal_id: id, actor_id: profileResult.profile.id, event_type: "release_started", from_status: "approved", to_status: "release_pending" }
  ]);

  return apiOk({ dealId: id, status: "release_pending", auditEvents: ["deal_approved", "release_started"] });
}
