const { calculatePositionMetrics } = require("../engine/calculations");

function getAnchorPrice(anchor) {
  return anchor && anchor.y && typeof anchor.y.value === "number"
    ? anchor.y.value
    : null;
}

function getPricesFromAnchors(anchors) {
  return {
    entryPrice: getAnchorPrice(anchors[0]),
    stopLossPrice: getAnchorPrice(anchors[1]),
    takeProfitPrice: getAnchorPrice(anchors[2])
  };
}

function hasAllAnchorPrices(prices) {
  return Object.values(prices).every((value) => typeof value === "number");
}

function incrementRevision(previousRevision = 0) {
  return previousRevision + 1;
}

function buildGeometrySignature(metrics) {
  return [
    metrics.entryPrice,
    metrics.stopLossPrice,
    metrics.takeProfitPrice,
    metrics.directionResolved
  ].join("|");
}

function recalculateState({ anchors, props, state }) {
  const previousState = state || {};
  const prices = getPricesFromAnchors(anchors);

  if (!hasAllAnchorPrices(prices)) {
    return {
      ...previousState,
      ...prices,
      isReady: false
    };
  }

  const metrics = calculatePositionMetrics({
    positionType: props.positionType,
    contracts: props.contracts,
    tickSize: props.tickSize,
    tickValueUsd: props.tickValueUsd,
    ...prices
  });
  const geometrySignature = buildGeometrySignature(metrics);
  const shouldIncrementRevision = geometrySignature !== previousState.geometrySignature;

  return {
    ...previousState,
    ...metrics,
    changedAt: new Date().toISOString(),
    geometrySignature,
    isReady: true,
    revision: shouldIncrementRevision
      ? incrementRevision(previousState.revision)
      : previousState.revision || 0
  };
}

module.exports = {
  getAnchorPrice,
  getPricesFromAnchors,
  incrementRevision,
  recalculateState
};

