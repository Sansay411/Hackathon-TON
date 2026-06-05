import { apiError, apiOk } from "@/lib/api/errors";
import { walletConnectSchema } from "@/lib/api/validation";
import { isLikelyTonAddress } from "@/lib/ton/address";

export async function POST(request: Request) {
  const parsed = walletConnectSchema.safeParse(await request.json());
  if (!parsed.success) {
    return apiError("bad_request", "Invalid wallet payload.", 400);
  }
  if (!isLikelyTonAddress(parsed.data.walletAddress)) {
    return apiError("bad_request", "Wallet address format is not a supported TON address.", 400);
  }
  return apiOk({ walletAddress: parsed.data.walletAddress, network: parsed.data.network, auditEvent: "wallet_connected" });
}
