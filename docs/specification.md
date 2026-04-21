# MVP Specification

## Objective

Build a Tradovate Custom Drawing Tool that simulates a trade position directly on the chart without placing or modifying orders.

## Functional Scope

### Required

- three anchors: entry, stop loss, take profit
- live drag interaction for all anchors
- real-time recalculation
- long and short layout support
- on-chart labels
- risk and reward measurements in ticks, points, and USD
- risk:reward ratio when layout is valid

### Explicitly Out of Scope

- order placement
- order modification
- strategy automation
- broker account interaction
- automatic Git commits or pushes from the chart runtime

## Tradovate Fit

The design assumes a Custom Drawing Tool with:

- `minN: 3`
- `maxN: 3`
- drawing state managed through `init()` and `update()`
- chart graphics rendered through `render()`
- optional tooltip support through `tooltips()`

This is consistent with Tradovate public documentation for Custom Drawing Tools.

## Inputs

### Tool Parameters

- `positionType`: `long | short`
- `contracts`: positive integer
- `tickSize`: positive number
- `tickValueUsd`: positive number
- `showTicks`: boolean
- `showPoints`: boolean
- `showUsd`: boolean
- `showRiskReward`: boolean
- `entryColor`: string
- `lossColor`: string
- `profitColor`: string
- `textColor`: string
- `revisionLabelEnabled`: boolean

### Runtime Anchors

- `entryAnchor`
- `stopLossAnchor`
- `takeProfitAnchor`

## Derived State

- `entryPrice`
- `stopLossPrice`
- `takeProfitPrice`
- `distanceToStopLossTicks`
- `distanceToTakeProfitTicks`
- `distanceToStopLossPoints`
- `distanceToTakeProfitPoints`
- `stopLossValueUsd`
- `takeProfitValueUsd`
- `riskRewardRatio`
- `isLayoutValid`
- `directionResolved`
- `revision`
- `changedAt`

## Calculation Rules

### Rounding

Use deterministic tick rounding for every anchor price before calculations:

```txt
roundedPrice = Math.round(price / tickSize) * tickSize
```

Implementation should avoid floating-point drift by normalizing precision after rounding.

### Distance

```txt
differenceToStop = abs(entryPrice - stopLossPrice)
differenceToTarget = abs(entryPrice - takeProfitPrice)

ticksToStop = differenceToStop / tickSize
ticksToTarget = differenceToTarget / tickSize
```

### Points

```txt
pointsToStop = differenceToStop
pointsToTarget = differenceToTarget
```

### USD

```txt
stopLossUsd = ticksToStop * tickValueUsd * contracts
takeProfitUsd = ticksToTarget * tickValueUsd * contracts
```

### Risk Reward

```txt
riskRewardRatio = takeProfitUsd / stopLossUsd
```

Only compute and display risk:reward when the layout is valid and `stopLossUsd > 0`.

## Validation Rules

### Long

`stopLoss < entry < takeProfit`

### Short

`takeProfit < entry < stopLoss`

### Invalid Layout Behavior

- keep drawing visible
- keep labels visible where possible
- hide or replace risk:reward with an invalid-state message
- still increment revision when anchors change

## Rendering Requirements

### Minimum Visual Elements

- entry line
- stop loss line
- take profit line
- loss zone
- profit zone
- labels for all three prices
- summary label for risk:reward
- revision label

### Label Format

```txt
ENTRY 20345.25
SL 20335.25 | 40t | -100 USD
TP 20365.25 | 80t | +200 USD
R:R 1:2.00
REV 0.0.7
```

Final wording may change, but the structure should remain concise and stable.

## Interaction Model

### Creation

1. first click sets entry
2. second click sets stop loss
3. third click sets take profit

### Editing

- dragging any anchor recalculates immediately
- state refresh should happen on every meaningful anchor move
- revision increments after each committed geometry change

## Instrument Presets

Initial presets:

- `MNQ`: `tickSize = 0.25`, `tickValueUsd = 0.50`
- `NQ`: `tickSize = 0.25`, `tickValueUsd = 5.00`
- `MES`: `tickSize = 0.25`, `tickValueUsd = 1.25`
- `ES`: `tickSize = 0.25`, `tickValueUsd = 12.50`

Presets should populate defaults, not override explicit user parameters.

## Non-Functional Requirements

- all source, comments, commit messages, and configuration names must be English-only
- repository contents must remain public-safe
- secrets, credentials, account data, and private endpoints are forbidden
- calculation logic must be testable outside Tradovate runtime

## Phased Delivery

### Phase 1

- three anchors
- price normalization
- validation
- live calculations
- essential labels
- revision tracking in runtime state

### Phase 2

- profit and loss zones
- presets
- invalid-layout styling
- improved label composition

### Phase 3

- optional auto direction detection
- performance optimization
- collision and overlap improvements

