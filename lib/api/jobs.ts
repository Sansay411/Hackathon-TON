import type { JobApplication, MarketplaceJob } from "@/lib/domain/types";

export const jobSelect =
  "id, client_id, title, description, category, budget_amount, budget_token, deadline, status, ai_score, ai_risk, deliverables, acceptance_criteria, ai_missing_items, ai_suggested_terms, created_at, updated_at";

export const legacyJobSelect =
  "id, client_id, title, description, category, budget_amount, budget_token, deadline, status, ai_score, ai_risk, ai_missing_items, ai_suggested_terms, created_at, updated_at";

export const applicationSelect =
  "id, job_id, freelancer_id, proposal_text, energy_cost, status, ai_score, ai_risk, created_at, updated_at";

export function mapJobRow(row: Record<string, unknown>): MarketplaceJob {
  return {
    id: String(row.id),
    clientId: String(row.client_id),
    title: String(row.title),
    description: String(row.description),
    category: String(row.category ?? "WorkPay"),
    budgetAmount: trimDecimal(row.budget_amount),
    budgetToken: String(row.budget_token ?? "TON"),
    deadline: typeof row.deadline === "string" ? row.deadline.slice(0, 10) : null,
    status: mapJobStatus(row.status),
    aiScore: row.ai_score == null ? null : Number(row.ai_score),
    aiRisk: mapRisk(row.ai_risk),
    deliverables: stringArray(row.deliverables),
    acceptanceCriteria: stringArray(row.acceptance_criteria),
    aiMissingItems: stringArray(row.ai_missing_items),
    aiSuggestedTerms: typeof row.ai_suggested_terms === "string" ? row.ai_suggested_terms : null,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString())
  };
}

export function mapApplicationRow(row: Record<string, unknown>): JobApplication {
  return {
    id: String(row.id),
    jobId: String(row.job_id),
    freelancerId: String(row.freelancer_id),
    proposalText: String(row.proposal_text ?? ""),
    energyCost: Number(row.energy_cost ?? 1),
    status: mapApplicationStatus(row.status),
    aiScore: row.ai_score == null ? null : Number(row.ai_score),
    aiRisk: mapRisk(row.ai_risk),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString())
  };
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function trimDecimal(value: unknown): string {
  const raw = String(value ?? "0");
  return raw.includes(".") ? raw.replace(/\.?0+$/, "") : raw;
}

function mapRisk(value: unknown): "low" | "medium" | "high" | null {
  return value === "low" || value === "medium" || value === "high" ? value : null;
}

function mapJobStatus(value: unknown): MarketplaceJob["status"] {
  const statuses: MarketplaceJob["status"][] = ["draft", "ai_reviewed", "published", "in_review", "matched", "closed", "cancelled"];
  return statuses.includes(value as MarketplaceJob["status"]) ? (value as MarketplaceJob["status"]) : "published";
}

function mapApplicationStatus(value: unknown): JobApplication["status"] {
  const statuses: JobApplication["status"][] = ["submitted", "shortlisted", "accepted", "rejected", "withdrawn"];
  return statuses.includes(value as JobApplication["status"]) ? (value as JobApplication["status"]) : "submitted";
}
