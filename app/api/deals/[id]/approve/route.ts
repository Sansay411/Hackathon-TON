import { apiOk } from "@/lib/api/errors";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return apiOk({ dealId: id, status: "release_pending", auditEvents: ["deal_approved", "release_started"] });
}
