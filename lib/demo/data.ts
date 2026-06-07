import type { EnergyTransaction, JobApplication, MarketplaceJob, Profile } from "@/lib/domain/types";

export const demoDealScenario = {
  id: "foundation-preview",
  title: "WorkPay receipt and escrow proof implementation",
  description:
    "Freelancer will implement the completed deal receipt flow for WorkPay, including TON funding proof, release proof, setup-required states, and Telegram share text.",
  amount: "20",
  token: "TON",
  deadline: "2026-06-21",
  deliverables: [
    "Receipt page for completed and waiting-payment deals",
    "Funding transaction hash section",
    "Release transaction hash section",
    "TON proof status copy",
    "Telegram share text"
  ],
  acceptanceCriteria: [
    "Receipt never claims funding from wallet approval alone",
    "Funding status depends on server-side TONCenter/TonAPI verification",
    "Missing provider keys show setup-required state",
    "Receipt is readable on Telegram mobile WebView"
  ],
  riskContextShort: "Payment proof must be server verified before completion."
};

export const demoProfile: Profile = {
  id: "demo-profile",
  telegramId: "demo-telegram",
  telegramUsername: "workpay_user",
  firstName: "Alex",
  lastName: "Morgan",
  avatarUrl: null,
  language: "en",
  role: "both",
  walletAddress: null,
  bio: "TON builder, product designer, and Mini App freelancer.",
  skills: ["Telegram Mini Apps", "Landing pages", "TON", "React"],
  hourlyRate: "55",
  rating: 4.9,
  completedDealsCount: 12,
  successRate: 98,
  energyBalance: 19,
  createdAt: new Date("2026-06-01T10:00:00Z").toISOString(),
  updatedAt: new Date("2026-06-05T10:00:00Z").toISOString()
};

export const demoJobs: MarketplaceJob[] = [
  {
    id: "workpay-miniapp-onboarding",
    clientId: "demo-client",
    title: "Design WorkPay Mini App onboarding",
    description:
      "Create a mobile-first Telegram Mini App onboarding flow for WorkPay. The flow should collect language, role, skills, portfolio links, and explain that TON wallet connection is required for applying, accepting deals, escrow funding, and reputation.",
    category: "Telegram Mini App",
    budgetAmount: "120",
    budgetToken: "TON",
    deadline: "2026-06-18",
    status: "published",
    aiScore: 92,
    aiRisk: "low",
    deliverables: [
      "Five-step onboarding UI for language, role, skills, portfolio, and wallet education",
      "Responsive Telegram Mini App layout for 390px and 430px mobile widths",
      "Final copy in English and Russian",
      "Component handoff notes for implementation"
    ],
    acceptanceCriteria: [
      "No bottom navigation is visible during onboarding",
      "Existing Telegram profile data is reused and not requested manually",
      "Wallet requirement is explained without claiming payment confirmation",
      "The flow can be completed in under 90 seconds"
    ],
    aiMissingItems: ["Exact analytics events for onboarding completion"],
    aiSuggestedTerms: "Limit the scope to onboarding screens and copy; implementation wiring is a separate milestone.",
    createdAt: new Date("2026-06-05T09:00:00Z").toISOString(),
    updatedAt: new Date("2026-06-05T09:00:00Z").toISOString()
  },
  {
    id: "ton-escrow-receipt-flow",
    clientId: "demo-client",
    title: "Build TON escrow receipt flow",
    description:
      "Implement a WorkPay receipt screen for completed freelance deals. The receipt should show client, freelancer, deal amount, escrow funding transaction, release transaction, TON proof status, and share text for Telegram.",
    category: "TON Payments",
    budgetAmount: "95",
    budgetToken: "TON",
    deadline: "2026-06-19",
    status: "published",
    aiScore: 89,
    aiRisk: "low",
    deliverables: [
      "Receipt page with deal title, client, freelancer, amount, and status",
      "TON proof section for funding and release transaction hashes",
      "Telegram share text for completed deal",
      "Empty states for missing provider configuration"
    ],
    acceptanceCriteria: [
      "Wallet approval is never shown as payment confirmation",
      "Receipt shows funded/completed only after server-side verification",
      "Missing TONCenter or escrow config displays setup-required state",
      "Share text includes deal id and proof status"
    ],
    aiMissingItems: ["Exact wording for public share text"],
    aiSuggestedTerms: "Define proof fields and setup-required states before connecting final transaction verification.",
    createdAt: new Date("2026-06-04T12:00:00Z").toISOString(),
    updatedAt: new Date("2026-06-04T12:00:00Z").toISOString()
  },
  {
    id: "supabase-energy-ledger",
    clientId: "demo-client",
    title: "Implement Energy ledger in Supabase",
    description:
      "Create safe server routes for Energy balance, spend checks, transaction history, and profile monthly free grant logic.",
    category: "Backend",
    budgetAmount: "320",
    budgetToken: "USDT",
    deadline: "2026-06-22",
    status: "published",
    aiScore: 88,
    aiRisk: "low",
    deliverables: [
      "Server route for monthly free Energy grant",
      "Server route for application Energy spend",
      "Energy transaction ledger with job/application references",
      "Tests for duplicate spend and insufficient balance"
    ],
    acceptanceCriteria: [
      "Energy balance cannot go below zero",
      "Duplicate applications do not spend Energy twice",
      "All balance changes are written server-side",
      "Monthly grant can be claimed only once per month"
    ],
    aiMissingItems: ["Exact RLS ownership model"],
    aiSuggestedTerms: "All balance changes must be server-side and auditable.",
    createdAt: new Date("2026-06-03T12:00:00Z").toISOString(),
    updatedAt: new Date("2026-06-03T12:00:00Z").toISOString()
  }
];

export const demoApplications: JobApplication[] = [
  {
    id: "application-demo-1",
    jobId: "workpay-miniapp-onboarding",
    freelancerId: demoProfile.id,
    proposalText: "I can deliver a Telegram-native landing page with TON wallet CTA, responsive sections, and clean handoff.",
    energyCost: 1,
    status: "submitted",
    aiScore: 81,
    aiRisk: "low",
    createdAt: new Date("2026-06-05T10:15:00Z").toISOString(),
    updatedAt: new Date("2026-06-05T10:15:00Z").toISOString()
  }
];

export const demoEnergyTransactions: EnergyTransaction[] = [
  {
    id: "energy-grant-june",
    profileId: demoProfile.id,
    amount: 20,
    type: "monthly_free_grant",
    reason: "June free Energy grant",
    relatedJobId: null,
    relatedApplicationId: null,
    paymentId: null,
    createdAt: new Date("2026-06-01T00:00:00Z").toISOString()
  },
  {
    id: "energy-spend-application",
    profileId: demoProfile.id,
    amount: -1,
    type: "application_spend",
    reason: "Applied to TON startup landing job",
    relatedJobId: "workpay-miniapp-onboarding",
    relatedApplicationId: "application-demo-1",
    paymentId: null,
    createdAt: new Date("2026-06-05T10:15:00Z").toISOString()
  }
];
