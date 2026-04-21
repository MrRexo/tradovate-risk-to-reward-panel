# Repository and Git Workflow

## Repository

- remote: `https://github.com/MrRexo/tradovate-risk-to-reward-panel.git`
- visibility: public
- default branch: `main`
- license: Apache-2.0

## Public Safety Rules

Allowed:

- source code
- safe configuration
- documentation
- changelog
- CI workflows without secrets

Forbidden:

- API keys
- passwords
- tokens
- credentials
- trading account data
- private logs
- `.env` files
- machine-specific local paths
- private endpoints

## Commit Convention

Recommended commit format:

```txt
rev 0.0.7: adjust take profit label
rev 0.1.0: add instrument presets
rev 1.0.0: refactor rendering engine
```

## Versioning Policy

Use semantic versioning:

- patch: fixes and minor internal improvements
- minor: new backward-compatible features
- major: breaking changes

If the repository reaches `999.9.9`, automatic increment logic must stop and require explicit manual handling.

## Safe Push Workflow

1. review changed files
2. verify only public-safe content is staged
3. update version and changelog
4. create commit with semantic revision message
5. push to `main` only after validation succeeds

## Explicit Non-Goal

The Tradovate drawing tool must not execute Git commands or interact with GitHub during chart runtime.

