import { apiError, apiOk } from "@/lib/api/errors";
import { demoApplications, demoEnergyTransactions, demoJobs, demoProfile } from "@/lib/demo/data";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createSupabaseServiceRoleClient();
  if (!supabase) {
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

  await supabase.from("deal_events").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("payments").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("deliveries").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("deals").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("energy_transactions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("job_applications").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("jobs").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const { data: client, error: clientError } = await supabase
    .from("profiles")
    .upsert(
      {
        telegram_id: "workpay-demo-client",
        telegram_username: "workpay_client",
        first_name: "WorkPay",
        last_name: "Client",
        language: "en",
        role: "client",
        energy_balance: 20,
        rating: 4.8,
        completed_deals_count: 6,
        success_rate: 96
      },
      { onConflict: "telegram_id" }
    )
    .select("id")
    .single();
  if (clientError || !client) {
    return apiError("server_error", clientError?.message ?? "Demo client profile could not be seeded.", 500);
  }

  const { data: freelancer, error: freelancerError } = await supabase
    .from("profiles")
    .upsert(
      {
        telegram_id: "workpay-demo-freelancer",
        telegram_username: "workpay_builder",
        first_name: "TON",
        last_name: "Builder",
        language: "en",
        role: "freelancer",
        energy_balance: 19,
        rating: 4.9,
        completed_deals_count: 12,
        success_rate: 98
      },
      { onConflict: "telegram_id" }
    )
    .select("id")
    .single();
  if (freelancerError || !freelancer) {
    return apiError("server_error", freelancerError?.message ?? "Demo freelancer profile could not be seeded.", 500);
  }

  let { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .insert(
      demoJobs.map((job) => ({
        client_id: client.id,
        title: job.title,
        description: job.description,
        category: job.category,
        budget_amount: job.budgetAmount,
        budget_token: job.budgetToken,
        deadline: job.deadline,
        status: job.status,
        ai_score: job.aiScore,
        ai_risk: job.aiRisk,
        deliverables: job.deliverables,
        acceptance_criteria: job.acceptanceCriteria,
        ai_missing_items: job.aiMissingItems,
        ai_suggested_terms: job.aiSuggestedTerms
      }))
    )
    .select("id, title");
  if (jobsError?.message.includes("deliverables") || jobsError?.message.includes("acceptance_criteria")) {
    const fallback = await supabase
      .from("jobs")
      .insert(
        demoJobs.map((job) => ({
          client_id: client.id,
          title: job.title,
          description: `${job.description}\n\nDeliverables:\n- ${job.deliverables.join("\n- ")}\n\nAcceptance criteria:\n- ${job.acceptanceCriteria.join("\n- ")}`,
          category: job.category,
          budget_amount: job.budgetAmount,
          budget_token: job.budgetToken,
          deadline: job.deadline,
          status: job.status,
          ai_score: job.aiScore,
          ai_risk: job.aiRisk,
          ai_missing_items: job.aiMissingItems,
          ai_suggested_terms: job.aiSuggestedTerms
        }))
      )
      .select("id, title");
    jobs = fallback.data;
    jobsError = fallback.error;
  }
  if (jobsError || !jobs?.length) {
    return apiError("server_error", jobsError?.message ?? "Demo jobs could not be seeded.", 500);
  }

  const goodJob = jobs.find((job) => job.title === demoJobs[0].title) ?? jobs[0];
  const { data: application, error: applicationError } = await supabase
    .from("job_applications")
    .insert({
      job_id: goodJob.id,
      freelancer_id: freelancer.id,
      proposal_text:
        "I will implement the WorkPay receipt flow with server-verified TON proof states, mobile Telegram layout, and no fake payment confirmation.",
      energy_cost: 1,
      status: "submitted",
      ai_score: 87,
      ai_risk: "low"
    })
    .select("id")
    .single();
  if (applicationError || !application) {
    return apiError("server_error", applicationError?.message ?? "Demo application could not be seeded.", 500);
  }

  await supabase.from("energy_transactions").insert({
    profile_id: freelancer.id,
    amount: -1,
    type: "application_spend",
    reason: "Applied to WorkPay demo job",
    related_job_id: goodJob.id,
    related_application_id: application.id
  });

  return apiOk({
    seeded: true,
    mode: "supabase_reset",
    records: {
      profiles: [client.id, freelancer.id],
      jobs,
      applications: [application.id],
      deleted: ["deal_events", "payments", "deliveries", "deals", "energy_transactions", "job_applications", "jobs"]
    }
  });
}
