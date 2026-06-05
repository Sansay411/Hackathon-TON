# WorkPay

WorkPay is a Telegram Mini App for secure freelance deals on TON.

Telegram is the interface layer, Mira is the intelligence layer, STON.fi is the liquidity layer, and TON is the trust layer. Deals are only active when they can be funded, verified, settled, and later used for reputation through TON-native flows.

The hackathon version adds a marketplace, onboarding, freelancer profiles, Energy monetization, job applications, safe API contracts, and payment preparation without fake crypto confirmations.

## Architecture

- Frontend: Next.js 15 App Router, TypeScript, TailwindCSS, shadcn-style components, Telegram Mini App runtime, TonConnect UI React, React Query.
- Backend: Next.js Route Handlers.
- Database: Supabase PostgreSQL, Storage-ready schema, Realtime publication.
- Payments: TON-first interfaces for funding verification and escrow release.
- Liquidity: STON.fi Omniston adapter boundary for future quote, swap, and trade tracking.
- AI: Mira adapter boundary with a mock provider for local review shape only.
- Monetization: Energy balance and transactions for freelancer applications.
- Marketplace: jobs, applications, client acceptance, and deal creation architecture.

## Database

The foundation migration is in `supabase/migrations/20260604170000_workpay_foundation.sql`.

It creates:

- `profiles`
- `deals`
- `payments`
- `deliveries`
- `deal_events`

Deal status transitions are enforced in application code through `lib/domain/deal-status.ts`. Database-level transition enforcement should be added once the final write path is locked.

## Supabase Setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
4. Apply migrations with Supabase CLI or the dashboard SQL editor.
5. Keep RLS enabled on all public tables.

The initial RLS policies are broad foundation policies. Before production, bind Telegram identity to a Supabase-authenticated profile and replace broad policies with participant-scoped policies.

## Telegram Mini App Setup

1. Create a Telegram bot with BotFather.
2. Configure the Mini App URL to the deployed Vercel URL.
3. Set `TELEGRAM_BOT_TOKEN`.
4. The client extracts `initData` only. Server verification happens in `app/api/auth/telegram/route.ts`.
5. Do not trust `initDataUnsafe` for authorization.
6. `NEXT_PUBLIC_TONCONNECT_MANIFEST_URL` should be the full manifest URL when set. If omitted, the app falls back to `NEXT_PUBLIC_APP_URL/tonconnect-manifest.json`.

## Telegram Bot Setup

WorkPay includes a grammY bot layer for `@GetWorkPayBot`.

Environment variables:

```bash
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=GetWorkPayBot
NEXT_PUBLIC_APP_URL=https://your-domain.com
BOT_WEBHOOK_SECRET=
```

Local development uses long polling:

```bash
npm run bot:dev
```

Production requires a deployed HTTPS domain:

```bash
npm run bot:setup
```

The bot is intentionally minimal. `/start` and `/help` launch the Mini App; product logic stays inside WorkPay. The setup script configures bot commands, sets the chat menu button to `Open WorkPay`, and sets the webhook to `NEXT_PUBLIC_APP_URL/api/bot/webhook`.

## Hackathon Demo Flow

See `docs/demo-script.md`.

Core routes:

- `/` onboarding and home
- `/marketplace` jobs
- `/jobs/[id]` job detail and apply architecture
- `/jobs/new` create job
- `/applications` freelancer applications
- `/deals` deals dashboard
- `/deals/[id]` deal/payment timeline
- `/energy` Energy balance and packages
- `/wallet` TON wallet/payment readiness
- `/profile` profile and reputation

Manual BotFather steps:

1. Open `@BotFather`.
2. Select `@GetWorkPayBot`.
3. Open Bot Settings.
4. Configure Mini App.
5. Enable Mini App.
6. Set Mini App URL to the production HTTPS domain.
7. Set menu button to `WorkPay` if not done by script.
8. Add bot picture.
9. Add description and commands.

The Main Mini App profile button still needs to be configured manually in BotFather.

See `docs/telegram-bot.md` for the command list, webhook setup, local development, production deployment, and troubleshooting.

## TON Architecture

TON runs in testnet by default through `NEXT_PUBLIC_TON_NETWORK=testnet`.

The project includes:

- `lib/ton/types.ts`
- `lib/ton/network.ts`
- `lib/ton/address.ts`
- `lib/ton/transactions.ts`
- `lib/payments/paymentVerifier.ts`
- `lib/payments/escrowRelease.ts`

No fake blockchain verification is implemented. Real verification should use TonAPI or Toncenter to confirm transaction hash, network, source, destination, amount, asset, finality, and replay safety.

## STON.fi Architecture

`lib/stonfi/types.ts` defines the liquidity provider interface for:

- quote
- swap creation
- trade tracking

No fake swaps are implemented.

## Mira Architecture

`lib/mira/types.ts` defines `MiraProvider`.

`MockMiraProvider` returns a typed local review shape for UI development.

`DeepSeekMiraProvider` is the current real review adapter behind the Mira boundary. It uses the DeepSeek OpenAI-compatible API with `DEEPSEEK_MODEL=deepseek-v4-flash` by default. Configure it server-side only:

```bash
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
```

## Roadmap

- Bind Telegram auth to Supabase profiles.
- Add participant-scoped RLS.
- Replace sample UI data with Supabase queries.
- Implement TonAPI or Toncenter verification.
- Add smart contract escrow.
- Implement STON.fi Omniston quotes and swaps.
- Implement Mira real review provider.
- Add on-chain reputation from completed deals.

## Security Considerations

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- Never trust Telegram `initDataUnsafe`.
- Never manually confirm payments.
- Never mark deals funded without verified TON transaction data.
- Keep testnet as the default until production escrow is audited.
- Never trust frontend Energy costs or balances.
- Never allow duplicate applications to spend Energy twice.

## Future Smart Contract Escrow

The current foundation prepares for escrow but does not claim custody logic. Production escrow should use audited TON smart contracts, deterministic escrow addresses or contract instances, formal release/refund paths, and chain-derived state as the source of truth.
