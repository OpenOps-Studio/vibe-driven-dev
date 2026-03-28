# Contributing to Vibe Driven Dev

Thanks for contributing.

Vibe Driven Dev is a pre-execution framework for AI coding workflows. The project is opinionated about safety, clarity, and handoff quality, so contributions should optimize for correctness and minimal churn rather than novelty.

## Before you open a change

1. Read [README.md](./README.md), [INSTALL.md](./INSTALL.md), and [USAGE.md](./USAGE.md).
2. Review the core operating rules in `core/constitution/core-operating-rules.md`.
3. Check whether the change belongs in `core/`, `skills/`, `agents/`, `packs/`, or `docs/`.
4. Prefer a focused change over a broad refactor.

## Good contribution lanes

- core routing and state behavior
- install targets and runtime compatibility
- governance and safety improvements
- pack authoring and source validation
- docs, examples, and onboarding flows
- tests that improve confidence without changing behavior

## Change expectations

- Keep diffs tight.
- Preserve existing public commands unless the change is intentional and documented.
- Add or update tests for meaningful behavior changes.
- Update docs when commands, install behavior, or workflow stages change.
- Avoid introducing hidden network behavior, broad file writes, or unsafe execution paths.

## Development

Install dependencies:

```bash
npm install
```

Run the main verification loop:

```bash
npm run check
npm test
```

Build the CLI:

```bash
npm run build
```

## Pull request guidance

When opening a PR, include:

- what changed
- why the change is needed
- affected commands, paths, or runtime targets
- test evidence
- any migration or compatibility notes

## Code of conduct

Participation in this project is governed by [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Security issues

Do not open public issues for vulnerabilities. Follow [SECURITY.md](./SECURITY.md) instead.
