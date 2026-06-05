import type { AiReview } from "@/lib/domain/types";

export type DealReviewInput = {
  title: string;
  description: string;
  priceAmount: string;
  priceToken: string;
  deadline: string | null;
};

export interface MiraProvider {
  reviewDeal(input: DealReviewInput): Promise<AiReview>;
}
