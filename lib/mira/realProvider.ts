import type { MiraProvider } from "@/lib/mira/types";
import type { AiReview } from "@/lib/domain/types";

export class RealMiraProvider implements MiraProvider {
  constructor(private readonly apiKey: string) {}

  async reviewDeal(): Promise<AiReview> {
    throw new Error("Real Mira integration is not configured yet");
  }
}
