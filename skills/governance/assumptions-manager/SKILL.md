---
name: assumptions-manager
description: Track, update, and surface project assumptions with explicit confidence, status, and downstream impact across the VDD journey.
category: governance
stage: cross-stage
version: 0.1.0
triggers:
  - invoked-by-agent
  - /vibe.assumptions
inputs:
  required:
    - assumptions
  optional:
    - source_artifacts
    - confidence_level
    - risk_level
    - owner
    - stage
outputs:
  - assumptions-log.md
  - assumptions-summary.md
gates:
  before: []
  after: []
state_effect: write
authority:
  final: orchestration
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Assumptions Manager

## Purpose

Track the assumptions the project is currently relying on and keep them visible as the project moves through the VDD journey.

This skill exists to prevent invisible assumptions from becoming accidental requirements.

## When to Use

Use this skill when:

- a new assumption is discovered or confirmed
- an existing assumption changes confidence or risk
- a stage transition depends on an assumption remaining visible
- an agent needs to preserve assumptions for downstream execution

## When Not to Use

Do not use this skill when:

- there are no meaningful assumptions to record
- the task is only to inspect or resume context
- the assumption has already been captured and does not need a state update

## Core Responsibilities

This skill is responsible for:

- recording assumptions clearly and concisely
- assigning a visible status to each assumption
- preserving owner, confidence, and risk when known
- surfacing assumptions that block or weaken readiness
- carrying assumptions forward across stages

## Assumption Statuses

Use clear statuses such as:

- `open`
- `accepted`
- `validated`
- `reclassified`
- `blocking`
- `retired`

## Assumption Rules

This skill should:

- keep each assumption explicit and traceable
- tie assumptions back to source context when available
- separate validated facts from provisional beliefs
- surface high-risk assumptions early
- keep unresolved assumptions visible to downstream agents

This skill should not:

- hide assumptions inside narrative prose
- convert assumptions into facts without evidence
- drop open assumptions because they are inconvenient
- over-rotate on minor details that do not affect execution

## Output Requirements

A valid output from this skill should make clear:

- what the assumption is
- why it matters
- how confident the project is in it
- whether it is open, accepted, validated, or blocking
- what downstream work depends on it

The output should support creation or update of:

- `assumptions-log.md`
- `assumptions-summary.md`

## Halt Conditions

This skill must halt when:

- the request does not involve a real assumption
- the assumption cannot be distinguished from a fact
- the update would fabricate certainty
