import { apiOk } from "@/lib/api/errors";
import { demoApplications, demoEnergyTransactions, demoJobs, demoProfile } from "@/lib/demo/data";

export async function POST() {
  return apiOk({
    seeded: true,
    mode: "demo_local",
    records: {
      profiles: [demoProfile, { ...demoProfile, id: "demo-client-profile", telegramUsername: "client_demo", role: "client" }],
      jobs: demoJobs,
      applications: demoApplications,
      deals: [{ id: "foundation-preview", title: "Landing Page Design", status: "waiting_payment", paymentStatus: "setup_required" }],
      energyTransactions: demoEnergyTransactions,
      dealEvents: ["job_created", "job_ai_reviewed", "application_created", "energy_spent", "deal_created", "payment_started"]
    }
  });
}
