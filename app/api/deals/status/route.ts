import { NextResponse } from "next/server";
import { z } from "zod";
import { assertDealTransition, dealStatuses } from "@/lib/domain/deal-status";

const bodySchema = z.object({
  from: z.enum(dealStatuses),
  to: z.enum(dealStatuses)
});

export async function POST(request: Request) {
  const body = bodySchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  }

  try {
    assertDealTransition(body.data.from, body.data.to);
    return NextResponse.json({ allowed: true });
  } catch (error) {
    return NextResponse.json({ allowed: false, error: error instanceof Error ? error.message : "Invalid transition" }, { status: 409 });
  }
}
