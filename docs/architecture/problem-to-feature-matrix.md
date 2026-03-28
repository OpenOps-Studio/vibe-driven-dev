# Problem-to-Feature Matrix

## Purpose

This document turns the recurring failure modes of vibe coding into explicit VDD problem statements and corresponding product features.

It exists to keep the system grounded in real workflow failures rather than generic AI optimism.

VDD should not be defined only by what commands it has.

It should be defined by which recurring problems it prevents.

## Core Principle

Every important VDD feature should be traceable back to a recurring builder failure.

If a feature does not solve a real breakdown pattern, it should not become core by default.

## Matrix

| Problem | What Actually Breaks | VDD Feature Response | Likely Surface |
| --- | --- | --- | --- |
| Spec blindness | Users ask for features without a clear problem, scope, or success definition. | Guided onboarding, spec-quality checks, minimum question budget, gated start flow. | `/vibe.start`, `spec-quality-checker`, onboarding-guide |
| Context rot | Sessions drift, prior decisions disappear, file boundaries blur, and fixes cause regressions elsewhere. | Live memory, repo map, handoff snapshots, scoped change discipline, change-budget guards. | `Memory.md`, repo map, context-rot guard, session handoff |
| Decomposition deficit | Users cannot turn vague intent into executable work packages. | Decomposition engine, work-package generation, explicit ownership per package, execution checklists. | `/vibe.decompose`, `Logic.md`, `Structure.md`, package planning |
| Manager crisis | Users treat the AI like a magic builder instead of a worker that needs direction and review. | Director mode, delegation matrix, specialist ownership by stage, anti-one-shot guardrails. | orchestrator, delegation engine, specialist capability model |
| Invisible technical debt | Fast generation hides architecture shortcuts, fragile coupling, and long-term cleanup costs. | Architecture ownership, decision ledger, debt register, tradeoff logging. | `decision-ledger`, debt register, blueprint/detail artifacts |
| No technical ownership | The project "works" but nobody can explain why, how, or what depends on what. | Explainability checkpoints, logic explanations, why-this-exists sections on artifacts. | `/vibe.explain`, `Logic.md`, `architecture-baseline.md` |
| Weak review of subtle failure modes | Generated code passes happy paths but breaks under partial failure, rollback, or edge cases. | Failure-mode review, edge-case enumeration, recovery-path checking, adversarial review. | `/vibe.failure-modes`, failure-mode reviewer, QA guardian |
| Shipping without judgment | Users build things that should be reframed, reduced, or not built at all. | Judgment layer, kill criteria, problem validation, scope sanity checks. | `/vibe.risks`, judgment gate, kill-criteria artifact |
| Premature complexity | MVPs get overbuilt with fantasy scaling and unnecessary architecture. | Complexity budget, MVP fit score, smallest-viable-system recommendations, reality checks. | complexity checker, blueprint guardrails, reality-check gate |
| Tool-cost spiral | Repeated loops and shallow fixes burn time and tokens without root-cause progress. | Iteration budgets, repeated-fix detection, escalation after N loops, root-cause notes before retry. | loop guard, issue classifier, root-cause policy |
| Missing observability and validation | Projects move forward without tests, monitoring, or measurable feedback loops. | Validation plans, stronger QA/readiness gate, test bundles, observability checklist. | `/vibe.readiness`, validation plan, production readiness gate |
| No usable handoff | Future maintainers receive code without rationale, assumptions, or artifact trail. | Mandatory handoff package, state continuity, assumptions summary, decision bundle. | `spec-handoff.md`, `execution-entry-summary.md`, handoff manager |
| Domain ignorance | Builders know the tool, but not the actual workflow, users, or edge cases of the domain. | Domain-understanding capture, manual-process-before-software prompts, user-reality notes. | onboarding, PRD, Logic, domain notes |
| False confidence from polished output | The output looks complete, so users trust unstable work too early. | Artifact trust levels, draft vs trusted states, QA guardian veto, truth gating. | artifact registry, trust levels, QA gate |
| Wrong external skills installed, or no skills installed at all | Users cannot tell which capabilities their agent actually needs for the current project. | Skill recommendation layer, capability gap mapping, job bundles, controlled install plans. | `/vibe.skills`, capability bundles, install planning |

## Top Priority Core Features

If VDD must prioritize aggressively, the first three problems to solve as core product features should be:

1. **Spec blindness**
2. **Context rot**
3. **Manager crisis**

These three generate many of the downstream failures that later appear as debugging pain, architecture confusion, or handoff nightmares.

## Problem Clusters

The problems above naturally group into five clusters.

### 1. Clarity Failures

These are failures of understanding before execution:
- spec blindness
- decomposition deficit
- domain ignorance
- shipping without judgment

### 2. Workflow Failures

These are failures of process and control:
- context rot
- manager crisis
- tool-cost spiral

### 3. Design and Architecture Failures

These are failures of system shape:
- invisible technical debt
- no technical ownership
- premature complexity

### 4. Verification Failures

These are failures of review and confidence:
- weak review of subtle failure modes
- missing observability and validation
- false confidence from polished output

### 5. Capability Failures

These are failures of agent enablement:
- wrong external skills installed, or no skills installed at all
- no usable handoff

## Feature Roadmap Mapping

The following VDD features should exist as first-class capabilities.

### 1. Spec Quality Engine

Solves:
- spec blindness
- shipping without judgment

Candidate surfaces:
- `/vibe.start`
- `/vibe.spec-quality`
- `spec-quality-checker`

### 2. Context Rot Protection

Solves:
- context rot
- no usable handoff

Candidate surfaces:
- memory file
- repo map
- scoped-change guards
- handoff snapshots

### 3. Delegation Engine

Solves:
- manager crisis
- decomposition deficit

Candidate surfaces:
- orchestrator delegation policy
- specialist capability profiles
- next-owner hints

### 4. Complexity Budget Checker

Solves:
- premature complexity
- invisible technical debt

Candidate surfaces:
- blueprint guardrails
- reality-check gate
- MVP fit scoring

### 5. Stack and Provider Intelligence

Solves:
- shipping without judgment
- poor fit between project needs and technical choices

Candidate surfaces:
- stack-advisor
- ai-provider-selector
- bundle-aware architecture recommendations

### 6. Failure Mode Reviewer

Solves:
- weak review of subtle failure modes

Candidate surfaces:
- `/vibe.failure-modes`
- failure-mode reviewer
- QA adversarial pass

### 7. Skill Recommendation Layer

Solves:
- wrong external skills installed, or no skills installed at all
- manager crisis for capability selection

Candidate surfaces:
- `/vibe.skills`
- capability bundles
- major capability recommendations like `Spec-Kit` and `Impeccable`

### 8. Production Readiness Gate

Solves:
- missing observability and validation
- false confidence from polished output
- no usable handoff

Candidate surfaces:
- `/vibe.readiness`
- validation plans
- monitoring checklist
- QA and handoff gates

## Problem-to-Command Mapping

Suggested future command surfaces:

- `/vibe.start`
- `/vibe.spec-quality`
- `/vibe.decompose`
- `/vibe.skills`
- `/vibe.risks`
- `/vibe.failure-modes`
- `/vibe.explain`
- `/vibe.readiness`

These commands should not all be built at once.

They should be implemented in priority order based on the matrix above.

## Product Positioning Implication

VDD should be described as:

- an agency operating system for vibe coders
- a pre-execution clarity and control system
- a delegation-first workflow for non-specialist builders

It should not be positioned as:

- just another prompt pack
- a command wrapper
- a generic AI coding toolkit

## Success Criteria

This matrix is useful only if it changes product decisions.

It should be used to:
- justify new core features
- reject low-value additions
- prioritize roadmap work
- keep README and architecture docs aligned with actual user pain
