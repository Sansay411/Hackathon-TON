import { apiOk } from "@/lib/api/errors";
import { demoApplications } from "@/lib/demo/data";

export async function GET() {
  return apiOk({ applications: demoApplications });
}
