---
name: stack-advisor
description: Recommend the right technology stack for a project based on type, platform, team constraints, and real-time ecosystem health via MCPs.
category: advisor
stage: blueprint
version: 0.1.0
triggers:
  - /vibe.advise-stack
  - invoked-by-agent
inputs:
  required:
    - project_type
    - platform_target
  optional:
    - team_size
    - performance_requirements
    - delivery_timeline
    - existing_constraints
    - preferred_languages
mcps:
  recommended:
    - context7
    - any framework-specific MCP matching the project type
outputs:
  - stack-recommendation.md
gates:
  before: []
  after: []
state_effect: write
authority:
  final: staff-engineering
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Stack Advisor

## Purpose

Recommend the right technology stack for a project based on what the project actually needs, not based on trend or familiarity bias.

This skill exists to prevent projects from defaulting to a stack before the trade-offs have been honestly examined.

It should:
- ask the right qualifying questions
- consult available MCP tools for current ecosystem health and version recency
- surface real trade-offs, not just a winner
- keep the recommendation proportional to the declared project stage and scope
- avoid recommending complexity the project does not yet need

## When to Use

Use this skill when:

- the project is in the blueprint stage
- the architect agent needs a stack recommendation grounded in project reality
- the orchestrator has identified stack selection as an open decision
- no stack has been decided yet, or the current stack assumption needs validation

## When Not to Use

Do not use this skill when:

- the stack is already decided and validated
- the request is only to resume or inspect context
- the project has not yet completed research

## Required Context

Minimum required inputs:

- project type: what category of product this is (web app, API, mobile, CLI, AI-powered app, data pipeline, etc.)
- platform target: where does this run? browser, iOS, Android, server, edge, embedded?

Helpful optional inputs:

- team size and experience profile
- performance or scalability requirements
- delivery timeline constraints
- languages the team already knows
- existing infrastructure or lock-in constraints

## MCP Integration

When MCPs are enabled, this skill should:

- query available context MCPs (e.g. context7) for the latest stable versions of candidate frameworks
- verify that recommended libraries are actively maintained
- surface any known ecosystem risks or deprecation signals
- use retrieved version data to ground the recommendation in current reality

When MCPs are not available, this skill should:

- rely on its internal knowledge baseline
- explicitly label the recommendation as not MCP-verified
- recommend the user verify versions before locking decisions

## Decision Framework

### Web Application
| Need | Recommendation | Notes |
|---|---|---|
| Full-stack, server-rendered | Next.js + TypeScript | Strong ecosystem, Vercel-native |
| Lightweight SPA | Vite + React or SvelteKit | Fast builds, minimal overhead |
| Enterprise / complex routing | Remix | Better data loading model |

### API / Backend
| Need | Recommendation | Notes |
|---|---|---|
| REST API, TypeScript | Hono or Fastify | Fast, type-safe |
| Full REST + Auth | NestJS | Opinionated, large team-ready |
| Python API | FastAPI | Modern Python standard |
| Edge / serverless | Hono on Cloudflare Workers | Exceptional performance |

### Mobile
| Need | Recommendation | Notes |
|---|---|---|
| Cross-platform | React Native + Expo | Broad ecosystem |
| Native performance critical | Swift / Kotlin | No abstraction cost |
| Lightweight forms-heavy | Flutter | Strong for data-heavy UI |

### AI-Powered Applications
| Need | Recommendation | Notes |
|---|---|---|
| AI wrapper / tool | Vercel AI SDK + Next.js | Native streaming, LLM-ready |
| Agent orchestration | Python + LangChain or raw SDK | More control |
| Edge AI inference | Cloudflare AI Workers | Fast, close to user |

### CLI Tools
| Need | Recommendation | Notes |
|---|---|---|
| TypeScript CLI | Commander.js + tsx | Fast dev loop |
| Rust CLI | clap + tokio | Maximum performance |
| Python CLI | Typer or Click | Best DX for scripted tools |

## Output Contract

### `stack-recommendation.md`

Required contents:
- recommended stack with versions (MCP-verified if available)
- rationale tied to the project inputs
- alternatives considered with trade-off summary
- risks or lock-in considerations
- what this recommendation does not cover
- whether MCP verification was used

## Halt Conditions

This skill must halt when:

- minimum required inputs are missing
- the project type is too vague to support an honest recommendation
- no stack candidate can be meaningfully differentiated from another given current inputs

## Escalation Behavior

This skill should surface to the orchestrator when:

- the stack decision carries major product or security trade-offs
- the team constraint makes the ideal stack impractical
- a decision record should be logged before the recommendation is locked

## Assumptions Rules

Allowed:
- using current ecosystem knowledge when MCP data is unavailable
- marking recommendations as provisional when input is incomplete
- surfacing competing options rather than forcing a single answer

Disallowed:
- recommending a stack based on popularity alone
- hiding known risks or ecosystem problems
- fabricating version accuracy when MCPs are unavailable
- pretending the recommendation is final when key inputs are missing
