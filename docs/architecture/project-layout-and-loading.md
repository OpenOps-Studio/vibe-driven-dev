# Project Layout and Loading

## Purpose

This document defines how Vibe Driven Dev organizes, discovers, loads, prioritizes, and interprets its runtime components.

This includes:
- core system files
- commands
- skills
- agents
- templates
- packs
- add-ons
- archive learning sources

Because Vibe Driven Dev is an agent-first framework, layout is not only a repository concern.

Layout is also a runtime concern.

The system must know:
- what exists
- where it lives
- whether it is authoritative
- whether it is executable
- whether it is only a learning source
- what takes precedence when sources conflict

## Core Principle

Not every discovered skill should be executable.

Some sources are trusted runtime units.
Some sources are learning inputs.
Some sources are optional extensions.
Some sources are unverified.

The loader must understand the difference.

## Why Loading Architecture Matters

Modern agent environments already support multi-source loading models.

For example, agent runtimes may support:
- project-level definitions
- user-level definitions
- plugin-provided definitions
- filesystem-based discovery
- local and remote install sources

Vibe Driven Dev should embrace this model directly.

It should not assume one repository folder is the only truth.

## Canonical Repository Layout

Recommended repository structure:

```txt
vibe-driven-dev/
├── docs/
├── core/
├── cli/
├── skills/
├── agents/
├── templates/
├── packs/
├── addons/
├── tests/
└── archive/
```

### Directory Roles

#### `docs/`
System definition, architecture, command contracts, authoring rules, and contributor-facing documentation.

#### `core/`
Authoritative system logic and schemas.
Includes:
- constitution
- router
- gates
- state
- decision logic
- artifact contracts

#### `cli/`
The future command-line entry point for initialization, validation, loading, installation, and execution.

#### `skills/`
Core skills that belong to the canonical Vibe Driven Dev journey and protection model.

#### `agents/`
Core agent definitions used by the router for agent-first orchestration.

#### `templates/`
Canonical artifact and skill templates.

#### `packs/`
Optional, curated extensions that add domain-specific capabilities without changing core guarantees.

#### `addons/`
Multi-source add-on loading layer. This is where installed and indexed external skills become visible to the system.

#### `archive/`
Storage for raw imports, experimental materials, and learning-only sources that the agent may read but should not automatically treat as trusted runtime logic.

## Add-on System Model

Vibe Driven Dev should support a multi-source add-on model. This allows users and contributors to expand the system through:
- locally created `SKILL.md` files
- imported skill folders
- repository-based skill collections
- remote install sources
- curated pack add-ons
- archive learning sources

This layer may be branded as **Skills.sh**, but the runtime contract remains repository-friendly and markdown-first.

### Add-on Types
V1 should distinguish between five add-on types:
1. **Core Add-ons**: Authoritative skills and agents shipped with the system.
2. **Pack Add-ons**: Curated optional extensions that remain compatible with core guarantees.
3. **Local Installed Add-ons**: Skills explicitly installed into the active project.
4. **User or Global Add-ons**: Skills available across projects at the user level.
5. **Archive Learning Sources**: Skills or skill-like materials stored for agent learning, inspiration, or retrieval, but not automatically trusted for execution.

### Add-on Trust Tiers
Every discovered add-on should have a trust tier:
- `trusted-core`: Shipped with the core system.
- `trusted-pack`: Provided by a curated compatible pack.
- `installed-local`: Installed for this project but not necessarily core-reviewed.
- `installed-global`: Available across projects but lower priority than local project sources.
- `archive-learning-only`: Readable by agents as learning material, not directly executable by default.
- `remote-unverified`: Discovered from remote or external source but not yet promoted into a trusted installed state.

## Core Rule: Archive is not execution.

Archive is learning input unless promoted. A `SKILL.md` dropped into archive may influence the agent as:
- reference material
- reusable pattern source
- comparison point
- candidate skill for later promotion

It must not silently become an executable core skill.

### Recommended Add-on Layout
```txt
addons/
├── registry/
│   └── sources.json
├── installed/
│   ├── core/
│   ├── packs/
│   ├── local/
│   └── global/
├── remote/
│   └── cache/
└── manifests/
```

### Recommended Archive Layout
```txt
archive/
├── raw-skills/
├── imported-material/
├── experiments/
└── learning-sources/
```

## Loading Categories

The loader should classify discovered materials into one of three categories:
1. **Executable**: Can be resolved by the router and used as part of the workflow.
2. **Loadable but restricted**: Can be indexed and inspected but not used for state-changing execution unless promoted.
3. **Learning-only**: Can be read by agents as context or inspiration, but not invoked as runtime logic.

## Source Registry

The system should maintain a registry of discovered sources.
File: `addons/registry/sources.json`

Example shape:
```json
{
  "source_id": "local-skill-001",
  "name": "backend-hardening",
  "type": "skill",
  "origin": "./archive/learning-sources/backend-hardening",
  "scope": "project",
  "trust_tier": "archive-learning-only",
  "install_status": "indexed",
  "runtime_eligible": false,
  "last_validated_at": null
}
```

## Multi-Source Loading Order

When resolving skills or agents, the system should prefer sources in this order:
1. core
2. project-installed local add-ons
3. trusted packs
4. user or global installed add-ons
5. archive learning sources
6. remote unverified sources

This preserves the principle that project-specific trusted logic should win over general-purpose or uncertain sources.

## Conflict Resolution Rules

When names conflict, the system should resolve in this order:
1. core wins over everything
2. project-installed wins over global
3. trusted-pack wins over unverified add-on
4. executable installed source wins over archive learning source
5. if conflict remains ambiguous, halt resolution and require explicit naming or promotion

No silent override should happen between equally plausible third-party sources.

## Skill Loading Rules

A skill is executable only if all of the following are true:
- it is in a valid skill folder shape
- it contains `SKILL.md`
- frontmatter parses successfully
- required schema fields exist
- trust tier allows execution
- no higher-priority conflicting skill blocks it
- it does not violate core pack-boundary rules

## Agent Loading Rules

Agent definitions should load from:
1. core agents
2. project agents
3. pack agents
4. global agents

Agent loading should remain stricter than skill loading. Archive materials must not silently become runtime agents.

Agent definitions should always require:
- valid file structure
- role identity
- tool policy
- stage alignment
- supported skill references

## Learning Source Ingestion

Archive learning sources let contributors and users drop in external skill ideas, preserve useful patterns, teach the agent through examples, and experiment without polluting the trusted runtime surface.

When a new `SKILL.md` appears in archive learning sources, the system should:
1. index it
2. classify it
3. extract metadata if possible
4. mark it as learning-only by default
5. allow later review or promotion

## Promotion Model

A learning-only source may later be promoted into executable add-on status. Promotion should require:
- schema validation
- trust review
- conflict check
- category assignment
- declared scope
- explicit install or approval action

Promotion must be intentional.

## Pack Integration Model

Packs may ship: skills, agents, templates, optional artifact supplements.
Packs must declare: name, compatible core version, provided skills/agents, trust tier, and whether any item is learning-only or executable.
Packs must not: silently replace core contracts, weaken gate logic, or redefine canonical stage meanings.

## Runtime Eligibility

- **executable**: Can be selected by the router.
- **restricted**: Visible but may require explicit opt-in or promotion.
- **learning-only**: Usable only as a reference or learning input.

## Router Interaction

The router should load only runtime-eligible components by default. It may consult learning-only sources when generating suggestions, comparing patterns, or enriching context, but it must not treat them as authoritative execution logic unless promoted.

## Agent Interaction

Agents may consume learning-only sources as contextual material (e.g., studying an archived skill before writing a new one). The agent should surface that it used learning material to keep reasoning visible and auditable.

## CLI Direction

The future CLI should support actions: initialize core layout, scan discovered sources, validate skills, index archive learning sources, install remote skills, promote learning-only sources, and list runtime-eligible add-ons.

## Contribution Direction

- **Core contribution**: Improve the authoritative core.
- **Pack contribution**: Add curated domain-specific behavior.
- **Add-on contribution**: Provide reusable skills, templates, or learning-only materials.

## V1 Boundary

V1 loading model should support: core/skill/agent/pack loading, local/global add-ons, archive learning source indexing, trust tiers, promotion flow, and deterministic precedence rules. It should **not** yet include: remote marketplace execution by default, auto-trusting third-party skills, or autonomous promotion without review.
