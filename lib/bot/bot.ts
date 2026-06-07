import { Bot } from "grammy";
import { getBotConfig } from "@/lib/bot/config";
import { createDealMessage, dealsMessage, helpMessage, unknownMessage, walletMessage, welcomeMessage } from "@/lib/bot/messages";
import { createDealKeyboard, dealsKeyboard, openWorkPayKeyboard, startKeyboard, walletKeyboard } from "@/lib/bot/keyboard";

export function createWorkPayBot() {
  const bot = new Bot(getBotConfig().token);

  bot.command("start", async (ctx) => {
    await ctx.reply(welcomeMessage, { reply_markup: startKeyboard() });
  });

  bot.command("help", async (ctx) => {
    await ctx.reply(helpMessage, { reply_markup: openWorkPayKeyboard() });
  });

  bot.command("create", async (ctx) => {
    await ctx.reply(createDealMessage, { reply_markup: createDealKeyboard() });
  });

  bot.command("deals", async (ctx) => {
    await ctx.reply(dealsMessage, { reply_markup: dealsKeyboard() });
  });

  bot.command("wallet", async (ctx) => {
    await ctx.reply(walletMessage, { reply_markup: walletKeyboard() });
  });

  bot.on("message:text", async (ctx) => {
    await ctx.reply(unknownMessage, { reply_markup: openWorkPayKeyboard() });
  });

  bot.catch((error) => {
    console.error("WorkPay bot error", error.message);
  });

  return bot;
}
