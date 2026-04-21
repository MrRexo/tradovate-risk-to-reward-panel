const DEFAULT_PRECISION_DIGITS = 8;

function normalizePrecision(value, digits = DEFAULT_PRECISION_DIGITS) {
  return Number(value.toFixed(digits));
}

function decimalPlaces(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const parts = value.toString().split(".");
  return parts[1] ? parts[1].length : 0;
}

function resolvePrecision(tickSize) {
  return Math.max(decimalPlaces(tickSize), DEFAULT_PRECISION_DIGITS);
}

function roundToTick(price, tickSize) {
  if (!Number.isFinite(price)) {
    throw new Error("price must be a finite number");
  }

  if (!Number.isFinite(tickSize) || tickSize <= 0) {
    throw new Error("tickSize must be a positive finite number");
  }

  const scaled = Math.round(price / tickSize) * tickSize;
  return normalizePrecision(scaled, resolvePrecision(tickSize));
}

module.exports = {
  decimalPlaces,
  normalizePrecision,
  roundToTick,
  resolvePrecision
};

