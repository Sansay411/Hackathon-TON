import { z } from "zod";

export const languageSchema = z.enum(["en", "ru", "kk"]);
export const roleSchema = z.enum(["client", "freelancer", "both"]);

export const profileUpdateSchema = z.object({
  language: languageSchema.optional(),
  role: roleSchema.optional(),
  bio: z.string().max(1000).optional(),
  skills: z.array(z.string().min(1).max(60)).max(20).optional(),
  hourlyRate: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  portfolioChannel: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional()
});

export const walletConnectSchema = z.object({
  walletAddress: z.string().min(20),
  network: z.enum(["testnet", "mainnet"]).default("testnet")
});

export const jobCreateSchema = z.object({
  title: z.string().min(5).max(160),
  description: z.string().min(20).max(5000),
  category: z.string().min(2).max(80),
  budgetAmount: z.string().regex(/^\d+(\.\d{1,9})?$/),
  budgetToken: z.string().min(2).max(20),
  deadline: z.string().nullable().optional()
});

export const applyJobSchema = z.object({
  proposalText: z.string().min(20).max(5000)
});

export const paymentCreateSchema = z.object({
  dealId: z.string().min(1),
  asset: z.string().min(2).max(20),
  amount: z.string().regex(/^\d+(\.\d{1,9})?$/),
  paymentMode: z.enum(["direct_ton", "stonfi_swap"]).default("direct_ton")
});
