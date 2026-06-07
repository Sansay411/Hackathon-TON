import { config } from "dotenv";
config({ path: ".env.local" });

const PAT = "sbp_b589ddc72f63fb8060eff581c399220d1051088d";
const url = `https://api.supabase.com/v1/projects/rylpfkszvlvfyorctiuf/database/query`;

const r = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${PAT}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ query: "delete from public.profiles where telegram_id = '999000111';" })
});
console.log("cleanup status:", r.status, await r.text());
