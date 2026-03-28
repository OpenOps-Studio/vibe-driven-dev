---
name: vibe-research
description: Ground the project in evidence, visible risks, and explicit assumptions before blueprinting begins.
category: journey
stage: research
version: 0.1.0
triggers:
  - /vibe.research
inputs:
  required:
    - problem_statement
    - scope
    - success_definition
  optional:
    - constraints
    - existing_assumptions
    - known_alternatives
outputs:
  - research-summary.md
  - risk-register.md
  - assumptions-log.md
gates:
  before: []
  after:
    - execution-reality-check
handoff:
  next:
    - vibe-blueprint
state_effect: write
authority:
  final: product
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Vibe Research

## Purpose

Ground the project in visible evidence, alternatives, assumptions, and risks before high-level system design begins.

This skill exists to reduce blind confidence.

It should help the system understand:
- what is already known
- what is still uncertain
- what risks are already visible
- what assumptions require caution
- what alternative directions may exist

## When to Use

Use this skill when:

- initialization and planning have already been completed
- the project has a trusted problem statement and scope
- the system is about to move toward blueprinting
- assumptions and risks need to be surfaced before architecture choices begin

## When Not to Use

Do not use this skill when:

- no trusted project state exists
- planning has not been completed
- the request is only to inspect status or resume context
- the project is already deep in implementation and the task is unrelated to research grounding
- the workflow is attempting to skip problem framing entirely

## Required Context

Minimum required context:

- problem statement
- scope
- success definition

Helpful optional context:

- user constraints
- prior assumptions
- known alternatives
- domain context
- prior decisions
- timeline pressure

If the required context is incomplete, the skill should halt or surface assumptions explicitly instead of pretending confidence.

## Assumptions Rules

This skill may use light assumptions only when they do not fabricate evidence or hide meaningful risk.

Allowed assumptions:
- a neutral structure for summarizing findings
- provisional grouping of assumptions by theme
- a visible placeholder note when evidence is limited but uncertainty is explicit

Disallowed assumptions:
- inventing market facts
- inventing user validation
- inventing competitor behavior
- hiding contradictions
- treating opinion as evidence
- claiming certainty where only possibility exists

All meaningful uncertainty must remain visible.

## Steps

1. Read the trusted planning artifacts and current project state.
2. Confirm that research is the valid next stage.
3. Extract the key problem, scope, and success definition.
4. Surface the main assumptions the project currently relies on.
5. Identify visible risks that could affect feasibility, clarity, or delivery.
6. Note relevant alternatives, patterns, or competing directions when they are available.
7. Summarize what appears known, unknown, and risky.
8. Update the assumptions log so uncertainty remains visible across stages.
9. Persist the research artifacts.
10. Recommend `/vibe.blueprint` as the next valid step.

## Output Contract

### `research-summary.md`
Create or update the research grounding artifact.

Minimum required contents:
- key findings
- relevant context or patterns
- notable alternatives
- visible contradictions
- unresolved questions

### `risk-register.md`
Create or update the risk visibility artifact.

Minimum required contents:
- list of key risks
- short explanation of each risk
- rough severity or priority hint
- possible mitigation direction when visible

### `assumptions-log.md`
Create or update the assumptions record.

Minimum required contents:
- assumption statement
- associated stage
- confidence or risk level
- current status such as open, challenged, or validated

## Halt Conditions

This skill must halt when:

- no trusted project state exists
- the project has not completed planning
- problem statement is missing
- scope is missing
- success definition is missing
- the runtime cannot persist research artifacts safely
- the system is being asked to present unsupported certainty as evidence

## Handoff Behavior

After successful completion:

- research artifacts must exist
- assumptions and risks must remain visible
- the project should be in a valid position to begin blueprinting
- the next recommended command must be `/vibe.blueprint`
- unresolved uncertainty should remain explicit rather than buried