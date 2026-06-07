import { apiOk } from "@/lib/api/errors";
import { getVerifiedProfile } from "@/lib/api/profile";
import { demoEnergyTransactions, demoProfile } from "@/lib/demo/data";
import { energyPackages, monthlyFreeEnergy } from "@/lib/energy/service";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const initData = new URL(request.url).searchParams.get("initData");
  const profileResult = await getVerifiedProfile(initData);
  const supabase = createSupabaseServiceRoleClient();
  if (profileResult.status === "ready" && supabase) {
    const { data } = await supabase
      .from("energy_transactions")
      .select("id, profile_id, amount, type, reason, related_job_id, related_application_id, payment_id, created_at")
      .eq("profile_id", profileResult.profile.id)
      .order("created_at", { ascending: false })
      .limit(30);
    return apiOk({
      balance: profileResult.profile.energyBalance,
      monthlyFreeEnergy,
      resetInfo: "Free Energy resets monthly.",
      packages: energyPackages,
      transactions: data ?? []
    });
  }

  return apiOk({
    balance: demoProfile.energyBalance ?? 0,
    monthlyFreeEnergy,
    resetInfo: "Free Energy resets monthly.",
    packages: energyPackages,
    transactions: demoEnergyTransactions
  });
}
