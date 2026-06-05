export type BotConfig = {
  token: string;
  username: string;
  appUrl: string;
  webhookSecret: string | null;
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for the WorkPay Telegram bot`);
  }
  return value;
}

export function getBotConfig(): BotConfig {
  return {
    token: requireEnv("TELEGRAM_BOT_TOKEN"),
    username: process.env.TELEGRAM_BOT_USERNAME ?? "GetWorkPayBot",
    appUrl: normalizeAppUrl(requireEnv("NEXT_PUBLIC_APP_URL")),
    webhookSecret: process.env.BOT_WEBHOOK_SECRET || null
  };
}

export function getWebhookUrl(config = getBotConfig()) {
  return buildMiniAppUrl("/api/bot/webhook", undefined, config.appUrl);
}

export function isHttpsUrl(value: string) {
  return value.startsWith("https://");
}

export function isMiniAppWebAppUrlReady(baseUrl = process.env.NEXT_PUBLIC_APP_URL) {
  return Boolean(baseUrl && isHttpsUrl(baseUrl));
}

export function buildMiniAppUrl(path = "/", startParam?: string, baseUrl = process.env.NEXT_PUBLIC_APP_URL) {
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is required to build Mini App URLs");
  }

  const url = new URL(path, `${normalizeAppUrl(baseUrl)}/`);
  if (startParam) {
    url.searchParams.set("startapp", startParam);
  }
  return url.toString();
}

function normalizeAppUrl(value: string) {
  return value.replace(/\/+$/, "");
}
