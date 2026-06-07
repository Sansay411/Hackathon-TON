# WorkPay

**TON-native freelance escrow inside Telegram.**

WorkPay is a Telegram Mini App for hackathon demos where Telegram provides identity and the mobile interface, TON provides wallet identity and payment proof, Supabase persists product data, Mira reviews deal risk, and STON.fi is the planned liquidity layer for token swap settlement.

Current production Mini App:

- Telegram bot: `@GetWorkPayBot`
- Mini App URL: `https://workpay-ton-fixed.vercel.app/launch/3b983d8`
- Production app: `https://workpay-ton-fixed.vercel.app`
- TonConnect manifest: `https://workpay-ton-fixed.vercel.app/tonconnect-manifest.json`

## English

### What WorkPay Demonstrates

WorkPay turns a Telegram bot into a real freelance workflow:

- Telegram Mini App launch and verified Telegram profile sync
- TON wallet connection through TonConnect
- Wallet-gated critical actions
- Marketplace jobs and applications
- Energy spending for applications
- Client acceptance and deal creation architecture
- Honest escrow payment preparation
- TONCenter-backed verification boundary
- Mira/DeepSeek AI review for job risk
- STON.fi Omniston readiness without fake swap success
- Supabase-backed persistent profiles

### Product Principles

- Telegram is the interface and identity source.
- TON is the wallet, payment proof, funding, settlement, and reputation layer.
- Supabase stores profiles, jobs, applications, deals, and audit data.
- Mira is the AI review and risk layer.
- STON.fi is the token swap and liquidity layer.
- No frontend-only payment confirmation.
- No fake TON funding.
- No fake STON.fi swap success.
- No private keys, bot tokens, service role keys, or wallet mnemonics in the frontend.

### Current Demo Status

**Real and working:**

- Telegram bot opens the Mini App.
- Telegram `initData` is verified server-side.
- Telegram profile fields are synced to Supabase.
- TonConnect provider and manifest are public and reachable.
- Wallet address can be saved to the user profile.
- Critical API routes enforce wallet gates.
- Direct TON payment preparation creates a real TonConnect transaction when escrow env is configured.
- TON transaction payload includes a WorkPay text comment reference.
- TONCenter verification route checks Telegram identity, saved wallet, escrow destination, sender wallet, amount, and `workpay:<dealId>` reference.
- Mira review route returns structured review output when DeepSeek/Mira credentials are configured.
- Production Vercel deployment is public and Telegram points to the current version.

**Setup-required by design:**

- Real escrow funding requires a testnet escrow wallet and real transaction hash.
- STON.fi Omniston quote, swap build, and trade tracking require full provider wiring.
- Mainnet is disabled unless `NEXT_PUBLIC_ENABLE_MAINNET=true`.
- Smart-contract escrow custody is not claimed in this demo build.

### Architecture

- Frontend: Next.js 15 App Router, TypeScript, TailwindCSS, shadcn-style UI
- Telegram: Telegram Mini Apps WebApp runtime, grammY bot
- Wallet: TonConnect UI React
- TON: `@ton/core`, TONCenter verification boundary
- Liquidity: STON.fi Omniston package boundary
- AI: Mira provider boundary with DeepSeek-compatible adapter
- Database: Supabase PostgreSQL
- Deployment: Vercel

### Core Routes

- `/launch/[version]` - Telegram cache-busted Mini App entry
- `/` - home
- `/marketplace` - jobs marketplace
- `/jobs/[id]` - job detail and application flow
- `/jobs/new` - create job
- `/applications` - applications
- `/deals` - deals dashboard
- `/deals/[id]` - deal timeline and payment panel
- `/deals/[id]/receipt` - receipt
- `/wallet` - TonConnect and payment readiness
- `/profile` - Telegram profile, wallet, reputation
- `/tonconnect-manifest.json` - TonConnect manifest

### Environment

Copy `.env.example` to `.env.local`.

```bash
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_VERSION=
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_TON_NETWORK=testnet
NEXT_PUBLIC_ENABLE_MAINNET=false
NEXT_PUBLIC_TONCONNECT_MANIFEST_URL=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=GetWorkPayBot
BOT_WEBHOOK_SECRET=

ESCROW_WALLET_ADDRESS=
TONAPI_KEY=
TONCENTER_API_KEY=

STONFI_API_URL=
STONFI_ENABLED=false

MIRA_API_URL=
MIRA_API_KEY=
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
```

### Local Development

Use `npm.cmd` on Windows.

```bash
npm.cmd install
npm.cmd run dev
```

Local bot polling:

```bash
npm.cmd run bot:dev
```

Production bot setup:

```bash
npm.cmd run bot:setup
```

Telegram Mini Apps require a public HTTPS URL. Use Vercel or a tunnel for Telegram-facing tests.

### Telegram Setup

1. Create a bot in BotFather.
2. Set `TELEGRAM_BOT_TOKEN`.
3. Deploy the app to HTTPS.
4. Set `NEXT_PUBLIC_APP_URL`.
5. Run `npm.cmd run bot:setup`.
6. Configure the Mini App URL in BotFather if needed.
7. Open `@GetWorkPayBot` and tap **Open WorkPay**.

### TON Setup

TonConnect requires:

- public app URL
- public manifest URL
- public icon URL
- client-side TonConnect provider
- testnet wallet for demo payments

Direct TON payment requires:

```bash
NEXT_PUBLIC_TON_NETWORK=testnet
NEXT_PUBLIC_ENABLE_MAINNET=false
ESCROW_WALLET_ADDRESS=
TONCENTER_API_KEY=
```

Payment flow:

1. User connects TON wallet.
2. Server prepares a TonConnect transaction.
3. Wallet signs/sends the transaction.
4. User provides tx hash for verification.
5. Backend checks the transaction through TONCenter.
6. Deal is treated as funded only after server-side verification.

### STON.fi Setup

The project includes STON.fi readiness boundaries and official package dependencies:

- `@ston-fi/omniston-sdk-react`
- `@ston-fi/api`
- `@ton/core`
- `@tonconnect/ui-react`

Current behavior is intentionally honest:

- no fake quote
- no fake route
- no fake swap transaction
- no fake settlement confirmation

Set `STONFI_ENABLED=true` only after a real Omniston quote/build/tracking implementation is wired.

### Mira / AI Setup

Mira review is exposed through a provider boundary.

For the current demo, DeepSeek-compatible review is configured server-side:

```bash
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
```

The job review route returns structured risk output:

- clarity score
- risk level
- missing items
- dispute risks
- suggested terms

### Verification Commands

```bash
npm.cmd test
npm.cmd run typecheck
npm.cmd run build
```

### Security Notes

- Never expose `SUPABASE_SERVICE_ROLE_KEY`.
- Never expose `TELEGRAM_BOT_TOKEN`.
- Never expose wallet private keys or mnemonics.
- Never trust `initDataUnsafe` on the backend.
- Never mark deals funded from a frontend wallet callback.
- Keep mainnet disabled until escrow and verification are production-ready.

### Known Demo Risks

- STON.fi Omniston is package-ready but not fully wired to quote/build/track trades.
- TONCenter verification requires a real testnet transaction hash.
- Supabase RLS should be tightened before production.
- npm audit currently reports dependency warnings that do not block the demo build.

---

# WorkPay RU

**TON-native escrow для фриланса внутри Telegram.**

WorkPay - это Telegram Mini App для хакатон-демо, где Telegram отвечает за профиль и интерфейс, TON - за кошелек и платежное доказательство, Supabase - за постоянные данные, Mira - за AI-риск сделки, а STON.fi - за будущий swap/liquidity слой.

Текущий production Mini App:

- Telegram bot: `@GetWorkPayBot`
- Mini App URL: `https://workpay-ton-fixed.vercel.app/launch/3b983d8`
- Production app: `https://workpay-ton-fixed.vercel.app`
- TonConnect manifest: `https://workpay-ton-fixed.vercel.app/tonconnect-manifest.json`

## Что Показывает Демо

WorkPay показывает полноценный путь фриланс-сделки:

- запуск Mini App из Telegram-бота;
- серверная проверка Telegram `initData`;
- синхронизация Telegram-профиля в Supabase;
- подключение TON-кошелька через TonConnect;
- блокировка критичных действий без кошелька;
- маркетплейс задач;
- отклики фрилансеров;
- Energy списание при отклике;
- принятие отклика клиентом и создание сделки;
- честная подготовка TON-платежа;
- TONCenter verify boundary;
- AI review через Mira/DeepSeek;
- STON.fi readiness без фейкового swap success.

## Принципы Продукта

- Telegram - интерфейс и источник личности.
- TON - кошелек, платежное доказательство, funding, settlement и reputation.
- Supabase - хранение профилей, задач, откликов, сделок и audit data.
- Mira - AI review и risk layer.
- STON.fi - swap и liquidity layer.
- Нельзя подтверждать оплату только по callback из кошелька.
- Нельзя фейково подтверждать TON funding.
- Нельзя фейково подтверждать STON.fi swap.
- Нельзя отдавать секреты на фронт.

## Что Сейчас Реально Работает

- Бот `@GetWorkPayBot` открывает Mini App.
- Telegram menu указывает на свежую версию `/launch/3b983d8`.
- Webhook настроен на production.
- Telegram profile sync проходит через серверную проверку.
- Supabase сохраняет профиль.
- TonConnect manifest публичный и корректный.
- Кошелек можно подключить и сохранить в профиль.
- API critical actions требуют кошелек.
- Direct TON payment создает реальный TonConnect transaction, если настроен escrow.
- TON transaction содержит comment payload `workpay:<dealId>`.
- `/api/payments/verify` проверяет Telegram user, saved wallet, escrow, sender, amount и reference.
- Mira review route возвращает структурированный анализ риска.

## Что Требует Настройки

- Реальная проверка funding требует testnet transaction hash.
- STON.fi Omniston quote/build/track еще нужно полностью довязать к provider API.
- Mainnet выключен по умолчанию.
- Smart-contract escrow custody не заявлен в этой демо-версии.

## Как Запустить Локально

```bash
npm.cmd install
npm.cmd run dev
```

Проверки:

```bash
npm.cmd test
npm.cmd run typecheck
npm.cmd run build
```

## Как Проверить В Telegram

1. Открыть `@GetWorkPayBot`.
2. Нажать **Open WorkPay**.
3. Должен открыться URL `/launch/3b983d8`.
4. Пройти первый опрос.
5. Проверить, что профиль берет имя/avatar/username из Telegram.
6. Подключить TON wallet.
7. Открыть сделку и payment panel.
8. Для тестового TON payment нужен настроенный `ESCROW_WALLET_ADDRESS`.
9. После отправки транзакции вставить tx hash и проверить через TONCenter.

## Безопасность

- `TELEGRAM_BOT_TOKEN` только на сервере.
- `SUPABASE_SERVICE_ROLE_KEY` только на сервере.
- `TONCENTER_API_KEY` только на сервере.
- Wallet private keys и mnemonics никогда не используются WorkPay.
- Backend не доверяет frontend payment status.
- Telegram `initDataUnsafe` не используется для backend authorization.

## Hackathon Demo Summary

WorkPay уже можно показывать как честный Telegram + TON Mini App сервис:

- identity из Telegram;
- wallet через TON;
- профиль в Supabase;
- AI review через Mira boundary;
- TON payment readiness через TonConnect;
- TONCenter verification boundary;
- STON.fi readiness без фейковых успехов.

