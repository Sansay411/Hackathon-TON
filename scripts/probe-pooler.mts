import { config } from "dotenv";
config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.log("missing env");
  process.exit(1);
}

const candidates = ["2nc-Axp-x2j-XQq", "55985598Artem"];

for (const pwd of candidates) {
  for (const region of ["us-east-1","us-east-2","us-west-1","us-west-2","eu-west-1","eu-west-2","eu-central-1","eu-north-1","ap-southeast-1","ap-southeast-2","ap-northeast-1","ap-northeast-2","ap-south-1","ca-central-1","sa-east-1"]) {
    const poolerHost = `aws-0-${region}.pooler.supabase.com`;
    // Try the auth/signup endpoint to get the project region back
    const probeUrl = `https://${poolerHost}:6543/postgres`;
    try {
      const r = await fetch(probeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-Info": "supabase-js-node/2.49.4",
        },
        body: JSON.stringify({ user: `postgres.rylpfkszvlvfyorctiuf`, database: "postgres" }),
        signal: AbortSignal.timeout(4000),
      });
      console.log(`${region}: HTTP ${r.status}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      const code = (e as { cause?: { code?: string } })?.cause?.code ?? "?";
      console.log(`${region}: ${code} ${msg.slice(0,80)}`);
    }
  }
}
