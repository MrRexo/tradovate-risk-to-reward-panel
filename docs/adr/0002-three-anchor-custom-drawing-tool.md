# ADR 0002: Use a Three-Anchor Custom Drawing Tool

## Status

Accepted

## Context

The product goal is an on-chart simulation tool with entry, stop loss, and take profit.

Tradovate public documentation for Custom Drawing Tools supports configurable anchor counts through `minN` and `maxN` and exposes rendering and state hooks suitable for a drawing-based workflow.

## Decision

The MVP will be implemented as a Tradovate Custom Drawing Tool with exactly three anchors:

- entry
- stop loss
- take profit

The exported tool definition should use:

```txt
minN = 3
maxN = 3
```

## Consequences

### Positive

- matches the user interaction model directly
- keeps geometry simple
- avoids forcing the feature into an indicator abstraction

### Negative

- label overlap and dense rendering need dedicated handling
- direction validation must be explicit

