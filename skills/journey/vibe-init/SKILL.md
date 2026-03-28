---
name: vibe-init
description: Initialize a new Vibe Driven Dev journey by establishing the minimum required execution context.
category: journey
stage: init
version: 0.1.0
triggers:
  - /vibe.init
inputs:
  required:
    - target_platform_or_environment
    - intended_user_or_audience
    - success_definition
  optional:
    - project_id
    - constraints
    - preferred_stack
outputs:
  - project-state.json
  - assumptions-log.md
gates:
  before: []
  after: []
handoff:
  next:
    - vibe-plan
state_effect: write
authority:
  final: orchestration
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Vibe Init

## Purpose

Initialize a new Vibe Driven Dev project journey with the minimum required context.

This skill exists to establish a valid starting state before the system enters planning.

It should create the initial project state, capture the minimum execution context, and make the next step explicit.

## When to Use

Use this skill when:

- a new Vibe Driven Dev workflow is being started
- no trusted project state exists yet
- the user wants to begin a structured journey from idea to execution readiness
- the system needs to initialize project-local orchestration state

## When Not to Use

Do not use this skill when:

- a trusted project state already exists and the user intends to continue from it
- the user is resuming an interrupted workflow
- the request is only to inspect status or read existing state
- the system is already inside an active stage and no reset was explicitly requested

## Required Context

Minimum required context:

- target platform or environment
- intended user or audience
- success definition

Optional context may include:

- project identifier
- stated constraints
- preferred stack
- early non-goals

If the minimum context is missing, the skill must halt or request clarification through the orchestration layer.

## Assumptions Rules

This skill may proceed with limited assumptions only when they do not create hidden safety, privacy, or feasibility risk.

Allowed assumptions:
- a default local project id when none is supplied
- a neutral empty assumptions log
- a default handoff target of Spec-Kit

Disallowed assumptions:
- inventing the target platform
- inventing the intended user
- inventing success criteria
- pretending an existing state is recoverable when it is missing or untrusted

All non-trivial assumptions must be visible.

## Steps

1. Check whether a trusted project state already exists.
2. If a trusted state exists, do not overwrite it silently.
3. Confirm or capture the minimum required execution context:
   - target platform or environment
   - intended user or audience
   - success definition
4. Create the initial project state object.
5. Initialize empty or baseline cross-stage records as needed.
6. Mark the project as being in the `init` stage with `active` status.
7. Check for the presence of the `coding-standards` pack via `vdd packs`.
8. If the `coding-standards` pack is missing, provide a recommendation to the user to add it via `vdd add <path-to-coding-standards-skill>`.
9. Persist the new state to the project-local state location.
10. Make the next valid step explicit by recommending `/vibe.plan`.

## Output Contract

### `project-state.json`
Create or initialize the authoritative state file.

Minimum required contents:
- project id
- current stage = `init`
- current status = `active`
- target platform if provided
- intended user if provided
- success definition if provided
- empty assumptions list
- empty decisions list
- empty artifacts list
- gate statuses initialized to `pending`
- handoff target set to `spec-kit`
- handoff readiness set to `false`

### `assumptions-log.md`
Create or initialize the assumptions log if the runtime model chooses to materialize it during init.

Minimum required contents:
- heading or title
- explicit note that no major assumptions have yet been validated
- room for later cross-stage updates

## Halt Conditions

This skill must halt when:

- no usable target platform or environment is available
- no intended user or audience is available
- no success definition is available
- an existing trusted state would be overwritten silently
- the runtime cannot persist state safely
- the project root cannot be resolved

## Handoff Behavior

After successful completion:

- the authoritative state must exist
- the project remains in the `init` stage with `active` status
- the next recommended command must be `/vibe.plan`
- the system should clearly communicate that initialization is complete and planning is now the correct next step