import { Client } from "pg";
import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";

config({ path: ".env.local" });
// The password candidates can be provided via the SUPABASE_DB_PASSWORD_OVERRIDE environment variable, separated by commas.
const candidates = (process.env.SUPABASE_DB_PASSWORD_OVERRIDE || "2nc-Axp-x2j-XQq,55985598Artem")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const host = "db.rylpfkszvlvfyorctiuf.supabase.co";
const port = 5432;
const user = "postgres";
const database = "postgres";

const migrationsDir = path.resolve("supabase", "migrations");
const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

async function tryConnect(password: string, hostOverride?: string, portOverride?: number, userOverride?: string) {
  const client = new Client({
    host: hostOverride ?? host,
    port: portOverride ?? port,
    user: userOverride ?? user,
    password,
    database,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });
  await client.connect();
  return client;
}

let client: Client | null = null;
let usedPassword: string | null = null;
const errors: string[] = [];

const targets: { host: string; port: number; label: string }[] = [
  { host: "db.rylpfkszvlvfyorctiuf.supabase.co", port: 5432, label: "direct:5432" },
  { host: "aws-0-us-east-1.pooler.supabase.com", port: 6543, label: "pooler-us-east-1:6543" },
  { host: "aws-0-us-east-2.pooler.supabase.com", port: 6543, label: "pooler-us-east-2:6543" },
  { host: "aws-0-us-west-1.pooler.supabase.com", port: 6543, label: "pooler-us-west-1:6543" },
  { host: "aws-0-us-west-2.pooler.supabase.com", port: 6543, label: "pooler-us-west-2:6543" },
  { host: "aws-0-eu-west-1.pooler.supabase.com", port: 6543, label: "pooler-eu-west-1:6543" },
  { host: "aws-0-eu-west-2.pooler.supabase.com", port: 6543, label: "pooler-eu-west-2:6543" },
  { host: "aws-0-eu-central-1.pooler.supabase.com", port: 6543, label: "pooler-eu-central-1:6543" },
  { host: "aws-0-eu-north-1.pooler.supabase.com", port: 6543, label: "pooler-eu-north-1:6543" },
  { host: "aws-0-ap-southeast-1.pooler.supabase.com", port: 6543, label: "pooler-ap-southeast-1:6543" },
  { host: "aws-0-ap-southeast-2.pooler.supabase.com", port: 6543, label: "pooler-ap-southeast-2:6543" },
  { host: "aws-0-ap-northeast-1.pooler.supabase.com", port: 6543, label: "pooler-ap-northeast-1:6543" },
  { host: "aws-0-ap-northeast-2.pooler.supabase.com", port: 6543, label: "pooler-ap-northeast-2:6543" },
  { host: "aws-0-ap-south-1.pooler.supabase.com", port: 6543, label: "pooler-ap-south-1:6543" },
  { host: "aws-0-ca-central-1.pooler.supabase.com", port: 6543, label: "pooler-ca-central-1:6543" },
  { host: "aws-0-sa-east-1.pooler.supabase.com", port: 6543, label: "pooler-sa-east-1:6543" },
];

for (const target of targets) {
  const userForTarget = target.port === 6543 ? `${user}.rylpfkszvlvfyorctiuf` : user;
  for (const pwd of candidates) {
    try {
      client = await tryConnect(pwd, target.host, target.port, userForTarget);
      usedPassword = `${target.label}#${pwd.slice(0, 2)}***`;
      break;
    } catch (e: unknown) {
      errors.push(`${target.label} user='${userForTarget}' pwd='${pwd.slice(0, 2)}***': ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  if (client) break;
}

if (!client) {
  console.log(JSON.stringify({ ok: false, stage: "connect", errors }));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, stage: "connect", usedPassword: usedPassword?.slice(0, 2) + "***" }));

const results: { file: string; ok: boolean; error?: string }[] = [];
for (const file of files) {
  const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
  try {
    await client.query(sql);
    results.push({ file, ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    results.push({ file, ok: false, error: msg });
  }
}

await client.end();

console.log(JSON.stringify({ ok: true, stage: "migrations", results }, null, 2));
