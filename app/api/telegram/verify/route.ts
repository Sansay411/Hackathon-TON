import { apiError, apiOk } from "@/lib/api/errors";
import { verifyTelegramInitData } from "@/lib/telegram/auth";

export async function POST(request: Request) {
  const { initData } = (await request.json()) as { initData?: string };
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!initData || !botToken) {
    return apiError("bad_request", "Telegram initData and bot token are required.", 400);
  }
  try {
    return apiOk(verifyTelegramInitData(initData, botToken));
  } catch {
    return apiError("unauthorized", "Telegram verification failed.", 401);
  }
}
