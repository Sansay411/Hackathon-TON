import { isLikelyTonAddress, truncateTonAddress } from "@/lib/ton/address";
const addr = "0QATpLw033Sg6pI_GjP2O4I6SNPUQEP58zMkeJ9L2wttvD8j";
console.log(JSON.stringify({ address: addr, valid: isLikelyTonAddress(addr), truncated: truncateTonAddress(addr) }));
