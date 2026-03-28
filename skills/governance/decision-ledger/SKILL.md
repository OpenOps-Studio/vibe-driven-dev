---
name: decision-ledger
description: Record, track, and surface major decisions that materially affect the project across all stages — planning, architecture, detail, QA, and handoff.
category: governance
stage: cross-stage
version: 0.1.0
triggers:
  - /vibe.log-decision
  - invoked-by-agent
inputs:
  required:
    - decision_title
    - decision_context
    - decision_made
  optional:
    - alternatives_considered
    - rationale
    - risks
    - owner
    - stage
    - reversibility
outputs:
  - decisions/DECISION-<id>.md
  - decisions/index.md
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

# Decision Ledger

## Purpose

Record, track, and surface major decisions that materially affect the project.

This skill exists to prevent decisions from disappearing into chat history, becoming invisible to downstream execution, or being silently reversed without acknowledgment.

It should ensure that:
- major decisions are written down when they are made
- decisions are retrievable by any agent or stage
- visible alternatives and rationale are preserved
- reversibility and risk are acknowledged
- downstream execution starts with full decision visibility

## When to Use

Use this skill when:

- a major technical, architectural, product, or scope decision has been made
- an agent identifies a decision that should be formally logged before continuing
- the orchestrator needs to preserve a decision for downstream reference
- QA surfaces a decision that materially affects readiness
- handoff requires a clear record of active decisions

## When Not to Use

Do not use this skill when:

- the decision is trivial and has no meaningful downstream impact
- the task is only to inspect or resume context without new decisions
- no decision has actually been made — do not log intent or speculation as a decision

## Required Context

Minimum required inputs:

- decision title: a short, unambiguous name for the decision
- decision context: why this decision was needed
- decision made: what was decided, stated clearly

Helpful optional inputs:

- alternatives considered
- rationale for the chosen direction
- known risks of this decision
- who owns or originated this decision
- which stage of the project this belongs to
- whether the decision is reversible or not

## Assumptions Rules

This skill must record decisions as they are, not as they should be.

Allowed:
- summarizing context concisely when it is clear
- grouping related decisions into a sequence
- using provisional labels when reversibility is unclear

Disallowed:
- inventing rationale that was not stated
- omitting known risks to make a decision look cleaner
- recording intent or speculation as a confirmed decision
- overwriting a prior decision without explicitly noting the revision

## Steps

1. Receive the decision inputs.
2. Assign a unique sequential ID to the decision.
3. Write the decision record as `decisions/DECISION-<id>.md`.
4. Update `decisions/index.md` to include the new decision in the decision log.
5. Confirm that the record is persisted.

## Output Contract

### `decisions/DECISION-<id>.md`

Create a new decision record file.

Required contents:
- ID
- Title
- Stage
- Date recorded
- Context: why this decision was needed
- Decision: what was decided
- Alternatives considered (if known)
- Rationale (if stated)
- Risks (if known)
- Owner (if known)
- Reversibility: reversible / costly to reverse / irreversible
- Status: active / superseded / revisited

### `decisions/index.md`

Create or update the decision index.

Required contents:
- running list of all logged decisions
- ID, title, stage, status, and one-line summary for each

## Decision Record Format

```markdown
# Decision: <Title>

**ID:** DECISION-<id>
**Stage:** <stage>
**Date:** <date>
**Status:** active

## Context

<why this decision was needed>

## Decision Made

<what was decided, stated clearly>

## Alternatives Considered

<what else was considered, if known>

## Rationale

<why this direction was chosen, if stated>

## Risks

<what risks this decision carries>

## Owner

<who originated or owns this decision>

## Reversibility

<reversible / costly to reverse / irreversible>
```

## Halt Conditions

This skill must halt when:

- the minimum required inputs are not present
- the runtime cannot persist the decision record safely
- a decision is being fabricated rather than recorded

## Cross-Stage Availability

This skill is available to all agents across all stages:

- planner may log scope decisions
- architect may log architecture decisions
- detailer may log implementation constraint decisions
- qa-guardian may log readiness or risk decisions
- handoff-manager may log final packaging decisions

All logged decisions must remain visible in the handoff package.