# Artifact Contracts

## Purpose

This document defines the canonical artifact model for Vibe Driven Dev.

Artifacts are the durable outputs of the system.

They are not optional notes.
They are the structured records that allow:
- agents to coordinate reliably
- the router to update trusted state
- gates to inspect readiness
- sessions to resume safely
- downstream execution systems to take over cleanly

In Vibe Driven Dev, progress is not measured by how much text an agent produced.
Progress is measured by whether valid artifacts now exist.

## Why Artifact Contracts Matter

Vibe Driven Dev is an agent-first orchestration framework.

That means outputs must be:
- inspectable
- reusable
- resumable
- stage-aware
- trustworthy enough to support transition logic

Without artifact contracts, the system would collapse into:
- chat transcripts
- vague summaries
- hidden assumptions
- inconsistent handoffs
- hard-to-audit agent behavior

Artifacts are what make the system operational instead of conversational.

## Core Principle

Every state-changing command must produce or update one or more artifacts.

Every artifact that affects stage progression must have:
- a clear purpose
- a minimum content contract
- a known owner stage
- a trust model
- a relationship to state

A file existing is not enough.

It must also satisfy its contract.

## What Counts as an Artifact

An artifact is any durable output that is intended to become part of the project's authoritative working state.

Examples:
- a problem statement
- a scope definition
- a research summary
- an architecture baseline
- a QA report
- a decision record
- a handoff package
- an assumptions log

Artifacts may be:
- markdown files
- JSON records
- structured indexes
- generated summaries with defined sections

## What Does Not Count as an Artifact

The following do not count as authoritative artifacts by default:
- casual chat output
- hidden chain-of-thought
- transient notes with no contract
- placeholder files with no minimum structure
- undocumented agent summaries

If it cannot be validated, it should not drive state progression.

## Design Goals

Artifact contracts must be:

### Durable
Artifacts should remain useful across sessions.

### Structured
Artifacts should have expected sections or fields.

### Minimal but sufficient
Each artifact should require only the contents needed to support its role.

### Router-readable
The router should be able to tell whether an artifact exists and whether it is credible enough to matter.

### Agent-friendly
Agents should know what they are expected to create or update.

### Handoff-ready
Artifacts should support clean downstream transfer into systems like Spec-Kit.

## Canonical Artifact Categories

V1 defines five artifact categories:

1. Planning artifacts
2. Research artifacts
3. Design artifacts
4. Governance artifacts
5. Handoff artifacts

## 1. Planning Artifacts

Planning artifacts define what the project is trying to solve and where the boundaries are.

### Canonical Planning Artifacts
- `problem-statement.md`
- `scope.md`
- `success-definition.md`

### Purpose
These artifacts turn vague intent into a project worth evaluating.

### Stage Owner
- `plan`

## 2. Research Artifacts

Research artifacts ground the project in visible assumptions, evidence, and risks.

### Canonical Research Artifacts
- `research-summary.md`
- `risk-register.md`
- `assumptions-log.md`

### Purpose
These artifacts reduce blind confidence and make contradictions visible.

### Stage Owner
- `research`

## 3. Design Artifacts

Design artifacts define the system shape and execution-ready details.

### Canonical Design Artifacts
- `architecture-baseline.md`
- `system-boundaries.md`
- `analytics-outline.md`
- `Event-Architecture.md`
- `Event-Catalog.md`
- `Event-Contracts.md`
- `technical-detail.md`
- `validation-plan.md`
- `execution-notes.md`

### Purpose
These artifacts make the proposed solution buildable enough to review and hand off.

### Stage Owners
- `blueprint`
- `detail`

## 4. Governance Artifacts

Governance artifacts preserve project truth across decisions, uncertainty, and review.

### Canonical Governance Artifacts
- `decision-records/DEC-xxxx.json`
- `qa-report.md`
- `go-no-go.md`
- `project-state.json`

### Purpose
These artifacts make the system traceable, auditable, and resumable.

### Stage Owners
- `qa`
- `cross-stage`

## 5. Handoff Artifacts

Handoff artifacts prepare the project to leave Vibe Driven Dev and enter downstream execution.

### Canonical Handoff Artifacts
- `spec-handoff.md`
- `execution-entry-summary.md`
- `initial-decisions.json`
- `assumptions-summary.md`

### Purpose
These artifacts define the execution-ready boundary and what the next system needs to know.

### Stage Owner
- `handoff`

## Canonical Artifact Registry

```json
{
  "problem-statement.md": {
    "category": "planning",
    "stage_owner": "plan",
    "required_for_stage_exit": true
  },
  "research-summary.md": {
    "category": "research",
    "stage_owner": "research",
    "required_for_stage_exit": true
  },
  "architecture-baseline.md": {
    "category": "design",
    "stage_owner": "blueprint",
    "required_for_stage_exit": true
  },
  "qa-report.md": {
    "category": "governance",
    "stage_owner": "qa",
    "required_for_stage_exit": true
  },
  "spec-handoff.md": {
    "category": "handoff",
    "stage_owner": "handoff",
    "required_for_stage_exit": true
  }
}
```

## Artifact Trust Model

V1 distinguishes between three trust levels:

### 1. Present
The artifact file exists. This is the lowest level. Presence alone does not make the artifact usable.

### 2. Complete
The artifact satisfies its minimum structural contract. Required sections exist, required fields exist, and the content is not obviously empty.

### 3. Trusted
The artifact is complete enough and coherent enough to support router decisions or stage progression. Trusted does not mean perfect. It means sufficient for the current stage.

## Artifact Lifecycle

An artifact may go through four lifecycle states:

1. **missing** — No artifact exists.
2. **draft** — Exists but does not yet satisfy the minimum contract.
3. **complete** — Satisfies the minimum contract.
4. **trusted** — Complete and accepted for state progression.

## Canonical Artifact Contracts

### 1. `problem-statement.md`
- **Stage Owner**: `plan`
- **Required for Stage Exit**: Yes
- **Minimum Contents**: problem summary, target user, why it matters, success framing, non-goal note.

### 2. `scope.md`
- **Stage Owner**: `plan`
- **Required for Stage Exit**: Yes
- **Minimum Contents**: in-scope items, out-of-scope items, major constraints, scope risks.

### 3. `success-definition.md`
- **Stage Owner**: `plan`
- **Required for Stage Exit**: Yes
- **Minimum Contents**: success statement, measurable signal or outcome, failure indicator or kill criteria.

### 4. `research-summary.md`
- **Stage Owner**: `research`
- **Required for Stage Exit**: Yes
- **Minimum Contents**: key findings, notable alternatives, visible contradictions, evidence-backed observations, unresolved questions.

### 5. `risk-register.md`
- **Stage Owner**: `research`
- **Required for Stage Exit**: Yes
- **Minimum Contents**: list of key risks, severity hint, mitigation direction if known.

### 6. `assumptions-log.md`
- **Stage Owner**: `cross-stage`
- **Required for Stage Exit**: Yes during research and before handoff review.
- **Minimum Contents**: assumption statement, stage, confidence level, validation status.

### 7. `architecture-baseline.md`
- **Stage Owner**: `blueprint`
- **Required for Stage Exit**: Yes
- **Minimum Contents**: major components, system boundaries, core flows, major technical choices, architecture risks.

### 8. `system-boundaries.md`
- **Stage Owner**: `blueprint`
- **Required for Stage Exit**: Recommended
- **Minimum Contents**: internal responsibilities, external dependencies, excluded responsibilities, trust boundaries.

### 9. `analytics-outline.md`
- **Stage Owner**: `blueprint`
- **Required for Stage Exit**: Required before handoff readiness.
- **Minimum Contents**: core signals or events, success measurement path, what should be observed post-build.

### 10. `technical-detail.md`
- **Stage Owner**: `detail`
- **Required for Stage Exit**: Yes
- **Minimum Contents**: implementation constraints, important technical assumptions, major flows, unresolved detail risks.

### 11. `Event-Architecture.md`
- **Stage Owner**: `blueprint`
- **Required for Stage Exit**: Required when event relevance score >= 2.
- **Minimum Contents**: why events exist, chosen topology, producer-consumer map, delivery expectations, failure handling expectations, correlation strategy, observability basics.

### 12. `Event-Catalog.md`
- **Stage Owner**: `detail`
- **Required for Stage Exit**: Required when event relevance score >= 4.
- **Minimum Contents**: event name, producer, consumers, trigger, business meaning, idempotency note.

### 13. `Event-Contracts.md`
- **Stage Owner**: `detail`
- **Required for Stage Exit**: Required when event relevance score >= 4.
- **Minimum Contents**: payload schema, metadata fields, versioning note, correlation ID, causation ID guidance, timestamp expectations.

### 14. `validation-plan.md`
- **Stage Owner**: `detail`
- **Required for Stage Exit**: Yes
- **Minimum Contents**: validation steps, what will be tested, what counts as acceptable behavior.

### 15. `execution-notes.md`
- **Stage Owner**: `detail`
- **Required for Stage Exit**: Recommended
- **Minimum Contents**: execution guidance, important warnings, implementation caveats.

### 16. `qa-report.md`
- **Stage Owner**: `qa`
- **Required for Stage Exit**: Yes
- **Minimum Contents**: what was reviewed, what passed, what warned, what failed, readiness summary.

### 17. `go-no-go.md`
- **Stage Owner**: `qa`
- **Required for Stage Exit**: Yes
- **Minimum Contents**: go or no-go decision, reasons, blockers if no-go, next corrective action.

### 18. `decision-records/DEC-xxxx.json`
- **Stage Owner**: `cross-stage`
- **Required for Stage Exit**: Conditionally required.
- **Minimum Contents**: decision id, stage, owner, topic, context, assumptions, options considered, final choice, rationale, risks accepted, revisit conditions, status.

### 19. `project-state.json`
- **Stage Owner**: `cross-stage`
- **Required for Stage Exit**: Always required for stateful continuation.
- **Minimum Contents**: project id, current stage, status, artifact inventory, assumption references, decision references, gate status, handoff readiness.

### 20. `spec-handoff.md`
- **Stage Owner**: `handoff`
- **Required for Stage Exit**: Yes
- **Minimum Contents**: project summary, current objective, relevant artifacts, major assumptions, major decisions, exact next execution entry.

### 21. `execution-entry-summary.md`
- **Stage Owner**: `handoff`
- **Required for Stage Exit**: Yes
- **Minimum Contents**: immediate next command or workflow entry, execution context, scope of next phase.

### 22. `initial-decisions.json`
- **Stage Owner**: `handoff`
- **Required for Stage Exit**: Recommended
- **Minimum Contents**: active decision references, summaries of decisions that affect execution.

### 23. `assumptions-summary.md`
- **Stage Owner**: `handoff`
- **Required for Stage Exit**: Recommended
- **Minimum Contents**: open assumptions, validated assumptions, assumptions requiring ongoing caution.

## Artifact Ownership Rules

- **Stage-owned**: Belongs primarily to one stage (e.g., `architecture-baseline.md` → `blueprint`).
- **Cross-stage**: May be updated across multiple stages (e.g., `assumptions-log.md`, `project-state.json`).

## Artifact Mutation Rules

A command or agent must not rewrite an artifact arbitrarily. If updated, the update should preserve core identity, remain aligned with stage owner, and not erase prior meaning silently. For critical governance artifacts, append or revise explicitly rather than overwrite.

## Artifact Directory Model

```txt
templates/
└── artifacts/
    ├── problem-statement.md
    ├── scope.md
    ├── success-definition.md
    ├── research-summary.md
    ├── risk-register.md
    ├── assumptions-log.md
    ├── architecture-baseline.md
    ├── system-boundaries.md
    ├── analytics-outline.md
    ├── Event-Architecture.md
    ├── Event-Catalog.md
    ├── Event-Contracts.md
    ├── technical-detail.md
    ├── validation-plan.md
    ├── execution-notes.md
    ├── qa-report.md
    ├── go-no-go.md
    ├── decision-record.json
    ├── project-state.json
    ├── spec-handoff.md
    ├── execution-entry-summary.md
    ├── initial-decisions.json
    └── assumptions-summary.md
```

## Artifact Interaction with Router

The router should use artifacts to:
- reconstruct state when possible
- validate stage readiness
- determine whether transitions are allowed
- decide whether handoff is honest
- surface missing or weak outputs

The router must not treat all artifacts as automatically trusted.

## Artifact Interaction with Agents

A valid agent output should always make clear:
- which artifacts were affected
- whether each artifact is draft, complete, or trusted
- which blockers remain before trust is justified

## Artifact Interaction with Packs

Packs may introduce new optional artifacts or richer versions of existing ones. Packs must not remove required core artifacts, change the meaning of canonical artifacts silently, or redefine handoff truth without explicit compatibility rules.

## Contribution Rule

Contributors adding a new artifact must define:
- why the artifact exists
- which stage owns it
- whether it is required for stage exit
- minimum required contents
- whether it belongs in core or a pack
- how the router should interpret it

## V1 Boundary

V1 artifact contracts should remain focused on planning truth, research visibility, blueprint coherence, detail readiness, QA evidence, handoff clarity, state continuity, and decision traceability. No live dashboards, remote databases, or autonomous versioning services in V1.
