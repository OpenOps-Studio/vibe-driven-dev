# Coding Standards Pack

Local VDD pack for standards enforcement and session continuity.

## What It Contains

- `coding-standards-enforcer`: rules, references, and scripts for code quality and project standards
- `session-handoff`: tools and guidance for generating and validating handoff documents
- `references/master-rules.json`: top-level rule index used as the primary standards reference

## Intended Use

Install or reference this pack when a project needs:

- a stronger coding standards baseline
- consistent review and enforcement guidance
- a repeatable handoff workflow for long-running agent sessions

This pack is meant to be consumed by VDD through `.vdd/packs.json` and the runtime pack loader. It is intentionally local and should be treated as a project-scoped dependency.

## Usage

1. Register the pack in the target project via `.vdd/packs.json`.
2. Run `vdd scan` to confirm the pack is discovered.
3. Use the included skills from the VDD journey or agent workflows as needed.

## Notes

- The pack does not introduce new runtime behavior by itself.
- GitHub source support is not part of this pack root contract.
- Keep the pack contents aligned with the included skills and rules; do not rely on files outside this directory for its contract.
