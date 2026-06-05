import type { MiraProvider } from "@/lib/mira/types";

export class MockMiraProvider implements MiraProvider {
  async reviewDeal() {
    return {
      clarityScore: 72,
      riskLevel: "medium" as const,
      missingItems: ["Acceptance criteria", "Revision limit", "Delivery format"],
      disputeRisks: ["Scope may expand without written change approval"],
      suggestedTerms: [
        "Define measurable acceptance criteria before funding",
        "Limit included revisions to two rounds",
        "Require delivery files and handoff notes before approval"
      ]
    };
  }
}
