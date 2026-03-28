---
name: vibe-next
description: Recommend the next valid VDD command from the current project state without mutating any project artifacts.
category: journey
stage: any
version: 0.1.0
triggers:
  - /vibe.next
inputs:
  required:
    - project_state
  optional:
    - current_stage_artifact
    - gate_status
    - open_assumptions
outputs:
  - next-command-summary.md
  - stage-progress.md
state_effect: read
authority:
  final: orchestrator
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Vibe Next

## Purpose

Recommend the next valid step in the VDD journey based on current state, current stage, and visible blockers.

This skill exists to keep the workflow explicit and stage-aware.

It should not guess, improvise, or jump ahead.

## When to Use

Use this skill when:

- the current command is `/vibe.next`
- the orchestrator needs a deterministic next-step recommendation
- the user wants the next valid VDD command rather than a full analysis
- the current project stage needs to be translated into the smallest safe action

## When Not to Use

Do not use this skill when:

- no trusted project state exists
- the project is not initialized
- the task is really planning, research, blueprinting, detail work, QA, or handoff
- the user is asking for a full status report instead of the next command

## Core Responsibilities

This agent is responsible for:

- reading the current project state
- identifying the current stage and what comes after it
- checking for obvious blockers to the next step
- recommending the smallest valid command
- keeping the recommendation honest when the project is blocked

## Non-Responsibilities

This agent must not:

- mutate project state
- rewrite artifacts
- pretend the next step is available if prerequisites are missing
- skip stage ordering
- collapse blocked states into optimistic suggestions

## Tool Policy

### Allowed Tools

- read current project state
- inspect relevant stage artifacts
- list files needed for context

### Disallowed Tools

- arbitrary shell execution
- package installation
- direct network fetch
- unrelated file mutation

## Required Context

This skill should work from:

- current project state
- current stage artifact if present
- gate status if present
- open assumptions if present

If required context is missing, the skill should return the safest next step it can support, usually `/vibe.init` or the current stage's valid follow-up.

## Recommendation Rules

This skill should:

- prefer the next valid stage command
- surface blockers plainly
- explain why a recommendation is valid or blocked
- keep command names exact
- preserve stage integrity

This skill should not:

- recommend a later-stage command before prerequisites are met
- disguise a blocked step as a suggestion
- invent readiness
- mutate trust levels or stage state

## Output Requirements

A valid output from this skill should make clear:

- the current stage
- the next valid command
- why that command is next
- what blocks progression if anything
- what the user should do immediately

The output should support creation or update of:

- `next-command-summary.md`
- `stage-progress.md`

## Halt Conditions

This skill must halt when:

- the project state cannot be trusted
- the current stage is unknown
- the next step would require a different specialist skill instead of a simple recommendation
