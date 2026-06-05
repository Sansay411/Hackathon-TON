import { NextResponse } from "next/server";
import { createWorkPayBot } from "@/lib/bot/bot";
import { getBotConfig } from "@/lib/bot/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { webhookSecret } = getBotConfig();
  if (webhookSecret) {
    const receivedSecret = request.headers.get("x-telegram-bot-api-secret-token");
    if (receivedSecret !== webhookSecret) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  try {
    const update = await request.json();
    const bot = createWorkPayBot();
    await bot.handleUpdate(update);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook handling failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

export function GET() {
  return NextResponse.json({ ok: true, service: "workpay-bot-webhook" });
}
