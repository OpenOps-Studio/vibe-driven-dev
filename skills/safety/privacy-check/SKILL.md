---
name: privacy-check
description: "Evaluates product assumptions and plans for PII handling, user tracking, and data retention risks. Triggered during 'research' and 'blueprint' stages to enforce privacy-by-design."
stage_alignment: "blueprint"
category: "safety"
---

# Privacy Check

Ensures privacy-by-design principles are applied before any code is generated or architectural decisions are finalized.

## Responsibilities

1. **PII Handling Analysis**: Checks if the scope or product logic involves storing Personally Identifiable Information (PII).
2. **Data Retention Rules**: Verifies that retention assumptions are documented (e.g., hard deletes vs soft deletes).
3. **Third-Party Data Sharing**: Highlights any intended use of analytics or external tools that might leak user data.

## Execution Rules

- Ensure that any analytics outline includes a mention of anonymization and consent where applicable.
- Output warnings if PII is collected but not addressed securely in the architecture boundaries.

## Remediation

- Suggest privacy-preserving alternatives (e.g., hashed IDs, local-only storage if possible).
- Attach any findings as "risks" to be included in the `risk-register.md`.