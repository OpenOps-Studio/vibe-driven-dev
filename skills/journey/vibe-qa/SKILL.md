---
name: vibe-qa
description: Review the project for readiness, visible risk, measurement integrity, and execution coherence before handoff is allowed.
category: journey
stage: qa
version: 0.1.0
triggers:
  - /vibe.qa
inputs:
  required:
    - technical_detail
    - validation_plan
    - execution_notes
    - architecture_baseline
    - assumptions_log
  optional:
    - decision_records
    - analytics_outline
    - prior_gate_results
outputs:
  - qa-report.md
  - go-no-go.md
  - assumptions-log.md
gates:
  before:
    - security-gate
    - measurement-gate
    - execution-reality-check
  after:
    - security-gate
    - measurement-gate
    - execution-reality-check
handoff:
  next:
    - vibe-handoff-to-spec
state_effect: write
authority:
  final: security
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Vibe QA

## Purpose

Review the project for readiness before handoff.

This skill exists to determine whether the system has earned the right to move forward.

It should verify that:
- major risks are visible
- measurement remains credible
- execution detail is coherent enough
- unresolved assumptions are still visible
- the system is not pretending readiness it has not earned

## When to Use

Use this skill when:

- detail design has been completed
- the project has trusted blueprint and detail artifacts
- the system needs a formal readiness review
- the next decision is whether the project may move toward handoff

## When Not to Use

Do not use this skill when:

- no trusted project state exists
- detail work is incomplete
- the task is still planning, research, blueprinting, or detail design
- the request is only to inspect status or resume context
- the system is attempting to use QA as a shortcut around missing upstream artifacts

## Required Context

Minimum required context:

- technical detail
- validation plan
- execution notes
- architecture baseline
- assumptions log

Helpful optional context:

- decision records
- analytics outline
- prior gate results
- visible mitigation notes
- known tradeoffs

If required context is missing, this skill must halt or surface the gap clearly.

## Assumptions Rules

This skill may use limited assumptions only when they do not fabricate readiness or hide blocking risk.

Allowed assumptions:
- a neutral QA reporting structure
- provisional grouping of warnings and blockers
- explicit carry-forward of unresolved assumptions that remain visible

Disallowed assumptions:
- pretending a project is safe because detail exists
- hiding security uncertainty
- inventing validation coverage
- treating warnings as acceptable without visibility
- collapsing blockers into vague language
- implying handoff readiness without real support

All meaningful uncertainty and all critical blockers must remain visible.

## Steps

1. Read the trusted blueprint, detail, and governance artifacts plus the current project state.
2. Confirm that QA is the valid current action.
3. Review whether the project has enough detail to support honest downstream execution.
4. Review whether visible assumptions remain acceptable for the current stage.
5. Review whether measurement and validation remain credible.
6. Review whether execution reality still matches the declared product stage and scope.
7. Summarize what passes, what warns, and what blocks.
8. Write a clear go or no-go result.
9. Update assumptions visibility if needed.
10. Recommend `/vibe.handoff-to-spec` only if the project is genuinely ready.

## Output Contract

### `qa-report.md`
Create or update the QA review artifact.

Minimum required contents:
- what was reviewed
- what passed
- what warned
- what failed
- readiness summary
- major unresolved concerns if any

### `go-no-go.md`
Create or update the readiness decision artifact.

Minimum required contents:
- go or no-go decision
- reasons for that decision
- blockers if the answer is no-go
- next corrective action when needed

### `assumptions-log.md`
Update the assumptions record if QA surfaced unresolved or reclassified assumptions.

Minimum required contents for updates:
- newly surfaced assumption risks
- changed confidence or risk level
- whether assumptions remain open, acceptable, or blocking

## Halt Conditions

This skill must halt when:

- no trusted project state exists
- detail artifacts are missing
- the project is attempting to skip detail design
- the system cannot produce an honest QA judgment
- the runtime cannot persist QA artifacts safely
- the system is being pushed to imply readiness despite blocking uncertainty

## Handoff Behavior

After successful completion:

- QA artifacts must exist
- the project should either be clearly no-go or clearly eligible for handoff
- blockers must remain visible when present
- the next recommended command must be `/vibe.handoff-to-spec` only when readiness is genuinely supported
- the system must not silently convert warnings into readiness