# STON.fi

STON.fi is WorkPay's **smart settlement** layer. It lets a deal be priced in one
asset (e.g. USDT) while the client pays from what they actually hold (e.g. TON),
using STON.fi's **Omniston** RFQ protocol for real on-chain price discovery.

## Why Smart Settlement matters

Freelance deals are priced in a stable unit (USDT), but clients often hold TON.
Without settlement, the client has to manually swap, guess the rate, and hope
the freelancer receives the agreed amount. WorkPay instead asks STON.fi Omniston
for a live quote: *"to settle 50 USDT to the freelancer, how much TON must the
client send right now?"* — and shows the exact route, input, and output before
any signing happens.

## What is real

- **Live Omniston quotes.** `lib/stonfi/quote.ts` opens a real WebSocket RFQ to
  the public Omniston endpoint (`wss://omni-ws.ston.fi`) via the official
  `@ston-fi/omniston-sdk` and returns the first resolver quote. No values are
  fabricated.
- WorkPay fixes the **settlement (output) amount** (e.g. 50 USDT) and Omniston
  returns the required **input amount** (e.g. ~28.9 TON), the resolver name, a
  real `quoteId`, the quote timestamp, and the minimum received after slippage.
- The quote runs against **TON mainnet liquidity** (where Omniston resolvers
  operate), so the numbers reflect real market pricing.

## What is NOT implemented (honest scope)

- **Swap execution is not wired.** WorkPay prepares the quote and a TonConnect
  readiness state but does **not** build or send the settlement transaction yet
  (`lib/stonfi/swap.ts` returns an explicit `setup_required`). No swap is ever
  marked successful.
- A quote **never** marks a deal funded, completed, or released. On-chain
  payment proof still goes through the TON verification flow
  (`/api/payments/verify`).

## Quote flow

```
Deal priced in USDT, client holds TON
  ↓
SmartSettlementCard → POST /api/stonfi/quote
  ↓
lib/stonfi/quote.ts → Omniston requestForQuote (WebSocket RFQ)
  ↓
First resolver quote → normalized StonfiQuoteResult
  ↓
UI shows Route (TON → USDT), You pay ~X TON, Freelancer receives Y USDT,
provider, resolver, quote time, min received
  ↓
"Continue with TonConnect" → readiness state (signing is the next step)
```

### Files

- `lib/stonfi/config.ts` — Omniston endpoint, enable flag, quote timeout.
- `lib/stonfi/tokens.ts` — TON / USDT registry, Omniston `AssetId` builders,
  base-unit conversion.
- `lib/stonfi/types.ts` — `StonfiQuoteRequest`, `StonfiQuoteResult`,
  `StonfiQuoteState`, typed failures.
- `lib/stonfi/quote.ts` — real Omniston quote (Observable → Promise adapter).
- `app/api/stonfi/quote/route.ts` — `POST` quote endpoint (Node.js runtime).
- `components/stonfi/SmartSettlementCard.tsx` — stateful Smart Settlement UI.
- `components/stonfi/StonfiQuoteCard.tsx` — quote result presentation.

The Smart Settlement card is embedded on **Deal Detail** (`app/deals/[id]`).

## Normalized types

```ts
type StonfiQuoteRequest = {
  fromAsset: "TON" | string;
  toAsset: "USDT" | string;
  inputAmount?: string;
  targetOutputAmount?: string;
  settlementAmount?: string;
  settlementAsset?: string;
  network: "mainnet" | "testnet";
  dealId?: string;
};

type StonfiQuoteResult = {
  provider: "STON.fi Omniston";
  fromAsset: string;
  toAsset: string;
  inputAmount: string;
  outputAmount: string;
  route: string[];
  priceImpact?: string;
  minReceived?: string;
  quoteId?: string;
  validUntil?: string;
  timestamp: string;
  network: "mainnet" | "testnet";
  resolver?: string;
  raw?: unknown;
};

type StonfiQuoteState = "idle" | "loading" | "ready" | "setup_required" | "error";
```

## Configuration

| Env var | Default | Purpose |
| --- | --- | --- |
| `OMNISTON_API_URL` | `wss://omni-ws.ston.fi` | Public Omniston RFQ WebSocket. No API key required. |
| `STONFI_ENABLED` | `true` | Set to `false` to force the honest `setup_required` state. |
| `STONFI_QUOTE_TIMEOUT_MS` | `15000` | How long the server waits for the first resolver quote. |

Because Omniston quoting is a public endpoint, **WorkPay shows real quotes out of
the box** — no provider credentials are needed for the quote surface. The SDK is
listed in `next.config.ts` `serverExternalPackages` so its WebSocket transport
runs as a normal Node module instead of being bundled.

## UI states

| State | Shown when | Message |
| --- | --- | --- |
| `idle` | before requesting | "Get STON.fi Quote" |
| `loading` | request in flight | "Getting quote…" |
| `ready` | resolver quote received | route + amounts + Continue with TonConnect |
| `setup_required` | `STONFI_ENABLED=false` | "STON.fi setup required." |
| `error` | timeout / no quote / RPC error | "Unable to get STON.fi quote. Try again later." |

The "Continue with TonConnect" button is wallet-gated: without a connected
wallet it shows "Connect TON wallet to continue."

## Demo steps

1. Open a deal (`/deals/[id]`).
2. In **Smart Settlement**, see Deal Amount (50 USDT), Pay With (TON),
   Settlement Asset (USDT).
3. Tap **Get STON.fi Quote** → a live Omniston quote appears: route TON → USDT,
   you pay ~28.9 TON, freelancer receives 50 USDT, resolver + quote time.
4. Tap **Continue with TonConnect** → "Ready to sign transaction with your TON
   wallet." (signing is the documented next step).

## No fake swap policy

WorkPay never shows fake quote numbers, never fakes a successful swap, and never
marks a deal funded from the settlement UI. Quotes are real or the UI shows an
honest typed failure/setup state.
