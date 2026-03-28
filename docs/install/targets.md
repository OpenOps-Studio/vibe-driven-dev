# VDD Install Targets

This document defines the canonical VDD install targets and the current support level for each runtime family.

VDD is treated as a canonical system first:

- `agents/`
- `skills/`
- `packs/`
- `commands/`
- `.vdd/` state and manifests

Each runtime target receives a compatibility export or a native export generated from that canonical source.

## Support Matrix

| Target | Tier | Adapter status | Scopes | Export modes | Runtime conventions |
| --- | --- | --- | --- | --- | --- |
| `claude-code` | native | implemented | `project`, `global` | `agents-md`, `state`, `manifest` | `.claude/agents/`, `~/.claude/agents/`, `.claude/skills/` |
| `codex` | native | planned | `project` | `skills-md`, `agents-md`, `state`, `manifest` | `.codex/skills/`, `AGENTS.md` |
| `cursor` | compatible | planned | `project` | `agents-md`, `rules-md`, `state`, `manifest` | `AGENTS.md`, `.cursor/rules/` |
| `windsurf` | compatible | planned | `project` | `agents-md`, `rules-md`, `state`, `manifest` | `AGENTS.md`, `.windsurf/rules/` |
| `opencode` | compatible | planned | `project` | `agents-md`, `config`, `state`, `manifest` | `AGENTS.md`, `opencode.json`, `opencode.jsonc` |
| `gemini-cli` | native | planned | `project`, `global` | `commands`, `extensions`, `mcp`, `state`, `manifest` | `.gemini/commands/`, `.gemini/extensions/` |
| `generic-agents-md` | generic | implemented | `project` | `agents-md`, `state`, `manifest` | `AGENTS.md`, `.vdd/agents/` |

## Target Classes

### Native agents and skills

These runtimes have a first-class surface for agent or skill files:

- `claude-code`
- `codex`

VDD should export directly into their native filesystem conventions instead of flattening everything into one generic prompt file.

### AGENTS.md and rules family

These runtimes can consume a common `AGENTS.md` contract and may add runtime-specific rules or config:

- `cursor`
- `windsurf`
- `opencode`

The shared compatibility baseline is:

- root `AGENTS.md`
- canonical `.vdd/agents/`
- runtime-specific rule or config files when supported

### Commands, extensions, and MCP family

These runtimes rely more on command and extension surfaces than on raw agent markdown:

- `gemini-cli`

The intended export includes:

- `.gemini/commands/`
- `.gemini/extensions/`
- MCP metadata

### Generic compatibility

These exports are for tools without a strong native contract yet, or for teams that want a portable baseline:

- `generic-agents-md`

This adapter writes:

- root `AGENTS.md`
- canonical `.vdd/agents/`
- `.vdd/project-state.json`
- `.vdd/install-manifest.json`

## Implemented Targets Today

### `claude-code`

Implemented now.

Current output:

- `.claude/agents/vdd-*.md`
- `.vdd/project-state.json`
- `.vdd/install-manifest.json`

### `generic-agents-md`

Implemented now.

Current output:

- `AGENTS.md`
- `.vdd/agents/vdd-*.md`
- `.vdd/project-state.json`
- `.vdd/install-manifest.json`

## Planned Targets

These targets are intentionally modeled now so the install layer can grow without redesigning the canonical VDD core:

- `codex`
- `cursor`
- `windsurf`
- `opencode`
- `gemini-cli`

They are visible in the registry and CLI target listing, but `install` should refuse them until their adapters are implemented.

## CLI Direction

The intended commands are:

```bash
vdd targets
vdd install claude-code --project
vdd install claude-code --global
vdd install generic-agents-md --project
```

Backward-compatible aliases remain accepted for the currently implemented targets:

- `claude` -> `claude-code`
- `generic` -> `generic-agents-md`

## Design Rules

1. Canonical VDD content stays runtime-agnostic.
2. Adapters translate canonical content into runtime-specific layouts.
3. Implemented targets must be honest about what they write today.
4. Planned targets must be listed in the registry before their installers exist.
5. The install manifest must always record the canonical target id, not a legacy alias.
