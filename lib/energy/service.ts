import type { Profile } from "@/lib/domain/types";

export const monthlyFreeEnergy = 20;

export const energyPackages = [
  { energy: 20, label: "20 Energy", payment: "TON architecture" },
  { energy: 50, label: "50 Energy", payment: "TON architecture" },
  { energy: 120, label: "120 Energy", payment: "TON architecture" },
  { energy: 300, label: "300 Energy", payment: "TON architecture" }
] as const;

export function calculateApplicationEnergyCost(input: {
  rating: number;
  spamRisk?: "low" | "medium" | "high";
  premiumJob?: boolean;
}) {
  if (input.premiumJob) {
    return 3;
  }
  if (input.spamRisk === "high" || input.rating < 3) {
    return 2;
  }
  return 1;
}

export function assertCanSpendEnergy(profile: Pick<Profile, "energyBalance">, cost: number) {
  const balance = profile.energyBalance ?? 0;
  if (cost <= 0) {
    throw new Error("Energy cost must be positive");
  }
  if (balance < cost) {
    throw new Error("Not enough Energy to apply");
  }
}
