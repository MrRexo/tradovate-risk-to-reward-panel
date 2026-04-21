const test = require("node:test");
const assert = require("node:assert/strict");

const {
  calculatePositionMetrics,
  calculateRiskReward
} = require("../../src/engine/calculations");
const { roundToTick } = require("../../src/engine/rounding");
const {
  isLongLayoutValid,
  isShortLayoutValid
} = require("../../src/engine/validation");

test("roundToTick normalizes quarter-point values", () => {
  assert.equal(roundToTick(20345.2499999, 0.25), 20345.25);
  assert.equal(roundToTick(20345.3749999, 0.25), 20345.25);
  assert.equal(roundToTick(20345.3750001, 0.25), 20345.5);
});

test("calculatePositionMetrics returns correct long metrics", () => {
  const result = calculatePositionMetrics({
    positionType: "long",
    contracts: 2,
    entryPrice: 20345.25,
    stopLossPrice: 20335.25,
    takeProfitPrice: 20365.25,
    tickSize: 0.25,
    tickValueUsd: 5
  });

  assert.equal(result.isLayoutValid, true);
  assert.equal(result.distanceToStopLossTicks, 40);
  assert.equal(result.distanceToTakeProfitTicks, 80);
  assert.equal(result.stopLossValueUsd, 400);
  assert.equal(result.takeProfitValueUsd, 800);
  assert.equal(result.riskRewardRatio, 2);
});

test("calculatePositionMetrics returns correct short metrics", () => {
  const result = calculatePositionMetrics({
    positionType: "short",
    contracts: 1,
    entryPrice: 20345.25,
    stopLossPrice: 20355.25,
    takeProfitPrice: 20325.25,
    tickSize: 0.25,
    tickValueUsd: 5
  });

  assert.equal(result.isLayoutValid, true);
  assert.equal(result.directionResolved, "short");
  assert.equal(result.stopLossValueUsd, 200);
  assert.equal(result.takeProfitValueUsd, 400);
  assert.equal(result.riskRewardRatio, 2);
});

test("invalid layout hides risk reward", () => {
  const result = calculatePositionMetrics({
    positionType: "long",
    contracts: 1,
    entryPrice: 20345.25,
    stopLossPrice: 20355.25,
    takeProfitPrice: 20365.25,
    tickSize: 0.25,
    tickValueUsd: 5
  });

  assert.equal(result.isLayoutValid, false);
  assert.equal(result.riskRewardRatio, null);
});

test("layout validators distinguish long and short geometry", () => {
  assert.equal(isLongLayoutValid(100, 99, 101), true);
  assert.equal(isLongLayoutValid(100, 101, 99), false);
  assert.equal(isShortLayoutValid(100, 101, 99), true);
  assert.equal(isShortLayoutValid(100, 99, 101), false);
});

test("calculateRiskReward returns null for zero or invalid risk", () => {
  assert.equal(calculateRiskReward(200, 0), null);
  assert.equal(calculateRiskReward(200, Number.NaN), null);
});

