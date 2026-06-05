import { loadEnvConfig } from "@next/env";
import { createWorkPayBot } from "../lib/bot/bot";
import { getBotConfig } from "../lib/bot/config";
import { configureBotMenu } from "../lib/bot/menu";

loadEnvConfig(process.cwd());

async function main() {
  const config = getBotConfig();
  const bot = createWorkPayBot();

  console.log(`Starting @${config.username} in long polling mode`);
  await configureBotMenu(bot);
  console.log("Bot commands menu configured");

  await bot.start({
    onStart: (botInfo) => {
      console.log(`@${botInfo.username} is polling for updates`);
    }
  });
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Failed to start WorkPay bot");
  process.exit(1);
});
