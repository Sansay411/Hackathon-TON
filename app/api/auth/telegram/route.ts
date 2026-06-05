import { NextResponse } from "next/server";
import { verifyTelegramInitData } from "@/lib/telegram/auth";

export async function POST(request: Request) {
  const { initData } = (await request.json()) as { initData?: string };
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!initData || !botToken) {
    return NextResponse.json({ error: "Telegram auth is not configured" }, { status: 503 });
  }

  try {
    const result = verifyTelegramInitData(initData, botToken);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid Telegram auth" }, { status: 401 });
  }
}
