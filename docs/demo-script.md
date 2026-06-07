# Demo Script

## 2-Minute Pitch (structured)

**Problem**
Clients fear paying first. Freelancers fear working without payment. Telegram
freelance tools track tasks but do not verify payment, settlement, or reputation.

**Solution**
WorkPay is a Telegram-native freelance marketplace secured by TON.

**Integrations**
- **TON** — wallet identity, funding, payment proof, and reputation.
- **STON.fi (Omniston)** — smart settlement and token payment flexibility: a
  deal priced in USDT can be paid in TON with a real live quote.
- **Mira** — Telegram-native AI deal review through intent sourcing (no public
  API faked).

**Demo**
Show a job → Mira review intent → Energy application → deal → STON.fi quote
(TON → USDT) → TonConnect readiness → receipt.

### Exact demo path

1. Open WorkPay → Home → Marketplace.
2. Open a job → **Review with Mira** → copy prompt / open Mira → paste result.
3. Apply with Energy → Energy decreases.
4. Client accepts application → deal created.
5. Open the deal → **Smart Settlement (STON.fi)** → **Get STON.fi Quote**
   (live TON → USDT) → **Continue with TonConnect** (readiness).
6. Open the receipt.

## 2-Minute Pitch (narrative)

Freelance work in Telegram is fast, but trust is weak. Clients worry about paying too early. Freelancers worry about not getting paid. Most tools track tasks, but they do not verify payment, settlement, or reputation.

WorkPay is a secure freelance marketplace inside Telegram, powered by TON.

The bot is only the entry point. I open `@GetWorkPayBot`, tap `Open WorkPay`, and the Mini App launches. On first launch, the user chooses language, role, and connects a TON wallet. Browsing works without a wallet, but active deal actions require TON identity.

Now I open Jobs. This job is `Build a landing page for my TON startup`. Mira reviews the job for clarity, missing deliverables, deadline issues, and dispute risk. The freelancer applies using Energy. Energy is WorkPay's monetization layer: users get 20 free monthly Energy, and applications spend Energy.

### Mira Intent Sourcing

Because Mira does not currently expose a public API, WorkPay uses intent sourcing. The app generates a structured review intent, opens Mira through a Telegram deep link, and lets the user bring Mira's result back into the deal flow.

In the demo I tap `Review with Mira` on the job. WorkPay shows the Mira Intent Review panel: a compact `t.me/mira?start=...` deep link plus a full copyable prompt (`/workpay_review` skill format). I copy the prompt, open Mira (or use `@mira` inline mode), paste Mira's structured answer back, and WorkPay parses it into Clarity Score, Risk Level, Missing Items, Suggested Terms, and a Dispute Prevention Checklist. There is no fake API call — the user is always in control of the round trip.

Next, I open Applications and accept the freelancer. WorkPay creates a deal and moves the flow to escrow preparation. On the deal, the **Smart Settlement** card (powered by STON.fi) shows the deal priced in USDT while the client holds TON. I tap **Get STON.fi Quote** and WorkPay requests a real Omniston quote over a live WebSocket: it shows the route TON → USDT, how much TON the client pays (e.g. ~28.9 TON for 50 USDT), the resolver, and the quote time. These are real numbers, not placeholders. **Continue with TonConnect** moves to wallet signing readiness — WorkPay never fakes a completed swap or a funded deal.

TON is required because WorkPay does not trust manual confirmations. A deal is not funded until the backend verifies a real TON or Jetton transaction. A deal is not completed until release transaction architecture is verified.

Finally, I open the receipt page. It shows deal status, parties, amount, transaction proof fields, and a share card. Since provider setup is missing in demo mode, the receipt clearly says no confirmed TON proof exists yet.

WorkPay combines Telegram for distribution, TON for trust, STON.fi for liquidity, Mira for risk review, and Energy for monetization.
