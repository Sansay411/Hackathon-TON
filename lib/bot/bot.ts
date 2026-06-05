import { Bot } from "grammy";
import { getBotConfig } from "@/lib/bot/config";
import { helpMessage, unknownMessage, welcomeMessage } from "@/lib/bot/messages";
import { openWorkPayKeyboard, startKeyboard } from "@/lib/bot/keyboard";

export function createWorkPayBot() {
  const bot = new Bot(getBotConfig().token);

  bot.command("start", async (ctx) => {
    await ctx.reply(welcomeMessage, { reply_markup: startKeyboard() });
  });

  bot.command("help", async (ctx) => {
    await ctx.reply(helpMessage, { reply_markup: openWorkPayKeyboard() });
  });

  bot.callbackQuery("help", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply(helpMessage, { reply_markup: openWorkPayKeyboard() });
  });

  bot.on("message:text", async (ctx) => {
    await ctx.reply(unknownMessage, { reply_markup: openWorkPayKeyboard() });
  });

  bot.catch((error) => {
    console.error("WorkPay bot error", error.message);
  });

  return bot;
}
