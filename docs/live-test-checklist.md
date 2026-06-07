# WorkPay Live Test Checklist

## Testnet Flow

1. Deploy WorkPay to HTTPS.
2. Set `NEXT_PUBLIC_APP_URL` to the HTTPS origin.
3. Set `NEXT_PUBLIC_TONCONNECT_MANIFEST_URL` to `/tonconnect-manifest.json`.
4. Configure BotFather Mini App URL to the same HTTPS origin.
5. Open `@GetWorkPayBot` in Telegram.
6. Press `/start`.
7. Tap `Open WorkPay`.
8. Verify Telegram profile sync: avatar, username, first name, language.
9. Connect Tonkeeper testnet wallet.
10. Check wallet saved to profile.
11. Create job.
12. Review with AI.
13. Apply with Energy.
14. Accept application.
15. Create deal.
16. Open payment panel.
17. Create testnet payment if `ESCROW_WALLET_ADDRESS` is configured.
18. Verify setup-required if escrow/provider env is missing.
19. Submit work.
20. Approve work.
21. Open receipt.

## What Is Real

- Telegram profile verification through Mini App `initData`.
- Telegram avatar/name/username profile defaults.
- TON wallet connection through TonConnect.
- Wallet save to server-side profile when Supabase is configured.
- Energy spending validation on the server.
- Job/application/deal flow backed by Supabase when configured.
- Payment architecture that prepares a TonConnect request only with escrow config.

## What Requires Provider Setup

- Real TON payment verification through TonAPI or Toncenter.
- STON.fi Omniston quote/swap/trade tracking.
- Mainnet payment generation.
- Real Mira provider unless `MIRA_API_KEY` or `DEEPSEEK_API_KEY` is configured.
