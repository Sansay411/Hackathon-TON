import { apiOk } from "@/lib/api/errors";

export async function POST() {
  return apiOk({ updated: true });
}
