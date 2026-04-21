function buildLine(a, b) {
  return {
    tag: "Line",
    a,
    b
  };
}

function buildHorizontalLineAtPrice(anchors, price, graphics) {
  const xValues = anchors.map((anchor) => anchor.x.value);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);

  return buildLine(
    {
      x: graphics.du(minX),
      y: graphics.du(price)
    },
    {
      x: graphics.du(maxX),
      y: graphics.du(price)
    }
  );
}

function drawEntryLine({ anchors, props, graphics }) {
  return {
    tag: "LineSegments",
    key: "entryLine",
    lines: [buildHorizontalLineAtPrice(anchors, anchors[0].y.value, graphics)],
    lineStyle: {
      lineWidth: 2,
      color: props.entryColor
    }
  };
}

function drawStopLossLine({ anchors, props }) {
  return {
    tag: "LineSegments",
    key: "stopLossLine",
    lines: [buildLine(anchors[0], anchors[1])],
    lineStyle: {
      lineWidth: 2,
      color: props.lossColor
    }
  };
}

function drawTakeProfitLine({ anchors, props }) {
  return {
    tag: "LineSegments",
    key: "takeProfitLine",
    lines: [buildLine(anchors[0], anchors[2])],
    lineStyle: {
      lineWidth: 2,
      color: props.profitColor
    }
  };
}

module.exports = {
  drawEntryLine,
  drawStopLossLine,
  drawTakeProfitLine
};
