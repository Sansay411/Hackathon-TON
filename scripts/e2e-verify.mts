async function call(payload) {
  const r = await fetch("http://localhost:3000/api/payments/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const text = await r.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  return { status: r.status, body };
}

const escrow = "0QATpLw033Sg6pI_GjP2O4I6SNPUQEP58zMkeJ9L2wttvD8j";
const realTx = "5Z5i74kLqfwHwFFdKlRylBLUWXpENNxcK7EkA0+n3rM=";
const realTxHex = "e59e62ef890ba9fc07c0515d2a54729412d4597a4434dc5c2bb124034fa7deb3";
const fakeTx = "0000000000000000000000000000000000000000000000000000000000000000";

console.log("\n--- 1) Real tx, expect 0.0001 (should confirm) ---");
console.log(JSON.stringify(await call({
  dealId: "deal-001",
  txHash: realTx,
  expectedAmount: "0.0001",
  expectedAsset: "TON",
  network: "testnet"
}), null, 2));

console.log("\n--- 2) Real tx hex form, expect 0.0001 (should confirm) ---");
console.log(JSON.stringify(await call({
  dealId: "deal-001",
  txHash: realTxHex,
  expectedAmount: "0.0001",
  expectedAsset: "TON",
  network: "testnet"
}), null, 2));

console.log("\n--- 3) Real tx, expect 2.0 (should mismatch - amount too small) ---");
console.log(JSON.stringify(await call({
  dealId: "deal-001",
  txHash: realTx,
  expectedAmount: "2.0",
  expectedAsset: "TON",
  network: "testnet"
}), null, 2));

console.log("\n--- 4) Fake tx (should not_found) ---");
console.log(JSON.stringify(await call({
  dealId: "deal-001",
  txHash: fakeTx,
  expectedAmount: "0.001",
  expectedAsset: "TON",
  network: "testnet"
}), null, 2));

console.log("\n--- 5) Bad payload (should 400) ---");
console.log(JSON.stringify(await call({
  dealId: "deal-001",
  txHash: "x".repeat(10),
  expectedAmount: "abc"
}), null, 2));

console.log("\n--- 6) Wrong asset (should mismatch) ---");
console.log(JSON.stringify(await call({
  dealId: "deal-001",
  txHash: realTx,
  expectedAmount: "0.0001",
  expectedAsset: "USDT",
  network: "testnet"
}), null, 2));
