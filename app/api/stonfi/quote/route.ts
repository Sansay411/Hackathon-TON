import { apiError, apiOk } from "@/lib/api/errors";
import { stonfiQuoteSchema } from "@/lib/api/validation";
import { getStonfiQuote } from "@/lib/stonfi/quote";
import { isStonfiQuoteResult } from "@/lib/stonfi/types";

// Omniston quotes run over a WebSocket connection, so this route must use the
// Node.js runtime (not the Edge runtime).
export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = stonfiQuoteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("bad_request", "Invalid STON.fi quote request.", 400);
  }

  const quote = await getStonfiQuote({
    fromAsset: parsed.data.fromAsset,
    toAsset: parsed.data.toAsset,
    settlementAmount: parsed.data.settlementAmount,
    network: parsed.data.network,
    dealId: parsed.data.dealId
  });

  if (isStonfiQuoteResult(quote)) {
    return apiOk({ quote });
  }

  if (quote.state === "setup_required") {
    return apiError("setup_required", quote.message, 503);
  }

  return apiOk({ quote });
}
