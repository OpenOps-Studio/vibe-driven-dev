---
name: vibe-blueprint
description: Turn validated planning and research into a viable high-level system design with clear boundaries, core components, and measurement visibility.
category: journey
stage: blueprint
version: 0.1.0
triggers:
  - /vibe.blueprint
inputs:
  required:
    - problem_statement
    - scope
    - success_definition
    - research_summary
    - risk_register
    - assumptions_log
  optional:
    - constraints
    - preferred_stack
    - prior_decisions
outputs:
  - architecture-baseline.md
  - system-boundaries.md
  - analytics-outline.md
gates:
  before:
    - execution-reality-check
  after:
    - security-gate
    - measurement-gate
    - execution-reality-check
handoff:
  next:
    - vibe-detail
state_effect: write
authority:
  final: staff-engineering
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Vibe Blueprint

## Purpose

Turn validated planning and research into a high-level system design that is coherent, scoped appropriately, and ready for deeper technical detail.

This skill exists to define the system shape before implementation begins.

It should clarify:
- the major components of the system
- what the system is responsible for
- what is outside system responsibility
- how the core flows are expected to work
- how success and behavior can later be measured

## When to Use

Use this skill when:

- planning has been completed
- research has been completed
- the project has a trusted problem statement and scope
- major assumptions and visible risks have been surfaced
- the system is ready to move from intent into high-level design

## When Not to Use

Do not use this skill when:

- no trusted project state exists
- planning is incomplete
- research is incomplete
- the request is only to inspect status or resume context
- the system is still relying on invisible or unsupported assumptions
- the project is already in detail design or QA and no blueprint revision was explicitly requested

## Required Context

Minimum required context:

- problem statement
- scope
- success definition
- research summary
- risk register
- assumptions log

Helpful optional context:

- constraints
- preferred stack
- prior decisions
- domain-specific requirements
- delivery limits

If required context is missing, the skill must halt or surface the gap clearly.

## Assumptions Rules

This skill may use limited assumptions only when they do not fabricate system certainty or hide feasibility risk.

Allowed assumptions:
- a provisional component grouping when the system shape is already strongly implied
- a neutral baseline architecture structure
- a measurement outline that remains explicitly preliminary when full detail is not yet expected

Disallowed assumptions:
- inventing infrastructure that has not been justified
- inventing security guarantees that have not been examined
- pretending an overbuilt architecture is appropriate for an MVP or PoC
- hiding trust boundaries
- burying known risks under design polish

All meaningful design assumptions must remain visible.

## Steps

1. Read the trusted planning artifacts, research artifacts, and current project state.
2. Confirm that blueprinting is the valid current action.
3. Identify the core problem, target user, and scope boundary that the design must serve.
4. Translate the project into a high-level system shape with major components and core flows.
5. Define system boundaries clearly:
   - what the system owns
   - what external services or dependencies it relies on
   - what is intentionally excluded
6. Outline a measurement or analytics direction that connects back to success definition.
7. Keep visible any design risks, overengineering risk, or trust-boundary uncertainty.
8. Persist the blueprint artifacts.
9. Recommend `/vibe.detail` as the next valid step.

## Output Contract

### `architecture-baseline.md`
Create or update the high-level system design artifact.

Minimum required contents:
- major components
- core system flows
- important technical choices at a high level
- architecture risks or tensions
- explanation of why this design fits the current project stage

### `system-boundaries.md`
Create or update the responsibility boundary artifact.

Minimum required contents:
- internal responsibilities
- external dependencies
- excluded responsibilities
- trust or ownership boundaries

### `analytics-outline.md`
Create or update the measurement visibility artifact.

Minimum required contents:
- core signals or events to observe
- how success could be measured after implementation
- what should be visible to validate the system in reality

## Halt Conditions

This skill must halt when:

- no trusted project state exists
- planning artifacts are missing
- research artifacts are missing
- the project is attempting to skip research grounding
- the design would clearly overbuild the stated objective
- core trust boundaries remain invisible
- the runtime cannot persist blueprint artifacts safely

## Handoff Behavior

After successful completion:

- blueprint artifacts must exist
- the project should be in a valid position to enter detailed design
- major risks and assumptions must remain visible
- the next recommended command must be `/vibe.detail`
- the system should not claim execution readiness yet