# WorkPay Architecture

WorkPay is a TON-native escrow product delivered as a Telegram Mini App.

## Layers

- Telegram: interface, launch surface, theme, user entry.
- Mira: intelligence, deal review, missing terms, risk scoring.
- STON.fi: liquidity, token conversion into supported settlement assets.
- TON: trust, funding, verification, escrow, settlement, reputation.

## Application Boundaries

- `app/`: App Router pages and route handlers.
- `components/`: reusable UI and providers.
- `lib/domain/`: deal lifecycle and core types.
- `lib/telegram/`: Telegram auth verification.
- `lib/ton/`: TON network, addresses, and transaction interfaces.
- `lib/payments/`: funding verification and escrow release contracts.
- `lib/stonfi/`: liquidity provider contracts.
- `lib/mira/`: AI provider contracts.
- `lib/mira/deepseekProvider.ts`: current DeepSeek-backed implementation for the Mira intelligence boundary.
- `supabase/`: database config and migrations.

## Deal Lifecycle

Deals move through explicit statuses:

`draft -> ai_reviewed -> waiting_payment -> funded -> in_progress -> submitted -> approved -> release_pending -> completed`

Alternative paths include `swap_pending`, `disputed`, and `cancelled`.

Invalid transitions are rejected by `assertDealTransition`.

## Production Rule

Without TON verification, there is no active deal. UI may prepare terms and AI review, but it must not create funded state without verified on-chain evidence.
