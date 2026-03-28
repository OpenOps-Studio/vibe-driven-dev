# Intelligence Layer

## Purpose

This document defines the intelligence layer for Vibe Driven Dev.

The intelligence layer exists to help the system make better early-stage decisions before downstream execution begins.

It is responsible for improving the quality of:
- stack selection
- dependency freshness awareness
- AI provider and model selection for the product itself
- bootstrap artifact generation
- source-aware recommendations
- evidence-backed technical guidance

This layer does not replace the core journey.

It strengthens it.

## Why This Layer Exists

Vibe Driven Dev is not meant to be a static prompt system.

It is meant to help AI coding agents and builders make better decisions before implementation begins.

That means the system should not rely only on:
- stale internal assumptions
- generic best-practice slogans
- hardcoded framework preferences
- one-size-fits-all stack advice
- vague model recommendations for AI-native products

Instead, the system should combine:
- repository context
- project goals
- stage-aware reasoning
- curated internal rules
- external freshness and capability signals
- explicit decision records

## Core Principle

The intelligence layer does not invent truth.

It gathers, scores, compares, and structures decision support.

It should help the system answer questions like:

- What stack best fits this project right now
- What libraries or frameworks are current and stable enough
- Which AI provider and model best fit this product use case
- What bootstrap files should exist before Spec-Kit begins
- Which imported standards or archived sources should influence the workflow

## Scope

The intelligence layer is responsible for:

- stack recommendation logic
- provider and model recommendation logic
- dependency freshness support
- bootstrap artifact planning
- source-aware evidence scoring
- curated import extraction from raw skill repositories
- integration with MCP-backed sources when available

The intelligence layer is not responsible for:

- replacing the router
- changing canonical stage meanings
- bypassing gates
- directly implementing code
- replacing downstream execution systems
- treating external source discovery as automatic trust

## Relationship to the Core Journey

The intelligence layer supports the journey.

It should primarily influence:

- `init`
- `plan`
- `research`
- `blueprint`
- bootstrap generation before Spec-Kit handoff

It may also enrich:
- `detail`
- `qa`
- `handoff`

But it must not silently mutate the journey into a different process.

## Intelligence Layer Responsibilities

The intelligence layer should support six major capabilities.

## 1. Stack Selection Intelligence

This capability helps the system determine the most suitable product stack for a given project.

It should consider:
- product type
- speed to MVP
- maintainability
- ecosystem maturity
- hosting simplicity
- auth and database needs
- AI integration needs
- complexity budget
- team or builder familiarity when known
- dependency freshness
- deployment constraints

This capability should not rely on slogans like "best stack" in isolation.

It should produce:
- a recommendation
- alternatives
- rationale
- accepted tradeoffs
- a decision record when needed

## 2. Dependency Freshness Intelligence

This capability helps the system understand whether a recommended stack or library set is still current enough to trust.

It should consider:
- current stable versions
- deprecations
- maintenance signals
- official documentation currency
- ecosystem activity where relevant
- compatibility with the selected stack

This capability should not assume that remembered versions are still current.

It should use live sources when available.

## 3. AI Provider and Model Selection Intelligence

This capability helps the system choose the most suitable AI provider and model for the product being built.

This is not the model used to code the project.

This is the model the user's product itself will rely on.

Examples:
- an AI copywriter SaaS
- an AI customer support assistant
- an AI multimodal analysis tool
- an AI voice or image product
- an AI workflow wrapper app

The selection logic should consider:
- writing quality
- reasoning quality
- latency
- cost
- context length
- structured output reliability
- multimodal support
- API ergonomics
- provider stability
- safety requirements
- deployment region or policy constraints
- use-case fit

This capability should not hardcode one provider as universally best.

It should evaluate fit for the specific product objective.

## 4. Bootstrap Artifact Intelligence

This capability helps the system generate the right setup files before Spec-Kit begins.

The purpose is to move the builder from vague idea into an organized working repo foundation.

Typical bootstrap artifacts may include:
- `PRD.md`
- `Logic.md`
- `Structure.md`
- `Dependencies.md`
- `Memory.md`
- `anti-hallucination.md`
- `repo.md`
- `Design.md`
- `Constraints.md`
- `Stack-Decision.md`
- `AI-Provider-Decision.md`

This capability should decide:
- which files are necessary
- which files are optional
- what each file should contain
- which stage should create or update them

## 5. Source-Aware Recommendation Intelligence

This capability helps the system learn from multiple sources without collapsing into noise.

It should support:
- core rules
- curated packs
- installed add-ons
- global add-ons
- archive learning sources
- imported raw materials
- promoted skills

This capability should distinguish clearly between:
- trusted execution logic
- learning-only source material
- optional enhancement
- incompatible or stale material

## 6. Imported Standards Extraction Intelligence

This capability defines how large raw repositories such as `coding-standards-skill` should be absorbed without polluting the system.

The raw source should not be copied directly into core.

Instead, the intelligence layer should help extract only the parts that deserve structured use.

These may include:
- engineering guardrails
- audit checklists
- session handoff logic
- architecture review heuristics
- reusable governance patterns

Everything else should remain archived or learning-only unless explicitly promoted.

## Intelligence Layer and MCP

The intelligence layer should support MCP-backed external context when available.

Its job is not to depend blindly on MCP.

Its job is to use MCP as a structured source of freshness and decision support.

## MCP Role

When configured, MCP sources may help the system answer questions such as:

- What is the current stable version of a framework
- What do official docs currently recommend
- What models and providers are currently available
- What pricing or capability differences matter
- What package or provider is deprecated or preview-only
- What ecosystem signals affect a stack choice

## Recommended MCP Source Classes

V1 should recognize these conceptual source classes.

### 1. Registry Sources

Examples:
- package registries
- language package indexes
- release feeds

Purpose:
- version awareness
- freshness checks
- dependency status visibility

### 2. Documentation Sources

Examples:
- official framework docs
- official provider docs
- official SDK docs

Purpose:
- current guidance
- supported features
- lifecycle state
- integration expectations

### 3. Provider Catalog Sources

Examples:
- model catalogs
- provider capability pages
- pricing and limits references

Purpose:
- AI provider and model comparison
- capability fit
- feature availability

### 4. Project Context Sources

Examples:
- local repo files
- project artifacts
- archived skills
- imported rule sets

Purpose:
- context-aware recommendation
- internal relevance scoring
- local workflow adaptation

## MCP Safety Rule

MCP improves freshness.

It does not automatically create trust.

External information must still be:
- relevant
- interpretable
- scored
- attributed internally
- converted into explicit reasoning or decision records

The intelligence layer should never turn raw MCP output directly into silent project truth.

## Core Internal Components

The intelligence layer should eventually include components such as:

```txt
core/
  intelligence/
    source-policy.ts
    stack-selector.ts
    provider-selector.ts
    model-selector.ts
    dependency-freshness.ts
    bootstrap-planner.ts
    evidence-scorer.ts
    import-extractor.ts
```

These names are not final implementation requirements.
They define the conceptual architecture.

## Bootstrap-First Philosophy

Before Spec-Kit begins, Vibe Driven Dev should help the user create a better repo foundation.

This means the system should support a bootstrap package that can be generated early in the journey.

The bootstrap package should:
- reduce ambiguity
- preserve project memory
- define repo intent
- clarify stack and dependency choices
- capture anti-hallucination constraints
- keep design and logic visible

This does not replace later specification work.

It makes later specification cleaner.

## Recommended Bootstrap Artifacts

The system should support early generation of artifacts such as:

### PRD.md
The project definition in user, product, and scope terms.

### Logic.md
Core business or interaction logic the product depends on.

### Structure.md
How the project should be organized conceptually.

### Dependencies.md
The selected or candidate dependency strategy.

### Memory.md
Persistent memory the system should preserve across sessions.

### anti-hallucination.md
Guardrails for what the agent must not invent.

### repo.md
What the repository is, how it is meant to be structured, and what belongs where.

### Design.md
Visual, interaction, and UX direction when relevant.

### Constraints.md
The hard boundaries the project must respect.

### Stack-Decision.md
Why the chosen stack won over alternatives.

### AI-Provider-Decision.md
Why the chosen provider and model fit the product use case.

These artifacts should be generated intentionally, not by default in every case.

## Stack Selection Model

The stack selector should evaluate candidates through explicit criteria.

Recommended criteria include:
- project type
- speed to first useful version
- complexity tolerance
- hosting environment
- auth requirements
- database requirements
- AI integration requirements
- operational simplicity
- ecosystem maturity
- dependency freshness
- future maintainability
- builder familiarity when known

The output should include:
- top recommendation
- alternatives considered
- why the top choice won
- accepted tradeoffs
- what could trigger reconsideration later

## AI Provider and Model Selection Model

The provider selector should evaluate candidates through explicit criteria.

Recommended criteria include:
- use-case fit
- writing quality
- reasoning quality
- structured output reliability
- multimodal capability
- latency
- cost
- API ergonomics
- safety constraints
- context length
- provider maturity
- deployment or policy fit

The output should include:
- top recommendation
- viable alternatives
- why the winner won
- cost and capability caveats
- what conditions would justify switching later

## Decision Discipline

The intelligence layer should feed decision quality, not bypass it.

Any major stack or provider recommendation that materially affects the project should be eligible for:
- decision logging
- revisit conditions
- visible rationale
- accepted tradeoffs

This keeps “intelligent recommendation” from turning into hidden authority.

## Imported Raw Repository Strategy

Large imported raw repositories such as `coding-standards-skill` should be handled in three layers.

### 1. Archive Layer
Keep the raw material intact for reference and learning.
Recommended location: `archive/imported-material/coding-standards-skill/`

### 2. Curated Pack Layer
Extract only reusable, meaningful, runtime-relevant pieces into packs.
Examples: engineering standards pack, session handoff pack, architecture review pack.

### 3. Learning Layer
Allow agents to read selected raw material as learning-only context when useful.
Raw import must not become authoritative core execution logic by default.

## Intelligence Layer and Add-ons

The intelligence layer must be add-on aware.

It should consider:
- core logic first
- trusted packs next
- installed project add-ons next
- global add-ons after that
- archive learning sources as learning input only unless promoted

This keeps recommendations contextual without weakening the trust model.

## Runtime Influence Rules

The intelligence layer may influence:
- recommendations
- ranking
- bootstrap generation
- decision support
- evidence visibility

It must not silently:
- change core stage meanings
- override gates
- convert archive sources into runtime logic
- auto-promote add-ons
- fabricate freshness when no live source exists

## Suggested Skills That Belong to This Layer

The intelligence layer should eventually support skills such as:
- bootstrap-writer
- stack-selector
- ai-provider-selector
- dependency-freshness-check
- import-extractor

These should likely live under:
- `skills/governance/`
- or a dedicated intelligence-related section if needed later

## Suggested Outputs

Typical outputs from the intelligence layer may include:
- `Stack-Decision.md`
- `AI-Provider-Decision.md`
- `AI-Model-Matrix.md`
- `Dependencies.md`
- `repo.md`
- `Memory.md`
- `anti-hallucination.md`

These outputs should remain explicit artifacts, not hidden reasoning.

## Contribution Rule

Contributors adding intelligence-layer logic must declare:
- what decision surface it affects
- what sources it depends on
- whether it requires MCP access
- what artifacts it writes
- what trust assumptions it makes
- what it should do when live freshness data is unavailable

This keeps the layer understandable and auditable.

## V1 Boundary

V1 should support:
- stack recommendation support
- AI provider and model recommendation support
- bootstrap artifact planning
- imported standards extraction strategy
- MCP-aware but not MCP-dependent design
- explicit decision support artifacts

V1 should not yet support:
- autonomous provider switching
- self-rewriting recommendation engines
- hidden scoring systems
- mandatory live network dependency for all decisions
- automatic promotion of imported raw material
- giant marketplace intelligence layers

The first version should remain simple, explicit, and inspectable.
