---
name: ai-provider-selector
description: Recommend the best AI provider and model for a project based on its use case, performance needs, cost constraints, and current model availability via MCPs.
category: advisor
stage: blueprint
version: 0.1.0
triggers:
  - /vibe.advise-ai-provider
  - invoked-by-agent
inputs:
  required:
    - use_case
  optional:
    - quality_priority
    - cost_sensitivity
    - latency_requirements
    - volume_estimate
    - language_requirements
    - multimodal_needs
    - autonomy_level
    - ecosystem_preference
mcps:
  recommended:
    - anthropic
    - gemini
    - openai
outputs:
  - ai-provider-recommendation.md
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

# AI Provider Selector

## Purpose

Recommend the best AI provider and model for a project based on what the project actually needs.

This skill exists to prevent AI-powered projects from defaulting to the most-hyped model before the real requirements have been examined.

The provider and model a project is built on matters deeply:
- it affects output quality for the specific task type
- it affects cost at production scale
- it affects ecosystem tooling and SDK maturity
- it affects latency, streaming, and availability
- it affects how much the product can trust the model for autonomous or agent tasks

This skill treats model selection as a real architecture decision, not a marketing preference.

## When to Use

Use this skill when:

- the project is AI-powered (uses an LLM or AI API as a core part of its product)
- the architect agent needs a provider and model recommendation grounded in project reality
- the orchestrator identifies AI provider selection as an open decision
- the blueprint stage is active and model selection has not been locked

## When Not to Use

Do not use this skill when:

- the project does not use AI as a core component
- the provider is already decided and validated
- the task is only to inspect or resume context

## Required Context

Minimum required input:

- use case: what is the AI being used for in this product?

Helpful optional inputs:

- quality priority: is output quality the #1 concern, or is cost or speed more important?
- cost sensitivity: is per-token cost a significant constraint?
- latency requirements: does the product need low-latency streaming or fast responses?
- volume estimate: how many requests per day or month at production scale?
- language requirements: does the product need strong multilingual support?
- multimodal needs: does the product need vision, audio, or document understanding?
- autonomy level: is this a simple single-turn prompt, or does the AI need to use tools and run multi-step tasks?
- ecosystem preference: does the team have an existing relationship or contract with a provider?

## MCP Integration

When provider MCPs are enabled, this skill should:

- query Anthropic MCP for current Claude model lineup, pricing, and availability
- query Gemini MCP for current Gemini model lineup, pricing, and availability
- query OpenAI MCP for current GPT model lineup, pricing, and availability
- verify that recommended models are currently in production availability
- surface any pricing changes or new model releases that affect the recommendation

When MCPs are not available, this skill should:

- rely on its internal knowledge baseline
- explicitly mark the recommendation as not MCP-verified
- recommend the user verify model availability and pricing before locking decisions

## Decision Matrix

### By Use Case

| Use Case | Best Provider | Best Model Class | Notes |
|---|---|---|---|
| Creative writing / copywriting / long-form content | Anthropic | Claude Opus (latest) | Best prose quality, nuance, tone |
| Code generation | Anthropic | Claude Sonnet (latest) | Strong reasoning + code output |
| Code review / refactoring | Anthropic | Claude Sonnet (latest) | Context window + precision |
| Autonomous agents / tool use | Anthropic | Claude Sonnet (latest) | Best tool use reliability |
| Complex multi-step reasoning | Anthropic | Claude with extended thinking | Best for deep reasoning tasks |
| Mathematical / logical reasoning | OpenAI / Anthropic | o3 / Claude Thinking | Competing at top tier |
| High-volume, cost-efficient tasks | Google | Gemini Flash (latest) | Best price-per-token at volume |
| Vision / image understanding | Google / OpenAI | Gemini Pro Vision / GPT-4o | Both strong, Gemini faster |
| Multimodal (text + image + audio) | Google | Gemini Pro (latest) | Broadest native multimodal |
| Multilingual applications | Google | Gemini Pro (latest) | Strong multilingual baseline |
| Real-time conversational UX | Anthropic / OpenAI | Claude Haiku / GPT-4o-mini | Fast, low-latency |
| Embeddings / semantic search | OpenAI | text-embedding-3-large | Industry standard |
| OpenAI ecosystem / plugin integrations | OpenAI | GPT-4o | Best ecosystem compatibility |
| Structured data extraction | Anthropic | Claude Sonnet | Reliable JSON / structured output |
| Summarization at scale | Google | Gemini Flash | Cost-effective, good quality |
| RAG applications | Anthropic / OpenAI | Claude Sonnet / GPT-4o | Both handle context well |

### By Priority

| Priority | Recommendation |
|---|---|
| Absolute best output quality | Anthropic Claude Opus |
| Best code generation | Anthropic Claude Sonnet |
| Lowest cost at scale | Google Gemini Flash |
| Best latency for conversational | Claude Haiku / GPT-4o-mini |
| Best tool use / agents | Anthropic Claude Sonnet |
| Best multimodal | Google Gemini Pro |
| Most ecosystem integrations | OpenAI GPT-4o |

### Common Project Archetypes

| Project Type | Recommendation |
|---|---|
| AI Copywriter SaaS | Claude Opus — best long-form quality |
| AI Code Assistant | Claude Sonnet — best code reasoning |
| AI Customer Support Bot | Claude Haiku or Gemini Flash — cost + speed |
| AI Research Tool | Claude Sonnet or GPT-4o — reasoning + retrieval |
| AI Image Analysis Tool | Gemini Pro Vision or GPT-4o |
| AI Document Processor | Claude Sonnet — large context, structured output |
| AI Data Extractor | Claude Sonnet — reliable structured output |
| High-Volume Classifier | Gemini Flash — lowest cost at scale |
| Autonomous Agent Platform | Claude Sonnet — best tool use reliability |

## Output Contract

### `ai-provider-recommendation.md`

Required contents:
- recommended provider
- recommended model (with version if MCP-verified)
- rationale tied to the use case and inputs
- cost estimate framing (rough per-token or per-call cost awareness)
- alternatives and why they were not the primary choice
- known risks or lock-in considerations
- whether MCP verification was used
- recommended SDK or integration approach

## Halt Conditions

This skill must halt when:

- the use case is too vague to support an honest recommendation
- no provider can be meaningfully differentiated without more information
- the minimum required input is missing

## Escalation Behavior

This skill should surface to the orchestrator when:

- the provider selection carries significant cost or vendor lock-in implications
- the team has an existing contract that should be honored
- a decision record should be formally logged before the recommendation is locked
- two providers are genuinely equivalent for the specific use case and the team must decide

## Assumptions Rules

Allowed:
- using internal knowledge when MCP data is unavailable
- marking recommendations as provisional when input is incomplete
- surfacing multiple options rather than forcing one choice
- using the decision matrix as a starting point, not a final authority

Disallowed:
- recommending a provider based on popularity or hype alone
- hiding known cost risks
- fabricating model availability or pricing accuracy
- pretending the recommendation is locked when key inputs are missing
- ignoring provider reliability or rate limit considerations for production use
