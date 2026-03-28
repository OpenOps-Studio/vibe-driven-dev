# USAGE.md — Vibe Driven Dev

> VDD governs the **pre-execution phase** of software development.
> Its job ends when your project is ready. Then it hands off to Spec-Kit or your coding agent.

---

## 1. Mental Model

```
Vague intent
    ↓
[ VDD Workflow ]   ← You are here
    ↓
Execution-ready specification
    ↓
[ Spec-Kit / AI Coding Agent ]
```

VDD does not write code. It makes sure the agent that writes code has everything it needs to do so correctly.

The VDD workflow produces a trusted set of bootstrap artifacts that your execution agent reads as ground truth.

---

## 2. Core Journey

Each stage is invoked by running a public command through the VDD router.

```bash
vdd run /vibe.init
vdd run /vibe.plan
vdd run /vibe.research
vdd run /vibe.blueprint
vdd run /vibe.detail
vdd run /vibe.scaffold
vdd run /vibe.qa
vdd run /vibe.handoff-to-spec
```

### Stage Summary

| Command | Stage | Purpose |
|---|---|---|
| `/vibe.init` | init | Capture project intent, scope, and success definition |
| `/vibe.plan` | plan | Translate intent into a structured problem statement |
| `/vibe.research` | research | Validate assumptions against real-world constraints |
| `/vibe.blueprint` | blueprint | Produce architecture and stack decisions |
| `/vibe.detail` | detail | Technical detail for each system component |
| `/vibe.scaffold` | scaffold | Generate repository bootstrap files |
| `/vibe.qa` | qa | Verify readiness before handoff |
| `/vibe.handoff-to-spec` | handoff | Transfer ownership to execution runtime |

Check current progress at any time:
```bash
vdd status
```

---

## 3. Quickly Use With Your Favorite Coding Agent

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
9. Then start guided onboarding and move the project into the VDD journey.
10. After installation, begin a plain-language Q&A loop instead of expecting me to know commands.

Your exact workflow:
- Detect the runtime and installation surface.
- Inspect the repository safely.
- Install VDD in the best supported way for this runtime.
- Create or update only the minimum required project-local files.
- Set up the agent integration layer if supported.
- Run environment checks.
- Read the repo-local guidance first:
  - README.md
  - INSTALL.md
  - USAGE.md
  - docs/architecture/guided-user-workflow.md
- Start the workflow with /vibe.start.
- Ask at most 5 to 7 simple onboarding questions in plain language.
- Translate the answers into VDD state.
- Continue into the first valid workflow steps once the intent is grounded.
- Before PRD-heavy scaffold work, recommend a stronger model temporarily if that would materially improve the artifact quality.
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
- start the guided workflow with /vibe.start
- ask simple onboarding questions in plain language
- continue into the first valid workflow steps once the project intent is clear
- before PRD-heavy scaffold work, recommend a stronger model temporarily if that would clearly improve the result

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
4. Start the guided workflow with /vibe.start.
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

## 4. Bootstrap Files

`/vibe.scaffold` generates these files in your project root:

| File | Contains |
|---|---|
| `PRD.md` | Product requirements and success criteria |
| `Logic.md` | Business logic and core system behaviors |
| `Structure.md` | File and module architecture |
| `Dependencies.md` | Tech stack with rationale and version guidance |
| `Memory.md` | Architectural decisions and rationale log |
| `anti-hallucination.md` | Explicit prohibitions and boundaries for the coding agent |
| `repo.md` | Repository conventions, branching, naming rules |
| `Design.md` | UI/UX and design system guidance |
| `Constraints.md` | Hard limits: time, budget, scope, tech constraints |

These files are the handoff artifacts. They are the source of truth for the execution agent.

---

## 5. Stack Selection

VDD uses the `stack-advisor` skill to suggest the best technology stack based on your project type, platform, and constraints.

This runs automatically during `/vibe.init` and `/vibe.plan`. The recommendation appears in the routing result.

Stack recommendations are based on:
- Declared platform
- Target user type
- Declared constraints
- Available packs and their stack preferences

---

## 6. AI Provider Selection

The `ai-provider-selector` skill recommends the best AI API provider for your *product* (not for VDD itself).

If your project is an AI-powered application, VDD will surface a recommendation during `/vibe.plan` covering:
- Anthropic Claude (reasoning, long context, agent use)
- Google Gemini (multimodal, grounding, search integration)
- OpenAI GPT (broad ecosystem, tool use)
- DeepSeek (cost-efficiency, code focus)

The recommendation is returned in the routing result with rationale. It does not auto-configure anything.

---

## 7. Learning Sources and Add-ons

VDD separates knowledge into trust tiers:

| Tier | Path | Trust |
|---|---|---|
| Core | `skills/`, `agents/` | Executable — always trusted |
| Installed Pack | `.vdd/addons/installed/` | Executable — explicitly added |
| Archive | `archive/learning-sources/` | Learning-only — never auto-executed |

Add an external pack:
```bash
vdd add ../my-coding-standards
```

Inspect archive sources and promote trusted ones:
```bash
vdd scan
vdd validate archive-learning-skill:archive/learning-sources/my-skill/SKILL.md
vdd promote archive-learning-skill:archive/learning-sources/my-skill/SKILL.md
```

---

## 8. Handoff to Spec-Kit

When VDD marks the project as handoff-ready, it transfers ownership to Spec-Kit:

```bash
vdd run /vibe.handoff-to-spec
```

At this point:
- All bootstrap files are written to the project root
- The state is marked `stage: handoff, status: completed`
- Spec-Kit or your coding agent can now read the scaffold and begin implementation

VDD's job is done.

---

## 9. CLI Reference

```bash
# Installation
npx vibe-driven-dev install claude-code --project    # Install for Claude Code (project)
npx vibe-driven-dev install claude-code --global     # Install for Claude Code (user-level)
npx vibe-driven-dev install generic-agents-md --project
vdd targets                                          # Show supported runtime targets

# Project lifecycle
vdd init                                       # Initialize project state
vdd run <command>                              # Run a VDD journey command
vdd status                                     # Show current stage and readiness
vdd doctor                                     # Full environment health check

# Source management
vdd scan                                       # Discover all agents and skills
vdd validate <source-id>                       # Audit a source for security and compliance
vdd promote <source-id>                        # Upgrade a source to executable trust tier

# Pack management
vdd add <path>                                 # Add a skill pack
vdd packs                                      # List installed packs
```
