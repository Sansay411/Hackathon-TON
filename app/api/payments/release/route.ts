import { apiError } from "@/lib/api/errors";
import { walletConnectSchema } from "@/lib/api/validation";
import { isLikelyTonAddress } from "@/lib/ton/address";

export async function POST(request: Request) {
  const parsed = walletConnectSchema.safeParse(await request.json());
  if (!parsed.success || !isLikelyTonAddress(parsed.data.walletAddress)) {
    return apiError("forbidden", "Connect TON wallet to continue.", 403);
  }
  return apiError("payment_setup_required", "Escrow release requires signed TON transaction and backend verification.", 503);
}
