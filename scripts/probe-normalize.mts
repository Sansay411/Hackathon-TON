import { config } from "dotenv";
config({ path: ".env.local" });

const key = process.env.TONCENTER_API_KEY!;
const friendly = "0QATpLw033Sg6pI_GjP2O4I6SNPUQEP58zMkeJ9L2wttvD8j";
const r = await fetch(
  `https://testnet.toncenter.com/api/v2/normalizeAddress?address=${encodeURIComponent(friendly)}`,
  { headers: { "X-API-Key": key } }
);
console.log("status:", r.status);
console.log("body:", JSON.stringify(await r.json(), null, 2));
