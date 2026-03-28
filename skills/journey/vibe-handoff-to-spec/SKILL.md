---
name: vibe-handoff-to-spec
description: Prepare a project for structured downstream execution by packaging the trusted context, visible assumptions, and active decisions into a clean Spec-Kit handoff.
category: journey
stage: handoff
version: 0.1.0
triggers:
  - /vibe.handoff-to-spec
inputs:
  required:
    - qa_report
    - go_no_go
    - architecture_baseline
    - technical_detail
    - assumptions_log
    - project_state
  optional:
    - decision_records
    - analytics_outline
    - execution_notes
outputs:
  - spec-handoff.md
  - execution-entry-summary.md
  - initial-decisions.json
  - assumptions-summary.md
gates:
  before:
    - security-gate
    - measurement-gate
    - execution-reality-check
  after: []
handoff:
  next: []
state_effect: write
authority:
  final: orchestration
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Vibe Handoff to Spec

## Purpose

Prepare a trusted project for downstream structured execution by packaging the right artifacts, assumptions, and active decisions into a clean handoff.

This skill exists to close the Vibe Driven Dev pre-execution journey honestly.

It should:
- confirm that the project is genuinely handoff-ready
- collect the artifacts that matter most
- summarize active decisions
- summarize open and validated assumptions
- define the exact next execution entry
- avoid pretending the project is more complete than it really is

## When to Use

Use this skill when:

- QA has been completed
- the project has a trustworthy go decision
- the system is genuinely ready to leave Vibe Driven Dev
- the next step is structured execution through Spec-Kit or a comparable downstream flow

## When Not to Use

Do not use this skill when:

- no trusted project state exists
- the project has not passed through QA honestly
- the current result is no-go
- critical blockers remain unresolved
- the task is only to inspect status or resume context
- the system is attempting to skip readiness discipline and jump into execution theater

## Required Context

Minimum required context:

- QA report
- go or no-go artifact
- architecture baseline
- technical detail
- assumptions log
- project state

Helpful optional context:

- decision records
- analytics outline
- execution notes
- pack-specific add-on context
- downstream execution preferences

If required context is missing or inconsistent, this skill must halt or escalate.

## Assumptions Rules

This skill may use limited assumptions only when they do not distort readiness or fabricate execution confidence.

Allowed assumptions:
- a neutral handoff package structure
- a concise execution entry summary when the next step is already clear
- a grouped summary of decisions or assumptions as long as nothing important is hidden

Disallowed assumptions:
- pretending QA passed if the artifacts do not support it
- hiding blockers or warnings
- inventing downstream readiness
- silently dropping major assumptions
- implying implementation guarantees that were never reviewed

All remaining risk and uncertainty that matter to downstream execution must stay visible.

## Steps

1. Read the trusted QA, design, governance, and state artifacts.
2. Confirm that handoff is the valid current action.
3. Confirm that the project is genuinely eligible for handoff.
4. Collect the minimum trusted artifacts required by downstream execution.
5. Summarize active decisions that materially affect implementation.
6. Summarize open and validated assumptions that still matter.
7. Define the exact execution entry point for the next system.
8. Persist the handoff artifacts.
9. Mark the project as complete only if the handoff package is honest and usable.

## Output Contract

### `spec-handoff.md`
Create or update the primary handoff artifact.

Minimum required contents:
- project summary
- current objective
- trusted upstream artifacts
- major assumptions
- major decisions
- readiness framing
- exact next downstream step

### `execution-entry-summary.md`
Create or update the execution entry artifact.

Minimum required contents:
- next command or downstream entry
- immediate implementation context
- scope of the next execution phase
- important caveats that must remain visible

### `initial-decisions.json`
Create or update the active decision bundle.

Minimum required contents:
- active decision references
- short summaries of decisions that materially affect execution

### `assumptions-summary.md`
Create or update the handoff assumptions summary.

Minimum required contents:
- open assumptions
- validated assumptions
- assumptions requiring downstream caution

## Halt Conditions

This skill must halt when:

- no trusted project state exists
- QA artifacts are missing
- the project is no-go
- critical blockers remain unresolved
- the handoff package cannot be generated honestly
- the runtime cannot persist handoff artifacts safely
- the system is being pushed to imply readiness that has not been earned

## Handoff Behavior

After successful completion:

- handoff artifacts must exist
- the project may be marked completed
- the downstream execution entry should be explicit
- the system should clearly communicate that the Vibe Driven Dev pre-execution journey has ended
- no further journey command should be recommended automatically unless the handoff needs revision