# Gates and Guards

## Purpose

This document defines the protection layer for Vibe Driven Dev.

Gates and guards exist to prevent the system from moving forward blindly.

In an agent-first system, speed is easy.
Safe progression is harder.

The role of this layer is to ensure that:
- stage transitions are justified
- risky ambiguity is surfaced
- unsafe execution paths are blocked
- weak outputs do not silently become project truth
- downstream handoff happens only when the project is actually ready

This protection layer is mandatory.

It is not an optional quality add-on.

## Why This Layer Exists

Vibe Driven Dev is designed for AI coding agents.

That means the system must assume:
- agents may move quickly
- agents may over-infer when context is weak
- agents may produce plausible but unsafe outputs
- agents may drift into implementation before clarity is earned

Gates and guards exist to stop those failure modes.

Without them, the system collapses into assisted chaos.

## Core Principle

A command succeeding is not enough.

A stage transition must also be allowed.

A useful output is not enough.

That output must also satisfy the conditions required to become trusted project state.

The system should prefer a visible halt over silent progression.

## Distinguishing Gates vs Guards

### Gates

Gates are formal checks that determine whether execution or progression is allowed.

A gate has:
- a clear purpose
- a trigger point
- pass criteria
- warning criteria
- failure criteria

A gate may block execution.

### Guards

Guards are always-on protective rules that constrain system behavior.

A guard does not necessarily run as a discrete checkpoint.
It acts as a continuous boundary.

Examples:
- do not skip required upstream stages
- do not proceed with hidden critical assumptions
- do not allow pack behavior to bypass core protections

Gates evaluate.
Guards constrain.

## Design Goals

The gates and guards layer must be:

### Explicit
Blockers must be visible.

### Small in V1
The first version should include only the protections that materially improve safety and coherence.

### Agent-aware
The system must assume delegated agents are operating inside it.

### State-aware
A gate result must connect back to project state.

### Stable
Packs may extend protection, but the core protections must remain authoritative.

## V1 Core Gates

V1 defines three mandatory core gates:

1. Security Gate
2. Measurement Gate
3. Execution Reality Check

These gates reflect the core requirement that output is not enough by itself.
The system must also verify safety, measurability, and real-world build coherence before continuing.

## 1. Security Gate

### Purpose
Ensure that the project is not progressing while hiding meaningful security or privacy risk.

### What It Checks
The Security Gate should inspect whether the current stage has made visible:
- data sensitivity implications
- authentication or authorization implications
- secret handling expectations
- unsafe trust boundaries
- obvious privacy concerns
- high-risk assumptions that affect safety

### Typical Trigger Points
- after blueprint
- after detail
- before handoff
- earlier when a command introduces clear security implications

### Pass Criteria
- major security-sensitive surfaces are visible
- risk areas are acknowledged
- nothing critical is being silently assumed away
- downstream execution would not begin from a false sense of safety

### Warning Criteria
- security visibility exists but is shallow
- non-critical uncertainty remains
- mitigation is incomplete but the project is not yet at handoff

Warnings should be recorded, not ignored.

### Failure Criteria
- critical security implications are invisible
- dangerous assumptions are being treated as facts
- handoff is attempted with unresolved critical risk
- the system suggests execution while trust boundaries are still unclear

### Outcome on Failure
- block forward stage progression
- mark the project as `halted` if the issue is recoverable
- require clarification, mitigation, or scope reduction

## 2. Measurement Gate

### Purpose
Ensure that the project can be evaluated in reality.

### What It Checks
The Measurement Gate should inspect whether the current stage has made visible:
- what success means
- what outcome is being measured
- whether the project can be evaluated after implementation
- whether core signals or events are defined at a useful level
- whether the project is moving with a measurable purpose

### Typical Trigger Points
- after plan
- after blueprint
- during QA
- before handoff

### Pass Criteria
- success definition exists
- at least one meaningful evaluation path is visible
- measurement is aligned with the problem being solved

### Warning Criteria
- success is defined but too loosely
- analytics or event thinking is partial
- early MVP measurement exists but is still thin

### Failure Criteria
- there is no meaningful way to judge success
- outputs exist but no validation path exists
- implementation would begin without any measurable feedback loop

### Outcome on Failure
- block handoff readiness
- recommend refinement of success definition or analytics outline
- keep the project from pretending readiness it has not earned

## 3. Execution Reality Check

### Purpose
Ensure the project remains grounded in what is actually buildable and appropriate for its stage.

### What It Checks
The Execution Reality Check should inspect whether:
- the scope fits the stated goal
- the architecture fits the stage
- the proposed work is not obviously overbuilt
- assumptions about feasibility remain visible
- the system is not drifting into unnecessary complexity
- the project still resembles an MVP, PoC, or early product when that is the stated intention

### Typical Trigger Points
- after plan
- after blueprint
- after detail
- during QA

### Pass Criteria
- the proposed path is coherent
- the level of complexity is proportional
- implementation would not start from fantasy assumptions

### Warning Criteria
- some choices may be heavier than necessary
- the system may be drifting toward avoidable complexity
- feasibility is acceptable but not elegant

### Failure Criteria
- architecture is clearly overbuilt for the objective
- constraints are ignored
- stage outputs imply a project much larger than declared
- execution would begin on top of unrealistic assumptions

### Outcome on Failure
- halt progression
- require scope reduction, simplification, or explicit decision logging

## Gate Timing Model

A gate may run at three times:

### 1. Pre-execution
Before a command or stage action proceeds. Use when:
- prerequisites are risky
- ambiguity is already dangerous
- the system must block work before it begins

### 2. Post-execution
After an artifact is produced, before state is advanced. Use when:
- the artifact exists
- but the system must inspect whether the artifact is trustworthy enough to move forward

### 3. Handoff-boundary
Immediately before transition into downstream execution. Use when:
- the project is attempting to leave Vibe Driven Dev
- the cost of false readiness is highest

## Gate Result Model

Each gate should return one of the following outcomes:
- `passed`
- `warning`
- `failed`

### `passed`
The gate found no meaningful blocker.

### `warning`
The gate found a non-blocking concern that must remain visible. Warnings should be attached to state and artifacts when relevant.

### `failed`
The gate found a blocking issue. Failure must stop forward transition.

## Canonical Gate Result Shape

```json
{
  "gate": "security",
  "stage": "qa",
  "status": "failed",
  "severity": "critical",
  "summary": "Authentication and trust boundaries remain undefined.",
  "blocking_reasons": [
    "No auth model is visible",
    "Sensitive operations are implied but not bounded"
  ],
  "recommended_fix": [
    "Define trust boundaries",
    "Declare auth assumptions explicitly",
    "Re-run QA after mitigation"
  ]
}
```

## Core Guards

In addition to formal gates, V1 defines the following guards.

### 1. Stage Integrity Guard
The system must not silently skip required upstream stages.
- no blueprint before valid planning
- no detail before coherent blueprint
- no handoff before QA readiness

This guard is always active.

### 2. Assumption Visibility Guard
Critical assumptions must never remain hidden. If an agent is proceeding on assumptions that affect security, compliance, privacy, feasibility, trust boundaries, or major scope — those assumptions must be surfaced explicitly or the system must halt.

### 3. Artifact Trust Guard
An artifact being present does not automatically make it valid. The system must distinguish:
- file exists
- artifact is complete enough
- artifact is trustworthy enough to support progression

This guard prevents shallow or placeholder outputs from becoming authoritative state.

### 4. Authority Guard
Specialist vetoes must remain meaningful.
- QA may block handoff
- architecture may reject incoherent design expansion
- planning may reject feature-first framing

The orchestrator coordinates. It does not erase specialist constraints.

### 5. Pack Boundary Guard
Optional packs must not weaken core guarantees. Packs may add extra checks, extra stage helpers, or domain-specific warnings. Packs must not bypass core gates, redefine canonical readiness, or silently suppress failure conditions.

### 6. Read-Only Safety Guard
Read-only commands must not mutate stage progression. Commands such as `/vibe.status`, `/vibe.resume` (when used only for reconstruction), and `/vibe.assumptions` (when only inspecting) must not advance the journey stage.

### 7. Recovery Transparency Guard
When recovery is happening, the system must say so. It must not pretend the state is healthy when it has reconstructed context from partial artifacts or uncertain state.

## Halt Behavior

A gate failure does not always mean system failure.

The default response to a blocking but recoverable issue should be:
- do not progress
- keep the project state intact
- mark the project as `halted`
- surface blockers clearly
- recommend the next corrective action

This supports recovery without lying about readiness.

## Failure Behavior

A true failure occurs when the system cannot trust its own state or transition logic.

Examples:
- corrupted state
- contradictory artifacts
- unresolved routing conflict
- impossible stage mismatch

In such cases:
- the project may move to `failed`
- forward execution must stop
- recovery or repair becomes necessary

## Warning Behavior

Warnings should not be treated as decoration.

Warnings should:
- remain visible in project state
- remain visible in relevant artifacts when appropriate
- be reviewable during QA and handoff decisions

Warnings do not block by default. They do create decision pressure.

## Gate Interaction with Agents

Because Vibe Driven Dev is agent-first, gates must apply to agent outputs, not just human-authored artifacts.

This means:
- agent speed does not bypass review
- delegated work must still satisfy gate criteria
- specialized agents may trigger stricter review around high-risk work
- no agent may declare handoff readiness on its own

The router remains the final enforcement point.

## Gate Interaction with Router

The router is responsible for:
- deciding when a gate runs
- collecting gate results
- blocking stage progression on failure
- attaching warnings to state
- marking status as `halted` or `handoff-ready` where appropriate

The router does not replace the gate logic. It enforces it.

## Gate Interaction with State

Gate results must be written into project state.

```json
{
  "gates": {
    "security": "warning",
    "measurement": "passed",
    "reality_check": "failed"
  }
}
```

## Handoff Rule

A project must not become handoff-ready unless:
- required gates have passed
- no critical gate is failing
- unresolved critical assumptions are visible and acceptable
- the handoff package can be generated honestly

Handoff is a formal claim of readiness. The system must protect that claim.

## Contribution Rule

Contributors may propose new gates or guards. A proposed addition must explain:
- what failure mode it protects against
- whether it belongs in core or a pack
- whether it blocks, warns, or annotates
- how it interacts with state and stage transitions
- whether it risks overcomplicating V1

V1 should remain small and high-signal.

## V1 Boundary

The V1 gates and guards layer must include:
- Security Gate
- Measurement Gate
- Execution Reality Check
- stage integrity protection
- assumption visibility protection
- authority protection
- pack boundary protection

It should not yet include:
- enterprise compliance frameworks
- advanced policy engines
- remote enforcement services
- dynamic third-party gate marketplaces
- autonomous self-rewriting protections
