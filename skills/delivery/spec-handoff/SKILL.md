---
name: spec-handoff
description: Package the trusted VDD project state into a downstream execution handoff that a Spec-Kit style implementation flow can consume safely.
category: delivery
stage: handoff
version: 0.1.0
triggers:
  - /vibe.handoff-to-spec
  - invoked-by-agent
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

# Spec Handoff

## Purpose

Package the trusted VDD project state into a clean downstream execution handoff.

This skill exists to close the pre-execution journey honestly and hand the next system the right artifacts, assumptions, and decisions.

## When to Use

Use this skill when:

- QA has completed honestly
- the project has a trustworthy go decision
- the next step is structured execution through Spec-Kit or an equivalent downstream flow
- the orchestrator needs a final packaging pass for implementation entry

## When Not to Use

Do not use this skill when:

- no trusted project state exists
- the project has not passed through QA honestly
- the current result is no-go
- critical blockers remain unresolved
- the task is still planning, research, blueprinting, detail design, or QA review

## Core Responsibilities

This skill is responsible for:

- collecting the minimum trusted artifacts required for downstream execution
- summarizing the project objective and current state
- preserving active decisions that affect implementation
- preserving visible assumptions that remain relevant
- producing a clean execution entry summary
- keeping the handoff honest about residual risk

## Non-Responsibilities

This skill must not:

- pretend QA passed if the artifacts do not support it
- hide blockers or warnings
- invent downstream readiness
- silently drop major assumptions
- imply implementation guarantees that have not been reviewed

## Output Requirements

A valid output from this skill should make clear:

- the project summary
- the current objective
- the trusted upstream artifacts
- the major assumptions
- the major decisions
- the readiness framing
- the exact next downstream step

The output should support creation or update of:

- `spec-handoff.md`
- `execution-entry-summary.md`
- `initial-decisions.json`
- `assumptions-summary.md`

## Halt Conditions

This skill must halt when:

- required QA or go/no-go context is missing
- the project is not genuinely ready for handoff
- the upstream artifacts conflict
- the downstream execution entry cannot be stated honestly
