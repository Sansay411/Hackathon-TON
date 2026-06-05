import { apiError } from "@/lib/api/errors";

export async function POST() {
  return apiError("payment_setup_required", "Escrow release requires signed TON transaction and backend verification.", 503);
}
