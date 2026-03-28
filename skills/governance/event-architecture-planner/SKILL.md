---
name: event-architecture-planner
description: Decide whether a project needs event-driven architecture, then define the smallest honest event topology and its required artifacts.
category: governance
stage: blueprint
version: 0.1.0
triggers:
  - event architecture
  - event bus
  - /vibe.events
  - async flows
inputs:
  required:
    - architecture_baseline
    - system_boundaries
  optional:
    - analytics_outline
    - technical_constraints
    - external_integrations
    - ai_async_flows
    - background_jobs
outputs:
  - Event-Architecture.md
  - Event-Catalog.md
  - Event-Contracts.md
handoff:
  next:
    - vibe-detail
authority:
  final: staff-engineering
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Event Architecture Planner

## Purpose

Determine whether the project actually needs event architecture, and if it does, produce the smallest honest event model before implementation details drift.

## Core Rule

Do not force a full event bus into every project.

Do force explicit event thinking when the project has enough async or multi-consumer pressure that silence would create hidden coupling and painful rework later.

## Required Outputs

### `Event-Architecture.md`

Required when event relevance reaches the minimum threshold.

Minimum contents:
- why events exist in this project
- chosen topology
- producer and consumer map
- delivery expectations
- failure handling expectations
- correlation strategy
- observability basics

### `Event-Catalog.md`

Required when event complexity is high enough to justify multiple named events.

Minimum contents:
- event name
- producer
- consumers
- trigger
- business meaning
- idempotency note

### `Event-Contracts.md`

Required when event complexity is high enough to justify durable contracts.

Minimum contents:
- payload schema
- metadata fields
- versioning note
- correlation ID
- causation ID guidance
- timestamp expectations

## Decision Policy

- If event relevance is below threshold, explicitly record that event architecture is not justified yet.
- If relevance reaches threshold, `Event-Architecture.md` becomes mandatory before leaving blueprint.
- If complexity is higher, also require `Event-Catalog.md` and `Event-Contracts.md` before leaving detail.

## Safety Rules

Do not:
- assume exactly-once semantics by default
- invent a distributed bus just because the project sounds modern
- ignore retries, dead-letter handling, or idempotency when async work exists

Prefer:
- the smallest viable topology
- visible failure expectations
- visible observability requirements
