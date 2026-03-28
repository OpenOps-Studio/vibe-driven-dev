# Event Architecture Policy

## Purpose

This document defines when VDD should require explicit event architecture and which artifacts become mandatory when a project shows enough async or multi-consumer complexity.

The goal is not to force a heavyweight event bus into every project.

The goal is to stop projects from discovering too late that they needed explicit event design all along.

## Core Principle

Event thinking should be mandatory before the project leaves blueprint when event relevance is high enough.

If the project does not justify it yet, the system should say so explicitly.

Silence is not acceptable.

## Why This Matters

When builders ignore events early, they usually pay for it later through:
- hidden coupling
- brittle side effects
- unclear retries
- missing idempotency rules
- observability gaps
- difficult AI generation pipelines
- painful notification and webhook expansion

## Canonical Event Artifacts

The canonical event artifacts are:

- `Event-Architecture.md`
- `Event-Catalog.md`
- `Event-Contracts.md`

### `Event-Architecture.md`

This is the required first artifact whenever event relevance reaches threshold.

It should explain:
- why events exist in the project
- where events are justified and where request-response remains enough
- chosen topology
- producer and consumer boundaries
- correlation strategy
- retry, dead-letter, and ordering expectations
- observability expectations

### `Event-Catalog.md`

This becomes required for more complex event systems.

It should list:
- event name
- producer
- consumers
- trigger
- business meaning
- idempotency note

### `Event-Contracts.md`

This becomes required when the project needs explicit durable event schemas.

It should define:
- payload schema
- required metadata
- versioning rules
- correlation ID
- causation ID guidance
- timestamps
- schema evolution notes

## Event Relevance Rule

If the project matches two or more of the following, event architecture is required before leaving blueprint:

- background jobs
- notifications
- webhooks
- audit logging
- analytics side effects
- AI generation async flows
- multiple modules consuming the same business action
- external integrations
- eventual consistency is acceptable

If it matches fewer than two, VDD should explicitly record:

`event architecture not justified yet`

## Event Complexity Rule

If the project matches four or more of the event relevance signals, the system should require:

- `Event-Architecture.md`
- `Event-Catalog.md`
- `Event-Contracts.md`

This is the threshold where the project stops being "just a few internal events" and starts needing a visible event model.

## Topology Guidance

VDD should not recommend one topology by default.

It should choose the smallest honest topology:

- `no-bus`
- `internal-app-events`
- `queue-workers`
- `pubsub-bus`
- `event-stream`

### `no-bus`

Use when async pressure is still too low to justify dedicated event infrastructure.

### `internal-app-events`

Use when the app needs explicit events, but fan-out and infrastructure complexity remain limited.

### `queue-workers`

Use when the main need is deferred processing, retries, and worker-style async execution.

### `pubsub-bus`

Use when multiple subsystems must react independently to the same business action.

### `event-stream`

Use when the project needs stronger replay, observability, or log-oriented event behavior.

## Minimum Technical Rules

Whenever event relevance crosses threshold, the system should require explicit thinking about:

- correlation IDs
- idempotency
- retry behavior
- dead-letter handling
- ordering assumptions
- consumer ownership
- observability linkage

For higher complexity systems, the system should also require:

- contract versioning
- causation IDs where event chains exist
- replay expectations

## Stage Integration

### In `vibe-blueprint`

The system should:
- check event relevance
- decide whether event architecture is justified
- create `Event-Architecture.md` when required
- otherwise record that no event architecture is justified yet

### In `vibe-detail`

The system should:
- turn the chosen event topology into a concrete event catalog
- define event contracts when complexity threshold is reached
- document retry, idempotency, correlation, and failure expectations

### In `vibe-qa`

The system should review:
- whether event assumptions are visible
- whether correlation strategy exists
- whether failure handling is documented
- whether ordering assumptions are explicit
- whether consumer idempotency is at least conceptually accounted for

## Policy Summary

VDD should not force event bus complexity by default.

It should force event clarity when the project shows enough async or multi-consumer behavior that pretending otherwise would create hidden system debt.
