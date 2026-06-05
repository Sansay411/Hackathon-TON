import type { AiReview } from "@/lib/domain/types";
import type { DealReviewInput, MiraProvider } from "@/lib/mira/types";

type DeepSeekChatResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

const reviewSchemaInstruction = `Return only JSON matching this shape:
{
  "clarityScore": number,
  "riskLevel": "low" | "medium" | "high",
  "missingItems": string[],
  "disputeRisks": string[],
  "suggestedTerms": string[]
}`;

export class DeepSeekMiraProvider implements MiraProvider {
  constructor(
    private readonly apiKey: string,
    private readonly baseUrl = "https://api.deepseek.com",
    private readonly model = "deepseek-v4-flash"
  ) {}

  async reviewDeal(input: DealReviewInput): Promise<AiReview> {
    const response = await fetch(`${this.baseUrl.replace(/\/+$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: "system",
            content:
              "You are Mira, the intelligence layer for WorkPay, a TON-native freelance escrow Mini App. Review deal terms for clarity, missing details, and dispute risk."
          },
          {
            role: "user",
            content: [
              reviewSchemaInstruction,
              "",
              `Title: ${input.title}`,
              `Description: ${input.description}`,
              `Price: ${input.priceAmount} ${input.priceToken}`,
              `Deadline: ${input.deadline ?? "Not specified"}`
            ].join("\n")
          }
        ],
        stream: false,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek review failed with status ${response.status}`);
    }

    const payload = (await response.json()) as DeepSeekChatResponse;
    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("DeepSeek review returned an empty response");
    }

    return parseAiReview(content);
  }
}

function parseAiReview(content: string): AiReview {
  const parsed = JSON.parse(content) as Partial<AiReview>;
  const riskLevel = parsed.riskLevel;

  if (
    typeof parsed.clarityScore !== "number" ||
    !isRiskLevel(riskLevel) ||
    !Array.isArray(parsed.missingItems) ||
    !Array.isArray(parsed.disputeRisks) ||
    !Array.isArray(parsed.suggestedTerms)
  ) {
    throw new Error("DeepSeek review response did not match the expected AI review schema");
  }

  return {
    clarityScore: Math.max(0, Math.min(100, Math.round(parsed.clarityScore))),
    riskLevel,
    missingItems: parsed.missingItems.map(String),
    disputeRisks: parsed.disputeRisks.map(String),
    suggestedTerms: parsed.suggestedTerms.map(String)
  };
}

function isRiskLevel(value: unknown): value is AiReview["riskLevel"] {
  return value === "low" || value === "medium" || value === "high";
}
