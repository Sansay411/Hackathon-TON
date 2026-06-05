import type { EnergyTransaction, JobApplication, MarketplaceJob, Profile } from "@/lib/domain/types";

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
    id: "ton-startup-landing",
    clientId: "demo-client",
    title: "Build a landing page for my TON startup",
    description:
      "Create a polished responsive landing page for a TON payment product with clear hero, wallet CTA, pricing block, and Telegram Mini App launch section.",
    category: "Design",
    budgetAmount: "450",
    budgetToken: "USDT",
    deadline: "2026-06-20",
    status: "published",
    aiScore: 84,
    aiRisk: "low",
    aiMissingItems: ["Final brand assets", "Analytics requirement"],
    aiSuggestedTerms: "Add acceptance criteria, source file handoff, and two revision rounds.",
    createdAt: new Date("2026-06-05T09:00:00Z").toISOString(),
    updatedAt: new Date("2026-06-05T09:00:00Z").toISOString()
  },
  {
    id: "telegram-bot-polish",
    clientId: "demo-client",
    title: "Polish Telegram bot onboarding",
    description:
      "Improve bot start flow, command menu, Mini App deep links, and first-launch copy for a crypto productivity product.",
    category: "Telegram",
    budgetAmount: "180",
    budgetToken: "TON",
    deadline: "2026-06-14",
    status: "published",
    aiScore: 76,
    aiRisk: "medium",
    aiMissingItems: ["Notification copy", "BotFather assets"],
    aiSuggestedTerms: "Define supported commands and Mini App launch paths before implementation.",
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
    aiMissingItems: ["Exact RLS ownership model"],
    aiSuggestedTerms: "All balance changes must be server-side and auditable.",
    createdAt: new Date("2026-06-03T12:00:00Z").toISOString(),
    updatedAt: new Date("2026-06-03T12:00:00Z").toISOString()
  }
];

export const demoApplications: JobApplication[] = [
  {
    id: "application-demo-1",
    jobId: "ton-startup-landing",
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
    relatedJobId: "ton-startup-landing",
    relatedApplicationId: "application-demo-1",
    paymentId: null,
    createdAt: new Date("2026-06-05T10:15:00Z").toISOString()
  }
];
