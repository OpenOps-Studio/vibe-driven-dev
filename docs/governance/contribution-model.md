# Contribution Model

## Purpose

This document defines how people contribute to Vibe Driven Dev.

Vibe Driven Dev is not a loose repository of prompts or random skills. It is an agent-first, contract-driven system with:
- a core orchestration model
- canonical stage semantics
- explicit artifacts
- guarded runtime behavior
- multi-source add-ons
- archive learning sources
- promotion rules

Because of that, contribution must be structured.

## Core Principle

Not every useful contribution belongs in core. Not every discovered skill should become executable. Not every experiment should be promoted.

Vibe Driven Dev stays healthy by separating:
- **core truth**
- **curated extension**
- **local experimentation**
- **learning-only material**

## Contribution Goals
- **Open**: Welcome useful ideas and extensions.
- **Safe**: Do not weaken core guarantees.
- **Scalable**: Grow through clear lanes, not one giant surface.
- **Auditable**: Clear review levels and classification.
- **Experimental**: Friendly to exploration without polluting core.

## Contribution Lanes

### 1. Core Contributions
Authoritative system changes (router, stages, commands, state, agents, skills, artifacts, CLI).
- **Review Level**: Highest (Architectural).
- **Standard**: Must not weaken system integrity or core semantics.

### 2. Pack Contributions
Curated domain-specific functionality (SaaS, AI, Security).
- **Review Level**: High (Structured).
- **Standard**: Compatibility declaration, respect core stages/gates.

### 3. Runtime Add-on Contributions
Executable external units (skill folders, collections, agent definitions).
- **Review Level**: Medium to High.
- **Standard**: Valid structure, compatibility declaration.

### 4. Learning-Source Contributions
Materials to inform or teach agents (raw `SKILL.md`, archived patterns).
- **Review Level**: Low to Medium.
- **Standard**: Understandable, clearly classified as non-authoritative.

### 5. Documentation and Governance
README, docs, guides, migration notes.
- **Review Level**: Medium.
- **Standard**: Improve clarity without contradicting architecture.

## Review Severity Model

- **Level 1: Light** (Docs, Examples, Learning Sources).
- **Level 2: Structured** (Add-ons, Packs, Templates).
- **Level 3: Architectural** (Core system, Commands, Stages, Gates, Artifacts).

## Core Safety Rule
No contribution may silently redefine canonical stages, core handoff rules, gate requirements, or contracts. Add-ons extend; they do **not** replace core authority.

## Promotion Rule
A contribution does not become runtime-eligible just by being merged. Promotion must remain explicit and pass structural/compatibility/trust checks.

## Command and Agent Rules
- **Commands**: Any new `/vibe.*` command or meaning change requires Architectural Review.
- **Agents**: Must declare role, purpose, stage alignment, and tool policy. No anonymous prompt blobs.

## Contribution Classification
Every contribution must be classified as: `core`, `pack`, `runtime add-on`, `learning-source`, `documentation`, or `governance`.

## Maintainer Decision Model
Decisions based on: lane classification, compatibility, trust impact, architectural coherence, and safety.

## V1 Boundary
V1 focus: Structured lanes, explicit promotion, and clear review tiers. No complex governance bureaucracy or automated reputation systems in V1.
