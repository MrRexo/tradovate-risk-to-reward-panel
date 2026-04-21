# ADR 0001: Separate Drawing Runtime From Git Workflow

## Status

Accepted

## Context

The initial concept mixed two different concerns:

- chart runtime behavior for a Tradovate Custom Drawing Tool
- repository maintenance behavior such as version bumping, committing, and pushing

That coupling would increase complexity, make the runtime harder to reason about, and create an unnecessary security surface.

## Decision

The drawing tool runtime will not perform:

- Git staging
- commit creation
- GitHub pushes
- repository inspection

Those actions belong to the external development workflow only.

## Consequences

### Positive

- simpler Tradovate runtime
- lower security risk
- cleaner testing boundaries
- clearer ownership of revision concepts

### Negative

- version and changelog updates require a separate workflow
- the initial concept of fully automated repository updates is intentionally reduced

## Notes

This decision does not block automated developer tooling outside Tradovate. It only forbids embedding repository actions inside the chart tool itself.

