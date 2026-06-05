# Telegram Bot

WorkPay uses a grammY bot for Telegram launch and command routing. The bot opens the existing Mini App through Telegram `web_app` buttons and configures the chat menu button for production.

## Architecture

- `lib/bot/config.ts`: server-only environment validation and Mini App URL builder.
- `lib/bot/bot.ts`: grammY bot instance and command handlers.
- `lib/bot/keyboard.ts`: inline Mini App keyboards.
- `lib/bot/menu.ts`: commands and chat menu button setup.
- `app/api/bot/webhook/route.ts`: production webhook endpoint.
- `scripts/bot-dev.ts`: local long polling.
- `scripts/setup-bot.ts`: production command, menu, and webhook setup.

## Commands

- `/start`: welcome message and Mini App buttons.
- `/create`: opens `/deals/new`.
- `/deals`: opens `/deals`.
- `/wallet`: opens WorkPay for wallet connection.
- `/help`: short workflow help.

Unknown text receives a short reply with an Open WorkPay Mini App button.

## Webhook Setup

Production uses `POST /api/bot/webhook`.

Set:

```bash
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=GetWorkPayBot
NEXT_PUBLIC_APP_URL=https://your-domain.com
BOT_WEBHOOK_SECRET=
```

Then run:

```bash
npm run bot:setup
```

The script sets commands, sets the chat menu button to `Open WorkPay`, and points Telegram to:

```text
https://your-domain.com/api/bot/webhook
```

If `BOT_WEBHOOK_SECRET` is set, Telegram will send it in `X-Telegram-Bot-Api-Secret-Token`, and the webhook route rejects mismatches.

## BotFather Setup

1. Open `@BotFather`.
2. Select `@GetWorkPayBot`.
3. Open Bot Settings.
4. Configure Mini App.
5. Enable Mini App.
6. Set Mini App URL to the production HTTPS domain.
7. Set menu button to `WorkPay` if not done by `npm run bot:setup`.
8. Add bot picture.
9. Add description and commands.

The Main Mini App profile button must still be configured manually in BotFather.

## Local Development

Local development uses long polling:

```bash
npm run bot:dev
```

Use this when the app is running locally and no public HTTPS webhook is available. Mini App buttons still need an HTTPS URL that Telegram clients can open, so set `NEXT_PUBLIC_APP_URL` to a public tunnel or deployed preview URL when testing inside Telegram.

## Production Deployment

1. Deploy the Next.js app to Vercel.
2. Set all bot environment variables in Vercel.
3. Set `NEXT_PUBLIC_APP_URL` to the deployed HTTPS domain.
4. Run `npm run bot:setup` once from an environment with the production env values.
5. Confirm the webhook with Telegram Bot API `getWebhookInfo` if needed.

## Troubleshooting

- If buttons do not open, confirm `NEXT_PUBLIC_APP_URL` is HTTPS and reachable from Telegram.
- If webhook calls fail, confirm `BOT_WEBHOOK_SECRET` matches the secret set by `npm run bot:setup`.
- If commands do not update, rerun `npm run bot:setup`.
- If local polling does not start, check `TELEGRAM_BOT_TOKEN` and ensure no webhook-only process is consuming updates.
