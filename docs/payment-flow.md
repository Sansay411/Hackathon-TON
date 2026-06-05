# Payment Flow

WorkPay does not include fake payment confirmation.

## Funding

1. Client connects a TON wallet through TonConnect.
2. App prepares a funding transaction for the selected network.
3. Client signs and sends the transaction.
4. Backend verifies the transaction through TonAPI or Toncenter.
5. Verification checks transaction hash, source wallet, escrow destination, amount, asset, network, finality, and duplicate use.
6. Deal transitions from `waiting_payment` or `swap_pending` to `funded`.

## Release

1. Freelancer submits delivery.
2. Client approves.
3. App prepares escrow release.
4. TON transaction is submitted through the real escrow contract or release wallet flow.
5. Backend verifies release transaction.
6. Deal transitions to `completed`.

## STON.fi

When the client funds with an unsupported asset, STON.fi Omniston can provide quote and swap routing into a supported settlement asset. Swap state must be tracked separately and cannot mark a deal funded until the escrow receives verified funds.

## No Manual Override

Production must not include manual payment confirmation, admin-entered transaction success, or mock blockchain verification.
