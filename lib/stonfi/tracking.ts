export async function trackStonfiTrade(trackingId: string) {
  if (!process.env.STONFI_API_URL || process.env.STONFI_ENABLED !== "true") {
    return { status: "setup_required" as const, trackingId };
  }
  throw new Error(`STON.fi trade tracking is configured but no Omniston tracking client is wired for ${trackingId}.`);
}
