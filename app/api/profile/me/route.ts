import { apiOk } from "@/lib/api/errors";
import { demoProfile } from "@/lib/demo/data";

export async function GET() {
  return apiOk({ profile: demoProfile, source: "demo_until_telegram_auth_is_bound" });
}
