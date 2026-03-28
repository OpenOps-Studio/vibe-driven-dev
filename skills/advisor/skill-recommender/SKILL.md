---
name: skill-recommender
description: Recommend the best external coding-agent skills for the current project, explain why they fit, and optionally generate a controlled install plan.
category: advisor
stage: any
version: 0.1.0
triggers:
  - /vibe.skills
inputs:
  required:
    - project_state
    - project_signals
    - runtime_target
  optional:
    - installed_skills
    - mode
    - top
    - bundle
    - category
    - gap
    - skills_catalog
outputs:
  - project-needs-summary
  - recommended-bundles
  - recommended-skills
  - recommendation-explanations
  - install-plan
state_effect: read
authority:
  final: orchestrator
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Skill Recommender

## Purpose

Recommend the smallest high-value set of external skills that will improve the current coding agent for the current project.

This skill is not a generic marketplace browser.

It exists to:
- understand what the project seems to need
- detect what the current runtime can use naturally
- rank skills by actual fit
- map project gaps to specialist capability bundles
- explain why the shortlisted skills matter
- produce a controlled install plan when requested

## When to Use

Use this skill when:

- the user asks which skills would strengthen their coding agent
- the project has obvious capability gaps such as testing, auth, debugging, performance, MCP, or deployment
- the runtime or editor has been detected and a project-local integration path is known or inferable
- the system wants to surface contextual skill recommendations after init, scaffold, or status

## When Not to Use

Do not use this skill when:

- the request is only to list all skills from a marketplace without project context
- the runtime cannot safely install or plan external skills
- the project context is too weak to rank skills honestly
- the user is asking to execute remote installs blindly with no shortlist or explanation
- the recommendation would only duplicate already-installed capabilities with no clear gain

## Inputs

### Required

- `project_state`
- `project_signals`
- `runtime_target`

### Optional

- `installed_skills`
- `mode`
- `top`
- `category`
- `gap`
- `skills_catalog`

## Modes

This skill should support three operating modes.

### 1. Recommend

Default behavior.

Return the best skills to add now for the current project.

### 2. Explain

Return the shortlist plus a clearer explanation of:
- why each skill fits
- what problem it solves
- why it outranked alternatives

### 3. Install-Plan

Return a controlled install plan.

This plan may include commands such as:

```bash
npx skills add owner/repo
```

But the skill should treat this as a plan first, not as permission to install everything automatically.

## Bundle Mode

This skill should support bundle-oriented recommendation rather than forcing the user to think in raw skill names.

Examples:
- `mvp-core`
- `frontend-polish`
- `ai-wrapper`
- `auth-safe-app`
- `mcp-app`
- `execution-handoff`

When a bundle is requested, the skill should:
- prioritize the capabilities in that bundle
- explain why the bundle fits the current project
- still rank the included capabilities by immediate usefulness

## Required Thinking Order

1. Understand the project.
2. Detect the runtime.
3. Determine current capability gaps.
4. Filter candidate skills by project fit and runtime fit.
5. Map project gaps to capability bundles.
6. Penalize overlap with already-installed skills.
7. Rank the shortlist.
8. Explain the shortlist in simple language.
9. Produce an install plan only if requested or clearly useful.

## Category Handling

The skill should support category-focused recommendations.

Recommended categories:
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

If both `category` and `gap` are provided:
- use `gap` as the stronger prioritization signal
- use `category` as a secondary filter

If neither is provided:
- infer the most relevant project gaps from project signals

## Output Shape for Non-Technical Users

The response should be easy to scan and should avoid marketplace jargon unless necessary.

Preferred output structure:

1. What your project seems to need
2. Best skills to add now
3. Why these skills
4. Install plan
5. What this will improve

### 1. What Your Project Seems to Need

One short summary sentence such as:

- "Your project looks like an AI SaaS with frontend, auth, and testing gaps."
- "Your project looks backend-heavy and would benefit most from debugging, database, and deployment skills."

### 2. Best Skills to Add Now

Return the top 3 to 5 skills unless `top` explicitly asks for a different number.

For each skill, provide:
- skill name
- short summary
- fit score
- category

### 3. Why These Skills

For each recommended skill, explain:
- what project gap it addresses
- why it fits the detected runtime
- why it is a better fit than generic alternatives

### 4. Install Plan

If mode is `install-plan`, return:
- the exact commands
- whether each command is project-local or runtime-specific
- any runtime notes

If mode is not `install-plan`, still provide a brief “how to install later” section when useful.

### 5. What This Will Improve

Conclude with the expected improvement in plain language, such as:

- safer auth decisions
- better debugging discipline
- cleaner test setup
- stronger MCP integration guidance

## Recommendation Rules

Recommendations must be:
- project-aware
- runtime-aware
- limited in number
- transparent in reasoning
- conservative about install noise

The skill must avoid:
- long unfocused lists
- recommending skills only because they are popular
- pushing overlapping skills without justification
- suggesting installs that do not match the active runtime

## Curated Major Capabilities

This skill should treat some capabilities as larger specialist operating systems rather than ordinary marketplace skills.

Two important examples are:
- `Spec-Kit`
- `Impeccable`

### Spec-Kit

Recommend `Spec-Kit` when:
- the project is entering structured implementation
- bootstrap artifacts exist
- the system is moving through detail, scaffold, QA, or handoff work

### Impeccable

Recommend `Impeccable` when:
- the project is frontend-heavy
- visual quality materially affects success
- the user needs differentiated or polished UI output

## Safety Constraints

This skill must not create recommendation noise.

### Allowed

- ranking a small shortlist
- surfacing one or two alternatives when useful
- generating install commands as a controlled plan
- recommending a discovery helper skill when it clearly improves future recommendations

### Disallowed

- auto-installing many skills with no explanation
- recommending skills that conflict with current runtime conventions
- recommending archive or learning-only materials as if they were ready-to-use runtime skills
- burying important uncertainty
- pretending marketplace popularity is proof of quality

## Overlap and Clutter Rules

The skill must penalize overlap.

It should reduce the rank of skills when:
- the project already has an equivalent installed
- the skill duplicates a higher-confidence recommendation
- the skill only adds marginal value relative to setup complexity

It should prefer:
- one excellent skill over three vaguely similar ones
- composable coverage over redundant coverage
- one strong bundle over a noisy list of unrelated installs

## Explanation Rules

Each recommendation explanation should answer:

- Why this project needs it
- Why this runtime can use it
- What it improves immediately
- Why it is worth installing now instead of later

If uncertainty exists, state it clearly.

Examples:
- "This is a strong fit if your auth path will be built soon."
- "This ranks lower because your current runtime support is less natural."

## Install-Plan Rules

If an install plan is requested:

1. Keep the plan short.
2. Prefer project-local integration.
3. Show exact commands.
4. Group commands by priority.
5. Warn when runtime support is partial or generic only.

The install plan should default to:
- top 3 skills

Unless:
- the user asked for more
- the project has a strong multi-gap need that justifies a larger plan

## Halt Conditions

This skill must halt or degrade gracefully when:

- no credible project signals exist
- runtime detection is unavailable and no safe generic fallback exists
- the candidate catalog is empty
- the request is explicitly asking for uncontrolled mass install
- the system cannot distinguish installed skills from new skills at all

In a degraded case, return:
- what is missing
- what safe fallback is still possible

## Handoff Behavior

After successful completion:

- do not mutate project state
- do not silently install anything unless the calling layer explicitly permits that mode
- return a shortlist that the orchestrator or runtime can present directly
- recommend the next best action such as:
  - review shortlist
  - run install plan
  - continue the current VDD workflow
