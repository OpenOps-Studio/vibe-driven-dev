---
name: security-gate
description: "Evaluates project artifacts and state for security risks. Triggered explicitly before the 'scaffold' and 'qa' stages to ensure no hardcoded secrets, unsafe dependency assumptions, or major architectural security flaws pass into execution."
stage_alignment: "qa"
category: "safety"
---

# Security Gate

This skill acts as a hard checkpoint in the VDD journey to prevent obvious security vulnerabilities from reaching execution.

## Responsibilities

1. **Secret Detection (Static)**: Scans generated artifacts (like memory, PRD, execution notes) to ensure no placeholder API keys, passwords, or tokens are left hardcoded.
2. **Dependency Risk Check**: Reviews proposed dependencies for known unsafe patterns (e.g., outdated crypto libraries, unverified packages).
3. **Architecture Review**: Ensures that any system boundaries defined in `blueprint` explicitly include auth, authorization, and data-in-transit encryption strategies.

## Execution Rules

- **Halt on secrets**: If any raw secret is found, the system MUST halt and issue a `failed` gate status.
- **Enforce environment variables**: Ensure all secrets are documented as requiring `.env` or secure vault injection.
- **Output**: Writes the security evaluation to the state manager through `setGate("security", "passed" | "failed" | "warning")`.

## Interaction with Router

- If this gate returns `failed`, the orchestration agent must block the transition to the next stage.
- The gate should output the list of blockers required to resolve the failure.