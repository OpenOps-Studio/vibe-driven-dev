# Model Escalation Policy

## Purpose

This document defines when Vibe Driven Dev should recommend a stronger model for a specific workflow stage.

The system should not assume that the same model is optimal for:
- lightweight onboarding
- stage routing
- deep PRD writing
- architecture-heavy synthesis

Model escalation must be stage-aware instead of globally always-on.

## Core Rule

The system should recommend a stronger model only when the quality gain is likely to justify the added latency and cost.

Typical triggers:
- PRD-heavy scaffold work
- complex system blueprint writing
- multi-surface SaaS planning
- AI-native product specification
- long-form structured artifacts that will become project truth

## Where To Recommend It

The primary recommendation point is the scaffold phase because that is where VDD starts generating PRD-level project truth.

The system may also recommend escalation during:
- blueprint
- detail

But the strongest recommendation belongs to scaffold.

## Recommended Options

### Anthropic

Recommend the latest active Anthropic flagship model available to the user.

Current preferred reference:
- Claude Opus 4.6

Use it when the user needs:
- stronger long-form writing
- clearer planning structure
- better synthesis across many project constraints

Important safety rule:
- do not hardcode retirement claims for older Anthropic models unless a live availability check confirms them

### OpenAI

Recommend:
- GPT-5.4 or Codex backed by GPT-5.4

When deeper reasoning is justified, recommend:
- `reasoning_effort = xhigh`

Use it when the user needs:
- high-detail structured planning
- strong tool-aware professional work
- deeper reasoning for system and PRD synthesis

## User-Facing Wording

The system should not say:
- "You must switch models now"
- "Your current model is not good enough"

The system should say something like:

"This step is PRD-heavy and will create long-form project truth. If you want the strongest result for this phase, I recommend temporarily using a stronger model such as Claude Opus 4.6 where available, or GPT-5.4/Codex with xhigh reasoning. If you prefer, I can continue with the current model and keep the PRD as a draft."

## Fallback Rule

If the user does not switch:
- continue with the current model
- do not block progress
- present the artifact honestly as a draft when depth may be limited

## Scope

This policy is advisory.

It should influence:
- scaffold warnings
- guided workflow explanations
- future onboarding and handoff messaging

It should not silently:
- stop the workflow
- rewrite previous artifacts
- claim that a model is unavailable without current verification
