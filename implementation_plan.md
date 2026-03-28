# VDD Next Phase: Strategic Integration Plan

## Context

The core journey is now structurally complete:
`init → plan → research → blueprint → detail → qa → handoff`

This document defines three strategic integrations needed before the next runtime milestone.

---

## Track A: Governance Foundation

### `skills/governance/decision-ledger/SKILL.md`
**Status:** Next immediate scaffold  
**Role:** Cross-stage decision recording used by architect, detailer, qa-guardian, handoff-manager  
**Why now:** Multiple agents already reference it in their `supported_skills`. Without it, the governance layer is a reference with no backing contract.

---

## Track B: Advisor System (New Namespace)

### Problem
The current journey has no mechanism for:
- Helping a Vibe Coder choose the right Stack
- Helping a Vibe Coder choose the right AI Provider for their project

### Solution: `skills/advisor/` namespace

#### `skills/advisor/stack-advisor/SKILL.md`
- Triggered during `vibe-blueprint`
- Inputs: project type, platform target, team size, performance requirements
- Outputs: recommended stack with rationale + comparison of alternatives
- MCP Integration: uses enabled MCPs to fetch latest framework versions/ecosystem health

#### `skills/advisor/ai-provider-selector/SKILL.md`
- Triggered during `vibe-blueprint` only for AI-powered projects
- Decision matrix:

| Use Case | Best Provider | Best Model |
|---|---|---|
| Creative writing / Copywriting | Anthropic | Claude Opus 4.x |
| Code generation | Anthropic | Claude Sonnet 4.x |
| Autonomous agents / tool use | Anthropic | Claude Sonnet 4.x |
| Extended reasoning tasks | Anthropic / OpenAI | Claude Thinking / o3 |
| Cost-efficient high-volume API | Google | Gemini Flash |
| Vision + multimodal | Google / OpenAI | Gemini Pro / GPT-4o |
| Multilingual apps | Google | Gemini Pro |
| OpenAI ecosystem integration | OpenAI | GPT-4o |

- Outputs: provider recommendation, model recommendation, rationale, cost tradeoffs
- MCP Integration: queries Anthropic MCP, Gemini MCP, OpenAI MCP for latest models + pricing

### MCP Integration Layer

In `project-state.json`:
```json
{
  "mcps": {
    "enabled": ["anthropic", "gemini", "context7"],
    "purpose": "stack-research, provider-selection, library-versions"
  }
}
```

The orchestrator passes available MCPs to specialist agents.  
Stack Advisor uses MCPs to verify framework health + version recency.  
AI Provider Selector uses MCPs to verify model availability + pricing.

---

## Track C: Scaffold System + Pack System

### Problem 1: Missing Setup Files before Spec-Kit
The current handoff produces architecture and QA artifacts but NOT the structured project files that Spec-Kit and AI coding agents need to begin building without hallucinating.

### Solution: `skills/journey/vibe-scaffold/SKILL.md`

**Position in journey:** Between `vibe-detail` and `vibe-qa`

```
detail → scaffold → qa → handoff
```

**Output files:**

| File | Contents |
|---|---|
| `PRD.md` | Product Requirements Document, goals, non-goals, users |
| `Logic.md` | Core business logic, rules, state transitions |
| `Structure.md` | Project file structure, module responsibilities |
| `Dependencies.md` | Tech dependencies, versions, roles |
| `Memory.md` | Agent memory baseline, key context for the build |
| `anti-hallucination.md` | Grounding rules, what must not be fabricated |
| `Repo.md` | Repository overview, conventions, branching |
| `Design.md` | UI/UX design system baseline, tokens, patterns |

These files are passed as handoff artifacts and consumed directly by Spec-Kit and agent runtimes like Claude Code.

---

### Problem 2: coding-standards-skill Integration

**The wrong approach:** Copy it into VDD core. This creates duplication and version drift.

**The right approach: Pack System**

#### Pack System Design

```
.vdd/
└── packs.json   ← references to installed external packs
```

```json
{
  "packs": [
    {
      "name": "coding-standards",
      "source": "local:../../coding-standards-skill",
      "version": "0.1.0"
    }
  ]
}
```

#### Source Loader Update
`source-loader.ts` gains a new scope: `pack`  
It reads `.vdd/packs.json` and discovers pack skills/agents from referenced paths.

#### CLI Update
```bash
vdd add ../coding-standards-skill        # install from local path
vdd add github:user/skill-name           # install from GitHub
vdd packs list                           # list installed packs
```

#### vibe-init Integration
`vibe-init` checks: does `coding-standards` pack exist?  
If not: recommends `vdd add <path>` as a setup step.  
If yes: marks it as active in project context.

This preserves the original skill's location and avoids any duplication.

---

## Recommended Scaffold Order

| # | Scaffold | Track | Reason |
|---|---|---|---|
| 1 | `skills/governance/decision-ledger/SKILL.md` | A | Multiple agents reference it now |
| 2 | `skills/journey/vibe-scaffold/SKILL.md` | C | Inserts between detail → qa → handoff |
| 3 | `skills/advisor/stack-advisor/SKILL.md` | B | Activates in blueprint stage |
| 4 | `skills/advisor/ai-provider-selector/SKILL.md` | B | Activates in blueprint for AI projects |
| 5 | `core/runtime/pack-loader.ts` | C | Enables add command + external skill discovery |
| 6 | CLI `vdd add` + `vdd packs` commands | C | Surfaces the Pack System to users |
| 7 | Update `source-loader.ts` | C | Add `pack` scope to discovery |

---

## Revised Journey (Post-Integration)

```
vibe-init
  ↓ (checks coding-standards pack, prompts vdd add if missing)
vibe-plan
  ↓ (captures project type, platform, AI-powered flag)
vibe-research
  ↓ (uses MCPs for grounded constraints)
vibe-blueprint
  ↓ (stack-advisor + ai-provider-selector activate here)
vibe-detail
  ↓
vibe-scaffold  ← NEW (generates PRD, Logic, Structure, Dependencies, Memory, etc.)
  ↓
vibe-qa
  ↓
vibe-handoff-to-spec
  ↓ (full package including scaffold files → Spec-Kit ready)
```
