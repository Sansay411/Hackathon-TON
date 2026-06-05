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
