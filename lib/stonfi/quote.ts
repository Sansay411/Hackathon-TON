import { Omniston, type Quote, type QuoteRequest } from "@ston-fi/omniston-sdk";
import { OMNISTON_API_URL, STONFI_QUOTE_NETWORK, STONFI_QUOTE_TIMEOUT_MS, isStonfiEnabled } from "@/lib/stonfi/config";
import { fromBaseUnits, getStonfiToken, toBaseUnits, toOmnistonAssetId } from "@/lib/stonfi/tokens";
import type { StonfiQuoteRequest, StonfiQuoteResponse, StonfiQuoteResult } from "@/lib/stonfi/types";

// Requests a real STON.fi Omniston quote. WorkPay fixes the freelancer's
// settlement amount (output, e.g. 50 USDT) and asks Omniston how much of the pay
// asset (input, e.g. TON) the client must send. No values are fabricated: a
// failure returns an honest typed state instead of a placeholder quote.
export async function getStonfiQuote(request: StonfiQuoteRequest): Promise<StonfiQuoteResponse> {
  if (!isStonfiEnabled()) {
    return { state: "setup_required", message: "STON.fi Omniston is disabled. Set STONFI_ENABLED=true to request live quotes." };
  }

  const fromToken = getStonfiToken(request.fromAsset);
  const toToken = getStonfiToken(request.toAsset);
  if (!fromToken || !toToken) {
    return { state: "error", message: "Unsupported asset pair. WorkPay smart settlement supports TON and USDT." };
  }
  if (fromToken.symbol === toToken.symbol) {
    return { state: "error", message: "Pay asset and settlement asset must differ." };
  }

  const settlement = request.settlementAmount ?? request.targetOutputAmount;
  if (!settlement) {
    return { state: "error", message: "Settlement amount is required to request a quote." };
  }
  const outputUnits = toBaseUnits(settlement, toToken.decimals);
  if (!outputUnits || outputUnits === "0") {
    return { state: "error", message: "Settlement amount is invalid." };
  }

  const quoteRequest: QuoteRequest = {
    inputAsset: toOmnistonAssetId(fromToken),
    outputAsset: toOmnistonAssetId(toToken),
    amount: { $case: "outputUnits", value: outputUnits },
    settlementParams: [{ params: { $case: "swap", value: { maxPriceSlippagePips: 5000 } } }]
  };

  const omniston = new Omniston({ apiUrl: OMNISTON_API_URL });

  try {
    const quote = await firstQuote(omniston, quoteRequest);
    if (!quote) {
      return { state: "no_quote", message: "No STON.fi resolver returned a quote for this pair right now. Try again later." };
    }

    const result: StonfiQuoteResult = {
      provider: "STON.fi Omniston",
      fromAsset: fromToken.symbol,
      toAsset: toToken.symbol,
      inputAmount: fromBaseUnits(quote.inputUnits, fromToken.decimals),
      outputAmount: fromBaseUnits(quote.outputUnits, toToken.decimals),
      route: [fromToken.symbol, toToken.symbol],
      quoteId: quote.quoteId,
      resolver: quote.resolverName,
      timestamp: new Date(quote.quoteTimestamp * 1000).toISOString(),
      network: STONFI_QUOTE_NETWORK
    };

    if (quote.settlementData.$case === "swap") {
      const swap = quote.settlementData.value;
      if (swap.minOutputAmount) {
        result.minReceived = fromBaseUnits(swap.minOutputAmount, toToken.decimals);
      }
    }

    return result;
  } catch (error) {
    return { state: "error", message: error instanceof Error ? error.message : "Unable to get STON.fi quote. Try again later." };
  } finally {
    closeOmniston(omniston);
  }
}

// Subscribes to the Omniston quote stream and resolves with the first concrete
// quote (or null when the resolver explicitly reports no quote / times out).
function firstQuote(omniston: Omniston, request: QuoteRequest): Promise<Quote | null> {
  return new Promise<Quote | null>((resolve, reject) => {
    let settled = false;
    const observable = omniston.requestForQuote(request);

    const finish = (fn: () => void) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      try {
        subscription.unsubscribe();
      } catch {
        // ignore unsubscribe errors
      }
      fn();
    };

    const timer = setTimeout(() => finish(() => resolve(null)), STONFI_QUOTE_TIMEOUT_MS);

    const subscription = observable.subscribe({
      next: (event) => {
        if (event.$case === "quoteUpdated") {
          finish(() => resolve(event.value));
        } else if (event.$case === "noQuote") {
          finish(() => resolve(null));
        }
      },
      error: (err: unknown) => finish(() => reject(err instanceof Error ? err : new Error(String(err))))
    });
  });
}

function closeOmniston(omniston: Omniston): void {
  const closable = omniston as unknown as { close?: () => void };
  if (typeof closable.close === "function") {
    try {
      closable.close();
    } catch {
      // ignore close errors
    }
  }
}
