const predef = require("./tools/predef");
const { du, op, px } = require("./tools/graphics");

const DEFAULT_PROPS = {
  positionType: "long",
  contracts: 1,
  tickSize: 0.25,
  tickValueUsd: 5,
  showTicks: true,
  showPoints: true,
  showUsd: true,
  showRiskReward: true,
  entryColor: "#ffffff",
  lossColor: "#ff5a5f",
  profitColor: "#29c46d",
  textColor: "#f5f5f5",
  revisionLabelEnabled: true
};

function normalizePrecision(value, digits = 8) {
  return Number(value.toFixed(digits));
}

function roundToTick(price, tickSize) {
  return normalizePrecision(Math.round(price / tickSize) * tickSize);
}

function isLongLayoutValid(entryPrice, stopLossPrice, takeProfitPrice) {
  return stopLossPrice < entryPrice && entryPrice < takeProfitPrice;
}

function isShortLayoutValid(entryPrice, stopLossPrice, takeProfitPrice) {
  return takeProfitPrice < entryPrice && entryPrice < stopLossPrice;
}

function isLayoutValid(positionType, entryPrice, stopLossPrice, takeProfitPrice) {
  return positionType === "long"
    ? isLongLayoutValid(entryPrice, stopLossPrice, takeProfitPrice)
    : isShortLayoutValid(entryPrice, stopLossPrice, takeProfitPrice);
}

function calculateTicks(entryPrice, otherPrice, tickSize) {
  return normalizePrecision(Math.abs(entryPrice - otherPrice) / tickSize);
}

function calculatePoints(entryPrice, otherPrice) {
  return normalizePrecision(Math.abs(entryPrice - otherPrice));
}

function calculateUsd(ticks, tickValueUsd, contracts) {
  return normalizePrecision(ticks * tickValueUsd * contracts);
}

function calculateRiskReward(takeProfitUsd, stopLossUsd) {
  return stopLossUsd > 0
    ? normalizePrecision(takeProfitUsd / stopLossUsd)
    : null;
}

function withDefaults(props) {
  return {
    ...DEFAULT_PROPS,
    ...props
  };
}

function getAnchorPrice(anchor, fallback) {
  return anchor && anchor.y ? anchor.y.value : fallback;
}

function buildMetrics(anchors, props) {
  const mergedProps = withDefaults(props);
  const entryPrice = roundToTick(getAnchorPrice(anchors[0], 0), mergedProps.tickSize);
  const stopLossPrice = roundToTick(
    getAnchorPrice(anchors[1], entryPrice),
    mergedProps.tickSize
  );
  const takeProfitPrice = roundToTick(
    getAnchorPrice(anchors[2], entryPrice),
    mergedProps.tickSize
  );
  const distanceToStopLossTicks = calculateTicks(
    entryPrice,
    stopLossPrice,
    mergedProps.tickSize
  );
  const distanceToTakeProfitTicks = calculateTicks(
    entryPrice,
    takeProfitPrice,
    mergedProps.tickSize
  );
  const distanceToStopLossPoints = calculatePoints(entryPrice, stopLossPrice);
  const distanceToTakeProfitPoints = calculatePoints(entryPrice, takeProfitPrice);
  const stopLossValueUsd = calculateUsd(
    distanceToStopLossTicks,
    mergedProps.tickValueUsd,
    mergedProps.contracts
  );
  const takeProfitValueUsd = calculateUsd(
    distanceToTakeProfitTicks,
    mergedProps.tickValueUsd,
    mergedProps.contracts
  );
  const layoutValid = isLayoutValid(
    mergedProps.positionType,
    entryPrice,
    stopLossPrice,
    takeProfitPrice
  );

  return {
    entryPrice,
    stopLossPrice,
    takeProfitPrice,
    distanceToStopLossTicks,
    distanceToTakeProfitTicks,
    distanceToStopLossPoints,
    distanceToTakeProfitPoints,
    stopLossValueUsd,
    takeProfitValueUsd,
    riskRewardRatio: layoutValid
      ? calculateRiskReward(takeProfitValueUsd, stopLossValueUsd)
      : null,
    isLayoutValid: layoutValid
  };
}

function buildHorizontalLine(anchors, price) {
  const xValues = anchors
    .filter(Boolean)
    .map((anchor) => anchor.x.value);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);

  return {
    tag: "Line",
    a: { x: du(minX), y: du(price) },
    b: { x: du(maxX), y: du(price) }
  };
}

function buildZoneRectangle(a, b) {
  const left = Math.min(a.x.value, b.x.value);
  const top = Math.min(a.y.value, b.y.value);
  const width = Math.max(Math.abs(a.x.value - b.x.value), 1);
  const height = Math.max(Math.abs(a.y.value - b.y.value), 0.01);

  return {
    tag: "Rectangle",
    position: {
      x: du(left),
      y: du(top)
    },
    size: {
      width: du(width),
      height: du(height)
    }
  };
}

function formatLabelText(metrics, props, revision) {
  return [
    `ENTRY ${metrics.entryPrice.toFixed(2)}`,
    [
      `SL ${metrics.stopLossPrice.toFixed(2)}`,
      props.showTicks ? `${metrics.distanceToStopLossTicks.toFixed(0)}t` : null,
      props.showPoints ? `${metrics.distanceToStopLossPoints.toFixed(2)}pt` : null,
      props.showUsd ? `-${metrics.stopLossValueUsd.toFixed(2)} USD` : null
    ].filter(Boolean).join(" | "),
    [
      `TP ${metrics.takeProfitPrice.toFixed(2)}`,
      props.showTicks ? `${metrics.distanceToTakeProfitTicks.toFixed(0)}t` : null,
      props.showPoints ? `${metrics.distanceToTakeProfitPoints.toFixed(2)}pt` : null,
      props.showUsd ? `+${metrics.takeProfitValueUsd.toFixed(2)} USD` : null
    ].filter(Boolean).join(" | "),
    props.showRiskReward
      ? metrics.isLayoutValid
        ? `R:R 1:${metrics.riskRewardRatio.toFixed(2)}`
        : "R:R INVALID"
      : null,
    props.revisionLabelEnabled ? `REV ${revision}` : null
  ].filter(Boolean).join("\n");
}

function buildRevision(nextState, metrics) {
  const signature = [
    metrics.entryPrice,
    metrics.stopLossPrice,
    metrics.takeProfitPrice,
    nextState.positionType
  ].join("|");

  if (signature === nextState.geometrySignature) {
    return nextState.revision || 0;
  }

  return (nextState.revision || 0) + 1;
}

const RiskRewardPanel = {
  init() {
    return {
      geometrySignature: null,
      revision: 0
    };
  },

  update({ anchors, props, state }) {
    const mergedProps = withDefaults(props);

    if (!anchors[0] || !anchors[1] || !anchors[2]) {
      return {
        newState: {
          ...state,
          positionType: mergedProps.positionType
        }
      };
    }

    const metrics = buildMetrics(anchors, mergedProps);
    const nextState = {
      ...(state || {}),
      ...metrics,
      positionType: mergedProps.positionType
    };

    nextState.revision = buildRevision(nextState, metrics);
    nextState.geometrySignature = [
      metrics.entryPrice,
      metrics.stopLossPrice,
      metrics.takeProfitPrice,
      mergedProps.positionType
    ].join("|");

    return { newState: nextState };
  },

  render({ anchors, props, state }) {
    if (!anchors[0]) {
      return { items: [] };
    }

    const mergedProps = withDefaults(props);
    const anchorA = anchors[0];
    const anchorB = anchors[1] || anchors[0];
    const anchorC = anchors[2] || anchors[0];
    const metrics = buildMetrics([anchorA, anchorB, anchorC], mergedProps);
    const revision = state && typeof state.revision === "number"
      ? state.revision
      : 0;

    return {
      items: [
        {
          tag: "Shapes",
          key: "lossZone",
          primitives: [buildZoneRectangle(anchorA, anchorB)],
          fillStyle: {
            color: mergedProps.lossColor,
            opacity: 0.18
          }
        },
        {
          tag: "Shapes",
          key: "profitZone",
          primitives: [buildZoneRectangle(anchorA, anchorC)],
          fillStyle: {
            color: mergedProps.profitColor,
            opacity: 0.18
          }
        },
        {
          tag: "LineSegments",
          key: "entryLine",
          lines: [buildHorizontalLine([anchorA, anchorB, anchorC], metrics.entryPrice)],
          lineStyle: {
            lineWidth: 2,
            color: mergedProps.entryColor
          }
        },
        {
          tag: "LineSegments",
          key: "stopLossLine",
          lines: [
            {
              tag: "Line",
              a: anchorA,
              b: anchorB
            }
          ],
          lineStyle: {
            lineWidth: 2,
            color: mergedProps.lossColor
          }
        },
        {
          tag: "LineSegments",
          key: "takeProfitLine",
          lines: [
            {
              tag: "Line",
              a: anchorA,
              b: anchorC
            }
          ],
          lineStyle: {
            lineWidth: 2,
            color: mergedProps.profitColor
          }
        },
        {
          tag: "Text",
          key: "riskRewardLabel",
          point: {
            x: anchorC.x,
            y: op(anchorC.y, "-", px(64))
          },
          text: formatLabelText(metrics, mergedProps, revision),
          style: {
            fontSize: 14,
            fontWeight: "bold",
            fill: mergedProps.textColor
          },
          textAlignment: "leftBelow",
          global: true
        }
      ]
    };
  },

  tooltips({ anchors, props }) {
    if (!anchors[0]) {
      return [];
    }

    const mergedProps = withDefaults(props);
    const anchorA = anchors[0];
    const anchorB = anchors[1] || anchors[0];
    const anchorC = anchors[2] || anchors[0];
    const metrics = buildMetrics([anchorA, anchorB, anchorC], mergedProps);

    return [
      {
        coord: anchorA,
        alignment: {
          tag: "predef",
          x: "center",
          y: "below"
        },
        items: [
          {
            key: "entry",
            title: "Entry",
            content: metrics.entryPrice
          },
          {
            key: "riskReward",
            title: "RiskReward",
            content: metrics.riskRewardRatio == null
              ? "N/A"
              : metrics.riskRewardRatio.toFixed(2)
          }
        ]
      }
    ];
  },

  anchorStyles({ props }) {
    const mergedProps = withDefaults(props);

    return [
      { color: mergedProps.entryColor },
      { color: mergedProps.lossColor },
      { color: mergedProps.profitColor }
    ];
  }
};

module.exports = {
  name: "RiskRewardPanelCandidate",
  description: "Risk Reward Panel Candidate",
  drawing: RiskRewardPanel,
  minN: 3,
  maxN: 3,
  params: {
    positionType: {
      type: "enum",
      def: "long",
      enumSet: {
        long: "Long",
        short: "Short"
      }
    },
    contracts: {
      type: "number",
      def: 1,
      restrictions: {
        min: 1,
        step: 1
      }
    },
    tickSize: {
      type: "number",
      def: 0.25,
      restrictions: {
        min: 0.01,
        step: 0.01
      }
    },
    tickValueUsd: {
      type: "number",
      def: 5,
      restrictions: {
        min: 0.01,
        step: 0.01
      }
    },
    showTicks: {
      type: "boolean",
      def: true
    },
    showPoints: {
      type: "boolean",
      def: true
    },
    showUsd: {
      type: "boolean",
      def: true
    },
    showRiskReward: {
      type: "boolean",
      def: true
    },
    revisionLabelEnabled: {
      type: "boolean",
      def: true
    },
    entryColor: predef.paramSpecs.color("#ffffff"),
    lossColor: predef.paramSpecs.color("#ff5a5f"),
    profitColor: predef.paramSpecs.color("#29c46d"),
    textColor: predef.paramSpecs.color("#f5f5f5")
  },
  tags: ["MrRexo", "Risk Management", "Candidate"]
};

