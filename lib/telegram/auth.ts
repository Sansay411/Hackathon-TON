import crypto from "node:crypto";

export type TelegramAuthResult = {
  telegramId: string;
  username: string | null;
  authDate: Date;
};

export function verifyTelegramInitData(initData: string, botToken: string): TelegramAuthResult {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) {
    throw new Error("Telegram initData is missing hash");
  }

  params.delete("hash");
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secret = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const calculatedHash = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(calculatedHash, "hex"), Buffer.from(hash, "hex"))) {
    throw new Error("Telegram initData hash verification failed");
  }

  const userJson = params.get("user");
  if (!userJson) {
    throw new Error("Telegram initData is missing user");
  }

  const user = JSON.parse(userJson) as { id?: number; username?: string };
  if (!user.id) {
    throw new Error("Telegram user id is missing");
  }

  return {
    telegramId: String(user.id),
    username: user.username ?? null,
    authDate: new Date(Number(params.get("auth_date") ?? "0") * 1000)
  };
}
