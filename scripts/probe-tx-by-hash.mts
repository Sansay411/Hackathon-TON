import { config } from "dotenv";
config({ path: ".env.local" });

const key = process.env.TONCENTER_API_KEY!;
const txHash = "5Z5i74kLqfwHwFFdKlRylBLUWXpENNxcK7EkA0+n3rM=";
const hexHash = Buffer.from(txHash, "base64").toString("hex");
console.log("hex hash:", hexHash);

const r = await fetch(
  `https://testnet.toncenter.com/api/v3/transactions?hash=${hexHash}&limit=1`,
  { headers: { "X-API-Key": key } }
);
console.log("status:", r.status);
const j = (await r.json()) as { transactions?: unknown[] };
console.log("count:", j.transactions?.length);
console.log("preview:", JSON.stringify(j, null, 2).slice(0, 1200));
