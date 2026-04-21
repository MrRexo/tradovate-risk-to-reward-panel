const { recalculateState } = require("../state/drawingState");
const { drawLabels } = require("../render/labels");
const {
  drawEntryLine,
  drawStopLossLine,
  drawTakeProfitLine
} = require("../render/lines");
const { drawLossZone, drawProfitZone } = require("../render/zones");

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

function withDefaults(props) {
  return {
    ...DEFAULT_PROPS,
    ...props
  };
}

function createRiskRewardDrawingTool({ predef, meta, graphics }) {
  const { px, op, du } = graphics;

  const RiskRewardDrawing = {
    init() {
      return {
        changedAt: null,
        geometrySignature: null,
        isReady: false,
        revision: 0
      };
    },

    update({ anchors, props, state }) {
      return {
        newState: recalculateState({
          anchors,
          props: withDefaults(props),
          state
        })
      };
    },

    render({ anchors, props, state }) {
      if (!anchors || anchors.length < 3) {
        return { items: [] };
      }

      const mergedProps = withDefaults(props);
      const chartGraphics = { du, op, px };
      const nextState = state && state.isReady
        ? state
        : recalculateState({ anchors, props: mergedProps, state });

      if (!nextState.isReady) {
        return { items: [] };
      }

      return {
        items: [
          drawLossZone({ anchors, props: mergedProps, graphics: chartGraphics }),
          drawProfitZone({ anchors, props: mergedProps, graphics: chartGraphics }),
          drawEntryLine({ anchors, props: mergedProps, graphics: chartGraphics }),
          drawStopLossLine({ anchors, props: mergedProps }),
          drawTakeProfitLine({ anchors, props: mergedProps }),
          ...drawLabels({
            anchors,
            state: nextState,
            props: mergedProps,
            graphics: chartGraphics
          })
        ]
      };
    },

    tooltips({ state }) {
      if (!state || !state.isReady) {
        return [];
      }

      return [
        {
          coord: {
            x: du(0),
            y: du(state.entryPrice)
          },
          alignment: {
            tag: "predef",
            x: "left",
            y: "center"
          },
          items: [
            {
              key: "direction",
              title: "Direction",
              content: state.directionResolved
            },
            {
              key: "riskReward",
              title: "RiskReward",
              content: state.riskRewardRatio == null
                ? "N/A"
                : state.riskRewardRatio.toFixed(2)
            }
          ]
        }
      ];
    },

    anchorStyles() {
      return [
        { color: "#ffffff" },
        { color: "#ff5a5f" },
        { color: "#29c46d" }
      ];
    }
  };

  return {
    name: "RiskRewardPanel",
    description: "Risk to Reward Panel",
    drawing: RiskRewardDrawing,
    minN: 3,
    maxN: 3,
    params: {
      positionType: predef.paramSpecs.enum({
        long: "Long",
        short: "Short"
      }, "long"),
      contracts: predef.paramSpecs.number(1, 1, 100),
      tickSize: predef.paramSpecs.number(0.25, 0.01, 100),
      tickValueUsd: predef.paramSpecs.number(5, 0.01, 1000),
      showTicks: predef.paramSpecs.bool(true),
      showPoints: predef.paramSpecs.bool(true),
      showUsd: predef.paramSpecs.bool(true),
      showRiskReward: predef.paramSpecs.bool(true),
      revisionLabelEnabled: predef.paramSpecs.bool(true),
      entryColor: predef.paramSpecs.color("#ffffff"),
      lossColor: predef.paramSpecs.color("#ff5a5f"),
      profitColor: predef.paramSpecs.color("#29c46d"),
      textColor: predef.paramSpecs.color("#f5f5f5")
    },
    tags: ["MrRexo", "Risk Management"],
    schemeStyles: meta.schemeStyles
  };
}

module.exports = {
  createRiskRewardDrawingTool
};

