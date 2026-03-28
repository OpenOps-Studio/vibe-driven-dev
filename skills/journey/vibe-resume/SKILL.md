---
name: vibe-resume
description: Resume a VDD journey from the latest trusted project state, prior handoff, and visible decisions without re-deriving context from scratch.
category: journey
stage: any
version: 0.1.0
triggers:
  - /vibe.resume
inputs:
  required:
    - project_state
  optional:
    - handoff_artifact
    - recent_decisions
    - assumptions_log
    - latest_stage_artifact
outputs:
  - resume-brief.md
  - resume-checklist.md
state_effect: read
authority:
  final: orchestrator
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Vibe Resume

## Purpose

Resume work from the latest trusted state with enough context to continue safely.

This skill exists to prevent the next session from re-litigating what was already decided or re-reading the entire repository to recover basic context.

## When to Use

Use this skill when:

- the current command is `/vibe.resume`
- the user wants to continue from a prior VDD session
- a handoff or state snapshot already exists
- the orchestrator needs a concise restart path

## When Not to Use

Do not use this skill when:

- no trusted project state exists
- there is no prior work to resume
- the task is actually status inspection, planning, research, or handoff generation
- the current session has not lost context

## Core Responsibilities

This agent is responsible for:

- finding the latest trusted state and relevant handoff material
- summarizing what was already established
- identifying what changed since the last trusted checkpoint
- surfacing blockers or stale assumptions
- recommending the first safe action to continue work

## Non-Responsibilities

This agent must not:

- pretend the latest context is newer than it is
- hide staleness
- re-open settled decisions without cause
- mutate project truth while resuming
- treat an incomplete handoff as fully trustworthy

## Tool Policy

### Allowed Tools

- read current project state
- inspect handoff and decision artifacts
- list relevant files

### Disallowed Tools

- arbitrary shell execution
- package installation
- direct network fetch
- unrelated project mutation

## Required Context

This skill should work from:

- current project state
- the most recent handoff artifact if present
- recent decision records
- assumptions log
- stage-specific artifacts relevant to the last active command

If required context is missing, the skill should state that the resume quality is limited and recommend the safest recovery path.

## Resume Rules

This skill should:

- preserve continuity with the prior trusted state
- identify what is current and what may be stale
- make the first next action explicit
- call out anything that must be re-validated before continuing

This skill should not:

- blindly trust old state
- re-run everything from scratch without cause
- hide divergence between handoff and working tree
- overstate certainty about the previous session

## Output Requirements

A valid output from this skill should make clear:

- what the last trusted context was
- what is still valid
- what may be stale
- what should be re-checked
- what the first next command should be

The output should support creation or update of:

- `resume-brief.md`
- `resume-checklist.md`

## Halt Conditions

This skill must halt when:

- there is no usable prior context to resume from
- the project state is too stale to trust without re-grounding
- a different specialist skill is required before work can continue
