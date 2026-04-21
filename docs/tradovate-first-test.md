# Tradovate First Test

## Candidate File

Use this file for the first direct Tradovate compatibility check:

- [tradovate/RiskRewardPanel.candidate.js](E:\Multipro\Tradovate\Panel R-R\tradovate\RiskRewardPanel.candidate.js)

## Why This File

This candidate is intentionally self-contained:

- no local `src/` imports
- only uses Tradovate `./tools/predef` and `./tools/graphics`
- uses raw parameter definitions for `number`, `boolean`, and `enum`
- keeps rendering limited to lines, rectangles, text, and basic tooltips

## Expected Outcome

This is not expected to be feature-complete.

The goal of the first test is only to answer:

1. does Tradovate accept the file
2. does the drawing appear
3. do three anchors work
4. do labels and zones render at all
5. which properties or objects fail in the real runtime

## What To Report Back

After you test it in Tradovate, report:

- whether the script saves without validation errors
- any runtime error message
- whether the drawing appears in the tool list
- whether placement with three clicks works
- whether drag updates visuals
- whether labels appear
- whether rectangles render correctly

## Known Risk Areas

- `Rectangle` sizing in domain units may behave differently than expected
- `global: true` on `Text` may need adjustment
- tooltip formatting may differ from docs examples
- `LineSegments` plus standalone horizontal entry line may need refinement

