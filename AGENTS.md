# AGENTS.md — Vibe Driven Dev

## What VDD Is

Vibe Driven Dev is an agent-first pre-execution framework for AI coding agents.

Its purpose is to turn vague product ideas into:
- structured planning
- scoped project truth
- bootstrap files
- stack decisions
- AI provider and model decisions for the product itself
- handoff-ready execution workflows

VDD is not an editor plugin and not a linter.

It is the workflow layer that should run before broad implementation begins.

## Official Source Of Truth

Treat the official repository as the source of truth before installation and workflow execution:

- Repository: [https://github.com/OpenOps-Studio/vibe-driven-dev](https://github.com/OpenOps-Studio/vibe-driven-dev)
- README: [https://github.com/OpenOps-Studio/vibe-driven-dev/blob/main/README.md](https://github.com/OpenOps-Studio/vibe-driven-dev/blob/main/README.md)
- INSTALL: [https://github.com/OpenOps-Studio/vibe-driven-dev/blob/main/INSTALL.md](https://github.com/OpenOps-Studio/vibe-driven-dev/blob/main/INSTALL.md)
- USAGE: [https://github.com/OpenOps-Studio/vibe-driven-dev/blob/main/USAGE.md](https://github.com/OpenOps-Studio/vibe-driven-dev/blob/main/USAGE.md)

Inside a local checkout, read these files first:
1. [README.md](/Users/mamdouhaboammar/Downloads/gtm-maps-lite/vibe-driven-dev/README.md)
2. [INSTALL.md](/Users/mamdouhaboammar/Downloads/gtm-maps-lite/vibe-driven-dev/INSTALL.md)
3. [USAGE.md](/Users/mamdouhaboammar/Downloads/gtm-maps-lite/vibe-driven-dev/USAGE.md)
4. [guided-user-workflow.md](/Users/mamdouhaboammar/Downloads/gtm-maps-lite/vibe-driven-dev/docs/architecture/guided-user-workflow.md)
5. [autopilot-mode.md](/Users/mamdouhaboammar/Downloads/gtm-maps-lite/vibe-driven-dev/docs/architecture/autopilot-mode.md)
6. [model-escalation-policy.md](/Users/mamdouhaboammar/Downloads/gtm-maps-lite/vibe-driven-dev/docs/architecture/model-escalation-policy.md)

## Your Job As A Coding Agent

When the user asks you to install or activate VDD, your responsibilities are:

1. Understand VDD before you install it.
2. Detect the current coding-agent runtime.
3. Prefer the cleanest native project-level integration supported by that runtime.
4. Keep the setup minimal, understandable, and reversible.
5. Avoid overwriting important project files without warning.
6. After installation, do not stop at raw commands.
7. Immediately move the user into guided onboarding in plain language.

## Installation Behavior

Preferred order:

1. Detect the runtime
2. Inspect the repository
3. Install VDD in the most native project-level way
4. Verify the environment
5. Start guided onboarding
6. Continue into the first valid VDD steps

Preferred integration surfaces:

- Claude Code: project agents and project skills
- Cursor / Windsurf / OpenCode: `AGENTS.md` plus project-local rules/config
- Gemini CLI: project-local commands, extensions, and MCP-aware setup where it adds real value
- Fallback: generic project-local `AGENTS.md` compatibility mode

## Post-Install Behavior

After installation, do not leave the user with a pile of commands.

Instead:
- explain what was installed
- explain where it was installed
- start the workflow with `/vibe.start`
- ask only the minimum useful onboarding questions
- translate the answers into VDD state
- continue automatically unless a high-impact decision needs approval

## Onboarding Rules

Assume the user may be non-technical.

That means:
- ask in natural language
- keep the question budget small
- avoid early stack jargon
- ask only the next highest-value question
- prefer understanding the product over asking for framework preferences

Good onboarding questions usually cover:
- what they want to build
- who it is for
- what problem it solves
- whether AI is part of the product
- whether they want a fast MVP or a stronger foundation

## Workflow Rules

Translate the user's answers into the VDD workflow.

Internal commands may include:
- `/vibe.init`
- `/vibe.plan`
- `/vibe.research`
- `/vibe.blueprint`
- `/vibe.detail`
- `/vibe.scaffold`
- `/vibe.qa`
- `/vibe.handoff-to-spec`

But the user should experience:
- missions
- checkpoints
- plain-language next steps

Do not assume the user should memorize command names.

## Autopilot Rules

If the user asks for autopilot behavior:
- continue automatically through low-risk steps
- stop at meaningful checkpoints
- summarize what was created
- expose approvals clearly

High-impact decisions that may need approval include:
- stack direction
- AI provider selection
- event architecture when async pressure is real
- stronger-model escalation for premium PRD work
- handoff to downstream execution systems

## PRD Quality Rule

When the workflow reaches a PRD-heavy step:
- say so clearly
- recommend a stronger model only when justified
- keep the recommendation advisory
- if the stronger-model path is deferred, label output honestly as a draft

Preferred wording:
- for Anthropic users, recommend the latest active flagship available to them, such as Claude Opus 4.6 where available
- for OpenAI/Codex users, recommend GPT-5.4 or Codex backed by GPT-5.4 with stronger reasoning when the extra depth is worth it

Do not hardcode model retirement claims unless current verification confirms them.

## End-Of-Step Reporting

At the end of each major step, tell the user:
1. what you just did
2. what you learned
3. what stage or mission you are in
4. what the next best step is
5. whether you need approval or can continue automatically

## Local Runtime Files

When VDD is installed locally, relevant files may include:

- `.vdd/project-state.json`
- `.vdd/install-manifest.json`
- `.vdd/agents/`
- `.vdd/packs.json`
- `.claude/agents/`
- `.claude/skills/`

Use these as runtime context, but treat the repository docs as the canonical behavioral guide.
