---
name: vibe-detail
description: Turn a validated blueprint into execution-ready technical detail, validation paths, and implementation constraints without pretending the project is already ready to ship.
category: journey
stage: detail
version: 0.1.0
triggers:
  - /vibe.detail
inputs:
  required:
    - architecture_baseline
    - system_boundaries
    - analytics_outline
    - problem_statement
    - scope
    - assumptions_log
  optional:
    - preferred_stack
    - prior_decisions
    - technical_constraints
outputs:
  - technical-detail.md
  - validation-plan.md
  - execution-notes.md
  - Event-Catalog.md
  - Event-Contracts.md
gates:
  before:
    - execution-reality-check
  after:
    - security-gate
    - execution-reality-check
handoff:
  next:
    - vibe-qa
state_effect: write
authority:
  final: staff-engineering
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Vibe Detail

## Purpose

Turn a trusted high-level blueprint into execution-ready technical detail.

This skill exists to bridge the gap between system shape and actual build preparation.

It should define:
- important technical constraints
- core flows and logic details
- what must be validated
- what implementation caveats still matter
- what remains risky before QA
- and, when relevant, the concrete event catalog and event contracts that downstream execution must honor

## When to Use

Use this skill when:

- blueprinting has been completed
- the project has trusted architecture artifacts
- the system is ready to move from high-level design into actionable implementation detail
- the next step depends on concrete technical and validation-oriented outputs

## When Not to Use

Do not use this skill when:

- no trusted project state exists
- blueprinting is incomplete
- the request is only to inspect status or resume context
- the project is still missing planning or research truth
- the system is attempting to jump directly from planning into technical detail
- the workflow is already inside QA or handoff with no explicit detail revision request

## Required Context

Minimum required context:

- architecture baseline
- system boundaries
- analytics outline
- problem statement
- scope
- assumptions log

Helpful optional context:

- preferred stack
- prior decisions
- technical constraints
- delivery limits
- runtime environment constraints

If required context is missing, this skill must halt or surface the gap clearly.

## Assumptions Rules

This skill may use limited assumptions only when they do not fabricate implementation certainty or hide technical risk.

Allowed assumptions:
- a neutral structure for technical notes
- provisional implementation constraints when clearly labeled
- a baseline validation structure that remains visibly incomplete if needed

Disallowed assumptions:
- inventing final implementation details not supported by the blueprint
- pretending stack-specific certainty where none exists
- hiding technical risk under overly polished detail
- claiming security or reliability guarantees that have not been reviewed
- silently converting a high-level idea into an implementation commitment

All meaningful technical uncertainty must remain visible.

## Steps

1. Read the trusted blueprint artifacts and current project state.
2. Confirm that detailed design is the valid current action.
3. Translate the high-level architecture into actionable technical detail.
4. Define the important flows, implementation constraints, and boundary logic that downstream execution will need.
5. If event relevance score >= 4, expand the blueprint into:
   - `Event-Catalog.md`
   - `Event-Contracts.md`
   and define retry, idempotency, correlation, and failure expectations.
6. Write a validation plan that explains what should be checked and what acceptable behavior looks like.
7. Capture important execution notes, warnings, and technical caveats.
8. Keep visible any unresolved technical risks, event assumptions, or implementation risks.
9. Persist the detail artifacts.
10. Recommend `/vibe.qa` as the next valid step.

## Output Contract

### `technical-detail.md`
Create or update the detailed technical artifact.

Minimum required contents:
- implementation constraints
- key logic or flow details
- important technical assumptions
- notable technical risks or unresolved questions

### `validation-plan.md`
Create or update the validation artifact.

Minimum required contents:
- validation steps
- what should be checked
- what acceptable behavior looks like
- what failures or regressions would matter

### `execution-notes.md`
Create or update the execution support artifact.

Minimum required contents:
- implementation guidance
- important caveats
- warnings for downstream execution
- anything that should remain visible during build work

### `Event-Catalog.md`
Create or update the event catalog artifact when event relevance score >= 4.

Minimum required contents:
- event name
- producer
- consumers
- trigger
- business meaning
- idempotency note

### `Event-Contracts.md`
Create or update the event contracts artifact when event relevance score >= 4.

Minimum required contents:
- payload schema
- metadata fields
- versioning note
- correlation ID
- causation ID guidance
- timestamp expectations

## Halt Conditions

This skill must halt when:

- no trusted project state exists
- blueprint artifacts are missing
- the project is attempting to skip blueprinting
- the design is still too vague for honest technical detail
- the project requires event catalog or event contracts but they are still missing
- the runtime cannot persist detail artifacts safely
- the system is being pushed to imply execution readiness before QA

## Handoff Behavior

After successful completion:

- detail artifacts must exist
- the project should be in a valid position to enter QA
- technical assumptions and caveats must remain visible
- the next recommended command must be `/vibe.qa`
- the system should still avoid claiming handoff readiness
