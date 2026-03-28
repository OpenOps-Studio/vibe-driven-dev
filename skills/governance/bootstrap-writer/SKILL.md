---
name: bootstrap-writer
description: Generate the essential project setup files (PRD, Logic, Structure, etc.) that move a project from design completion to a structured repository foundation ready for execution.
category: governance
stage: scaffold
version: 0.1.0
triggers:
  - invoked-by-agent
  - /vibe.scaffold
inputs:
  required:
    - problem_statement
    - scope
    - architecture_baseline
    - technical_detail
  optional:
    - stack_decision
    - ai_provider_decision
    - memory_baseline
    - anti_hallucination_rules
    - repo_conventions
    - design_tokens
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
  final: staff-engineering
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Bootstrap Writer

## Purpose

Generate the essential project setup files that move a project from design completion into a structured repository foundation.

This skill is the primary worker for the **Intelligence Layer's Bootstrap capability**. It transforms validated project intent and architecture into the grounding documents that AI coding agents (like Spec-Kit or Claude Code) need to begin building without hallucinating or reinventing the wheel.

## When to Use

Use this skill when:
- The `vibe-detail` stage is complete.
- The project is ready to be "scaffolded" into its repository structure.
- You need to generate the formal PRD, Logic, and Memory artifacts before entering the QA and Handoff stages.

## When Not to Use

Do not use this skill when:
- High-level planning or architecture is still in flux.
- Technical details have not been validated.
- The project does not yet have a trusted `architecture-baseline`.

## Required Context

Minimum requirements:
- **Problem Statement**: The clear framing of what is being built.
- **Scope**: The boundaries of what is included and excluded.
- **Architecture Baseline**: The high-level system design.
- **Technical Detail**: The execution-ready technical constraints.

## Steps

1. **Verify Integrity**: Confirm all required design artifacts (`architecture-baseline.md`, `technical-detail.md`, etc.) are present and trusted.
2. **Draft PRD**: Extract the product goals, target users, and functional requirements into `PRD.md`.
3. **Logic Extract**: Capture the core business logic and state transitions from the technical detail into `Logic.md`.
4. **Structure Mapping**: Define the conceptual file and folder structure in `Structure.md`.
5. **Dependency Listing**: List all selected technologies, versions, and rationale in `Dependencies.md`.
6. **Memory Baseline**: Summarize the project's persistent context and key decisions in `Memory.md`.
7. **Grounding Guardrails**: Define the explicit "don't-fabricate" rules in `anti-hallucination.md`.
8. **Repo Conventions**: Document branching, naming, and contribution rules in `repo.md`.
9. **Final Assembly**: Ensure all generated files are consistent with each other and the upstream design.

## Output Contract

Consistent with the **Intelligence Layer** specification:
- `PRD.md`: Goals, non-goals, user profiles.
- `Logic.md`: Business rules, invariants, state flow.
- `Structure.md`: Conceptual repo mapping.
- `Dependencies.md`: Verifiable tech stack list.
- `Memory.md`: Cross-session agent grounding.
- `anti-hallucination.md`: Reliability rules.
- `repo.md`: Contribution and repo identity.
- `Design.md`: Visual and UX system baseline.
- `Constraints.md`: Hard project boundaries.

## Halt Conditions

- Any required upstream artifact is missing or untrusted.
- The generated files would contain conflicting information.
- The target repository environment is not resolved.
