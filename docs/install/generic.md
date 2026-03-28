# Installing VDD in Generic AGENTS.md Mode

Use `generic-agents-md` when you want VDD's structured workflow without binding it to a single native runtime adapter.

---

## When to Use Generic AGENTS.md Mode

- Your AI coding agent understands `AGENTS.md`
- You want VDD installed as a reference layer without Claude Code
- You're building a compatibility layer for Cursor, Windsurf, OpenCode, or a custom tool
- You want the canonical `.vdd/` workspace structure plus a portable root `AGENTS.md`

---

## Install

```bash
npx vibe-driven-dev install generic-agents-md --project
```

Files created:
```
your-project/
├── AGENTS.md
└── .vdd/
    ├── project-state.json
    ├── install-manifest.json
    ├── agents/
    │   ├── vdd-orchestrator.md
    │   ├── vdd-planner.md
    │   ├── vdd-architect.md
    │   ├── vdd-detailer.md
    │   ├── vdd-researcher.md
    │   ├── vdd-qa-guardian.md
    │   └── vdd-handoff-manager.md
    └── addons/
        └── installed/
            └── local/
```

---

## Integrating with Your Runtime

The exported `AGENTS.md` acts as the compatibility bridge, while each file in `.vdd/agents/` keeps the canonical VDD agent contract:

```yaml
---
name: orchestrator
description: ...
role: orchestrator
version: 0.1.0
stage_alignment: [init, plan, ...]
tools:
  allowed: [...]
  disallowed: [...]
---
```

AGENTS-aware runtimes can read the root `AGENTS.md`, and deeper integrations can read `.vdd/agents/` directly.

---

## Verify

```bash
vdd doctor
vdd scan
vdd targets
```

---

## Switching to Claude Mode Later

If you later adopt Claude Code:

```bash
npx vibe-driven-dev install claude-code --project
```

This will install the Claude-specific layer (`.claude/agents/`) alongside your existing `.vdd/` workspace. No existing state is lost.
