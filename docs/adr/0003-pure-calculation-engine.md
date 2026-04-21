# ADR 0003: Keep the Calculation Engine Pure

## Status

Accepted

## Context

Ticks, USD values, points, and risk:reward are deterministic calculations based on a small set of inputs. These rules do not need Tradovate runtime state beyond anchor prices and user parameters.

## Decision

The calculation engine will be implemented as pure functions that accept normalized inputs and return derived values without side effects.

Core functions:

- `roundToTick`
- `calculateTicks`
- `calculatePoints`
- `calculateUsd`
- `calculateRiskReward`
- `isLongLayoutValid`
- `isShortLayoutValid`
- `isLayoutValid`

## Consequences

### Positive

- straightforward unit tests
- easier debugging
- better portability if the rendering layer changes

### Negative

- an adapter layer is required between Tradovate anchors and pure calculation inputs

