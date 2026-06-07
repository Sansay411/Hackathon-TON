import assert from "node:assert/strict";
import test from "node:test";
import { apiError } from "@/lib/api/errors";
import { walletRequiredError } from "@/lib/api/profile";
import { canTransitionDeal } from "@/lib/domain/deal-status";
import { assertCanSpendEnergy, calculateApplicationEnergyCost } from "@/lib/energy/service";
import { isLikelyTonAddress, truncateTonAddress } from "@/lib/ton/address";
import { tonToNano } from "@/lib/ton/transactionBuilder";

test("energy spend requires positive balance", () => {
  assert.equal(calculateApplicationEnergyCost({ rating: 5 }), 1);
  assert.equal(calculateApplicationEnergyCost({ rating: 2.5 }), 2);
  assert.equal(calculateApplicationEnergyCost({ rating: 5, premiumJob: true }), 3);
  assert.doesNotThrow(() => assertCanSpendEnergy({ energyBalance: 3 }, 3));
  assert.throws(() => assertCanSpendEnergy({ energyBalance: 0 }, 1), /Not enough Energy/);
});

test("deal transitions reject invalid jumps", () => {
  assert.equal(canTransitionDeal("waiting_payment", "funded"), true);
  assert.equal(canTransitionDeal("waiting_payment", "completed"), false);
});

test("wallet required error contract is stable", () => {
  const error = walletRequiredError();
  assert.equal(error.error, "wallet_required");
  assert.equal(error.message, "Connect TON wallet to continue.");
  const response = apiError(error.error, error.message, 403);
  assert.equal(response.status, 403);
});

test("TON address helpers format cautiously", () => {
  assert.equal(isLikelyTonAddress("0:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"), true);
  assert.equal(isLikelyTonAddress("not-a-wallet"), false);
  assert.equal(truncateTonAddress("EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"), "EQAAAA...AAAAAA");
});

test("TON decimal amount converts to nanotons", () => {
  assert.equal(tonToNano("1"), "1000000000");
  assert.equal(tonToNano("0.25"), "250000000");
  assert.throws(() => tonToNano("0.1234567891"), /Invalid TON amount/);
});
