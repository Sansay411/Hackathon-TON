import { config } from "dotenv";
config({ path: ".env.local" });

const key = process.env.TONCENTER_API_KEY!;
// Get latest transactions on the escrow wallet to find a real one to verify
const addr = "0QATpLw033Sg6pI_GjP2O4I6SNPUQEP58zMkeJ9L2wttvD8j";
const r = await fetch(
  `https://testnet.toncenter.com/api/v3/transactions?account=${addr}&limit=3&direction=in`,
  { headers: { "X-API-Key": key } }
);
const j = (await r.json()) as { transactions?: unknown[] };
console.log("v3 status:", r.status, "count:", j.transactions?.length);
console.log("first tx:", JSON.stringify(j.transactions?.[0], null, 2).slice(0, 4000));
