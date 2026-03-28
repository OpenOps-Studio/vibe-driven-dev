# INSTALL.md — Vibe Driven Dev

> **VDD installs a pre-execution clarity layer for AI coding agents.**
> It is not an editor plugin. It is not a linter. It is an orchestration framework that runs *before* your coding agent touches the codebase.

---

## 1. What VDD Installs

When you run `vdd install`, three things happen:

| Layer | What it creates |
|---|---|
| **Runtime agents** | Agent definition files (`.claude/agents/vdd-*.md` or `.vdd/agents/`) |
| **Project workspace** | `.vdd/` directory with project state and add-on registry |
| **Install manifest** | `.vdd/install-manifest.json` tracking version, target, scope |

VDD does **not** modify your application code, package.json, or any existing config.

---

## 2. Choose Your Installation Mode

### Try once with npx (no global install)
```bash
npx vibe-driven-dev install claude-code --project
```

### Install globally, use anywhere
```bash
npm install -g vibe-driven-dev
vdd install claude-code --project
```

### Install VDD for Claude Code (project-level)
```bash
npx vibe-driven-dev install claude-code --project
```
Agents appear in `.claude/agents/`. Claude Code will discover them automatically on next launch.

### Install VDD for Claude Code (user-level)
```bash
npx vibe-driven-dev install claude-code --global
```
Agents appear in `~/.claude/agents/`. Available across all your projects.

### Install in generic AGENTS.md compatibility mode
```bash
npx vibe-driven-dev install generic-agents-md --project
```
This writes `AGENTS.md` plus canonical agent files in `.vdd/agents/`.

---

## 3. Quick Start (30 seconds)

```bash
# Step 1: Install for your AI coding agent
npx vibe-driven-dev install claude-code --project

# Step 2: Verify the environment
npx vibe-driven-dev doctor
npx vibe-driven-dev targets

# Step 3: Start the VDD workflow
npx vibe-driven-dev run /vibe.init
```

---

## 4. Quickly Use With Your Favorite Coding Agent

Do not want to install everything manually

Copy one of the prompts below and paste it directly into your coding agent

The agent should detect its environment install VDD in the cleanest project-level way possible and start the workflow for you

### Runtime Fit

| Runtime | Best fit |
|---|---|
| Claude Code | Best native fit via project agents and project skills |
| Cursor / Windsurf / OpenCode | Best fit via `AGENTS.md` plus project rules or config |
| Gemini CLI | Best fit via project commands, extensions, and MCP-aware setup |

### Universal Prompt

```text
You are my coding agent and setup operator.

Your job is to install and activate Vibe Driven Dev in this project with the most native integration possible for the current runtime.

Important goals:
1. Detect which coding agent/runtime you are currently running inside.
2. If the runtime supports native agents, skills, rules, commands, extensions, or project-level configuration, use the most appropriate project-local installation method.
3. Prefer project-level installation over global installation unless project-level is impossible.
4. Do not ask me technical questions unless absolutely necessary. I am a non-technical user.
5. Explain what you are doing in simple language before each major step.
6. Keep the installation clean. Do not add unnecessary files.
7. Do not overwrite existing important project files without checking first.
8. If Vibe Driven Dev is not installed yet, install or scaffold it in the correct way for this runtime.
9. Then initialize the workflow and move the project into the VDD journey.
10. After installation, run the first useful flow automatically.

Your exact workflow:
- Detect the runtime and installation surface.
- Inspect the repository safely.
- Install VDD in the best supported way for this runtime.
- Create or update only the minimum required project-local files.
- Set up the agent integration layer if supported.
- Run environment checks.
- Initialize VDD.
- Start the workflow with:
  - /vibe.init
  - /vibe.plan
  - /vibe.scaffold
- Generate the core bootstrap files if available.
- Summarize what was installed, where it was installed, and what I should do next.

Important constraints:
- Prefer the native runtime conventions of the current agent.
- If native integration is not possible, fall back to a clean generic project-local setup.
- Keep archive or learning-only material out of the main runtime path unless needed explicitly.
- Keep the setup understandable and tidy.
- Use a calm, beginner-friendly explanation style.

At the end, give me:
1. What you detected
2. What you installed
3. Where the files were placed
4. What workflow step I am currently in
5. What I should type next if I want to continue manually
```

### Claude Code Prompt

```text
You are running inside Claude Code.

Please install and activate Vibe Driven Dev for this project using Claude Code native project-level integration.

Use Claude-native conventions:
- project subagents in .claude/agents/
- project skills in .claude/skills/

Your job:
- inspect the current repository
- install or scaffold Vibe Driven Dev cleanly for Claude Code
- use project-level setup, not user-level, unless project-level is impossible
- keep the installation minimal and tidy
- do not overwrite important files without warning me first
- initialize the project workflow
- then automatically begin:
  - /vibe.init
  - /vibe.plan
  - /vibe.scaffold

I am not technical, so explain each step in simple language.

At the end:
- summarize what you installed
- list the Claude-specific paths you used
- show me the current VDD stage
- tell me the next command if I want to continue manually
```

### Cursor / Windsurf / OpenCode Prompt

```text
You are my coding agent.

Please install and activate Vibe Driven Dev in this repository using the most native project-level integration available for this editor/runtime.

Preferred behavior:
- use AGENTS.md if this runtime supports it
- use project-local rules/config files if supported
- keep everything inside the project
- avoid unnecessary files
- do not overwrite important repository files without checking first

Your tasks:
1. Detect whether this runtime prefers AGENTS.md, project rules, custom agent files, or another native project-level setup.
2. Install or scaffold Vibe Driven Dev accordingly.
3. Keep the setup clean and understandable.
4. Initialize the workflow and begin:
   - /vibe.init
   - /vibe.plan
   - /vibe.scaffold
5. Generate the bootstrap foundation if supported.
6. Explain what you did in very simple language because I am a non-technical user.

At the end, show:
- detected runtime
- installation method used
- files created
- current VDD stage
- next manual step
```

### Gemini CLI Prompt

```text
You are running inside Gemini CLI.

Please set up Vibe Driven Dev for this project using the most native Gemini CLI approach available.

Preferred Gemini-style behavior:
- use project-local commands if useful
- use project-local extensions if useful
- use MCP configuration only when it improves the setup clearly
- keep the setup minimal and understandable
- prefer project-level setup over user-level setup

Your tasks:
- inspect the repository
- determine the best Gemini CLI integration path
- install or scaffold Vibe Driven Dev cleanly
- initialize the project workflow
- begin the first useful sequence:
  - /vibe.init
  - /vibe.plan
  - /vibe.scaffold
- generate the essential bootstrap files if supported

I am a non-technical user, so explain each step simply.

At the end:
- tell me what Gemini-specific setup you used
- list the files or commands created
- tell me the current workflow stage
- tell me the next step if I want to continue manually
```

### What the Agent Should Do

A good setup flow should:
- detect the current runtime
- prefer project-level installation
- keep the setup tidy
- avoid unnecessary files
- initialize VDD
- start the first workflow steps
- explain clearly what was installed and where

If the runtime does not support native agents or skills well, the agent should fall back to a clean generic project-local setup instead of forcing a bad integration

### What the User Should Expect

After a good setup run, the agent should tell you:
- which runtime it detected
- which installation method it used
- which files it created or updated
- which VDD stage the project is currently in
- which command to type next if you want to continue manually

---

## 5. Install for Claude Code

Claude Code reads subagent definitions from two locations:

| Scope | Path | Priority |
|---|---|---|
| Project | `.claude/agents/vdd-*.md` | **Highest** — overrides user-level |
| User | `~/.claude/agents/vdd-*.md` | Applied when no project-level agent conflicts |

### Project-level install (recommended for teams)
```bash
npx vibe-driven-dev install claude-code --project
```

Files created:
```
.claude/
  agents/
    vdd-orchestrator.md
    vdd-planner.md
    vdd-architect.md
    vdd-detailer.md
    vdd-researcher.md
    vdd-qa-guardian.md
    vdd-handoff-manager.md
.vdd/
  project-state.json
  install-manifest.json
  addons/
    installed/
      local/
```

### User-level install (recommended for individuals)
```bash
npx vibe-driven-dev install claude-code --global
```

Files created in `~/.claude/agents/` with the same `vdd-*.md` naming scheme.

---

## 6. Generic AGENTS.md Mode

Use this mode if you do not use Claude Code but want a portable compatibility layer for AGENTS-aware runtimes.

```bash
npx vibe-driven-dev install generic-agents-md --project
```

VDD writes `AGENTS.md` plus canonical agent files into `.vdd/agents/`.

---

## 7. Verify the Installation

```bash
vdd doctor
```

Expected output on a healthy install:
```
VDD doctor

  ✓  .vdd/project-state.json
     stage: —
  ✓  .vdd/install-manifest.json
     target: claude-code, scope: project, version: 0.1.0
  ✓  .claude/agents/ (Claude integration)
     7 VDD agent(s) installed
  ✓  Executable sources
     31 executable source(s) discovered

✓ VDD environment is healthy.
```

Also run `vdd scan` to see all discovered agents and skills.

---

## 8. First Workflow

```bash
vdd run /vibe.init
vdd run /vibe.plan
vdd run /vibe.scaffold
```

See [USAGE.md](./USAGE.md) for the full journey reference.

---

## 9. Packs and Add-ons

Add an external skill pack (e.g., coding standards):

```bash
vdd add ../my-coding-standards
vdd packs
```

Discover and promote learning sources:
```bash
vdd scan
vdd validate <source-id>
vdd promote <source-id>
```

---

## 10. Troubleshooting

| Problem | Fix |
|---|---|
| `No agent folder found` | Run `vdd install claude-code --project` |
| `No project state found` | Run `vdd init` |
| `Validation failed` | Run `vdd validate <id>` to see findings |
| `Version mismatch` | Check `.vdd/install-manifest.json` and reinstall |
| `Command not recognized` | Ensure the `vdd` binary is in PATH or use `npx vibe-driven-dev` |
| Agents not appearing in Claude Code | Ensure you ran `--project` — Claude needs them in `.claude/agents/` |
