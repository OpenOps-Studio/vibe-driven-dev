# Autopilot Mode

## Purpose

This document defines how Vibe Driven Dev should behave when the user wants the system to drive the workflow instead of manually choosing commands.

The goal is to move VDD from a command-aware framework into a mission-driven operator that can:
- ask the next best question
- continue automatically when risk is low
- stop only at meaningful checkpoints
- expose major decisions without forcing the user to manage stage syntax

Autopilot is not "do everything silently."

Autopilot is "continue unless blocked, summarize at checkpoints, and ask only when a human decision is actually required."

## Problem Statement

The existing router and stage model are structurally sound, but they still leave too much workflow burden on the user.

Without an autopilot operating layer, the user still has to infer:
- which command comes next
- whether more answers are needed
- when the system can continue safely
- when a decision is high-impact enough to require explicit approval

That produces a guided framework, not a real operator.

## Core Principle

The user should think in missions and checkpoints.

The system should think in commands, stages, artifacts, and delegation.

This means:
- user-facing UX is mission-driven
- internal orchestration remains stage-driven
- checkpoints are the bridge between the two

## Non-Goals

Autopilot mode does not:
- remove the canonical state machine
- bypass security or approval-sensitive decisions
- invent missing project truth to avoid asking necessary questions
- hide major tradeoffs behind silent defaults
- replace artifact contracts with chat summaries

## User Modes

VDD should support three explicit user-facing modes.

### 1. Guided

Use when the user is non-technical or wants reassurance and explanations.

Behavior:
- ask more often
- explain why the next step exists
- continue only after explicit confirmation
- minimize hidden assumptions

### 2. Autopilot

Use when the user wants the system to keep moving until a meaningful blocker appears.

Behavior:
- ask the fewest high-value questions possible
- continue automatically across low-risk transitions
- expose checkpoints instead of step-by-step confirmations
- stop only for blockers, approvals, or high-impact decisions

### 3. Expert

Use when the user prefers direct command control.

Behavior:
- expose commands directly
- assume the user understands stage boundaries
- preserve all guardrails, but reduce conversational guidance

## Entry Point

The preferred user-facing entry point for non-technical operation is:

- `/vibe.start`

In autopilot mode, `/vibe.start` should behave like the start of a guided operating loop rather than a single command execution.

## Autopilot Operating Loop

Autopilot mode should run as a conductor above the router.

The router remains responsible for:
- valid transitions
- specialist routing
- artifact simulation and stage results
- guardrail enforcement

The autopilot conductor is responsible for:
- deciding whether to ask or continue
- deciding which internal command to run next
- deciding whether the current checkpoint is complete
- deciding when user approval is required
- deciding when to recommend model escalation

## Recommended Internal Modules

Autopilot mode should eventually live under:

```text
core/autopilot/
  conductor.ts
  question-engine.ts
  checkpoint-policy.ts
  confidence-engine.ts
  next-step-engine.ts
  escalation-policy.ts
```

### `conductor.ts`

The primary loop manager.

Responsibilities:
- receive current state plus latest user input
- choose ask vs continue
- execute low-risk internal steps
- summarize completed work at checkpoints
- stop when a high-impact decision or blocker appears

### `question-engine.ts`

Chooses the smallest, highest-value next question.

Responsibilities:
- avoid fixed onboarding forms
- derive adaptive questions from current uncertainty
- minimize user burden
- prefer one strong question over several weak ones

### `checkpoint-policy.ts`

Defines where autopilot must summarize and pause.

Responsibilities:
- define checkpoint boundaries
- classify checkpoint severity
- decide whether autopilot may cross the checkpoint automatically

### `confidence-engine.ts`

Measures whether the system knows enough to continue safely.

Responsibilities:
- evaluate confidence in intent capture
- evaluate whether gaps are low-risk or high-risk
- distinguish assumption-safe vs question-required cases

### `next-step-engine.ts`

Picks the next internal action.

Responsibilities:
- choose the next command
- choose the next specialist
- choose whether to continue or stop
- prefer the smallest valid progress step

### `escalation-policy.ts`

Handles stage-aware model and capability escalation.

Responsibilities:
- recommend stronger models only when justified
- keep escalation advisory unless a future policy says otherwise
- emit explicit user-facing handoff prompts

## Command-Driven vs Mission-Driven UX

Autopilot mode should hide most command sequencing from the user.

### Internal Reality

The system still runs:
- `/vibe.init`
- `/vibe.plan`
- `/vibe.research`
- `/vibe.blueprint`
- `/vibe.detail`
- `/vibe.scaffold`
- `/vibe.qa`
- `/vibe.handoff-to-spec`

### User-Facing Reality

The user should mostly see missions such as:
- capture the project intent
- turn the idea into a scoped plan
- build the bootstrap foundation
- choose the technical direction
- create the PRD package
- prepare execution handoff

## Missions

Autopilot mode should group internal commands into user-facing missions.

### Mission 1: Capture Intent

Purpose:
- turn natural language into initial project truth

Typical internal actions:
- `/vibe.start`
- onboarding question loop
- state seeding

Typical outputs:
- project type
- target user
- problem statement seed
- AI usage
- delivery preference
- initial constraints

### Mission 2: Build Planning Package

Purpose:
- turn intent into a credible project direction

Typical internal actions:
- `/vibe.init`
- `/vibe.plan`
- `/vibe.research`

Typical outputs:
- `problem-statement.md`
- `scope.md`
- `success-definition.md`
- `research-summary.md`
- `risk-register.md`
- `assumptions-log.md`

### Mission 3: Lock Technical Direction

Purpose:
- define the highest-impact technical choices before deep writing

Typical internal actions:
- `/vibe.blueprint`
- stack advisory
- provider advisory
- event relevance check
- skills recommendation

Typical outputs:
- `architecture-baseline.md`
- `system-boundaries.md`
- `analytics-outline.md`
- optionally `Event-Architecture.md`

### Mission 4: Build PRD Package

Purpose:
- produce project truth strong enough for execution

Typical internal actions:
- `/vibe.detail`
- `/vibe.scaffold`
- model escalation recommendation if needed

Typical outputs:
- `technical-detail.md`
- `validation-plan.md`
- `execution-notes.md`
- `PRD.draft.md` or `PRD.full.md`
- governance foundation files

### Mission 5: Prepare Execution Handoff

Purpose:
- confirm readiness for downstream implementation runtime

Typical internal actions:
- `/vibe.qa`
- `/vibe.handoff-to-spec`

Typical outputs:
- `qa-report.md`
- `go-no-go.md`
- handoff package

## Checkpoints

Autopilot mode should stop at checkpoints, not after every internal step.

### Checkpoint A: Intent Captured

Reached when:
- target user is clear enough
- problem statement is specific enough
- success definition exists
- core constraints are known or safely assumed

User-facing summary should include:
- what the system understood
- what assumptions were made
- what mission is next

### Checkpoint B: Planning Package Complete

Reached when:
- init, plan, and research artifacts exist
- obvious contradictions are resolved or exposed

User-facing summary should include:
- what was created
- top risks
- whether autopilot can continue to technical strategy

### Checkpoint C: Technical Strategy Locked

Reached when:
- blueprint outputs exist
- stack direction is narrow enough
- provider relevance is understood
- event architecture is either justified or explicitly not justified

User-facing summary should include:
- chosen direction
- unresolved high-impact decisions
- whether deep PRD work is now justified

### Checkpoint D: PRD Threshold Reached

Reached when:
- detail artifacts are credible
- scaffold can generate project truth
- model escalation decision is visible

User-facing summary should include:
- whether current output is `PRD.draft.md` or `PRD.full.md`
- whether the stronger-model path was accepted or deferred
- what the next best action is

### Checkpoint E: Execution Handoff Ready

Reached when:
- QA stage marks the project as handoff-ready
- blockers are resolved or explicitly accepted

User-facing summary should include:
- go/no-go posture
- remaining risks
- readiness for Spec-Kit or downstream execution

## Auto-Continue Policy

Autopilot should use one default rule:

continue automatically unless blocked

That means the system should proceed without asking for confirmation when:
- the next step is low-risk
- the necessary data is already present
- missing data can be filled with a safe, visible assumption
- the decision does not create major cost, lock-in, security, or compliance consequences

## Confidence Model

Autopilot mode should classify missing information into three buckets.

### 1. Sufficient

The system has enough information to continue safely.

Action:
- continue automatically

### 2. Incomplete but Safe

The system is missing information, but the gap can be covered with a reasonable assumption.

Action:
- continue automatically
- record the assumption
- surface the assumption at the next checkpoint

### 3. Incomplete and High-Risk

The system is missing information that could materially change:
- stack choice
- provider choice
- architecture boundaries
- compliance posture
- event topology
- handoff readiness

Action:
- stop and ask the smallest next question

## Question Loop Rules

Autopilot questions must be adaptive.

The system should never behave like a fixed onboarding form if the previous answer already narrowed the space.

Examples:
- if the user already says the product uses AI, do not ask whether it uses AI
- if the user clearly describes an internal admin tool, ask about roles or integrations, not about public-market positioning
- if the project already sounds async-heavy, ask about approval flows, notifications, or retries before asking about generic frontend preferences

Question selection rule:
- ask the next question that eliminates the most high-impact uncertainty with the least user effort

## Stop Conditions

Autopilot should stop and ask for user input when one of the following is true.

### High-Impact Technical Decision

Examples:
- final stack choice with significant lock-in
- AI provider choice
- external platform dependency with cost implications

### Security or Compliance Ambiguity

Examples:
- unclear handling of user data
- unclear authentication or authorization boundaries
- unclear third-party data movement

### Event Architecture Ambiguity

Examples:
- project is async-heavy
- multiple consumers appear likely
- eventual consistency might be required
- event architecture is relevant but still unresolved

### Inconsistent Project Truth

Examples:
- the user says "fast MVP" and also demands strong enterprise guarantees immediately
- the user describes both an internal tool and a customer-facing SaaS without clarifying scope

### Premium PRD Threshold

Examples:
- scaffold is about to create long-form project truth
- stronger-model path is recommended
- the system needs to know whether to produce `PRD.draft.md` or `PRD.full.md`

## Model Escalation in Autopilot

Autopilot mode must keep model escalation stage-aware and advisory.

### When To Recommend

Recommend a stronger model when:
- scaffold is producing PRD-heavy truth
- deep architecture synthesis is required
- the project is AI-native
- the project spans multiple modules or surfaces
- the user wants team-ready or investor-grade documents

### Required Behavior

If escalation is deferred:
- continue without blocking
- label the artifact honestly as `PRD.draft.md`
- return a clear handoff prompt
- return explicit human next steps

If escalation is accepted:
- continue with the stronger-model path
- target `PRD.full.md`

## Approval Policy

Autopilot should not ask for approval on every stage transition.

It should ask for approval only when the next step has meaningful consequences such as:
- cost or model escalation
- provider lock-in
- architecture lock-in
- security-sensitive design
- execution handoff

## User-Facing Response Shape

At checkpoints, the system should return:

1. what mission just completed
2. what artifacts or decisions were produced
3. what assumptions were made
4. whether autopilot can continue
5. the next recommended action
6. any explicit human next steps

The user should never have to inspect raw internal command sequencing to understand what the system is doing.

## Relationship To Existing Documents

This document is the operating contract for autopilot behavior.

Related documents:
- `guided-user-workflow.md` defines the broader non-technical guidance model
- `model-escalation-policy.md` defines when stronger-model advice is justified
- `event-architecture-policy.md` defines when event artifacts become required
- `artifact-contracts.md` defines which outputs are authoritative

## Immediate Implementation Implications

The next runtime iterations should prioritize:

1. introducing an autopilot conductor layer above the router
2. separating user-facing missions from internal commands
3. making checkpoint summaries first-class outputs
4. adding confidence thresholds for ask vs assume vs continue
5. making explicit human next steps part of the result contract
6. keeping auto-continue as the default unless a real blocker appears

## Success Criteria

Autopilot mode is working when a non-technical user can:
- describe the project in natural language
- answer only the smallest necessary set of questions
- watch the system continue through low-risk setup work automatically
- be stopped only at meaningful checkpoints
- understand what was done and what decision is needed next

At that point, VDD stops feeling like a command framework and starts feeling like a real operator.
