# CLI and Runtime Model

## Purpose

This document defines the runtime model for Vibe Driven Dev and the role of the CLI within it.

The CLI is not just a convenience wrapper.

It is the operational entry point for:
- initializing a project
- discovering and validating runtime components
- indexing add-ons and learning sources
- promoting eligible extensions
- executing public commands
- exposing project state to agent runtimes

The runtime model explains how commands, router logic, agents, skills, artifacts, and add-ons come together as one working system.

## Why This Matters

Vibe Driven Dev is an agent-first framework.

That means runtime behavior must be designed for:
- command-driven interaction
- markdown-based contracts
- multi-source skill discovery
- specialized agent delegation
- explicit state transitions
- trustworthy artifact generation

Without a clear runtime model, the project would become:
- a collection of docs without execution
- a CLI without system guarantees
- an agent setup without orchestration discipline

## Core Principle

The CLI exposes operations.

The runtime enforces meaning.

The router remains the decision center.
Agents remain runtime operators.
Skills remain reusable execution units.
Artifacts remain the durable outputs.
State remains the authoritative memory.

## Runtime Layers

The runtime should be understood as six cooperating layers:

1. CLI Layer
2. Command Layer
3. Router Layer
4. Agent Layer
5. Skill and Add-on Layer
6. Artifact and State Layer

## 1. CLI Layer

### Role
The CLI is the external operational interface. It allows users and agent environments to bootstrap, inspect, manage sources, validate components, run VDD commands, and surface state.

### Responsibilities
- project initialization
- source scanning
- add-on installation, validation, and promotion
- listing components
- invoking router actions
- displaying operational summaries

### Not Responsible For
- deciding business meaning of a command
- bypassing router rules
- inventing stage transitions
- weakening gate behavior
- treating discovery as trust

## 2. Command Layer

### Role
The command layer is the public interaction surface. It translates intent into actions (e.g., `/vibe.init`, `/vibe.plan`, `/vibe.research`, `/vibe.next`, `/vibe.status`).

### Command Rule
A command is a public contract. The runtime must never silently reinterpret one command as another.

## 3. Router Layer

### Role
The execution brain. It decides command validity, project stage, skill/flow resolution, agent selection, gate status, and state updates.

### Router Position in Runtime
The router sits between command invocation and actual execution. Nothing stateful should bypass it.

## 4. Agent Layer

### Role
Specialized runtime operators that receive delegated tasks, use scoped tools, consume skills, and return structured outputs. They do not control the overall journey.

### Runtime Assumption
Compatibility with runtimes supporting project/user-level agents, tool scoping, and markdown definitions.

## 5. Skill and Add-on Layer

### Role
Provides reusable operating units consumed by agents and router flows (core, pack, local, global, and archive sources).

### Runtime Principle
Not every discovered skill is executable. The runtime must respect trust tiers, eligibility, and precedence.

## 6. Artifact and State Layer

### Role
Preserves continuity and project truth (artifacts, project state, decision records, assumptions, gate outcomes).

### Runtime Principle
State changes must be backed by valid artifacts. Chat output alone is not authoritative state.

## CLI Direction

### 1. System Operations
Manage the environment (init, scan, validate, list, index, promote, inspect state).

### 2. Workflow Operations
Execute VDD journey commands through the router (run `/vibe.plan`, `/vibe.qa`, `/vibe.handoff-to-spec`).

## Recommended CLI Commands

Eventually: `init`, `doctor`, `scan`, `validate`, `list`, `promote`, `run <command>`, `status`.

### Core CLI Commands in V1

- **init**: Create project structure.
- **doctor**: Inspect runtime health.
- **scan**: Discover skills, agents, templates, and archive sources.
- **validate**: Check contracts (single skill, add-on, etc.).
- **list**: List discovered/installed components.
- **promote**: Turn an eligible source into a runtime-visible add-on.
- **run**: Pass a VDD command into the router.
- **status**: Show current project state and readiness summary.

## Command Execution Flow

1. Parse CLI input.
2. Normalize intent.
3. Load context (project, state, skills, agents).
4. Resolve precedence.
5. Invoke router.
6. Run pre-execution checks.
7. Delegate to agent/flow.
8. Update artifacts and state.
9. Run post-execution gates.
10. Return structured result.

## Runtime Context Model

Precedence:
1. core system definitions
2. project-level installed add-ons
3. trusted packs
4. user-level installed add-ons
5. archive learning sources
6. remote unverified sources

## Runtime Scopes
- **core**: Built-in.
- **project**: In the current project.
- **global**: Across projects for the user.
- **pack**: Curated extensions.
- **archive**: Indexed learning-only.

## Eligibility Model
- **executable**: Direct router selection.
- **restricted**: Visible but needs explicit opt-in/promotion.
- **learning-only**: Pattern material, not selectable logic.

## Doctor Model
Inspects required files, state readability, schema loading, skill/agent parsing, source registry coherence, and conflict detection.

## Scan Model
Discovery of core/installed/archived sources, manifest normalization, and eligibility classification. Scan is NOT install or promotion.

## Validate Model
structural, compatibility, and safety checks for skills, agents, or project health.

## Promote Model
Explicitly turns an eligible source into a runtime-visible add-on.

## Run Model
The entry point for journey commands (e.g., `npx vibe-driven-dev run /vibe.plan`). Normalize -> Route -> Delegate -> Update.

## Status Model
Shows current stage, status, artifact progress, gate outcomes, assumptions, and readiness. Grounded in authoritative state.

## Runtime Result Model
Example response:
```json
{
  "operation": "run",
  "command": "/vibe.blueprint",
  "status": "success",
  "artifacts_created": ["arch-baseline.md"],
  "next_recommended_command": "/vibe.detail"
}
```

## Interaction with Agent Runtimes
Complements environments like Claude Code by exposing structured state and allowing promotion/scanning outside the conversational loop.

## Safety Rules
- Discovery != Trust.
- No auto-promotion.
- No bypassing router stage rules.
- Learning sources != Authoritative skills.
- No silent overrides of core semantics.
- Handoff requires passing gates.

## V1 Boundary
V1 focuses on basic CLI operations, deterministic loading, routing, agent-aware execution, and artifact/state updates. No cloud sync or automatic third-party installs in V1.
