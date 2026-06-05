import type { Bot } from "grammy";
import type { Context } from "grammy";
import { buildMiniAppUrl, isMiniAppWebAppUrlReady } from "@/lib/bot/config";

export const botCommands = [
  { command: "start", description: "Open WorkPay" },
  { command: "help", description: "Get help" }
] as const;

export async function configureBotMenu(bot: Bot<Context>) {
  await bot.api.setMyCommands([...botCommands]);
  if (!isMiniAppWebAppUrlReady()) {
    return;
  }

  await bot.api.setChatMenuButton({
    menu_button: {
      type: "web_app",
      text: "Open WorkPay",
      web_app: {
        url: buildMiniAppUrl("/")
      }
    }
  });
}
