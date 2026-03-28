# Add-on Manifest and Promotion

## Purpose

This document defines how Vibe Driven Dev represents, validates, promotes, and manages add-ons across multiple sources.

An add-on in this system may be:
- a skill
- a skill collection
- an agent definition
- a template bundle
- a pack-like extension
- a learning-only source

Because Vibe Driven Dev is agent-first and multi-source aware, the system must not treat all discovered materials equally.

This document formalizes:
- add-on metadata
- trust status
- runtime eligibility
- promotion rules
- compatibility expectations
- contribution pathways

## Why This Exists

The system allows users and contributors to:
- install skills locally
- load skills globally
- import skill folders from external sources
- drop `SKILL.md` files into archive learning zones
- contribute reusable add-ons from GitHub or local filesystems

That flexibility is valuable.

But flexibility without classification leads to:
- ambiguous loading
- unsafe runtime behavior
- accidental overrides
- hidden incompatibilities
- polluted project truth

The add-on manifest and promotion model exists to prevent those failure modes.

## Core Principle

Discovery is not trust.

Presence is not runtime eligibility.

A discovered add-on may be:
- indexed
- validated
- classified
- restricted
- promoted
- executed

These are different states and must remain distinct.

## Add-on Definition

An add-on is any external or optional unit that extends the system beyond the minimal core.

Examples:
- a local skill folder added to a project
- a remote skill collection installed from GitHub
- a user-global helper skill
- an archived `SKILL.md` used only as learning material
- a curated domain-specific pack
- an extra agent profile for a specific workflow

## Add-on Types

V1 supports the following conceptual add-on types:

### 1. `skill`
A single reusable skill folder with `SKILL.md`.

### 2. `skill-collection`
A directory or repository containing multiple skills.

### 3. `agent`
A runtime agent definition with role and tool policy.

### 4. `template-bundle`
A reusable set of templates or artifact patterns.

### 5. `pack`
A curated extension that may include skills, agents, templates, and supplemental contracts.

### 6. `learning-source`
A source that may teach or inform the agent but is not directly executable by default.

## Add-on Manifest Requirement

Every installed or indexed add-on should have a manifest record, even if the source itself does not ship one.

This means the system may:
- read a source-provided manifest
- or generate an internal normalized manifest after discovery

The loader and router should rely on normalized manifest records.

## Canonical Manifest Goals

The add-on manifest should tell the system:
- what this add-on is
- where it came from
- what scope it belongs to
- whether it is executable
- what trust tier it has
- what it is compatible with
- whether it conflicts with anything
- whether it is learning-only or runtime-eligible

## Canonical Manifest Shape

Recommended normalized manifest shape:

```json
{
  "addon_id": "addon-backend-hardening-001",
  "name": "backend-hardening",
  "type": "skill",
  "source": {
    "kind": "local-path",
    "origin": "./archive/learning-sources/backend-hardening"
  },
  "scope": "project",
  "trust_tier": "archive-learning-only",
  "runtime_eligibility": "learning-only",
  "install_status": "indexed",
  "compatibility": {
    "core_version": "0.1.x",
    "agent_targets": ["claude-code", "codex"],
    "pack_compatible": true
  },
  "validation": {
    "schema_valid": true,
    "content_valid": false,
    "last_validated_at": null
  },
  "promotion": {
    "eligible": false,
    "blocked_reasons": [
      "Missing normalized outputs declaration"
    ]
  }
}
```

## Required Manifest Fields

Every normalized manifest should contain the following minimum fields:
- `addon_id`
- `name`
- `type`
- `source`
- `scope`
- `trust_tier`
- `runtime_eligibility`
- `install_status`
- `compatibility`
- `validation`
- `promotion`

### Field Definitions

#### `addon_id`
A unique stable identifier for the add-on record.
- **Rules**: machine-friendly, stable after indexing, not dependent solely on name.

#### `name`
Human-readable add-on name.
- **Rules**: should match source naming, may differ from `addon_id`.

#### `type`
Allowed V1 values: `skill`, `skill-collection`, `agent`, `template-bundle`, `pack`, `learning-source`.

#### `source`
Describes where the add-on came from (kind, origin).
- **Allowed kind values in V1**: `core`, `pack`, `local-path`, `global-path`, `git-repo`, `url`, `archive`.

#### `scope`
Allowed V1 values: `core`, `project`, `global`, `pack`, `archive`.

#### `trust_tier`
Allowed V1 values: `trusted-core`, `trusted-pack`, `installed-local`, `installed-global`, `archive-learning-only`, `remote-unverified`.

#### `runtime_eligibility`
Allowed V1 values:
- `executable`: May be selected by the router.
- `restricted`: Visible but blocked unless explicitly enabled or promoted.
- `learning-only`: Readable by agents, but not executable as an authoritative unit.

#### `install_status`
Allowed V1 values: `discovered`, `indexed`, `validated`, `installed`, `promoted`, `rejected`.

#### `compatibility`
Describes whether it works with current versions.
- **Recommended fields**: `core_version`, `agent_targets`, `pack_compatible`.

#### `validation`
Tracks passes in structural/content checks (`schema_valid`, `content_valid`).

#### `promotion`
Tracks eligibility and blockers (`eligible`, `blocked_reasons`).

## Add-on Lifecycle

An add-on may move through:
1. **discovered** — System found the source.
2. **indexed** — Manifest created and basic classification done.
3. **validated** — Shape and metadata checked.
4. **installed** — Present in an active scope.
5. **promoted** — Allowed as runtime-eligible.

## Archive Learning Source Rule

A `SKILL.md` dropped into archive is **not** executable by default. It is indexed as `archive-learning-only`. Only explicit promotion changes this.

## Promotion Model

Promotion is the explicit process by which a non-executable or restricted add-on becomes runtime-eligible.

### Promotion Triggers
- Explicit user install/enable.
- Contributor submission to a curated pack.
- CLI validation and approval of local skill.
- Review and upgrade of archive source.

### Promotion Requirements
Checks include: manifest existence, valid structure/contract, conflict resolution, correct trust tier, and explicit approval.

### Promotion Outcomes
- **promoted to executable**: Selected by router.
- **promoted to restricted**: Visible but needs opt-in.
- **rejected**: Annotated with reasons.

### Rejection Rules
Rejected if metadata is missing, schema invalid, stage mapping incoherent, conflicts with core, or weakens protections.

## Compatibility Rules
Add-ons should declare core version expectations, agent runtime targets, and dependencies on packs or canonical stages.

## Core Safety Rule
No add-on may silently redefine canonical stages, handoff rules, gate requirements, or contracts. Add-ons extend; they do **not** replace core authority.

## Conflict Resolution Rules
1. Core wins over all.
2. Project-installed wins over global.
3. Trusted-pack wins over unverified.
4. Executable add-ons win over archive learning sources.
5. Ambiguity halts promotion/selection.

## Agent-First Rule
Agents may use learning-only add-ons for pattern learning or inspiration, but must surface this influence to keep reasoning visible and auditable.

## Suggested Manifest Storage
Stored in `addons/registry/` and `addons/manifests/`.

## CLI Direction
CLI should support: `scan`, `index`, `validate`, `promote`, `reject`, `list`, and `inspect`.

## Contributor Direction
Value through: Learning-source contribution, Runtime add-on contribution, or Pack contribution.

## V1 Boundary
V1 focuses on normalized manifests, trust tiers, lifecycle tracking, and explicit promotion. No automatic reputation scoring or autonomous marketplace acceptance in V1.
