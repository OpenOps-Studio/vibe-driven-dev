# Versioning and Compatibility

## Purpose

This document defines how Vibe Driven Dev versions its core system and how compatibility should be evaluated across:
- core system releases
- command contracts
- skill schemas
- agent definitions
- packs
- add-ons
- manifests
- artifact contracts
- runtime integrations

Vibe Driven Dev is designed as an extensible, agent-first system. That means versioning is not only about publishing releases; it is also about preserving trust between components that evolve at different speeds.

## Why This Matters

The system supports core logic, optional packs, project-level add-ons, global add-ons, and archive learning sources. Without a clear compatibility model, the system would quickly break in subtle ways (e.g., an add-on assuming an old schema, an agent targeting a renamed stage, etc.).

## Core Principle

Not all change is equal. Some changes are safe, additive, and compatible, while others are behavioral, structural, and breaking. The system must distinguish clearly between them.

## Versioning Scope

VQ should track compatibility across five major surfaces:
1. Core system version
2. Command contract version
3. Skill schema version
4. Agent contract version
5. Add-on and pack compatibility version

## Versioning Goals
- **Predictable**: Clear understanding of change impact.
- **Stable**: Core guarantees do not drift silently.
- **Extensible**: Add-ons evolve without forcing core redesigns.
- **Inspectable**: Runtime can determine compatibility.
- **Honest**: Clear communication when compatibility is uncertain.

## Recommended Versioning Model

Vibe Driven Dev uses Semantic Versioning (`MAJOR.MINOR.PATCH`) for the core.
- `MAJOR`: Breaking changes to contracts, stage meanings, or routing.
- `MINOR`: Backward-compatible feature additions/expansions.
- `PATCH`: Backward-compatible fixes and clarifications.

## Public Contract Surfaces

### 1. Command Contract Version
Governs command names, meaning, stage implications, and handoff semantics. Breaking meaning changes require a major version bump.

### 2. Skill Schema Version
Governs `SKILL.md` frontmatter, required sections, and metadata. New mandatory fields are breaking changes.

### 3. Agent Contract Version
Governs `AGENT.md` metadata, role identity, tool policy, and stage alignment.

### 4. Manifest Contract Version
Governs normalized add-on manifests, trust tiers, and promotion metadata.

### 5. Artifact Contract Version
Governs file identity, required sections, and readiness significance.

## Compatibility Declaration

Alignment does not require identical versions; it requires declared compatibility.
- **Skills/Agents/Packs**: Must declare compatible core ranges and schema/contract versions.
- **Manifests**: Must declare core version and agent target expectations.

### Examples
- **Skills**: `compatibility: { core: "0.1.x", skill_schema: "1.x" }`
- **Agents**: `compatibility: { core: "0.1.x", agent_contract: "1.x" }`

## Compatibility Levels
- **compatible**: Safe to use.
- **compatible-with-warning**: Usable but with non-blocking mismatches.
- **restricted**: Indexed/loadable for learning but not executable runtime logic.
- **incompatible**: Must not be used for runtime execution.

## Breaking vs Non-Breaking Change

### Non-Breaking
- Adding optional metadata.
- Adding new optional artifacts.
- Improving CLI output.
- Adding non-intrusive packs.

### Breaking
- Changing command meanings.
- Renaming canonical stages.
- Redefining handoff/gate rules.
- Changing required metadata without fallback.

## Compatibility Checkpoints
1. **Scan time**: Discovery and indexing.
2. **Validate time**: Explicit checks.
3. **Promotion time**: Before becoming runtime-eligible.
4. **Run time**: Before router selection.

## Core Stability Rule
Canonical stage meanings, command semantics, gate logic, artifact trust, and handoff rules should remain especially stable.

## Pack and Add-on Compatibility
Packs must declare compatibility and must not replace core contracts or bypass gates. Local add-ons are loosely governed but still checked for breaking incompatibilities.

## Archive Learning Source Rule
Archive sources can be legacy or incompatible since they are for learning/inspiration, not authoritative execution.

## Compatibility with Agent Runtimes
VDD remains compatible with systems supporting markdown definitions, YAML frontmatter, and scoped tools (e.g., Claude Code, Codex).

## Deprecation Model
- **active**: Fully supported.
- **deprecated**: Recognized but scheduled for removal.
- **obsolete**: No longer supported for execution.

Visible during scan, validate, doctor, and promotion.

## Migration Principle
Prefer explicit migration notes and visible warnings over silent breakage or auto-mutation of third-party code.

## Runtime Behavior for Incompatibility
- **Core**: High severity error.
- **Packs/Add-ons**: Blocked from execution, kept as restricted/indexed only.
- **Archive**: Available for learning only.

## CLI Direction
CLI should support core versioning, compatibility inspection, and warnings for deprecated/incompatible components.

## V1 Boundary
V1 focus: Semantic versioning, compatibility declarations, check/validate during lifecycle, and trust-level distinctions. No auto-migration or marketplace governance in V1.
