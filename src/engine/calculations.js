const { normalizePrecision, roundToTick } = require("./rounding");
const {
  isLayoutValid,
  resolveDirection
} = require("./validation");

function assertPositiveNumber(value, fieldName) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive finite number`);
  }
}

function assertNonNegativeInteger(value, fieldName) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
}

function calculateTicks(entryPrice, otherPrice, tickSize) {
  assertPositiveNumber(tickSize, "tickSize");
  return normalizePrecision(Math.abs(entryPrice - otherPrice) / tickSize);
}

function calculatePoints(entryPrice, otherPrice) {
  return normalizePrecision(Math.abs(entryPrice - otherPrice));
}

function calculateUsd(ticks, tickValueUsd, contracts) {
  assertPositiveNumber(tickValueUsd, "tickValueUsd");
  assertNonNegativeInteger(contracts, "contracts");
  return normalizePrecision(ticks * tickValueUsd * contracts);
}

function calculateRiskReward(takeProfitUsd, stopLossUsd) {
  if (!Number.isFinite(takeProfitUsd) || !Number.isFinite(stopLossUsd) || stopLossUsd <= 0) {
    return null;
  }

  return normalizePrecision(takeProfitUsd / stopLossUsd);
}

function calculatePositionMetrics(input) {
  const {
    positionType,
    contracts,
    entryPrice,
    stopLossPrice,
    takeProfitPrice,
    tickSize,
    tickValueUsd
  } = input;

  assertPositiveNumber(entryPrice, "entryPrice");
  assertPositiveNumber(stopLossPrice, "stopLossPrice");
  assertPositiveNumber(takeProfitPrice, "takeProfitPrice");
  assertPositiveNumber(tickSize, "tickSize");
  assertPositiveNumber(tickValueUsd, "tickValueUsd");
  assertNonNegativeInteger(contracts, "contracts");

  const roundedEntryPrice = roundToTick(entryPrice, tickSize);
  const roundedStopLossPrice = roundToTick(stopLossPrice, tickSize);
  const roundedTakeProfitPrice = roundToTick(takeProfitPrice, tickSize);
  const directionResolved = resolveDirection(
    roundedEntryPrice,
    roundedStopLossPrice,
    roundedTakeProfitPrice,
    positionType
  );
  const layoutValid = isLayoutValid(
    directionResolved,
    roundedEntryPrice,
    roundedStopLossPrice,
    roundedTakeProfitPrice
  );
  const distanceToStopLossTicks = calculateTicks(
    roundedEntryPrice,
    roundedStopLossPrice,
    tickSize
  );
  const distanceToTakeProfitTicks = calculateTicks(
    roundedEntryPrice,
    roundedTakeProfitPrice,
    tickSize
  );
  const distanceToStopLossPoints = calculatePoints(
    roundedEntryPrice,
    roundedStopLossPrice
  );
  const distanceToTakeProfitPoints = calculatePoints(
    roundedEntryPrice,
    roundedTakeProfitPrice
  );
  const stopLossValueUsd = calculateUsd(
    distanceToStopLossTicks,
    tickValueUsd,
    contracts
  );
  const takeProfitValueUsd = calculateUsd(
    distanceToTakeProfitTicks,
    tickValueUsd,
    contracts
  );

  return {
    positionType,
    directionResolved,
    isLayoutValid: layoutValid,
    entryPrice: roundedEntryPrice,
    stopLossPrice: roundedStopLossPrice,
    takeProfitPrice: roundedTakeProfitPrice,
    distanceToStopLossTicks,
    distanceToTakeProfitTicks,
    distanceToStopLossPoints,
    distanceToTakeProfitPoints,
    stopLossValueUsd,
    takeProfitValueUsd,
    riskRewardRatio: layoutValid
      ? calculateRiskReward(takeProfitValueUsd, stopLossValueUsd)
      : null
  };
}

module.exports = {
  calculatePoints,
  calculatePositionMetrics,
  calculateRiskReward,
  calculateTicks,
  calculateUsd
};

