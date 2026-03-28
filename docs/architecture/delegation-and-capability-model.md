# Delegation and Capability Model

## Purpose

This document defines how Vibe Driven Dev should help a vibe coder operate like a one-person agency without pretending to be a specialist in every software discipline.

The system should not expect the user to perform specialist work directly.

Instead, VDD should:
- treat the user as the director
- treat specialist agents as the execution team
- treat external skills and frameworks as specialist operating playbooks
- translate project gaps into delegated specialist work and capability bundles

## Why This Matters

A vibe coder is usually not all of the following at once:
- product manager
- researcher
- architect
- frontend designer
- security engineer
- QA lead
- AI provider strategist

But many users still want the outcome of a one-man agency.

VDD should make that possible through structured delegation rather than by forcing the user to become a generalist operator of every discipline.

## Core Principle

The vibe coder should not do specialist work directly when a specialist agent or specialist capability can do it better.

The user should:
- define goals
- review tradeoffs
- approve major decisions
- steer priorities

The system should:
- assign specialist ownership
- activate the right internal skills
- recommend external capabilities when they materially improve output quality
- keep stage and governance constraints intact

## System Layers

The delegation model should be understood as four cooperating layers:

1. Director layer
2. Specialist agent layer
3. Capability layer
4. Governance layer

## 1. Director Layer

The director layer consists of:
- the vibe coder
- the orchestrator agent

### User Responsibilities

The user owns:
- what is being built
- what matters most
- which tradeoffs are acceptable
- whether the system should continue automatically

### Orchestrator Responsibilities

The orchestrator owns:
- reading the current stage
- selecting the right specialist
- delegating work
- reconciling outputs
- preventing workflow chaos

## 2. Specialist Agent Layer

Each major stage should map to a specialist agent.

Current VDD specialist roles:
- `planner`
- `researcher`
- `architect`
- `detailer`
- `qa-guardian`
- `handoff-manager`
- `onboarding-guide`

These agents are not interchangeable.

Each one should own a specific class of work and escalate when work leaves its boundary.

## 3. Capability Layer

The capability layer includes:
- internal VDD skills
- external ecosystem skills
- curated major capability frameworks

### Internal Capabilities

Examples:
- `vibe-plan`
- `vibe-blueprint`
- `vibe-detail`
- `vibe-qa`
- `stack-advisor`
- `ai-provider-selector`

### External Ecosystem Skills

Examples:
- `find-skills`
- `systematic-debugging`
- `test-driven-development`
- `webapp-testing`
- `better-auth-best-practices`
- `mcp-builder`

### Curated Major Capabilities

These are larger operating systems or playbooks that should not be treated like default always-on dependencies.

Examples:
- `Spec-Kit`
- `Impeccable`

## 4. Governance Layer

Delegation only works if the system preserves order.

Governance should enforce:
- stage rules
- gate discipline
- decision logging
- artifact contracts
- capability trust tiers
- no silent promotion of external logic

Without this layer, delegation becomes random skill installation and specialist drift.

## Delegation Rule

Every meaningful workflow step should answer:
- which specialist agent owns this work
- which internal skill performs the work
- which external capability may improve the work
- under what conditions external help is allowed

## Capability Profiles

Every specialist agent should have a capability profile that answers:
- what it owns
- what internal skills it may use
- what external capabilities it may recommend
- when it should escalate

### Planner

Owns:
- problem framing
- scope shaping
- first planning artifacts

May use:
- `vibe-plan`
- `find-skills` when ecosystem discovery is useful

Should not own:
- deep architecture
- UI polish
- handoff execution

### Researcher

Owns:
- domain scanning
- risks
- alternatives
- failure modes

May use:
- `vibe-research`
- debugging or testing-related skills when research surfaces delivery risk

### Architect

Owns:
- system boundaries
- stack decisions
- AI provider decisions
- major architecture tradeoffs

May use:
- `vibe-blueprint`
- `stack-advisor`
- `ai-provider-selector`
- architecture-related external skills

Should recommend `Impeccable` when:
- the project is frontend-heavy
- visual differentiation matters
- the project is design-sensitive

### Detailer

Owns:
- execution-level technical detail
- validation notes
- operational precision before scaffold

May use:
- `vibe-detail`
- targeted auth, performance, testing, and MCP capabilities depending on the project gaps

### QA Guardian

Owns:
- readiness checks
- quality gate visibility
- confidence before handoff

May use:
- `vibe-qa`
- `systematic-debugging`
- `test-driven-development`
- `webapp-testing`
- security-oriented skills when relevant

### Handoff Manager

Owns:
- execution handoff
- transfer into downstream structured implementation workflow

May activate:
- `Spec-Kit`

`Spec-Kit` should be recommended when:
- bootstrap artifacts exist
- the project has passed planning and detail shaping
- the system is entering structured implementation

## Curated Major Capability Policy

### Spec-Kit

Spec-Kit is not a universal default.

It should be treated as a structured execution system that becomes relevant once VDD has already grounded:
- project intent
- scope
- architecture
- technical detail
- handoff readiness

Recommended trigger:
- `detail`, `scaffold`, `qa`, or `handoff` stages

### Impeccable

Impeccable is not a core workflow engine.

It should be treated as a design specialist capability.

Recommended trigger:
- frontend-heavy project
- dashboard, SaaS UI, landing page, marketing site, consumer app, or portfolio surface
- user values visual polish and differentiation

## Capability Bundles

Users should not be forced to choose individual skill names first.

VDD should prefer job-oriented capability bundles.

Examples:
- `mvp-core`
- `frontend-polish`
- `ai-wrapper`
- `auth-safe-app`
- `mcp-app`
- `execution-handoff`

Each bundle should map:
- project gap or job
- specialist need
- curated external capabilities

## Bundle Selection Principle

The user chooses intent.

The system chooses the bundle.

Examples:
- "I need a safer MVP flow" -> `mvp-core`
- "The app must look strong" -> `frontend-polish`
- "This is an AI wrapper app" -> `ai-wrapper`
- "This app needs sign-in and safe sessions" -> `auth-safe-app`
- "This product depends on tools and MCP" -> `mcp-app`
- "We are ready for structured build execution" -> `execution-handoff`

## Recommended Initial Bundle Registry

The initial registry should live under:
- `core/capabilities/bundles/`

Each bundle file should remain machine-readable and should describe:
- bundle id
- title
- summary
- target project situations
- included capabilities
- recommended stage usage

## Interaction with `/vibe.skills`

`/vibe.skills` should evolve from plain recommendations into a capability advisor that can:
- analyze the current project
- detect capability gaps
- map those gaps to bundles
- recommend major capabilities such as Spec-Kit and Impeccable when relevant
- produce a controlled install plan

Recommended modes:
- `/vibe.skills`
- `/vibe.skills --bundle frontend-polish`
- `/vibe.skills --bundle mvp-core`
- `/vibe.skills --bundle ai-wrapper`
- `/vibe.skills --install`

## Decision Policy

The system should not install major capabilities blindly.

It should:
- explain why the capability is relevant
- explain which specialist role benefits from it
- explain what it improves
- produce a controlled install plan

## Example Delegation Flow

Example project:

`AI copywriter SaaS`

Expected delegation flow:
- `onboarding-guide` captures project intent
- `planner` shapes problem and scope
- `researcher` identifies risks and alternatives
- `architect` chooses stack and provider direction
- `detailer` prepares execution-ready detail
- `/vibe.skills` recommends:
  - `mvp-core`
  - `frontend-polish`
  - `ai-wrapper`
- `handoff-manager` recommends or activates `Spec-Kit` when entering structured implementation

## V1 Boundary

V1 should include:
- specialist capability model
- curated bundle registry
- bundle-aware recommendation logic
- explicit recommendation rules for Spec-Kit and Impeccable

V1 does not need:
- fully automatic bundle installation across every runtime
- remote marketplace synchronization as the only recommendation source
- autonomous specialist spawning without router visibility

## Success Criteria

The model is successful when:
- the user can act like a director rather than a specialist generalist
- each stage has a clear specialist owner
- external capabilities are recommended by job and gap, not by random name lists
- major capabilities like Spec-Kit and Impeccable appear only when the project actually benefits from them
- delegation remains governed rather than chaotic
