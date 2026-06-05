import { apiError, apiOk } from "@/lib/api/errors";
import { demoApplications } from "@/lib/demo/data";
import { walletConnectSchema } from "@/lib/api/validation";
import { isLikelyTonAddress } from "@/lib/ton/address";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = walletConnectSchema.safeParse(await request.json());
  if (!parsed.success) {
    return apiError("forbidden", "Connect TON wallet to continue.", 403);
  }
  if (!isLikelyTonAddress(parsed.data.walletAddress)) {
    return apiError("forbidden", "Connect TON wallet to continue.", 403);
  }
  const application = demoApplications.find((item) => item.id === id);
  if (!application) {
    return apiError("not_found", "Application not found.", 404);
  }
  return apiOk({ application: { ...application, status: "accepted" }, dealId: "deal-demo-created", auditEvents: ["deal_created"] });
}
