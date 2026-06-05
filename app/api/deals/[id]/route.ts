import { apiOk } from "@/lib/api/errors";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return apiOk({ deal: { id, status: "waiting_payment", paymentState: "created" } });
}
