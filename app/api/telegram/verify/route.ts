import { apiError, apiOk } from "@/lib/api/errors";
import { getVerifiedProfile } from "@/lib/api/profile";

export async function POST(request: Request) {
  const { initData } = (await request.json()) as { initData?: string };
  const result = await getVerifiedProfile(initData);
  if (result.status === "telegram_required") {
    return apiError("telegram_required", result.message, 400);
  }
  if (result.status === "setup_required") {
    return apiError("setup_required", result.message, 503);
  }
  if (result.status === "unauthorized") {
    return apiError("unauthorized", result.message, 401);
  }
  return apiOk({ user: result.telegramUser, profile: result.profile, source: "telegram_verified_supabase" });
}
