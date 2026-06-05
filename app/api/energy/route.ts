import { apiOk } from "@/lib/api/errors";
import { demoEnergyTransactions, demoProfile } from "@/lib/demo/data";
import { energyPackages, monthlyFreeEnergy } from "@/lib/energy/service";

export async function GET() {
  return apiOk({
    balance: demoProfile.energyBalance ?? 0,
    monthlyFreeEnergy,
    resetInfo: "Free Energy resets monthly.",
    packages: energyPackages,
    transactions: demoEnergyTransactions
  });
}
