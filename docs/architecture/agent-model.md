# Agent Model

## Purpose

This document defines the agent model for Vibe Driven Dev.

Vibe Driven Dev is an agent-first orchestration framework.

It is designed primarily for AI coding agents that can:
- read structured markdown instructions
- route tasks across specialized roles
- respect tool boundaries
- preserve state across steps
- generate artifacts as part of a guarded workflow

Humans interact with the system through commands and repository structure.
Agents are the primary runtime operators.

## Why This Matters

The system is not just a set of docs for humans to read.

It is meant to be consumed by agent runtimes such as:
- Claude Code style subagents
- skills-compatible coding agents
- command-driven implementation agents
- future agent runtimes that can read markdown contracts

This changes how the architecture should be designed.

The core unit is not just the document.
The core unit is the operating contract between:
- commands
- router
- agents
- skills
- artifacts
- state

## Core Principle

Commands are the public interface.

Skills are reusable execution units.

Agents are the runtime operators that consume skills, use tools, and return results.

The router coordinates all three.

## Three Distinct Layers

The system must clearly distinguish between:

### 1. Commands

Commands are what a human or outer system invokes.

Examples:
- `/vibe.init`
- `/vibe.plan`
- `/vibe.qa`

Commands are stable, public, and stage-aware.

They are the interface.

### 2. Skills

Skills are reusable capability units.

A skill defines:
- what job should be done
- when to use it
- when not to use it
- what context it needs
- what outputs it must produce

Skills are implementation-neutral and reusable.

They are not full agents.

### 3. Agents

Agents are specialized runtime operators.

An agent may:
- receive a delegated task
- consume one or more skills
- operate with limited tools
- work in isolated context
- return artifacts or findings to the router

Agents execute.
Skills instruct.
Commands expose.

## Why Agents Exist

The agent layer exists for five reasons:

### 1. Context isolation
Different tasks should not always share one giant context window.

### 2. Tool control
Some tasks should have narrower tool access than others.

### 3. Role specialization
Planning, research, architecture, and QA require different operating behaviors.

### 4. Safer delegation
High-risk tasks should route through role-specific operators.

### 5. Scalability
As the system grows, agents provide a stable way to coordinate skill usage without collapsing into prompt chaos.

## Agent Responsibilities

An agent in Vibe Driven Dev is responsible for:
- executing a scoped task
- following its role definition
- using allowed skills
- respecting tool boundaries
- producing structured outputs
- surfacing blockers clearly
- returning results to the router

An agent is not responsible for:
- redefining command meaning
- bypassing stage rules
- skipping required gates
- silently changing the project journey
- inventing outputs outside its contract

## Relationship Between Router and Agents

The router remains the central coordinator.

Agents do not self-govern the whole system.

The router decides:
- which agent to invoke
- which skill set applies
- what stage the project is in
- whether the transition is valid
- whether gates pass or fail
- whether a handoff is allowed

Agents perform work inside those boundaries.

## Canonical V1 Agent Roles

V1 should stay small and opinionated.

The recommended initial agent set is:

- `orchestrator`
- `planner`
- `researcher`
- `architect`
- `detailer`
- `qa-guardian`
- `handoff-manager`

A leaner starting subset may be:
- `orchestrator`
- `planner`
- `architect`
- `qa-guardian`

## Agent Role Definitions

### 1. `orchestrator`

#### Purpose
The central coordination agent.

#### Responsibilities
- interpret router intent
- coordinate task delegation
- collect outputs from other agents
- maintain coherence across stages
- avoid direct overreach into specialist reasoning when delegation is appropriate

#### Notes
This is the closest agent to the system brain, but it is still subordinate to router rules and state constraints.

### 2. `planner`

#### Purpose
Handle early-stage problem framing and scope shaping.

#### Responsibilities
- clarify the problem
- frame the target user
- define scope boundaries
- surface non-goals
- produce planning artifacts

#### Typical Skills
- `vibe-plan`
- `assumptions-manager`

### 3. `researcher`

#### Purpose
Ground decisions in evidence, alternatives, and visible risks.

#### Responsibilities
- summarize known patterns
- identify assumptions needing evidence
- surface contradictions
- produce research and risk artifacts

#### Typical Skills
- `vibe-research`
- `risk-scan`
- `assumptions-manager`

### 4. `architect`

#### Purpose
Translate validated direction into a viable high-level system design.

#### Responsibilities
- define boundaries
- select or compare architecture patterns
- outline data and flow expectations
- prevent overbuilding

#### Typical Skills
- `vibe-blueprint`
- `decision-ledger`
- `architecture-review`

### 5. `detailer`

#### Purpose
Turn a valid blueprint into execution-ready detail.

#### Responsibilities
- define schemas and flows
- translate high-level design into implementable constraints
- prepare detailed artifacts for readiness review

#### Typical Skills
- `vibe-detail`
- `validation-planner`

### 6. `qa-guardian`

#### Purpose
Protect quality, safety, and readiness before handoff.

#### Responsibilities
- review security visibility
- check measurement readiness
- run reality checks
- block unsafe progression

#### Typical Skills
- `vibe-qa`
- `security-gate`
- `privacy-check`
- `execution-reality-check`

### 7. `handoff-manager`

#### Purpose
Prepare a clean transition into downstream execution.

#### Responsibilities
- collect required artifacts
- summarize assumptions
- summarize decisions
- create the handoff package
- define the exact next execution entry

#### Typical Skills
- `vibe-handoff-to-spec`
- `spec-handoff`
- `handoff-writer`

## Agent Invocation Model

Agents may be invoked in three ways:

### 1. Router-directed invocation
The router chooses the correct agent based on:
- command
- state
- stage
- required specialization
- gate sensitivity

This should be the default mode.

### 2. Explicit command implication
A command strongly implies a specific agent role.

Examples:
- `/vibe.plan` strongly implies `planner`
- `/vibe.qa` strongly implies `qa-guardian`

### 3. Recovery or fallback invocation
The router may use a different agent for recovery logic when state is partial or damaged.

This must remain explicit and traceable.

## Agent to Skill Mapping

One agent may use many skills.

One skill may be used by more than one agent.

This is intentional.

Examples:
- `decision-ledger` may be used by `architect` and `qa-guardian`
- `assumptions-manager` may be used by `planner`, `researcher`, and `handoff-manager`

This separation prevents coupling role identity to a single prompt or file.

## Tool Boundaries

Agents must support bounded tool access.

This is especially important for:
- file mutation tools
- shell access
- network access
- package installation
- code execution
- security-sensitive operations

Tool access should be:
- least-privilege by default
- role-aware
- overrideable only through explicit configuration

## Agent Context Rules

Each agent should operate with scoped context.

That means:
- it receives only the context relevant to its task
- it should not consume the entire project context by default
- it should return concise structured outputs to the orchestrator or router

This improves:
- clarity
- repeatability
- context preservation
- agent specialization

## Agent Output Requirements

Every agent result should be structured enough to support router updates.

A valid result should include:
- what was done
- what artifacts were created or updated
- what blockers remain
- what assumptions were used
- what decisions were introduced or touched
- what next action is recommended

## Agent Authority Model

Agents do not all have equal authority.

Authority should follow the system model:

- product conflicts route toward planning authority
- architecture conflicts route toward architecture authority
- security concerns override convenience
- orchestration decides transition control

In practice:
- `qa-guardian` may block handoff
- `architect` may reject incoherent blueprint expansion
- `planner` may reject feature-first framing
- `orchestrator` coordinates but does not nullify specialist vetoes

## Agent File Model

The repository should support explicit agent definitions.

Recommended structure:

```txt
agents/
├── orchestrator/
│   └── AGENT.md
├── planner/
│   └── AGENT.md
├── researcher/
│   └── AGENT.md
├── architect/
│   └── AGENT.md
├── detailer/
│   └── AGENT.md
├── qa-guardian/
│   └── AGENT.md
└── handoff-manager/
    └── AGENT.md
```

Each `AGENT.md` should define:
- name
- description
- role
- tool policy
- stage alignment
- supported skills
- output expectations
- escalation rules

## Compatibility with Agent Runtimes

The design should remain compatible with agent runtimes that support:
- markdown-based agent definitions
- YAML frontmatter
- scoped tools
- role delegation
- project-level and user-level agent loading

This makes the system portable and future-friendly.

## Pack Compatibility

Packs may introduce additional agents for optional domains such as:
- SaaS design
- frontend systems
- AI agents
- security workflows

Packs must not:
- replace the orchestrator silently
- bypass core gates
- redefine canonical stage meanings
- weaken authority rules

Core agent behavior remains authoritative.

## V1 Boundary

The V1 agent model should remain small.

It should support:
- one orchestrator model
- a limited specialist set
- clear skill separation
- bounded tool access
- structured outputs
- router-controlled delegation

It should not yet include:
- agent swarms
- self-spawning delegation trees
- autonomous marketplace agent loading
- multi-user agent negotiation
- distributed remote execution

These may come later only if the core model stays understandable.
