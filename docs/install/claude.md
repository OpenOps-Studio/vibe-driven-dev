# Installing VDD for Claude Code

This guide covers VDD installation specifically for use with **Claude Code** by Anthropic.

---

## How Claude Code Discovers Agents

Claude Code reads subagent definitions (`.md` files with YAML frontmatter) from two directories:

| Scope | Path | When to use |
|---|---|---|
| **Project-level** | `.claude/agents/` inside your repo | Team projects, version-controlled agents |
| **User-level** | `~/.claude/agents/` on your machine | Personal agents across all projects |

**Precedence rule**: Project-level agents take priority over user-level agents when names conflict.

VDD respects this model. When you `install claude-code --project`, it writes to `.claude/agents/`. When you `install claude-code --global`, it writes to `~/.claude/agents/`.

---

## Project-Level Install

Run inside your project root:

```bash
npx vibe-driven-dev install claude-code --project
```

Files created:
```
your-project/
├── .claude/
│   └── agents/
│       ├── vdd-orchestrator.md    ← Central coordinator
│       ├── vdd-planner.md         ← Planning specialist
│       ├── vdd-architect.md       ← Architecture specialist
│       ├── vdd-detailer.md        ← Technical detail specialist
│       ├── vdd-researcher.md      ← Research and validation specialist
│       ├── vdd-qa-guardian.md     ← QA and readiness specialist
│       └── vdd-handoff-manager.md ← Handoff and spec generation
└── .vdd/
    ├── project-state.json
    ├── install-manifest.json
    └── addons/
        └── installed/
            └── local/
```

After install, open Claude Code in this project and the VDD agents will be available immediately.

---

## User-Level Install

Run once — available in all your projects:

```bash
npx vibe-driven-dev install claude-code --global
```

Agents are written to `~/.claude/agents/vdd-*.md`.

---

## Using VDD Agents in Claude Code

After installation, you can invoke VDD agents directly in Claude Code:

1. Open a project where VDD is installed
2. Start a new conversation
3. Reference a VDD agent by name, e.g.:
   - *"Use the vdd-orchestrator to start the vibe workflow"*
   - *"Ask vdd-architect to review the proposed stack"*
4. Or simply run the VDD commands through the CLI, which routes to the correct agent automatically

---

## Verify Claude Integration

```bash
vdd doctor
```

The doctor output will show:
```
✓  .claude/agents/ (Claude integration)
   7 VDD agent(s) installed
```

---

## Updating VDD Agents

When a new version of VDD is released:

```bash
npm install -g vibe-driven-dev@latest
vdd install claude-code --project
```

> **Note**: Install will skip already-existing agent files by default. Delete `.claude/agents/vdd-*.md` first if you want to force an update.

---

## Commit to Version Control

We recommend committing `.claude/agents/` to your repository so your whole team benefits from the same agent definitions:

```bash
git add .claude/agents/
git commit -m "chore: install VDD agents for Claude Code"
```

Add `.vdd/` to `.gitignore` since it contains local state:

```gitignore
.vdd/
```
