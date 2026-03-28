# System Positioning

## What This Project Is

Vibe Driven Dev is an open framework for turning vague product ideas into safer, more structured, and execution-ready systems.

It is built for founders, product innovators, and vibe coders who want to move fast with AI, but do not want to inherit the usual chaos that comes from unstructured prompting and premature implementation.

The system is designed to reduce failure patterns such as:
- weak problem framing
- unclear scope
- fragile architecture
- hidden security gaps
- missing validation paths
- early technical debt
- unlogged technical tradeoffs

Vibe Driven Dev is not just a collection of prompts or isolated skills.

It is a guarded operating model.

## The Core Promise

Vibe Driven Dev helps users build with speed, but not blindly.

The framework guides a project through a structured journey before execution so that product direction, architecture, risks, assumptions, and readiness are visible before implementation begins.

The promise is simple:

Build fast  
Think clearly  
Ship safely

## Who This Is For

### Primary Users

- Founders building early-stage products
- Product innovators exploring MVPs and PoCs
- Vibe coders who want stronger guardrails
- Small teams moving quickly with AI-assisted workflows

### Secondary Users

- Technical operators supporting founder-led builds
- AI-native product teams
- Open-source contributors building reusable packs and skills
- Builders who need structured project handoff into execution systems

## The Problem This Solves

AI-assisted building is fast, but the default mode is often chaotic.

Users can generate code quickly, but still fail because they do not have:
- a validated problem statement
- explicit scope boundaries
- structured research
- coherent architecture
- decision traceability
- quality and safety gates
- a clean transition into implementation

In practice, many MVPs fail before launch not because builders are slow, but because they move without enough structure.

Vibe Driven Dev exists to solve that gap.

## What Vibe Driven Dev Owns

Vibe Driven Dev owns pre-execution clarity.

That includes:
- framing the problem
- constraining the scope
- clarifying the audience
- defining success
- surfacing assumptions
- grounding decisions
- designing a viable blueprint
- checking risks and readiness
- preparing a handoff package for execution

## What Vibe Driven Dev Does Not Own

Vibe Driven Dev does not aim to replace full implementation workflows.

It does not try to be:
- a source code framework
- a deployment platform
- a backend runtime
- a visual builder
- a replacement for structured implementation systems

Its job is to prepare the project properly before execution and then transition it cleanly into the next system.

## Relationship to Spec-Kit

Vibe Driven Dev and Spec-Kit are complementary.

Vibe Driven Dev owns the stage before structured execution.

Spec-Kit owns the structured execution workflow.

This means the intended journey is:

1. Use Vibe Driven Dev to go from idea to execution readiness
2. Use handoff artifacts to transition into Spec-Kit
3. Continue execution through a spec-driven implementation path

In short:

Vibe Driven Dev owns pre-execution clarity  
Spec-Kit owns structured execution

## Core Design Principles

### 1. Clarity Before Implementation
No implementation path should begin before the system understands what is being built, for whom, and why.

### 2. Safe Acceleration
Speed matters, but speed without guardrails creates expensive problems later.

### 3. Explicit Assumptions
Assumptions are allowed when safe, but they must be visible and revisitable.

### 4. Decision Traceability
Major product and technical decisions must be logged, not implied.

### 5. Guarded Transitions
The user should not move from one stage to another without satisfying the conditions for that transition.

### 6. Modular Extensibility
The system should support reusable skills, packs, and domain-specific extensions without bloating the core.

### 7. Open Source Friendliness
The architecture should remain understandable, composable, and contributor-friendly.

## System Shape

The project is designed as four major layers:

### Constitution Layer
The non-negotiable rules, constraints, and safety boundaries.

### Orchestration Layer
The execution rounds, stage transitions, gates, and handoff logic.

### Skills Layer
Reusable `SKILL.md` units that perform focused work inside the system.

### Artifact Layer
The documents, records, and outputs created across the journey.

## Intended Journey

The default journey looks like this:

1. `/vibe.init`
2. `/vibe.plan`
3. `/vibe.research`
4. `/vibe.blueprint`
5. `/vibe.detail`
6. `/vibe.qa`
7. `/vibe.handoff-to-spec`

Optional support commands may include:
- `/vibe.next`
- `/vibe.resume`
- `/vibe.status`
- `/vibe.decide`
- `/vibe.assumptions`

## Anti-Goals

This project should not become:
- a random prompt dump
- a giant uncurated skill warehouse
- an agent zoo with no orchestration boundaries
- a vague productivity layer with unclear ownership
- a replacement for every downstream build system

If the system starts trying to do everything, it will lose clarity.

## Open Source Direction

The project should evolve in this order:

1. Core system definition
2. Router and stage model
3. Skill schema and authoring rules
4. Initial journey skills
5. CLI bootstrap
6. Handoff integration
7. Optional packs
8. Contributor ecosystem

The core must remain small, opinionated, and stable.

Optional functionality should grow through packs, not by bloating the core.

## Contribution Direction

Contributors should be able to help in three ways:

### Core Contributions
Improvements to orchestration, schemas, gates, and router behavior.

### Skill Contributions
New `SKILL.md` units that fit the system contract.

### Pack Contributions
Optional domain-specific extensions such as:
- SaaS pack
- frontend pack
- AI agents pack
- security pack

All contributions should preserve the core positioning of the project.

## Positioning Summary

Vibe Driven Dev is a guarded operating system for early product building with AI.

It helps users move from messy intent to execution readiness.

It does not replace implementation frameworks.

It prepares projects for them.
