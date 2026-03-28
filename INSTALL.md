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

# Step 3: Start the guided VDD workflow
npx vibe-driven-dev run /vibe.start --idea "Describe the project in plain language"

# Step 4: Or let onboarding auto-run planning and research
npx vibe-driven-dev run /vibe.start --autopilot --idea "Describe the project in plain language"
```

---

## 4. Quickly Use With Your Favorite Coding Agent

Paste one of the prompts below directly into your coding agent.

Each prompt tells the agent:
- what Vibe Driven Dev is
- where the official repository lives
- which local docs to read first
- how to install VDD
- how to start guided onboarding after installation
- how to continue into the workflow instead of stopping at raw commands

### Runtime Fit

| Runtime | Best fit |
|---|---|
| Claude Code | Best native fit via project agents and project skills |
| Cursor / Windsurf / OpenCode | Best fit via `AGENTS.md` plus project rules or config |
| Gemini CLI | Best fit via project commands, extensions, and MCP-aware setup |

### Universal Prompt

```text
You are my coding agent and setup operator.

You are going to install and activate Vibe Driven Dev for this project, then guide me through the first project-definition workflow in plain language.

Important context:
Vibe Driven Dev is an agent-first pre-execution framework for AI coding agents.
Its job is to turn vague product ideas into:
- structured planning
- bootstrap files
- stack decisions
- AI provider and model decisions for the product itself
- handoff-ready workflows

Official repository:
https://github.com/OpenOps-Studio/vibe-driven-dev

Treat the official VDD repository as the source of truth before installation and workflow execution.

Read these files first if they exist locally:
- README.md
- INSTALL.md
- USAGE.md
- AGENTS.md
- docs/architecture/guided-user-workflow.md
- docs/architecture/autopilot-mode.md
- docs/architecture/model-escalation-policy.md

Your responsibilities:
1. Inspect the repository and understand VDD before doing anything else.
2. Detect which coding-agent runtime you are currently running inside.
3. Install VDD using the cleanest native project-level method supported by this runtime.
4. Keep the setup minimal and tidy.
5. Do not overwrite important files without warning me first.
6. After installation, do not stop at raw commands.
7. Immediately move me into a guided onboarding loop in simple non-technical language.

Guided onboarding rules:
- Assume I am a non-technical user.
- Ask only the minimum useful questions.
- Ask about the project idea in natural language.
- Help me describe what I want to build, who it is for, what problem it solves, and whether AI is part of the product.
- Do not overwhelm me with technical wording.
- Keep the conversation practical and calm.

Workflow rules:
- Translate my answers into the VDD workflow.
- Start by guiding or executing the equivalent of:
  - /vibe.init
  - /vibe.plan
  - /vibe.scaffold
- Always explain what stage or mission we are in.
- Always tell me the next best step.
- Continue automatically unless a high-impact decision needs my approval.

Decision rules:
- If stack selection is needed, explain the top recommendation simply.
- If AI provider or model selection is needed for the product itself, explain the best fit simply.
- If this project would benefit from extra coding-agent skills, recommend them clearly.

PRD quality rule:
- Once you have enough information to create a serious PRD, tell me explicitly.
- At that point, recommend switching to a stronger model for the PRD-writing phase if appropriate.
- For Anthropic users, prefer the latest active flagship model available, such as Claude Opus 4.6 where available.
- For OpenAI/Codex users, prefer the strongest reasoning setting available for detailed PRD work.
- Do not force the switch, but explain why it would improve output quality.

Final behavior:
- be installation-aware
- be workflow-aware
- be next-step-aware
- be beginner-friendly
- do not leave me with a pile of commands and no guidance

At the end of each major step, tell me:
1. what you just did
2. what you learned
3. what stage or mission we are in
4. what the next best step is
5. whether you need my approval or can continue automatically
```

### Claude Code Prompt

```text
You are running inside Claude Code.

Install and activate Vibe Driven Dev for this project using Claude Code native project-level integration.

Official repository:
https://github.com/OpenOps-Studio/vibe-driven-dev

Treat the official VDD repository as the source of truth before installation and workflow execution.

Read these files first if they exist locally:
- README.md
- INSTALL.md
- USAGE.md
- AGENTS.md
- docs/architecture/guided-user-workflow.md
- docs/architecture/autopilot-mode.md
- docs/architecture/model-escalation-policy.md

Use Claude-native conventions:
- project subagents in .claude/agents/
- project skills in .claude/skills/

Your job:
- inspect the VDD repository first
- understand what VDD is and how it works
- install it cleanly into this project using Claude-native project-level conventions
- keep the installation minimal
- do not overwrite important files without warning me first
- after installation, do not stop at setup
- immediately start a guided onboarding conversation with me in simple language
- ask me what kind of project I want to build
- help me explain it naturally
- translate my answers into the VDD workflow
- guide or execute:
  - /vibe.init
  - /vibe.plan
  - /vibe.scaffold

At every stage:
- tell me what stage or mission we are in
- tell me the next best step
- continue automatically unless a high-impact decision needs my approval

When enough information exists for a serious PRD:
- say so clearly
- recommend using the strongest available model for that phase, such as Claude Opus 4.6 where available
- explain that this is to improve PRD quality, depth, and structure

I am not technical, so explain each step in simple language.

At the end:
- summarize what you installed
- list the Claude-specific paths you used
- show me the current VDD stage or mission
- tell me the next command if I want to continue manually
```

### Cursor / Windsurf / OpenCode Prompt

```text
You are my coding agent.

Please install and activate Vibe Driven Dev in this repository using the most native project-level integration available for this editor/runtime.

Official repository:
https://github.com/OpenOps-Studio/vibe-driven-dev

Treat the official VDD repository as the source of truth before installation and workflow execution.

Read these files first if they exist locally:
- README.md
- INSTALL.md
- USAGE.md
- AGENTS.md
- docs/architecture/guided-user-workflow.md
- docs/architecture/autopilot-mode.md
- docs/architecture/model-escalation-policy.md

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
4. Start the guided workflow with /vibe.start after installation.
5. Ask simple onboarding questions in plain language and keep the question budget small.
6. Continue into the first valid workflow steps only after the idea is grounded.
7. Before PRD-heavy scaffold work, recommend a stronger model temporarily if that would clearly improve the result.
8. Explain what you did in very simple language because I am a non-technical user.

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

Official repository:
https://github.com/OpenOps-Studio/vibe-driven-dev

Treat the official VDD repository as the source of truth before installation and workflow execution.

Read these files first if they exist locally:
- README.md
- INSTALL.md
- USAGE.md
- AGENTS.md
- docs/architecture/guided-user-workflow.md
- docs/architecture/autopilot-mode.md
- docs/architecture/model-escalation-policy.md

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
- start the guided workflow with /vibe.start
- ask simple onboarding questions in plain language
- continue into the first valid workflow steps only after the idea is grounded
- generate the essential bootstrap files when the workflow reaches scaffold
- before PRD-heavy scaffold work, recommend a stronger model temporarily if that would clearly improve the result

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
- understand VDD from the repository first
- prefer project-level installation
- keep the setup tidy
- avoid unnecessary files
- start guided onboarding
- translate plain-language answers into the first workflow steps
- keep explaining the current stage or mission
- keep proposing or executing the next best step
- explain clearly what was installed and where

If the runtime does not support native agents or skills well, the agent should fall back to a clean generic project-local setup instead of forcing a bad integration

### What the Agent Must Do After Install

After installation, the agent should:
1. tell the user what was detected
2. tell the user what was installed and where
3. start `/vibe.start` or the equivalent guided entrypoint
4. ask the minimum useful onboarding questions
5. translate answers into VDD workflow steps
6. continue automatically unless a high-impact decision needs approval
7. explain the next best step after each major checkpoint

### What the User Should Expect

After a good setup run, the agent should tell you:
- which runtime it detected
- which installation method it used
- which files it created or updated
- which VDD stage or mission the project is currently in
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
