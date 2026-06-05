# Demo Script

## 2-Minute Pitch

Freelance work in Telegram is fast, but trust is weak. Clients worry about paying too early. Freelancers worry about not getting paid. Most tools track tasks, but they do not verify payment, settlement, or reputation.

WorkPay is a secure freelance marketplace inside Telegram, powered by TON.

The bot is only the entry point. I open `@GetWorkPayBot`, tap `Open WorkPay`, and the Mini App launches. On first launch, the user chooses language, role, and connects a TON wallet. Browsing works without a wallet, but active deal actions require TON identity.

Now I open Jobs. This job is `Build a landing page for my TON startup`. Mira reviews the job for clarity, missing deliverables, deadline issues, and dispute risk. The freelancer applies using Energy. Energy is WorkPay's monetization layer: users get 20 free monthly Energy, and applications spend Energy.

Next, I open Applications and accept the freelancer. WorkPay creates a deal and moves the flow to escrow preparation. The payment panel shows two honest paths: direct TON payment and STON.fi token swap payment. STON.fi matters because clients may hold different TON ecosystem tokens, but escrow needs a supported settlement asset.

TON is required because WorkPay does not trust manual confirmations. A deal is not funded until the backend verifies a real TON or Jetton transaction. A deal is not completed until release transaction architecture is verified.

Finally, I open the receipt page. It shows deal status, parties, amount, transaction proof fields, and a share card. Since provider setup is missing in demo mode, the receipt clearly says no confirmed TON proof exists yet.

WorkPay combines Telegram for distribution, TON for trust, STON.fi for liquidity, Mira for risk review, and Energy for monetization.
