import crypto from "node:crypto";
import { config } from "dotenv";

config({ path: ".env.local" });

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
if (!BOT_TOKEN) {
  console.log("missing TELEGRAM_BOT_TOKEN");
  process.exit(1);
}

const user = {
  id: 999000111,
  first_name: "Test",
  last_name: "User",
  username: "workpay_test",
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

const initData = params.toString();
console.log(initData);
