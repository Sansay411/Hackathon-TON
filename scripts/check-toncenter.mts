import { config } from "dotenv";
config({ path: ".env.local" });

const key = process.env.TONCENTER_API_KEY!;
const url = `https://testnet.toncenter.com/api/v2/getAddressInformation?address=0QATpLw033Sg6pI_GjP2O4I6SNPUQEP58zMkeJ9L2wttvD8j`;
const r = await fetch(url, { headers: { "X-API-Key": key } });
console.log("status:", r.status);
const j = (await r.json()) as { ok?: boolean; result?: { balance?: string; state?: string } };
console.log("body:", JSON.stringify(j).slice(0, 400));
