import { NextResponse } from "next/server";

function normalizeAppUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export function GET(request: Request) {
  const requestOrigin = new URL(request.url).origin;
  const appUrl = normalizeAppUrl(process.env.NEXT_PUBLIC_APP_URL ?? requestOrigin);

  return NextResponse.json({
    url: appUrl,
    name: "WorkPay",
    iconUrl: `${appUrl}/icon.png`
  });
}
