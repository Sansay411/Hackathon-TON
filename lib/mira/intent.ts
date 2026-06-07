// Mira Intent Sourcing helpers.
//
// Mira currently has no public REST API, no webhook system, and no SDK for
// Mini App -> Mira communication. WorkPay therefore does NOT call Mira
// directly. Instead it generates a structured "intent" (a compact deep-link
// payload and a full copyable prompt), lets the user send it to Mira through
// Telegram (deep link or @mira inline mode), and imports Mira's response back
// manually. Nothing here talks to a Mira backend.

export type MiraIntentType = "job_review" | "deal_review" | "proposal_review" | "dispute_summary";

export type MiraIntentInput = {
  type: MiraIntentType;
  id: string;
  title: string;
  description?: string;
  budgetAmount?: string | number;
  budgetToken?: string;
  deadline?: string;
  deliverables?: string[];
  acceptanceCriteria?: string[];
  participants?: string[];
  /** Short, safe risk context (no secrets, no wallet data). */
  riskContextShort?: string;
};

export type MiraRiskLevel = "Low" | "Medium" | "High";

export type MiraReview = {
  clarityScore: number | null;
  riskLevel: MiraRiskLevel | null;
  missingItems: string[];
  suggestedTerms: string[];
  disputeChecklist: string[];
  finalRecommendation: string | null;
};

export type ParsedMiraReview = {
  /** true when at least one structured field was recognized. */
  ok: boolean;
  review: MiraReview;
  raw: string;
};

const MIRA_BOT = "mira";
const TYPE_CODES: Record<MiraIntentType, string> = {
  job_review: "jr",
  deal_review: "dr",
  proposal_review: "pr",
  dispute_summary: "ds"
};

// Telegram start parameters are short and limited to [A-Za-z0-9_-]. Keep the
// compact payload tiny: short codes, trimmed title/risk, no description.
const MAX_TITLE = 28;
const MAX_RISK = 32;

function clip(value: string | undefined, max: number): string {
  if (!value) {
    return "";
  }
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}\u2026` : trimmed;
}

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  const base64 =
    typeof btoa !== "undefined"
      ? btoa(binary)
      : Buffer.from(binary, "binary").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Build the compact, URL-safe deep-link payload. Contains only safe context:
 * source, type, id, short title, budget, token, deadline, short risk context.
 * Never includes descriptions, secrets or wallet data.
 */
export function createCompactMiraPayload(input: MiraIntentInput): string {
  const compact = {
    s: "workpay",
    t: TYPE_CODES[input.type],
    id: input.id,
    ti: clip(input.title, MAX_TITLE),
    b: input.budgetAmount !== undefined ? String(input.budgetAmount) : "",
    tok: input.budgetToken ?? "",
    d: input.deadline ?? "",
    r: clip(input.riskContextShort, MAX_RISK)
  };
  return toBase64Url(JSON.stringify(compact));
}

/** Build the Telegram deep link that opens Mira with the compact payload. */
export function createMiraDeepLink(input: MiraIntentInput): string {
  return `https://t.me/${MIRA_BOT}?start=${createCompactMiraPayload(input)}`;
}

function formatList(items: string[] | undefined): string {
  if (!items || items.length === 0) {
    return "-";
  }
  return items.map((item) => `- ${item}`).join("\n");
}

/**
 * Build the full structured prompt the user copies into Mira. Includes the
 * complete deal/job context and the exact output format Mira should return.
 */
export function createFullMiraPrompt(input: MiraIntentInput): string {
  const subjectNoun = input.type === "deal_review" ? "deal" : input.type === "proposal_review" ? "proposal" : "job";
  const subjectHeader = input.type === "deal_review" ? "Deal" : input.type === "proposal_review" ? "Proposal" : "Job";
  const budget = [input.budgetAmount !== undefined ? String(input.budgetAmount) : "", input.budgetToken ?? ""]
    .filter(Boolean)
    .join(" ");

  return [
    "/workpay_review",
    "",
    "You are Mira reviewing a WorkPay freelance marketplace item.",
    "",
    "WorkPay context:",
    "- WorkPay is a Telegram Mini App freelance marketplace.",
    "- Freelancers spend Energy to apply for jobs.",
    "- A TON wallet is used for identity, deal actions, escrow funding, settlement proof, and reputation.",
    "- Direct TON payments are prepared through TonConnect and verified later on the server through TONCenter/TonAPI.",
    "- Wallet approval is not payment confirmation.",
    "- A deal is funded only when server-side verification matches escrow destination, sender wallet, amount, network, and WorkPay reference.",
    "- STON.fi/Omniston may be used for swap-based settlement, but swap UI status alone does not mark the deal funded.",
    "- Do not treat TON or crypto payment as a risk by itself. Flag payment risk only when terms fail to define verification, escrow, settlement asset, refund, exchange-rate, or release rules.",
    "",
    `Analyze this freelance ${subjectNoun} before funding or publication.`,
    "Focus on scope clarity, missing deliverables, acceptance criteria, handoff, revision limits, dispute prevention, and WorkPay payment terms.",
    "",
    "Return this exact structure:",
    "",
    "Clarity Score:",
    "Risk Level:",
    "Missing Items:",
    "Suggested Terms:",
    "Dispute Prevention Checklist:",
    "Final Recommendation:",
    "",
    `${subjectHeader}:`,
    `Title: ${input.title || "-"}`,
    `Description: ${input.description?.trim() || "-"}`,
    `Budget: ${budget || "-"}`,
    `Deadline: ${input.deadline || "-"}`,
    `Deliverables:\n${formatList(input.deliverables)}`,
    `Acceptance Criteria:\n${formatList(input.acceptanceCriteria)}`
  ].join("\n");
}

const SECTION_PATTERNS: { key: keyof MiraReview; label: RegExp }[] = [
  { key: "clarityScore", label: /^clarity\s*score/i },
  { key: "riskLevel", label: /^risk\s*level/i },
  { key: "missingItems", label: /^missing\s*items/i },
  { key: "suggestedTerms", label: /^suggested\s*terms/i },
  { key: "disputeChecklist", label: /^dispute(\s*prevention)?\s*checklist/i },
  { key: "finalRecommendation", label: /^final\s*recommendation/i }
];

function matchSection(line: string): { key: keyof MiraReview; rest: string } | null {
  for (const { key, label } of SECTION_PATTERNS) {
    const headerWithColon = new RegExp(label.source + "\\s*:?(.*)", "i");
    const match = line.match(headerWithColon);
    if (match && label.test(line)) {
      return { key, rest: (match[match.length - 1] ?? "").trim() };
    }
  }
  return null;
}

function stripBullet(line: string): string {
  return line.replace(/^\s*(?:[-*\u2022]|\d+[.)])\s*/, "").trim();
}

function normalizeRisk(value: string): MiraRiskLevel | null {
  const lower = value.toLowerCase();
  if (lower.includes("low")) {
    return "Low";
  }
  if (lower.includes("medium") || lower.includes("med")) {
    return "Medium";
  }
  if (lower.includes("high")) {
    return "High";
  }
  return null;
}

/**
 * Parse a raw Mira response into structured fields. Returns ok=false when the
 * text does not contain any recognizable structured section, so the UI can
 * fall back to showing the unstructured response.
 */
export function parseMiraReview(rawText: string): ParsedMiraReview {
  const review: MiraReview = {
    clarityScore: null,
    riskLevel: null,
    missingItems: [],
    suggestedTerms: [],
    disputeChecklist: [],
    finalRecommendation: null
  };

  const raw = rawText ?? "";
  const lines = raw.split(/\r?\n/);
  let recognized = false;
  let current: keyof MiraReview | null = null;
  const scalarBuffer: Partial<Record<keyof MiraReview, string[]>> = {};

  const listKeys: (keyof MiraReview)[] = ["missingItems", "suggestedTerms", "disputeChecklist"];

  for (const line of lines) {
    const section = matchSection(line);
    if (section) {
      recognized = true;
      current = section.key;
      if (section.rest) {
        if (listKeys.includes(section.key)) {
          // Inline comma-separated list on the header line.
          const items = section.rest
            .split(/[,;]/)
            .map((item) => stripBullet(item))
            .filter(Boolean);
          (review[section.key] as string[]).push(...items);
        } else if (section.key === "clarityScore") {
          const num = section.rest.match(/\d+/);
          review.clarityScore = num ? Number(num[0]) : null;
        } else if (section.key === "riskLevel") {
          review.riskLevel = normalizeRisk(section.rest);
        } else {
          scalarBuffer[section.key] = [section.rest];
        }
      }
      continue;
    }

    const content = line.trim();
    if (!content || !current) {
      continue;
    }

    if (listKeys.includes(current)) {
      const item = stripBullet(content);
      if (item) {
        (review[current] as string[]).push(item);
      }
    } else if (current === "clarityScore") {
      if (review.clarityScore === null) {
        const num = content.match(/\d+/);
        review.clarityScore = num ? Number(num[0]) : null;
      }
    } else if (current === "riskLevel") {
      if (review.riskLevel === null) {
        review.riskLevel = normalizeRisk(content);
      }
    } else if (current === "finalRecommendation") {
      (scalarBuffer.finalRecommendation ??= []).push(stripBullet(content));
    }
  }

  if (scalarBuffer.finalRecommendation?.length) {
    review.finalRecommendation = scalarBuffer.finalRecommendation.join(" ").trim() || null;
  }

  return { ok: recognized, review, raw };
}
