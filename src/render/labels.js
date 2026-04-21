function formatUsd(value) {
  return `${value.toFixed(2)} USD`;
}

function formatTicks(value) {
  return `${value.toFixed(0)}t`;
}

function formatPrice(value) {
  return value.toFixed(2);
}

function formatRiskReward(value) {
  return value == null ? "R:R N/A" : `R:R 1:${value.toFixed(2)}`;
}

function buildLabelText(state, props) {
  return [
    `ENTRY ${formatPrice(state.entryPrice)}`,
    [
      `SL ${formatPrice(state.stopLossPrice)}`,
      props.showTicks ? formatTicks(state.distanceToStopLossTicks) : null,
      props.showPoints ? `${state.distanceToStopLossPoints.toFixed(2)}pt` : null,
      props.showUsd ? `-${formatUsd(state.stopLossValueUsd)}` : null
    ].filter(Boolean).join(" | "),
    [
      `TP ${formatPrice(state.takeProfitPrice)}`,
      props.showTicks ? formatTicks(state.distanceToTakeProfitTicks) : null,
      props.showPoints ? `${state.distanceToTakeProfitPoints.toFixed(2)}pt` : null,
      props.showUsd ? `+${formatUsd(state.takeProfitValueUsd)}` : null
    ].filter(Boolean).join(" | "),
    props.showRiskReward
      ? state.isLayoutValid
        ? formatRiskReward(state.riskRewardRatio)
        : "R:R INVALID"
      : null,
    props.revisionLabelEnabled ? `REV ${state.revision}` : null
  ].filter(Boolean).join("\n");
}

function drawLabels({ anchors, state, props, graphics }) {
  if (!state || !state.isReady) {
    return [];
  }

  const labelAnchor = anchors[2] || anchors[0];

  return [
    {
      tag: "Text",
      key: "riskRewardSummaryLabel",
      point: {
        x: labelAnchor.x,
        y: graphics.op(labelAnchor.y, "-", graphics.px(64))
      },
      text: buildLabelText(state, props),
      style: {
        fontSize: 14,
        fontWeight: "bold",
        fill: props.textColor
      },
      textAlignment: "leftBelow",
      global: true
    }
  ];
}

module.exports = {
  buildLabelText,
  drawLabels
};

