import { InlineKeyboard } from "grammy";
import { buildMiniAppUrl, isMiniAppWebAppUrlReady } from "@/lib/bot/config";

export function startKeyboard() {
  return openWorkPayKeyboard();
}

export function openWorkPayKeyboard() {
  return new InlineKeyboard().add(openAppButton("Open WorkPay", "/"));
}

export function createDealKeyboard() {
  return new InlineKeyboard().add(openAppButton("Open Create Deal", "/deals/new"));
}

export function dealsKeyboard() {
  return new InlineKeyboard().add(openAppButton("Open My Deals", "/deals"));
}

export function walletKeyboard() {
  return new InlineKeyboard().add(openAppButton("Connect Wallet", "/wallet"));
}

export function createJobKeyboard() {
  return new InlineKeyboard().add(openAppButton("Create Job", "/jobs/new"));
}

export function openDealKeyboard(dealId: string) {
  return new InlineKeyboard().add(openAppButton("Open Deal", `/deals/${dealId}`));
}

export function openProfileKeyboard(profileId: string) {
  return new InlineKeyboard().add(openAppButton("Open Profile", profileId ? `/profile/${profileId}` : "/profile"));
}

function openAppButton(text: string, path: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is required to build Telegram Mini App URLs");
  }

  const url = buildMiniAppUrl(path, undefined, appUrl);
  if (isMiniAppWebAppUrlReady()) {
    return InlineKeyboard.webApp(text, url);
  }
  return InlineKeyboard.url(text, url);
}
