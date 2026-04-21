# Tradovate Risk to Reward Panel

Simulation-only Tradovate custom drawing tool for chart-based trade planning.

## Scope

This project targets a Tradovate Custom Drawing Tool that:

- places three anchors: entry, stop loss, and take profit
- recalculates risk and reward values while anchors move
- renders labels and visual zones on the chart
- never sends orders

## Current Status

The repository is currently in architecture and specification mode.

Implemented in this stage:

- repository safety baseline
- MVP specification
- architecture decisions
- public repository rules

Not implemented yet:

- Tradovate drawing tool runtime code
- package setup
- automated tests
- release workflow

## Guiding Decisions

- Runtime chart logic stays separate from developer workflow logic.
- Versioning, changelog updates, commits, and pushes are external development actions.
- The drawing tool itself must remain simulation-only and public-safe.
- All project content must stay in English.

## Proposed Repository Layout

```text
docs/
  adr/
  architecture.md
  repo.md
  specification.md
src/
  drawing/
  engine/
  state/
  render/
  interaction/
tests/
```

## Tradovate Constraints

The design is aligned to Tradovate Custom Drawing Tool primitives documented here:

- https://tradovate.github.io/custom-indicators/pages/Tutorial/DrawingTools.html
- https://tradovate.github.io/custom-indicators/interfaces/drawing_tool.drawingtool.html
- https://tradovate.github.io/custom-indicators/interfaces/drawing_tool.drawingtoolimplementation.html

These references confirm that custom drawing tools support:

- configurable `minN` and `maxN` anchor counts
- custom `render`, `update`, `tooltips`, `anchorRestraints`, and `anchorStyles`
- internal drawing `state`

## Next Step

The next implementation step should be a minimal vertical slice:

1. three-anchor Tradovate drawing tool shell
2. pure calculation module with deterministic tests
3. label rendering for entry, stop loss, take profit, and risk:reward

