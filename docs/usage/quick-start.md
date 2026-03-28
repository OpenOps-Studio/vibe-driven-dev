# Quick Start — Vibe Driven Dev

Get VDD running in 30 seconds.

---

## 1. Install for Claude Code

```bash
npx vibe-driven-dev install claude-code --project
```

Portable compatibility install:

```bash
npx vibe-driven-dev install generic-agents-md --project
```

---

## 2. Verify

```bash
npx vibe-driven-dev doctor
npx vibe-driven-dev targets
```

Expected:
```
✓ VDD environment is healthy.
```

---

## 3. Start the Workflow

```bash
npx vibe-driven-dev run /vibe.init
npx vibe-driven-dev run /vibe.plan
npx vibe-driven-dev run /vibe.scaffold
```

---

## 4. See What Was Created

```bash
npx vibe-driven-dev status
npx vibe-driven-dev scan
```

---

## Next Steps

- [Full install guide →](../install/claude.md)
- [Target matrix →](../install/targets.md)
- [Complete workflow reference →](./agent-workflow.md)
- [USAGE.md →](../../USAGE.md)
