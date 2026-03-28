# Core Operating Rules

## Purpose

This document defines the foundational rules that govern all agents, skills, routers, and runtime components in Vibe Driven Dev.

These rules are not suggestions.

They are the operating Constitution of the system.

Any component that violates these rules is operating outside the governance boundary of VDD and must halt or escalate.

---

## 1. Stage Integrity

### 1.1 Stage Order is Enforced

The canonical stage order is:

```
init → plan → research → blueprint → detail → scaffold → qa → handoff
```

No stage may be skipped unless an explicit skip policy is defined in the router for that stage.

No agent may self-declare a stage as complete.

Stage promotion is the sole responsibility of the `RouterEngine`.

### 1.2 Stages Cannot Be Merged

Each stage has a distinct purpose and artifact contract.

Merging stages (e.g., "plan + research simultaneously") is not permitted.

Agents and skills must operate within their declared `stage_alignment`.

### 1.3 Resume Requires State Validation

When resuming a project, the system must:

1. Load the persisted state from `.vdd/project-state.json`.
2. Validate the schema.
3. Confirm the loaded stage is trusted before proceeding.

If the state is missing, corrupted, or schema-invalid, the system must halt and report clearly rather than guess a recovery path.

---

## 2. Authority Hierarchy

### 2.1 Authority Levels

The system recognizes four authority levels:

| Level | Role | Can Do |
|-------|------|--------|
| `orchestration` | Orchestrator | Route, delegate, coordinate |
| `product` | Planner | Problem framing, scope, success criteria |
| `staff-engineering` | Architect, Detailer, QA Guardian | Architecture, detail, quality gates |
| `handoff` | Handoff Manager | Close the journey, produce final artifacts |

### 2.2 Authority Does Not Transfer Upward

A lower-authority component cannot grant permissions above its level.

A planner cannot approve architecture decisions.
An architect cannot approve handoff.

### 2.3 Specialist Agents Own Their Domain

When a command belongs to a specialist domain, it must be delegated.

The orchestrator must not absorb specialist work to avoid delegation.

---

## 3. Halt vs. Failure

### 3.1 Halt is Not Failure

Halting is a valid, expected system behavior.

The system should halt when:
- Required context is missing.
- A gate is not passed.
- A trusted artifact is absent.
- Stage prerequisites are not met.
- A silent promotion would occur.
- An assumption would create hidden safety or feasibility risk.

A halt must always produce a clear, human-readable reason.

### 3.2 Failure is Different

Failure means an unexpected, unhandled error.

Failures should be surfaced explicitly — never silently swallowed.

The system must prefer explicit halts over silent fallbacks.

### 3.3 Blocking is Respected

If a specialist agent or gate issues a block, no other component may override it silently.

A block can only be resolved by:
- Satisfying the condition that caused it.
- Explicit human override with documented rationale.

---

## 4. Add-On Trust Policy

### 4.1 Trust Levels

| Source | Trust Level | Can Execute? |
|--------|-------------|--------------|
| Core skills | Trusted | Yes |
| Installed packs | Trusted (scoped) | Yes, within pack scope |
| Local project add-ons | Trusted (project) | Yes, within project scope |
| Global user add-ons | Trusted (user) | Yes, within user scope |
| Archive learning sources | Learning-only | No — read reference only |
| Unvalidated imports | Untrusted | No — must be promoted first |

### 4.2 Trust Does Not Propagate

Installing a pack does not make all its transitive dependencies trusted.

Each component in a pack must pass validation before it can run.

### 4.3 Priority Order

When the same skill or agent is defined in multiple scopes, the priority order is:

```
core > project > user > pack > archive
```

The first match in priority order wins.

---

## 5. Archive Is Learning-Only by Default

### 5.1 Archive Cannot Execute

Files in `archive/` are reference material only.

No agent, skill, or router component may treat archive content as runtime truth.

### 5.2 Promotion Required for Execution

To use archived content in execution:

1. The material must pass the `import-extractor` review.
2. It must be promoted to a curated pack or core layer.
3. The promotion must be visible and attributed.

Raw import must never become authoritative core execution logic by default.

### 5.3 Archive Can Be Read as Learning Context

Agents may read archive material as background context only when explicitly configured.

Reading archive is not the same as trusting it.

---

## 6. No Silent Promotion

### 6.1 Promotion Must Be Explicit

Nothing moves from `archive → pack`, `pack → core`, or `learning → trusted` without an explicit promotion action.

Silent promotion is a system violation.

### 6.2 Promotion Requires Attribution

Every promotion must record:
- What was promoted.
- From which source.
- By which component.
- Why.
- What trust level it now holds.

---

## 7. No Speculative Decisions Without Visible Rationale

### 7.1 Stack Decisions Must Be Explicit

The system must not recommend a stack, framework, or library without providing:
- A recommendation.
- Alternatives considered.
- Rationale for the winner.
- Accepted tradeoffs.
- Conditions that would trigger reconsideration.

Slogans like "best stack for this use case" without structure are not acceptable outputs.

### 7.2 Model and Provider Decisions Must Be Explicit

AI provider and model recommendations must include:
- Use-case fit analysis.
- Cost and latency considerations.
- Caveat conditions.
- Revisit triggers.

The system must not hardcode one provider as universally optimal.

### 7.3 Assumptions Must Be Surfaced

Non-trivial assumptions made during planning, research, or architecture must be:
- Written to the assumptions log.
- Associated with the stage that introduced them.
- Visible before the next stage begins.

Invisible assumptions are a governance violation.

---

## 8. MCP Usage Rules

### 8.1 MCP Improves Freshness — It Does Not Grant Trust

External information retrieved via MCP must still be:
- Relevant to the current decision context.
- Interpretable by the requesting component.
- Scored against existing internal knowledge.
- Attributed explicitly in any output.

### 8.2 MCP Is Not a Dependency

The system must function without MCP access.

When MCP is unavailable, the system must fall back to internal knowledge gracefully, and declare the `freshness_status` as `unverified` in any output.

### 8.3 MCP Cannot Override Governance

Even if an MCP source contradicts core rules, the core rules take precedence.

MCP is an input — not a governor.

---

## 9. What Counts as a Trusted Artifact

### 9.1 Trusted Artifacts

An artifact is trusted when:
- It was produced by a VDD skill in a completed stage.
- It was written to the artifact registry.
- It has not been manually mutated outside the VDD workflow.
- It passed any required gate evaluation.

### 9.2 Untrusted Artifacts

An artifact is untrusted when:
- It was produced outside the VDD workflow.
- It exists in the project directory but was not registered.
- It was produced by an archive source without promotion.
- It cannot be verified against its producing stage.

Untrusted artifacts may be read as context but must not be treated as authoritative project truth.

### 9.3 Artifact Registry Is the Ground Truth

`core/artifacts/artifact-registry.ts` defines the contracts for all artifacts.

No artifact that is not declared in the registry may be treated as an authoritative system output.

---

## 10. What Can and Cannot Become Project Truth

### 10.1 What Can Become Project Truth

- State written by the `StateManager` after valid stage transitions.
- Artifacts produced by trusted skills in their declared stage.
- Decisions logged by the `decision-ledger` skill.
- Gate pass results recorded by the router.

### 10.2 What Cannot Become Project Truth

- Archive material used directly as execution logic.
- Unvalidated external input.
- Agent-improvised conclusions without gate backing.
- Decisions made without visible rationale.
- Stage completions declared by anything other than the RouterEngine.
- Speculative recommendations without scoring.
- MCP outputs used without internal attribution.

---

## 11. Enforcement

These rules are enforced by:

| Mechanism | Enforces |
|-----------|----------|
| `RouterEngine` | Stage order, valid transitions, halt on invalid state |
| `StateManager` | Schema validation, trusted state load |
| `CommandParser` | Valid command surface, rejection of unknown commands |
| `Gates` | Stage readiness, artifact presence, blocker detection |
| `Agents` | Authority scope, delegation when out of domain |
| `SourceLoader` | Trust level assignment per source type |

Any component that cannot enforce a rule must escalate rather than silently bypass.

---

## Version

This constitution is version `0.1.0` and is compatible with VDD core `0.1.x`.

Changes to these rules require a constitution version bump and a documented rationale.
