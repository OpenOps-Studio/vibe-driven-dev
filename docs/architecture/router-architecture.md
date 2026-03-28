# Router Architecture

## Purpose

This document defines how the Vibe Driven Dev router interprets commands, reads project state, resolves skills, enforces stage rules, and decides what happens next.

The router is the execution brain of the system.

It is responsible for turning a public command such as `/vibe.plan` into a valid, state-aware, and guarded system action.

Without the router, the system would be only:
- a set of documents
- a set of commands
- a set of skills

With the router, the system becomes an operating model.

## Core Responsibility

The router must answer six questions for every command:

1. What command was requested
2. What is the current project state
3. Is this command valid right now
4. Which skill or orchestration flow should handle it
5. What artifacts or state changes should happen
6. Whether execution should proceed, halt, or hand off

## Design Goals

The router must be:

### Deterministic
The same valid context should lead to the same routing outcome.

### Stage-aware
The router must understand the current journey stage and block incoherent transitions.

### Skill-driven
The router should resolve into skills or orchestration flows, not freeform behavior.

### Guarded
The router must enforce gates, halt conditions, and authority rules.

### Extensible
Core behavior must remain stable while allowing packs to register new skills and optional routes.

### Contributor-friendly
The routing model should be understandable enough that contributors can reason about where a skill fits and why.

## Router Scope

The router is responsible for:
- parsing commands
- loading project state
- validating stage transitions
- selecting skills
- checking prerequisites
- triggering gates
- updating state
- recording decisions when needed
- preparing handoff readiness
- supporting resume behavior

The router is not responsible for:
- being the final source of skill instructions
- storing full artifact content logic
- acting as a build tool
- replacing downstream execution systems

## High-Level Architecture

The router consists of seven logical parts:

1. Command Parser
2. State Manager
3. Transition Validator
4. Skill Resolver
5. Gate Engine
6. Decision Hook
7. Handoff Manager

## 1. Command Parser

### Job
Interpret the incoming command and normalize it into a router-readable form.

### Inputs
- raw command string
- optional arguments
- optional session context

### Outputs
A normalized command object.

Example shape:

```json
{
  "command": "/vibe.plan",
  "action": "plan",
  "args": {},
  "source": "user"
}
```

### Rules
- reject malformed commands
- reject unknown namespaces
- normalize aliases only if explicitly supported
- do not silently reinterpret one command as another

## 2. State Manager

### Job
Load and update authoritative project state.

### Responsibilities
- read current state file
- reconstruct state from artifacts when possible
- detect missing or corrupted state
- persist stage changes
- persist gate results
- persist pointers to generated artifacts

### Canonical State Model
The router should rely on a canonical state object.

Example shape:

```json
{
  "project_id": "proj_001",
  "current_stage": "plan",
  "status": "active",
  "platform": "nextjs",
  "target_user": "founders building MVPs",
  "success_definition": "working MVP with measurable first-user success",
  "assumptions": [],
  "decisions": [],
  "artifacts": [],
  "gates": {
    "security": "pending",
    "measurement": "pending",
    "reality_check": "pending"
  },
  "handoff": {
    "ready": false,
    "target": "spec-kit"
  }
}
```

### Rules
- the state file is authoritative when valid
- artifact reconstruction is allowed only when needed
- state recovery must remain visible to the user
- no state-changing command may run without a trusted state context unless it is `/vibe.init`

## 3. Transition Validator

### Job
Decide whether the requested command is valid for the current stage.

### Responsibilities
- compare current stage to requested action
- enforce required upstream stages
- allow read-only commands at any time when safe
- determine whether assumptions are sufficient
- halt on incoherent jumps

### Example Transition Logic
Allowed journey path:
1. `init`
2. `plan`
3. `research`
4. `blueprint`
5. `detail`
6. `qa`
7. `handoff`

Supporting commands may run across stages:
- `next`
- `resume`
- `status`
- `assumptions`
- `decide`

### Rules
- `/vibe.blueprint` must not run before valid planning
- `/vibe.detail` must not run without an approved blueprint
- `/vibe.handoff-to-spec` must not run before QA readiness
- `/vibe.status` is always read-only
- `/vibe.resume` is allowed only when recoverable state exists

## 4. Skill Resolver

### Job
Resolve the correct skill or orchestration flow for the given command and state.

### Why This Exists
A command is a public interface. A skill is an execution unit. The router must not assume one command always maps to exactly one skill forever.

For example:
- `/vibe.plan` may map to `vibe-plan`
- later it may resolve differently for a pack
- or it may choose a fallback flow when recovering from partial state

### Resolution Inputs
- normalized command
- current stage
- available skills
- skill metadata
- pack registration
- gate outcomes
- project mode

### Resolution Outputs
A routing decision object.

Example shape:

```json
{
  "command": "/vibe.plan",
  "resolved_skill": "vibe-plan",
  "mode": "core",
  "reason": "direct stage match",
  "state_effect": "write"
}
```

### Resolution Priority
The resolver should use this order:
1. direct core skill match
2. stage-compatible pack override if explicitly allowed
3. recovery flow
4. refusal or halt

### Rules
- core journey commands default to core skills
- packs may extend, not silently replace, core guarantees
- ambiguous overlaps should fail loudly
- internal skills must not be selected unless explicitly permitted

## 5. Gate Engine

### Job
Evaluate whether execution is allowed before and after a command runs.

### Core Gates in V1
- Security Gate
- Measurement Gate
- Execution Reality Check

### Gate Timing
A gate may run:
- before execution
- after execution
- at handoff boundaries

### Examples
- **Before Blueprint**: The router may require evidence that planning exists and major assumptions are visible.
- **After Detail**: The router may check whether validation and technical constraints are sufficiently defined.
- **Before Handoff**: The router must confirm QA readiness.

### Rules
- failing a gate must block forward transition
- gate failures must be explicit
- non-critical warnings may be recorded without halting
- critical failures must halt state progression

## 6. Decision Hook

### Job
Ensure important decisions are recorded when required.

### When It Activates
The router should require or recommend a decision record when a command introduces a meaningful choice such as:
- stack selection
- architecture pattern choice
- auth strategy
- model or vendor selection
- scope cut
- accepted risk
- handoff boundary decision

### Rules
- a decision does not need to block all progress by default
- high-risk decisions should be visible before handoff
- decision records must be attached to state

## 7. Handoff Manager

### Job
Control the transition from Vibe Driven Dev into downstream execution.

### Primary V1 Target
Spec-Kit

### Responsibilities
- determine handoff readiness
- collect required artifacts
- summarize assumptions
- summarize decisions
- create handoff package
- provide exact next action for the user

### Rules
- handoff is a formal transition, not a casual recommendation
- only `/vibe.handoff-to-spec` performs the handoff
- `next` may recommend handoff, but does not finalize it
- unresolved critical risk must block handoff

## Routing Flow

The router should process commands in the following order:
1. Parse command
2. Load state
3. Validate transition
4. Resolve skill
5. Run pre-execution gates
6. Execute skill or orchestration flow
7. Run post-execution gates
8. Update state
9. Attach decisions if required
10. Return next-step result

### Canonical Routing Result
Every command should return a structured routing result internally.

Example shape:

```json
{
  "command": "/vibe.blueprint",
  "stage_before": "research",
  "stage_after": "blueprint",
  "resolved_skill": "vibe-blueprint",
  "artifacts_created": [
    "architecture-baseline.md",
    "analytics-outline.md"
  ],
  "gates": {
    "before": "passed",
    "after": "passed"
  },
  "decisions_required": [],
  "next_recommended_command": "/vibe.detail",
  "status": "success"
}
```

## Resume Logic

`/vibe.resume` should not restart the journey. It should:
- load state if present
- recover missing context from artifacts if needed
- summarize current position
- surface open assumptions
- recommend the next valid command

If state cannot be trusted:
- the router must say so clearly
- the router may offer recovery options
- the router must not pretend the system is healthy

## Next Logic

`/vibe.next` is the smart routing command. Its job is to:
- inspect current stage
- inspect completed artifacts
- inspect open blockers
- inspect pending gates
- recommend the next valid action

It may optionally route automatically in agent contexts, but in V1 it should prioritize explicitness over magic.

## Pack Integration Model

Packs may register:
- additional skills
- stage-compatible enrichments
- optional read-only commands
- optional stage-specific helpers

Packs must not:
- bypass core gates
- redefine core stage meanings silently
- replace core handoff rules
- weaken safety constraints

### Pack Resolution Rule
Core command semantics always win. A pack may extend the behavior around a stage, but it must not redefine what that stage fundamentally means.

## Failure Modes

The router must handle at least these failure modes:
- **Invalid Command**: Unknown or malformed command.
- **Missing State**: No recoverable state exists for a stateful action.
- **Invalid Transition**: Requested command does not fit current stage.
- **Skill Resolution Conflict**: Multiple possible skills match with no clear winner.
- **Gate Failure**: A required gate blocks execution.
- **Corrupted Context**: Artifacts or state are incomplete or contradictory.
- **Unsafe Assumption Surface**: Too much critical information is missing to proceed safely.

## Router Principles

- **Principle 1**: The router should prefer explicitness over convenience.
- **Principle 2**: The router should not silently fix structural problems.
- **Principle 3**: The router should make blockers visible.
- **Principle 4**: The router should preserve a clear journey model.
- **Principle 5**: The router should remain stable even as packs grow.

## V1 Boundary

The V1 router should stay focused. It should support:
- core command parsing
- canonical state
- stage validation
- skill resolution
- gate enforcement
- handoff readiness

It should **not** yet include:
- distributed execution
- multi-project orchestration
- remote registries
- cloud sync
- multi-user collaboration
- dynamic marketplace loading
