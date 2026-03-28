---
name: handoff-writer
description: Write the concrete downstream handoff artifacts for a VDD project once QA and readiness checks have passed.
category: delivery
stage: handoff
version: 0.1.0
triggers:
  - invoked-by-agent
inputs:
  required:
    - project_state
    - qa_report
    - go_no_go
    - architecture_baseline
    - technical_detail
    - assumptions_log
  optional:
    - decision_records
    - analytics_outline
    - execution_notes
outputs:
  - spec-handoff.md
  - execution-entry-summary.md
  - assumptions-summary.md
  - initial-decisions.json
state_effect: write
authority:
  final: orchestration
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Handoff Writer

## Purpose

Write the concrete handoff artifacts that carry a trusted VDD project into downstream execution.

This skill is the low-level writing worker for handoff packaging.
It should transform validated context into durable, readable artifacts without re-deciding the project.

## When to Use

Use this skill when:

- the project has completed QA
- a go decision exists
- the next step is downstream implementation
- the orchestrator or handoff manager needs the actual file contents written

## When Not to Use

Do not use this skill when:

- the project is not ready for handoff
- the request is still planning, research, blueprinting, or detail work
- the task is only to inspect status or resume context
- the input artifacts are inconsistent

## Core Responsibilities

This skill is responsible for:

- writing the downstream handoff documents
- preserving the project summary and implementation entry point
- carrying forward active decisions
- carrying forward unresolved assumptions
- keeping the handoff readable and execution-oriented

## Non-Responsibilities

This skill must not:

- alter project decisions while writing them out
- invent missing readiness
- hide blockers or uncertainty
- overwrite trusted context with optimistic prose
- bypass QA requirements

## Writing Rules

This skill should:

- keep the handoff concise but complete
- preserve the important implementation context
- make the next command or next system entry obvious
- separate facts, decisions, and assumptions

This skill should not:

- write marketing copy
- pad the handoff with unnecessary narrative
- duplicate upstream artifacts verbatim
- weaken the handoff by hiding edge cases

## Output Requirements

A valid output from this skill should make clear:

- what is being handed off
- what remains important
- what the next execution system must know
- what assumptions or decisions still matter

The output should support creation or update of:

- `spec-handoff.md`
- `execution-entry-summary.md`
- `assumptions-summary.md`
- `initial-decisions.json`

## Halt Conditions

This skill must halt when:

- required handoff context is missing
- QA has not passed honestly
- the project is not ready to leave VDD
- the input artifacts conflict
