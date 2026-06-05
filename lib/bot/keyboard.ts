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
  return new InlineKeyboard().add(openAppButton("Connect Wallet", "/"));
}

export function createJobKeyboard() {
  return new InlineKeyboard().add(openAppButton("Create Job", "/jobs/new"));
}

export function openDealKeyboard(dealId: string) {
  return new InlineKeyboard().add(openAppButton("Open Deal", `/deals/${dealId}`));
}

export function openProfileKeyboard(profileId: string) {
  return new InlineKeyboard().add(openAppButton("Open Profile", `/profile/${profileId}`));
}

function openAppButton(text: string, path: string) {
  const url = buildMiniAppUrl(path);
  if (isMiniAppWebAppUrlReady()) {
    return InlineKeyboard.webApp(text, url);
  }
  return InlineKeyboard.url(text, url);
}
