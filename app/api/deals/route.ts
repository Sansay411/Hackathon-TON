import { apiOk } from "@/lib/api/errors";

export async function GET() {
  return apiOk({ deals: [{ id: "foundation-preview", status: "waiting_payment", title: "Landing Page Design" }] });
}

export async function POST() {
  return apiOk({ deal: { id: "deal-demo-created", status: "waiting_payment" }, auditEvent: "deal_created" }, 201);
}
