# Security Policy

## Supported versions

Security fixes are currently applied to the latest published version of Vibe Driven Dev.

## Reporting a vulnerability

Please do not open a public GitHub issue for security vulnerabilities.

Instead, report the issue privately to the project maintainer with:

- a clear description of the problem
- affected files or commands
- reproduction steps
- impact assessment if known

If a fix is confirmed, the preferred path is:

1. validate the report privately
2. prepare the smallest safe fix
3. add tests or guards where possible
4. publish the fix and disclosure notes once users can update safely

## Security principles

Vibe Driven Dev is designed around:

- minimal writes outside the intended project scope
- explicit trust tiers for imported sources
- validation before promotion of external packs
- deterministic handoff artifacts over hidden side effects
