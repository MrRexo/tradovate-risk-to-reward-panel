function isLongLayoutValid(entryPrice, stopLossPrice, takeProfitPrice) {
  return stopLossPrice < entryPrice && entryPrice < takeProfitPrice;
}

function isShortLayoutValid(entryPrice, stopLossPrice, takeProfitPrice) {
  return takeProfitPrice < entryPrice && entryPrice < stopLossPrice;
}

function isLayoutValid(positionType, entryPrice, stopLossPrice, takeProfitPrice) {
  if (positionType === "long") {
    return isLongLayoutValid(entryPrice, stopLossPrice, takeProfitPrice);
  }

  if (positionType === "short") {
    return isShortLayoutValid(entryPrice, stopLossPrice, takeProfitPrice);
  }

  return false;
}

function resolveDirection(entryPrice, stopLossPrice, takeProfitPrice, preferredPositionType) {
  if (preferredPositionType === "long" || preferredPositionType === "short") {
    return preferredPositionType;
  }

  if (isLongLayoutValid(entryPrice, stopLossPrice, takeProfitPrice)) {
    return "long";
  }

  if (isShortLayoutValid(entryPrice, stopLossPrice, takeProfitPrice)) {
    return "short";
  }

  return "unknown";
}

module.exports = {
  isLayoutValid,
  isLongLayoutValid,
  isShortLayoutValid,
  resolveDirection
};

