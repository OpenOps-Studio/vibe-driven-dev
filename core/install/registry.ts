import type {
  InstallTargetDefinition,
  InstallTargetId,
  ImplementedInstallTargetId
} from "./target-types.js";

const INSTALL_TARGETS: InstallTargetDefinition[] = [
  {
    id: "claude-code",
    label: "Claude Code",
    summary: "Native project or global install for Claude subagents today.",
    supportTier: "native",
    adapterStatus: "implemented",
    scopes: ["project", "global"],
    aliases: ["claude", "claude-code"],
    exportModes: ["agents-md", "state", "manifest"],
    runtimeConventions: [".claude/agents/", "~/.claude/agents/", ".claude/skills/"]
  },
  {
    id: "codex",
    label: "Codex",
    summary: "Planned native Codex export via .codex/skills plus a lightweight manifest.",
    supportTier: "native",
    adapterStatus: "planned",
    scopes: ["project"],
    aliases: ["codex"],
    exportModes: ["skills-md", "agents-md", "state", "manifest"],
    runtimeConventions: [".codex/skills/", "AGENTS.md"]
  },
  {
    id: "cursor",
    label: "Cursor",
    summary: "Planned compatibility export using AGENTS.md plus .cursor/rules files.",
    supportTier: "compatible",
    adapterStatus: "planned",
    scopes: ["project"],
    aliases: ["cursor"],
    exportModes: ["agents-md", "rules-md", "state", "manifest"],
    runtimeConventions: ["AGENTS.md", ".cursor/rules/"]
  },
  {
    id: "windsurf",
    label: "Windsurf",
    summary: "Planned compatibility export using AGENTS.md plus .windsurf/rules files.",
    supportTier: "compatible",
    adapterStatus: "planned",
    scopes: ["project"],
    aliases: ["windsurf"],
    exportModes: ["agents-md", "rules-md", "state", "manifest"],
    runtimeConventions: ["AGENTS.md", ".windsurf/rules/"]
  },
  {
    id: "opencode",
    label: "OpenCode",
    summary: "Planned compatibility export using AGENTS.md and opencode.json config.",
    supportTier: "compatible",
    adapterStatus: "planned",
    scopes: ["project"],
    aliases: ["opencode"],
    exportModes: ["agents-md", "config", "state", "manifest"],
    runtimeConventions: ["AGENTS.md", "opencode.json", "opencode.jsonc"]
  },
  {
    id: "gemini-cli",
    label: "Gemini CLI",
    summary: "Planned native export through .gemini commands, extensions, and MCP metadata.",
    supportTier: "native",
    adapterStatus: "planned",
    scopes: ["project", "global"],
    aliases: ["gemini", "gemini-cli"],
    exportModes: ["commands", "extensions", "mcp", "state", "manifest"],
    runtimeConventions: [".gemini/commands/", ".gemini/extensions/"]
  },
  {
    id: "generic-agents-md",
    label: "Generic AGENTS.md",
    summary: "Implemented compatibility bridge that exports AGENTS.md plus canonical VDD agent files.",
    supportTier: "generic",
    adapterStatus: "implemented",
    scopes: ["project"],
    aliases: ["generic", "generic-agents-md", "agents-md-family"],
    exportModes: ["agents-md", "state", "manifest"],
    runtimeConventions: ["AGENTS.md", ".vdd/agents/"]
  }
];

const TARGET_ALIAS_MAP = new Map<string, InstallTargetId>();

for (const target of INSTALL_TARGETS) {
  TARGET_ALIAS_MAP.set(target.id, target.id);
  for (const alias of target.aliases) {
    TARGET_ALIAS_MAP.set(alias, target.id);
  }
}

export function listInstallTargets(): InstallTargetDefinition[] {
  return INSTALL_TARGETS.map((target) => ({ ...target }));
}

export function getInstallTarget(id: InstallTargetId): InstallTargetDefinition | undefined {
  return INSTALL_TARGETS.find((target) => target.id === id);
}

export function resolveInstallTarget(input: string): InstallTargetDefinition | undefined {
  const normalized = input.trim().toLowerCase();
  const id = TARGET_ALIAS_MAP.get(normalized);
  return id ? getInstallTarget(id) : undefined;
}

export function isImplementedInstallTarget(
  id: InstallTargetId
): id is ImplementedInstallTargetId {
  return id === "claude-code" || id === "generic-agents-md";
}
