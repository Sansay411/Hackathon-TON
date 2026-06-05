export async function trackStonfiTrade(trackingId: string) {
  if (!process.env.STONFI_API_URL) {
    return { status: "setup_required" as const, trackingId };
  }
  return { status: "pending" as const, trackingId };
}
