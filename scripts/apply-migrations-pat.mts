import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";

config({ path: ".env.local" });

const PAT = process.env.SUPABASE_PAT_OVERRIDE ?? "sbp_b589ddc72f63fb8060eff581c399220d1051088d";
const projectRef = "rylpfkszvlvfyorctiuf";
const url = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

const migrationsDir = path.resolve("supabase", "migrations");
const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

for (const file of files) {
  const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
  process.stdout.write(`Applying ${file} (${sql.length} bytes)... `);
  const r = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAT}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query: sql })
  });
  const text = await r.text();
  if (r.ok) {
    console.log(`OK [${r.status}]`);
  } else {
    console.log(`FAIL [${r.status}] ${text.slice(0, 500)}`);
  }
}
