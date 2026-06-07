import { config } from "dotenv";
config({ path: ".env.local" });

import { userFriendlyToRawAddress, isLikelyTonAddress } from "../lib/ton/address";

const cases: Array<[string, string]> = [
  ["0QATpLw033Sg6pI_GjP2O4I6SNPUQEP58zMkeJ9L2wttvD8j", "0:13A4BC34DF74A0EA923F1A33F63B823A48D3D44043F9F33324789F4BDB0B6DBC"],
];

let ok = true;
for (const [input, expected] of cases) {
  const got = userFriendlyToRawAddress(input);
  const pass = got === expected;
  console.log(pass ? "PASS" : "FAIL", input, "->", got, "expected:", expected);
  if (!pass) ok = false;
}
const bad = userFriendlyToRawAddress("not-an-address");
console.log(bad === null ? "PASS" : "FAIL", "bad input ->", bad);
if (bad !== null) ok = false;
const pass = isLikelyTonAddress("0:13A4BC34DF74A0EA923F1A33F63B823A48D3D44043F9F33324789F4BDB0B6DBC");
console.log(pass ? "PASS" : "FAIL", "raw recognized as likely");
if (!pass) ok = false;
process.exit(ok ? 0 : 1);
