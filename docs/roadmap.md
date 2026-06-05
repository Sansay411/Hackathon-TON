# Roadmap

## Phase 1 Foundation

- Next.js App Router foundation.
- Telegram Mini App provider.
- TonConnect provider.
- Supabase schema and RLS baseline.
- Deal status transition service.
- TON, payment, STON.fi, and Mira interfaces.

## Phase 2 Identity

- Verify Telegram initData server-side.
- Create or update profiles from verified Telegram identity.
- Bind Supabase auth sessions to Telegram profiles.
- Replace broad RLS with participant-scoped policies.

## Phase 3 Payments

- Implement TonAPI or Toncenter verifier.
- Add idempotent funding checks.
- Persist payment verification audit events.
- Implement escrow funding transaction creation.

## Phase 4 Escrow

- Design and audit TON smart contract escrow.
- Add release and refund paths.
- Add dispute state handling.
- Add chain-derived escrow state sync.

## Phase 5 Liquidity And Intelligence

- Integrate STON.fi Omniston quotes and swaps.
- Integrate real Mira review provider.
- Feed completed deals into reputation.
