---
name: vibe-plan
description: Turn vague product intent into a clear planning artifact with problem framing, scope boundaries, and measurable success criteria.
category: journey
stage: plan
version: 0.1.0
triggers:
  - /vibe.plan
inputs:
  required:
    - target_user
    - problem_context
    - success_definition
  optional:
    - project_id
    - constraints
    - non_goals
    - preferred_stack
    - project_type
    - is_ai_powered
    - platform_target
outputs:
  - problem-statement.md
  - scope.md
  - success-definition.md
gates:
  before: []
  after:
    - measurement-gate
    - execution-reality-check
handoff:
  next:
    - vibe-research
state_effect: write
authority:
  final: product
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Vibe Plan

## Purpose

Turn vague intent into a clear project framing that the rest of the Vibe Driven Dev journey can build on.

This skill defines:
- the actual problem worth solving
- who the project is for
- what is in scope
- what is out of scope
- what success means
- what would make the effort not worth continuing

## When to Use

Use this skill when:

- the project has been initialized successfully
- the user has an idea, direction, or product ambition but it is still fuzzy
- the system needs to turn freeform intent into structured planning truth
- the next step depends on a reliable problem statement and scope boundary

## When Not to Use

Do not use this skill when:

- no valid project state exists yet
- the workflow is still in an uninitialized state
- the task is only to inspect status or resume context
- the project already has a trusted planning artifact and the user is not intentionally revisiting planning
- the request is purely implementation-focused with no problem framing at all

## Required Context

Minimum required context:

- target user
- problem context
- success definition

Helpful optional context:

- constraints
- early non-goals
- preferred stack
- business context
- timeline sensitivity

If the required context is weak, the skill should either surface assumptions explicitly or halt through the orchestration layer.

## Assumptions Rules

This skill may make limited assumptions only when they do not distort core scope or project truth.

Allowed assumptions:
- a temporary planning boundary when the user has implied one clearly
- a neutral default format for scope sections
- a provisional success phrasing if the user intent is clear but slightly under-specified

Disallowed assumptions:
- inventing the core problem
- inventing the target user
- pretending feature requests equal problem framing
- inventing measurable success where none exists
- hiding major scope uncertainty

Any meaningful assumption must be visible.

## Steps

1. Read the current project state and confirm planning is the valid current action.
2. Extract the intended user and the problem context from available input.
3. Separate the actual problem from feature ideas or implementation wishes.
4. Write a problem statement that is specific enough to test.
5. Define scope boundaries:
   - what is in scope
   - what is out of scope
   - what constraints matter now
6. Capturing project type, platform target, and AI-powered flag for the advisor system.
7. Write a success definition that can later support measurement.
8. Surface non-goals or kill criteria if visible.
9. Persist the planning artifacts.
10. Recommend `/vibe.research` as the next valid step.

## Output Contract

### `problem-statement.md`
Create or update a planning artifact that defines the real problem.

Minimum required contents:
- problem summary
- target user
- why this problem matters
- current context of use
- success framing at a high level

### `scope.md`
Create or update the scope boundary artifact.

Minimum required contents:
- in-scope items
- out-of-scope items
- major constraints
- known scope tensions or risks

### `success-definition.md`
Create or update the project success definition.

Minimum required contents:
- success statement
- measurable signal or outcome
- failure indicator or kill criteria

## Halt Conditions

This skill must halt when:

- no trusted project state exists
- the project has not been initialized
- target user is missing
- problem context is missing
- success definition is missing
- the request is only a feature list with no discernible problem logic
- the runtime cannot persist planning artifacts safely

## Handoff Behavior

After successful completion:

- the project should remain active
- planning artifacts must exist
- the planning stage should be considered complete enough for research
- the next recommended command must be `/vibe.research`
- any major open uncertainty should remain visible through assumptions or warnings