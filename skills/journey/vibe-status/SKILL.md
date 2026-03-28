---
name: vibe-status
description: Summarize the current journey stage, active gates, handoff readiness, and next recommended command without mutating project state.
category: journey
stage: any
version: 0.1.0
triggers:
  - /vibe.status
inputs:
  required:
    - project_state
outputs:
  - current-stage-summary
  - gate-summary
  - next-recommended-command
state_effect: read
authority:
  final: orchestrator
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Vibe Status

## Purpose

Provide a deterministic read-only summary of where the project is in the VDD journey.

## Output Rules

1. Report the current stage and status exactly as stored.
2. Surface gate values and handoff readiness clearly.
3. Recommend the smallest valid next step from the current state.
4. Never modify artifacts, decisions, assumptions, or stage state.
