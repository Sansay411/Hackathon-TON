# TON Payments

TON is the trust layer for WorkPay.

Payment states:

- created
- waiting_wallet_signature
- sent
- confirming
- confirmed
- failed
- release_pending
- released

Deal funding can only move to funded after backend verification through TonAPI or Toncenter confirms escrow receipt, amount, asset, network, finality, and duplicate protection.

The current build includes transaction preparation boundaries and safe `503` responses when verification is not configured.

## TonConnect readiness

How to test:

1. Deploy the app over HTTPS.
2. Open WorkPay inside Telegram on mobile.
3. Connect a TonConnect wallet.
4. Confirm the wallet address appears in compact form and the network shows testnet or mainnet.
5. Verify the app shows `Connect TON wallet to continue.` when disconnected.

Deployment requirements:

- Telegram Mini Apps require HTTPS.
- Testnet is the default during development.
- `NEXT_PUBLIC_TONCONNECT_MANIFEST_URL` can point to the full manifest URL; otherwise WorkPay falls back to `NEXT_PUBLIC_APP_URL/tonconnect-manifest.json`.

Supported wallets:

- TonConnect-compatible wallets such as Tonkeeper, TON Space, MyTonWallet, Tonhub, and OpenMask.
