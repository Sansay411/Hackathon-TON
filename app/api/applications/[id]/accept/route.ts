import { apiError, apiOk } from "@/lib/api/errors";
import { demoApplications } from "@/lib/demo/data";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = demoApplications.find((item) => item.id === id);
  if (!application) {
    return apiError("not_found", "Application not found.", 404);
  }
  return apiOk({ application: { ...application, status: "accepted" }, dealId: "deal-demo-created", auditEvents: ["deal_created"] });
}
