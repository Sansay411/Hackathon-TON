import crypto from "node:crypto";
import { config } from "dotenv";
config({ path: ".env.local" });

const BASE = "http://localhost:3000";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

function makeInitData(telegramId: number) {
  const user = {
    id: telegramId,
    first_name: "Escrow",
    last_name: "Test",
    username: `escrow_test_${telegramId}`,
    language_code: "en"
  };
  const params = new URLSearchParams();
  params.set("user", JSON.stringify(user));
  params.set("auth_date", String(Math.floor(Date.now() / 1000)));
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");
  const secret = crypto.createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
  const hash = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");
  params.set("hash", hash);
  return { initData: params.toString(), username: user.username };
}

async function postJson(path: string, body: unknown) {
  const r = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return { status: r.status, body: (await r.json()) as unknown };
}

const t1 = makeInitData(999000222);

// 1. Verify profile exists
const verify = await postJson("/api/telegram/verify", { initData: t1.initData });
console.log("STEP 1 verify:", verify.status, JSON.stringify(verify.body).slice(0, 200));

const profile = (verify.body as { data?: { profile?: { id: string; walletAddress: string | null } } }).data?.profile;
if (!profile) {
  console.log("FAIL: no profile");
  process.exit(1);
}
console.log("   profile.id:", profile.id, "walletAddress:", profile.walletAddress);

// 2. Connect a wallet (using the same testnet-style address, but for the user's wallet, not the escrow)
const testUserWallet = "0QATpLw033Sg6pI_GjP2O4I6SNPUQEP58zMkeJ9L2wttvD8j";
const connect = await postJson("/api/wallet/connect", {
  initData: t1.initData,
  walletAddress: testUserWallet,
  network: "testnet"
});
console.log("STEP 2 wallet connect:", connect.status, JSON.stringify(connect.body).slice(0, 200));

// 3. Create payment
const pay = await postJson("/api/payments/create", {
  initData: t1.initData,
  dealId: "test-deal-001",
  asset: "TON",
  amount: "1.5",
  paymentMode: "direct_ton"
});
console.log("STEP 3 payment create:", pay.status, JSON.stringify(pay.body).slice(0, 600));

// 4. Cleanup
const { createClient } = await import("@supabase/supabase-js");
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
const { error } = await supabase.from("profiles").delete().eq("id", profile.id);
console.log("STEP 4 cleanup:", error ? "FAIL " + error.message : "OK");
