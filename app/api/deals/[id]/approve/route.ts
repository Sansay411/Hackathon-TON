import { apiError, apiOk } from "@/lib/api/errors";
import { walletConnectSchema } from "@/lib/api/validation";
import { isLikelyTonAddress } from "@/lib/ton/address";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = walletConnectSchema.safeParse(await request.json());
  if (!parsed.success || !isLikelyTonAddress(parsed.data.walletAddress)) {
    return apiError("forbidden", "Connect TON wallet to continue.", 403);
  }
  return apiOk({ dealId: id, status: "release_pending", auditEvents: ["deal_approved", "release_started"] });
}
