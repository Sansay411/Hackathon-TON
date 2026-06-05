import { apiError } from "@/lib/api/errors";

export async function POST() {
  return apiError("payment_setup_required", "Energy purchase architecture is ready, but TON or Stars payment setup is required.", 503);
}
