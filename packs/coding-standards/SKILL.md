---
name: coding-standards
description: Local coding standards pack for VDD. Provides project quality rules, enforcement guidance, and handoff workflows through included skills.
category: pack
version: 0.1.0
triggers:
  - invoked-by-pack-loader
  - operator-pack-reference
includes:
  - coding-standards-enforcer
  - session-handoff
compatibility:
  core: "0.1.x"
---

# Coding Standards Pack

This pack groups reusable standards and operational workflows for VDD projects.

## Purpose

Use this pack when you need:

- a consistent coding standards baseline for a VDD project
- a shared rule set for review, enforcement, and project setup
- a session handoff workflow for preserving context between agents

## Included Skills

- `coding-standards-enforcer`: project standards, architectural rules, and enforcement references
- `session-handoff`: handoff creation, validation, and resume support

## Operating Contract

- Treat the pack as a local, project-scoped dependency.
- Use the included skills as reference and workflow material for VDD agents.
- Keep the pack aligned with the root configuration in `.vdd/packs.json`.
- Do not assume any runtime behavior beyond what the included skills and pack loader support.

## Good Fit

- code review and standards enforcement
- bootstrap and project setup guidance
- session handoff and resume workflows

## Not a Fit

- production code execution
- GitHub pack fetching
- implicit automation beyond the skills and loader contracts already defined in VDD
