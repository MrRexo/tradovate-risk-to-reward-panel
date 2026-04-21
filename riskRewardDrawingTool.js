const predef = require("./tools/predef");
const meta = require("./tools/meta");
const graphics = require("./tools/graphics");

const { createRiskRewardDrawingTool } = require("./src/drawing/createRiskRewardDrawingTool");

module.exports = createRiskRewardDrawingTool({
  predef,
  meta,
  graphics
});

