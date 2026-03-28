---
name: spec-quality-checker
description: Assess whether a project idea is clear enough to support safe planning and execution, then point the user to the next best workflow step.
category: governance
stage: any
version: 0.1.0
triggers:
  - /vibe.spec-quality
  - spec review
  - clarity check
inputs:
  required: []
  optional:
    - problem
    - target-user
    - success-definition
    - constraints
    - existing_project_state
    - project_root
outputs:
  - spec-quality-score
  - blockers
  - warnings
  - recommended-questions
  - next-step-recommendation
handoff:
  next:
    - vibe-init
    - vibe-plan
authority:
  final: orchestrator
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Spec Quality Checker

## Purpose

Turn vague project intent into an explicit quality signal before deeper execution continues.

This skill exists to stop polished garbage from moving forward simply because the output looks professional.

## What It Checks

The checker should score whether the project is clear enough across five dimensions:

1. Problem framing
2. Target user clarity
3. Success definition
4. Constraints and assumptions
5. Execution readiness

## Core Rule

If the idea is still unclear, the system should not pretend that deeper implementation is trustworthy.

It should:
- say what is missing
- ask only the next most useful questions
- recommend the next workflow step
- keep the language simple

## Output Contract

The result should always include:
- a score
- a clarity level
- blockers
- warnings
- strengths
- recommended questions
- the next best workflow action

## Decision Policy

### Blocked

Use when the project still lacks the basics:
- no clear problem
- no clear user
- no clear success definition

In this state, the system should route back to onboarding or planning.

### Weak

Use when some signal exists, but the project can still drift badly.

Planning may continue, but implementation should remain gated.

### Usable

Use when the system has enough clarity to proceed, with explicit warnings where needed.

### Strong

Use when the project has enough grounded intent to support specialist execution with low ambiguity.

## Safety Rules

Do not:
- invent confidence
- promote a draft idea to trusted execution truth
- ask a long questionnaire
- force technical choices too early

Prefer:
- a short score-backed diagnosis
- a short list of missing signals
- the smallest useful next step
