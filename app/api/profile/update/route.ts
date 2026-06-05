import { profileUpdateSchema } from "@/lib/api/validation";
import { apiError, apiOk } from "@/lib/api/errors";
import { demoProfile } from "@/lib/demo/data";

export async function POST(request: Request) {
  const parsed = profileUpdateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return apiError("bad_request", "Invalid profile update payload.", 400);
  }
  return apiOk({ profile: { ...demoProfile, ...parsed.data }, auditEvent: "profile_updated" });
}
