function buildZoneRectangle(a, b, graphics) {
  const top = Math.min(a.y.value, b.y.value);
  const bottom = Math.max(a.y.value, b.y.value);
  const left = Math.min(a.x.value, b.x.value);
  const right = Math.max(a.x.value, b.x.value);

  return {
    tag: "Rectangle",
    position: {
      x: graphics.du(left),
      y: graphics.du(top)
    },
    size: {
      width: graphics.du(right - left || 1),
      height: graphics.du(bottom - top || 1)
    }
  };
}

function drawLossZone({ anchors, props, graphics }) {
  return {
    tag: "Shapes",
    key: "lossZone",
    primitives: [buildZoneRectangle(anchors[0], anchors[1], graphics)],
    fillStyle: {
      color: props.lossColor,
      opacity: 0.18
    }
  };
}

function drawProfitZone({ anchors, props, graphics }) {
  return {
    tag: "Shapes",
    key: "profitZone",
    primitives: [buildZoneRectangle(anchors[0], anchors[2], graphics)],
    fillStyle: {
      color: props.profitColor,
      opacity: 0.18
    }
  };
}

module.exports = {
  drawLossZone,
  drawProfitZone
};

