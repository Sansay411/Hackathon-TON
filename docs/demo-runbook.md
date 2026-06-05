# Demo Runbook

## Run Locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

Set:

```bash
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
```

## Open Bot

Run local polling:

```bash
npm run bot:dev
```

Open `@GetWorkPayBot` and send `/start`.

## Telegram Mini App URL

For real Telegram Mini App launch, BotFather requires HTTPS:

1. Deploy to Vercel or expose an HTTPS tunnel.
2. Set `NEXT_PUBLIC_APP_URL=https://your-domain`.
3. In BotFather, configure Mini App URL to the same HTTPS URL.
4. Run `npm run bot:setup`.

## Load Demo Data

When `NEXT_PUBLIC_DEMO_MODE=true`, the home page shows `Load Demo Data`.

The endpoint returns demo records for:

- client profile
- freelancer profile
- 3 jobs
- 2 applications
- 1 active deal
- energy transactions
- deal events

It does not create fake confirmed payments.

## Judge Demo Path

1. Open home page.
2. Show Demo Mode banner.
3. Click Load Demo Data.
4. Show onboarding: language, role, wallet.
5. Open Jobs.
6. Open `Build a landing page for my TON startup`.
7. Show Mira review and Energy cost.
8. Open Applications.
9. Accept application and show deal created.
10. Open Deals.
11. Open deal detail.
12. Show payment panel: direct TON and STON.fi setup requirements.
13. Open receipt.
14. Open Energy page and show balance/history.
15. Open Profile and explain reputation.

## What Is Real

- Telegram bot launcher architecture
- Mini App routes and mobile UX
- Supabase schema and migration
- server-side API validation contracts
- Energy accounting model
- Mira adapter boundary with DeepSeek-backed provider if configured
- TON/STON.fi/payment setup-required boundaries

## Requires Provider Setup

- TonAPI or Toncenter payment verification
- escrow smart contract release
- STON.fi production quote/swap provider
- Telegram Stars payment flow

## Known Limitations

- Demo data is local/static unless Supabase project credentials are connected.
- Payments are not confirmed without real blockchain verification.
- Release and completed states are prepared but not faked.
