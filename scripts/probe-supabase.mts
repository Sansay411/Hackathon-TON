import { config } from "dotenv";
config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.log("missing env");
  process.exit(1);
}

const r = await fetch(`${url}/rest/v1/`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
console.log("status:", r.status);
const text = await r.text();
console.log("body:", text.slice(0, 800));

const r2 = await fetch(`${url}/auth/v1/settings`, {
  headers: { apikey: key },
});
console.log("settings status:", r2.status);
const settings = await r2.json();
console.log("region/uri hint:", JSON.stringify({
  project_id: settings?.project_id,
  // Some Supabase responses include the region
  region: settings?.region,
}, null, 2));
