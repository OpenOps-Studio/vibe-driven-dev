---
name: vibe-scaffold
description: Convert validated planning, architecture, and technical detail into repository bootstrap artifacts that downstream execution agents can build from without hallucinating.
category: journey
stage: scaffold
version: 0.1.0
triggers:
  - /vibe.scaffold
  - invoked-by-agent
inputs:
  required:
    - architecture_baseline
    - technical_detail
    - problem_statement
    - scope
outputs:
  - PRD.md
  - Logic.md
  - Structure.md
  - Dependencies.md
  - Memory.md
  - anti-hallucination.md
  - repo.md
  - Design.md
  - Constraints.md
handoff:
  next:
    - vibe-qa
state_effect: write
authority:
  final: orchestrator
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Vibe Scaffold

## Purpose

Turn trusted design artifacts into the repository bootstrap files required for safe execution.

This stage is where the framework stops describing the build abstractly and produces the concrete files that guide implementation systems such as Spec-Kit and coding agents.

## Primary Worker

Delegate the file generation work to `bootstrap-writer`.

## Required Checks

1. Confirm the project has completed `vibe-detail`.
2. Verify the architecture and technical detail artifacts are present and internally consistent.
3. Refuse to scaffold if the project would generate contradictory bootstrap files.

## Expected Output

- A grounded PRD and repository bootstrap set.
- No placeholder content in generated artifacts.
- Clear continuity into `vibe-qa`.
