# Skill Recommendation Layer

## Purpose

This document defines the architecture for `/vibe.skills`.

`/vibe.skills` is not a marketplace clone.

It is a project-aware advisor layer that helps a coding agent:
- understand the current project
- detect the active agent runtime
- discover relevant skills from the open skills ecosystem
- rank them by actual fit
- generate a safe install plan
- optionally assist with controlled installation

The main external discovery surface for V1 is `skills.sh`.

## Why This Matters

One of the biggest problems for vibe coders is not installation itself.

It is selection.

Users often do not know:
- which skills improve their coding agent meaningfully
- which skills match their current stack
- which skills are useful for the active runtime
- which skills overlap with capabilities they already have
- which skills are worth installing now versus later

Without a recommendation layer, skill discovery becomes:
- noisy
- popularity-driven
- runtime-blind
- repetitive
- hard for non-technical users to trust

`/vibe.skills` exists to solve that.

## Core Principle

Recommend based on project fit first.

Not popularity first.

The system should rank skills by how much they improve the current project and the current coding runtime, not by raw marketplace visibility alone.

## Command Role

`/vibe.skills` is a cross-stage advisor command.

It is not a new journey stage.

It belongs to the intelligence and governance layer and can be invoked:
- after `/vibe.init`
- after `/vibe.scaffold`
- during `/vibe.status`
- on explicit user request

## V1 Goals

- discover candidate skills from `skills.sh`
- infer what the current project needs
- detect the runtime surface when possible
- score skills using a transparent weighted model
- return a shortlist with simple explanations
- support recommendation, explanation, and install-plan modes

## V1 Non-Goals

- building a new skill marketplace
- auto-installing large sets of skills without a controlled plan
- replacing runtime-native package or extension managers
- executing remote code without explicit user-facing install intent
- treating leaderboard popularity as sufficient evidence of fit

## User Experience Goal

For non-technical users, `/vibe.skills` should feel like:
- an advisor
- a translator
- an installer planner

It should answer:
- what your project seems to need
- which skills are best to add now
- why these skills matter
- how to install them safely
- what improvements they unlock

## Runtime Position

The skill recommendation layer sits above direct runtime installation.

It consumes:
- project context
- runtime detection signals
- current VDD state
- installed skill inventory
- marketplace discovery results

It produces:
- ranked recommendations
- explanations
- install plans
- optional runtime-specific install actions

## Main Architecture

The V1 architecture should be split into three surfaces:

1. Documentation
2. Skill contract
3. Intelligence engine

### 1. Documentation

Primary architecture note:
- `docs/architecture/skill-recommendation-layer.md`

### 2. Skill contract

Recommended contract location:
- `skills/advisor/skill-recommender/SKILL.md`

This skill defines the operator behavior and response shape for recommendation output.

### 3. Intelligence engine

Recommended implementation location:
- `core/intelligence/skill-recommender.ts`

This engine handles:
- project feature extraction
- runtime detection input
- discovery result normalization
- scoring
- deduplication
- install plan generation

## Recommendation Lifecycle

`/vibe.skills` should run in five phases.

### 1. Project Understanding

The command should inspect the current project and extract signals such as:
- project type
- frontend-heavy versus backend-heavy shape
- AI integration needs
- auth needs
- database needs
- testing gaps
- performance needs
- deployment needs
- security-sensitive areas

Preferred inputs include:
- `PRD.md`
- `Dependencies.md`
- `Structure.md`
- `Memory.md`
- provider or stack decision artifacts if present
- repository layout and package manifests

### 2. Runtime Detection

The command should detect which coding runtime is active or being targeted.

Examples:
- Claude Code
- Codex
- Cursor
- Windsurf
- OpenCode
- Gemini CLI
- fallback generic mode

This matters because runtime capability affects recommendation quality.

Examples:
- Claude Code benefits from agent and skill-native installs
- Cursor, Windsurf, and OpenCode may fit best with `AGENTS.md` plus rules or config
- Gemini CLI may fit best with commands, extensions, and MCP-aware setup

### 3. Skill Discovery

The primary discovery source in V1 is `skills.sh`.

Discovery should not be random.

The engine should query and normalize candidate skills using signals such as:
- project category
- stack fit
- runtime fit
- gap category
- install counts or popularity signal
- recency or trending signal when available
- source reputation

### 4. Fit Scoring

Each skill should receive a score out of 100.

Recommended V1 weights:
- 30% project fit
- 20% runtime compatibility
- 15% stack fit
- 15% install signal
- 10% source quality
- 10% overlap penalty

This model keeps fit as the dominant factor while still valuing signal quality and avoiding redundant installs.

### 5. Action Planning

The command should transform ranked results into one of three action modes:
- recommend
- explain
- install

## Action Modes

### Default Mode

`/vibe.skills`

Returns the best recommended skills for the current project.

### Top-N Mode

`/vibe.skills --top 5`

Returns the highest-ranked N skills.

### Category Mode

`/vibe.skills --category testing`

Restricts ranking toward one category.

### Gap Mode

`/vibe.skills --gap auth`

Focuses ranking around a specific missing capability or bottleneck.

### Install Mode

`/vibe.skills --install`

Produces an install plan and may execute it only through a controlled runtime-aware path.

## Recommendation Categories

Users should be able to think in gaps rather than marketplace names.

Recommended V1 categories:
- planning
- design
- frontend
- backend
- auth
- database
- testing
- debugging
- performance
- security
- MCP
- docs
- deployment
- AI integration
- product polish

## Fit Model Details

### 1. Project Fit

How well the skill solves the current project's real needs.

Questions:
- Does this skill help the current app type
- Does it address a visible capability gap
- Will it improve the most constrained part of the project

### 2. Runtime Compatibility

How naturally the current coding agent can consume the skill.

Questions:
- Does the runtime have a compatible skill surface
- Can the skill be installed project-locally
- Will the runtime actually use it in practice

### 3. Stack Fit

How well the skill aligns with the stack in the repository.

Questions:
- Is it relevant to Next.js, React, auth, testing, MCP, database, or AI workflows
- Does it complement the project's technical architecture

### 4. Install Signal

A quality-adjusted popularity measure.

Questions:
- Is the skill commonly installed
- Does it appear active and discoverable
- Does it have enough signal to justify recommendation

### 5. Source Quality

How trustworthy the maintainer and source appear.

Questions:
- Is the maintainer reputable
- Is the repository coherent
- Does the description clearly match the claimed value

### 6. Overlap Penalty

The system should penalize skills that duplicate already-installed or already-covered capabilities.

Questions:
- Does the project already have a strong equivalent
- Would this recommendation cause tool clutter
- Is the skill only marginally additive

## Discovery and Ranking Inputs

The recommendation engine should operate on normalized records like:

```ts
interface CandidateSkill {
  id: string;
  name: string;
  owner: string;
  repo: string;
  summary: string;
  categories: string[];
  runtimeHints: string[];
  installCount?: number;
  reputation?: number;
  lastUpdatedAt?: string;
}
```

And produce ranked results like:

```ts
interface RankedSkillRecommendation {
  skill: CandidateSkill;
  score: number;
  projectFit: number;
  runtimeCompatibility: number;
  stackFit: number;
  installSignal: number;
  sourceQuality: number;
  overlapPenalty: number;
  why: string[];
}
```

## Install Strategy

The install path should remain controlled.

The system should prefer:

1. shortlist first
2. explanation second
3. install plan third
4. execution only when the user or runtime mode clearly allows it

For ecosystems that support a one-line install command, the engine may produce commands such as:

```bash
npx skills add owner/repo
```

But V1 should avoid installing many skills blindly.

## Safety Rules

- discovery is not trust
- popularity is not fit
- recommendation is not installation
- install mode must remain controlled
- do not add unnecessary skills just because they are trending
- do not duplicate installed capabilities without strong justification
- do not mix archive or learning-only material into active runtime paths without explicit intent

## Explainability Rules

`/vibe.skills` should always be able to explain why a skill was recommended.

Each recommendation should answer:
- why this project needs it
- why this runtime can use it
- what it improves
- why it outranked alternatives

## Recommended Output Shape

The best user-facing output structure for V1 is:

1. What your project seems to need
2. Best skills to add now
3. Why these skills
4. Install plan
5. What this will improve

## Example UX

```text
Your project looks like an AI SaaS with frontend, auth, and testing gaps.

Best skills to add now:
- next-best-practices
- better-auth-best-practices
- systematic-debugging
- test-driven-development

Why these skills:
- next-best-practices improves architecture and framework usage for your app shell
- better-auth-best-practices addresses your auth decisions and implementation risk
- systematic-debugging strengthens failure investigation and faster recovery
- test-driven-development improves confidence and regression safety

Install plan:
- npx skills add owner/repo-a
- npx skills add owner/repo-b

What this will improve:
- safer auth decisions
- cleaner framework choices
- stronger debugging discipline
- better test coverage habits
```

## Integration with VDD Journey

The recommendation layer should become contextual, not isolated.

Recommended moments to surface it:
- after `/vibe.init`
- after `/vibe.scaffold`
- during `/vibe.status`

Examples:
- "Your project would benefit from 4 additional coding-agent skills"
- "Testing and auth are still underpowered for this stack"

## Router and Command Integration

`/vibe.skills` should be handled as a public command routed through the standard command parser and engine.

Recommended implementation flow:

1. extend `command-parser.ts`
2. extend `engine.ts`
3. route to the skill recommendation layer
4. return structured recommendations or an install plan

## Compatibility Direction

The recommendation layer should stay runtime-aware but runtime-agnostic at its core.

That means:
- scoring logic stays canonical
- install execution becomes adapter-specific
- explanation remains user-friendly and stable across runtimes

## V1 Boundary

V1 should include:
- project analysis
- runtime-aware discovery
- transparent scoring
- shortlist generation
- install plan generation

V1 should not require:
- a proprietary marketplace
- mandatory cloud sync
- automatic mass installation
- runtime-specific adapters for every editor before the advisor becomes useful

## Next Implementation Steps

1. create `skills/advisor/skill-recommender/SKILL.md`
2. create `core/intelligence/skill-recommender.ts`
3. extend `command-parser.ts` for `/vibe.skills`
4. extend `engine.ts` with recommendation routing
5. add recommendation output contracts and tests
