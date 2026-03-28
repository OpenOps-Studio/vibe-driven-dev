# Skill Schema V1

## Purpose

This document defines the authoring contract for all Vibe Driven Dev skills.

A skill in this system is not just a prompt.
It is a reusable operating unit with:
- a clear purpose
- explicit activation conditions
- known inputs
- expected outputs
- stage alignment
- gate awareness
- handoff behavior

The goal of this schema is to make the system:
- consistent
- scalable
- testable
- contributor-friendly
- safe to extend

## Design Goals

The skill schema must be:

### Predictable
A contributor should know exactly how to author a valid skill.

### Readable
A skill should be understandable without reading internal code.

### Stage-aware
A skill should clearly declare where it belongs in the Vibe Driven Dev journey.

### Router-friendly
A skill must expose enough structured metadata for the router to resolve it correctly.

### Pack-compatible
A skill should be portable into future packs without changing the core contract.

## Core Principle

Every skill must answer five questions clearly:

1. What does this skill do
2. When should this skill be used
3. When should this skill not be used
4. What inputs does it require
5. What outputs or artifacts does it produce

If a skill does not answer these clearly, it is not ready.

## Skill Structure

Every skill must live in its own directory.

Minimum structure:

```txt
my-skill/
└── SKILL.md
```

Optional extended structure:

```txt
my-skill/
├── SKILL.md
├── templates/
├── examples/
├── references/
└── scripts/
```

A skill may remain simple, but the folder boundary is required so the system can scale cleanly.

### Required File

Every skill must include a `SKILL.md` file.

This file is the canonical source for:
- metadata
- purpose
- usage rules
- instructions
- output contract

### Required Frontmatter

Every `SKILL.md` must begin with YAML frontmatter.

#### Minimum Required Fields
- `name`
- `description`

These are the minimum common-denominator fields used broadly across the current skills ecosystem.

#### Vibe Driven Dev Required Fields

In Vibe Driven Dev, the minimum required frontmatter is expanded to:

```yaml
---
name: vibe-plan
description: Turn vague product intent into a clear, scoped planning artifact
category: journey
stage: plan
version: 0.1.0
triggers:
  - /vibe.plan
inputs:
  required:
    - target_user
    - problem_context
    - success_definition
  optional:
    - constraints
    - preferred_stack
outputs:
  - problem-statement.md
  - scope.md
gates:
  before: []
  after: []
handoff:
  next:
    - vibe-research
state_effect: write
authority:
  final: product
---
```

## Frontmatter Fields

### name
Unique identifier for the skill.

Rules:
- lowercase only
- hyphen-separated
- stable over time
- should describe the capability, not the implementation

Examples:
- `vibe-plan`
- `security-gate`
- `decision-ledger`

### description
A short, direct explanation of what the skill does and when it should be used.

Good description:
- says what the skill is for
- hints at activation conditions
- avoids generic wording

### category
High-level grouping for the skill.

Allowed V1 values:
- `journey`
- `governance`
- `safety`
- `delivery`
- `pack`

### stage
The system stage this skill belongs to.

Allowed V1 values:
- `init`
- `plan`
- `research`
- `blueprint`
- `detail`
- `qa`
- `handoff`
- `cross-stage`

### version
The current schema or content version for the skill.

Format:
- semantic version string

Examples:
- `0.1.0`
- `1.0.0`

### triggers
List of public or internal triggers that may activate the skill.

Examples:
```yaml
triggers:
  - /vibe.plan
  - internal:plan-recovery
```

### inputs
Structured declaration of expected inputs.

Shape:
```yaml
inputs:
  required:
    - field_a
    - field_b
  optional:
    - field_c
```
Inputs should refer to logical context fields, not implementation-specific variables.

### outputs
List of artifacts or output objects this skill is expected to produce or update.

Examples:
```yaml
outputs:
  - problem-statement.md
  - scope.md
  - assumptions-log.md
```

### gates
Declare gate dependencies.

Shape:
```yaml
gates:
  before:
    - planning-complete
  after:
    - security-gate
```
Use this to make router validation easier and more explicit.

### handoff
Declares what naturally follows this skill.

Shape:
```yaml
handoff:
  next:
    - vibe-research
```
A skill may have zero, one, or multiple next candidates.

### state_effect
Declares whether the skill changes state.

Allowed V1 values:
- `read`
- `write`
- `read-write`

### authority
Declares which decision lens has final authority if the skill produces conflict.

Examples:
```yaml
authority:
  final: product
```
Allowed V1 values:
- `product`
- `staff-engineering`
- `security`
- `orchestration`

## Recommended Optional Fields

These are not mandatory in V1 but strongly encouraged.

### tags
Keywords for discoverability.

### pack
Declares which optional pack owns the skill, if any.

### status
Examples:
- `stable`
- `experimental`
- `internal`

### summary
A slightly richer human-readable description than `description`.

## Body Sections

After the frontmatter, every skill should contain the following sections in order.

### 1. Title
Use a human-readable title.

Example:
`# Vibe Plan`

### 2. Purpose
State the exact job of the skill. Keep it short and concrete.

### 3. When to Use
Describe the situations where this skill should activate. This section should be explicit enough that:
- a contributor understands activation
- the router logic remains auditable

### 4. When Not to Use
Describe invalid or risky usage scenarios. This is required because misuse prevention is part of the system design.

### 5. Required Context
Describe the minimum context needed to execute the skill well. This section should align with the `inputs.required` frontmatter field.

### 6. Assumptions Rules
State what assumptions are allowed and what assumptions are not allowed. This section should reflect the system-wide rule that assumptions may be used only when they do not create hidden safety, compliance, or feasibility risk.

### 7. Steps
Describe the internal execution flow for the skill. Use numbered steps. The steps should be written in a way that is:
- deterministic enough to guide behavior
- flexible enough to support evolution

### 8. Output Contract
Define what the skill must produce. This section should align with the `outputs` frontmatter field.

For each output, specify:
- name
- purpose
- whether it creates or updates
- minimum required contents

### 9. Halt Conditions
Define when this skill must stop instead of continuing.

Examples:
- critical information missing
- unsafe ambiguity
- invalid stage transition
- conflict with system constitution

### 10. Handoff Behavior
State what happens after the skill completes successfully.

Examples:
- recommend next command
- update state
- trigger gate review
- prepare for handoff

## Canonical Skill Template

Use this template when creating new skills:

```markdown
---
name: my-skill
description: Explain what this skill does and when to use it
category: journey
stage: plan
version: 0.1.0
triggers:
  - /vibe.example
inputs:
  required:
    - context_a
  optional:
    - context_b
outputs:
  - example-output.md
gates:
  before: []
  after: []
handoff:
  next: []
state_effect: write
authority:
  final: orchestration
---

# My Skill

## Purpose
Describe the exact job of this skill.

## When to Use
Describe valid activation conditions.

## When Not to Use
Describe invalid or unsafe usage conditions.

## Required Context
List the minimum useful context.

## Assumptions Rules
Describe what assumptions are allowed and what must never be assumed.

## Steps
1. Step one
2. Step two
3. Step three

## Output Contract
Describe the output artifacts and what each must contain.

## Halt Conditions
List explicit stop conditions.

## Handoff Behavior
Describe the next valid step after completion.
```

## Naming Rules

Skill names should be:
- short
- descriptive
- action-oriented when appropriate
- stable across versions

Avoid:
- vague names
- internal jokes
- overloaded names
- names tied to one narrow implementation detail

**Bad**: `magic-router-helper`, `stuff-doer`, `v2-plan-final`
**Good**: `vibe-plan`, `security-gate`, `spec-handoff`

## Authoring Rules

- **Rule 1**: A skill must do one coherent job.
- **Rule 2**: A skill must declare stage alignment clearly.
- **Rule 3**: A skill must not silently bypass gates or upstream requirements.
- **Rule 4**: A skill must define halt conditions.
- **Rule 5**: A skill must define concrete outputs whenever it changes state.
- **Rule 6**: A skill must not duplicate an existing stable skill without a clear reason.
- **Rule 7**: A pack skill must not weaken the guarantees of the core system.

## Validation Rules

A valid V1 skill must pass the following checks:
- has a folder
- includes `SKILL.md`
- frontmatter is valid YAML
- required fields exist
- category is valid
- stage is valid
- triggers are syntactically valid
- outputs are declared if the skill writes state
- body sections are present
- halt conditions exist
- handoff behavior exists

## Contribution Guidance

When contributors propose new skills, they should also declare:
- whether the skill belongs in core or a pack
- whether it overlaps an existing skill
- what stage it belongs to
- what artifacts it creates or updates
- what risks it introduces if misused

## V1 Boundary

This schema is intentionally strict. The goal is not maximum flexibility; the goal is consistency and safe extensibility. Future versions may add richer metadata, but V1 should remain small enough for contributors to understand quickly and follow reliably.
