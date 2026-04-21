# Architecture Overview

## Principle

The project should separate chart runtime concerns from repository maintenance concerns.

This is the most important correction to the initial concept.

## Runtime Layers

### Tool Definition Layer

Responsibility:

- export the Tradovate drawing tool definition
- define parameter schema
- set `minN` and `maxN`

### Interaction Layer

Responsibility:

- react to anchor placement and drag updates
- translate anchor coordinates into normalized prices
- trigger recalculation on geometry change

### State Management Layer

Responsibility:

- keep derived values required by rendering
- preserve revision metadata for the active drawing instance
- avoid expensive recalculation when no meaningful input changed

### Calculation Engine

Responsibility:

- tick rounding
- distances
- USD conversion
- long and short validation
- risk:reward calculation

This layer must be pure and deterministic so it can be unit-tested outside Tradovate.

### Rendering Engine

Responsibility:

- lines
- zones
- text labels
- invalid-state visuals

This layer should consume already-calculated state and stay as presentation-only as possible.

## Development Workflow Layer

This layer is intentionally external to the drawing tool runtime.

Responsibility:

- semantic version bumps
- changelog updates
- safe file staging
- commit message generation
- controlled push to GitHub

Reason:

Tradovate drawing tools are chart runtime artifacts. Repository versioning and GitHub publishing are developer workflow operations and should not be embedded into tool execution.

## Proposed Source Layout

```text
src/
  drawing/
    riskRewardDrawingTool.js
  interaction/
    anchorEvents.js
  state/
    drawingState.js
  engine/
    calculations.js
    validation.js
    rounding.js
    presets.js
  render/
    lines.js
    zones.js
    labels.js
```

## Runtime Data Flow

1. user places or drags an anchor
2. interaction layer reads anchor coordinates
3. state layer normalizes the runtime input
4. calculation engine derives values
5. rendering engine draws lines, zones, and labels
6. state stores the latest revision metadata

## Revision Model

Runtime revision is an annotation value for the drawing instance, not a Git version.

Recommended separation:

- runtime drawing revision: changes when drawing geometry changes
- repository version: changes when source code changes

These should never be conflated.

## Known Risks

- Tradovate drawing APIs may have rendering constraints that affect label density
- floating-point rounding can create off-by-one tick errors
- overlapping labels may reduce readability on tight ranges
- performance may degrade if state recalculation is too broad during drag events

