# State Machine

## Purpose

This document defines the canonical state machine for Vibe Driven Dev.

The state machine is the formal model that controls:
- where a project currently is
- what stage transitions are valid
- what conditions allow progress
- what conditions require halt
- what conditions mark the project as ready for handoff

The router uses this state machine as the source of truth for transition behavior.

Without a stable state model, commands would become ambiguous and the system would eventually drift into inconsistency.

## Why a State Machine Exists

Vibe Driven Dev is not a loose prompt workflow.

It is a guarded operating model.

That means the system must always know:
- the current stage
- what has already been completed
- what is still unresolved
- what blocks forward movement
- whether the project is ready for downstream execution

The state machine exists to make this explicit.

## Design Goals

The state machine must be:

### Predictable
The same project state should always produce the same transition outcome.

### Explicit
The system should never hide what stage a project is in.

### Recoverable
Interrupted work should be resumable from trusted state and artifacts.

### Guarded
Progress should depend on readiness, not momentum alone.

### Stable
The core state model must remain small and durable even as packs and skills grow.

## Core Journey States

V1 defines the following canonical stages:

1. `init`
2. `plan`
3. `research`
4. `blueprint`
5. `detail`
6. `qa`
7. `handoff`

These are ordered states. They define the standard pre-execution journey.

## Supporting Operational States

In addition to the main journey stages, the system must support the following operational states:

- `idle`
- `active`
- `halted`
- `failed`
- `handoff-ready`
- `completed`

These are status states, not journey stages.

A project always has:
- one current journey stage
- one current operational status

## Distinguishing Stage vs Status

### Stage
Represents where the project is in the structured journey.
- Examples: `plan`, `research`, `qa`

### Status
Represents the operational condition of the project at that stage.
- Examples: `active`, `halted`, `handoff-ready`

This distinction is required because a project may be:
- in the `qa` stage
- but currently `halted`

or:
- in the `handoff` stage
- and already `completed`

## Canonical State Shape

The state machine assumes a canonical state object.

Example:

```json
{
  "project_id": "proj_001",
  "stage": "research",
  "status": "active",
  "platform": "nextjs",
  "target_user": "founders building early SaaS products",
  "success_definition": "working MVP with clear first-user success criteria",
  "artifacts": [
    "problem-statement.md",
    "scope.md"
  ],
  "assumptions": [],
  "decisions": [],
  "gates": {
    "security": "pending",
    "measurement": "pending",
    "reality_check": "pending"
  },
  "handoff": {
    "target": "spec-kit",
    "ready": false
  }
}
```

## Initial State

A project starts in this condition:
- **stage**: `init`
- **status**: `active`

This initial state is created only by `/vibe.init`. No other command may create an authoritative new journey state.

## Main Stage Definitions

### 1. init
- **Meaning**: The project context is being initialized.
- **Required Minimum Inputs**: target platform/environment, intended user/audience, success definition.
- **Exit Condition**: Enough context to begin meaningful planning.
- **Common Failure Reasons**: missing platform, user, or success definition.
- **Valid Next Stage**: `plan`

### 2. plan
- **Meaning**: The project is being framed as a problem worth solving.
- **Required Artifacts**: problem statement, scope boundaries, success definition, non-goals.
- **Exit Condition**: Problem specific enough to guide research or design.
- **Common Failure Reasons**: vague framing, feature list without problem logic, unmeasurable success.
- **Valid Next Stage**: `research`

### 3. research
- **Meaning**: The project is being grounded in evidence, alternatives, and visible risks.
- **Required Artifacts**: research summary, assumptions log, risk register.
- **Exit Condition**: Major assumptions and risks visible enough to support blueprinting.
- **Common Failure Reasons**: opinion-driven reasoning, invisible assumptions, unsupported direction.
- **Valid Next Stage**: `blueprint`

### 4. blueprint
- **Meaning**: The high-level system design is being defined.
- **Required Artifacts**: architecture baseline, system boundaries, analytics outline.
- **Exit Condition**: System coherent enough to be detailed.
- **Common Failure Reasons**: overbuilt architecture, missing boundaries, inconsistent design, hidden feasibility issues.
- **Valid Next Stage**: `detail`

### 5. detail
- **Meaning**: The blueprint is being translated into execution-ready detail.
- **Required Artifacts**: technical detail, validation plan, execution notes.
- **Exit Condition**: Detailed enough for readiness review.
- **Common Failure Reasons**: undefined behavior, missing validation logic, incomplete constraints.
- **Valid Next Stage**: `qa`

### 6. qa
- **Meaning**: The project is being checked for safety, coherence, and readiness.
- **Required Artifacts**: QA report, go/no-go result.
- **Exit Condition**: Ready for handoff or explicitly halted.
- **Common Failure Reasons**: unresolved security risk, missing measurement path, feasibility concerns, critical ambiguity.
- **Valid Next Stage**: `handoff`

### 7. handoff
- **Meaning**: The project is being transitioned into downstream execution.
- **Required Artifacts**: spec handoff package, summaries of assumptions/decisions/entry context.
- **Exit Condition**: Downstream system has enough context to take over.
- **Common Failure Reasons**: incomplete QA, unresolved critical risk, missing handoff artifacts.
- **Valid Terminal Outcome**: `completed`

## Operational Status Definitions

- **idle**: Project exists but no command is being processed (transient runtime status).
- **active**: Project is in a valid stage and may continue (normal working status).
- **halted**: Project cannot continue until blockers (missing info, gate failure, conflict) are resolved. A halt is an intentional stop and should be recoverable.
- **failed**: Untrusted condition (corrupted state, contradictory artifacts), requires manual repair or reset.
- **handoff-ready**: Passed readiness checks and eligible for `/vibe.handoff-to-spec`.
- **completed**: VDD journey is finished and project has been handed off.

## State Transition Rules

Canonical progression: `init -> plan -> research -> blueprint -> detail -> qa -> handoff -> completed`

### Allowed Read-Only Commands
Commands like `/vibe.status`, `/vibe.assumptions`, `/vibe.decide`, and `/vibe.resume` may update metadata/supporting state but do not advance the journey stage.

### Transition Conditions
A transition is valid **only** when:
1. Current stage exists.
2. Next stage is allowed.
3. Required upstream artifacts exist.
4. No blocking gate failure.
5. Project status is not `failed`.
6. Project state is trusted.

## Halt vs Failure vs Recovery

### Halt
Controlled stop. The system knows why it stopped (missing artifact, risky assumptions). Project remains valid but blocked and resumable.

### Failure
Trust problem. System cannot safely determine next steps (corrupted state, impossible stage mismatch). May require manual recovery or reset.

### Recovery
Process of re-establishing trusted state from state file, artifacts, decisions, and assumptions. Must be explicit and visible to the user.

## Handoff Readiness

Project is `handoff-ready` only when:
- Current stage is `qa`.
- QA has passed.
- No critical gate failure.
- No unresolved critical assumption.
- Handoff package requirements satisfied.
- Major decisions are visible.

## Completion Rules
Project is `completed` only when:
- Handoff stage finished successfully.
- Handoff artifacts generated.
- Downstream execution context defined.

## State Invariants
- **Env 1**: Exactly one current stage.
- **Env 2**: Exactly one current status.
- **Env 3**: No transition without a valid state update.
- **Env 4**: `completed` project accepts no forward transitions.
- **Env 5**: `failed` project stops until recovery.
- **Env 6**: `handoff-ready` project remains resumable until finished.

## Pack Compatibility Rule
Packs may add enrichments, internal helper states, or readiness checks but must **not** redefine stage order, bypass core requirements, or alter meanings of `completed`, `halted`, or `failed`.

## V1 Boundary
V1 supports one canonical journey, core stages, operational status model, and formal handoff readiness. It does not yet support branches, multi-project workflows, or multi-user ownership.
