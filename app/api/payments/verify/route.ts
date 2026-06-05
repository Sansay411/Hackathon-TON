import { apiError } from "@/lib/api/errors";

export async function POST() {
  return apiError("payment_setup_required", "Real TON verification provider is required before confirming payments.", 503);
}
