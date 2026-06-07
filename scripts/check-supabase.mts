import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.log(JSON.stringify({ ok: false, stage: "env", url: Boolean(url), key: Boolean(key) }));
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

const { data, error } = await supabase.from("profiles").select("id").limit(1);

if (error) {
  console.log(JSON.stringify({ ok: false, stage: "query", code: error.code, message: error.message, hint: error.hint }));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, stage: "query", rows: data?.length ?? 0 }));
