export type InstallScope = "project" | "global";

export type InstallTargetId =
  | "claude-code"
  | "codex"
  | "cursor"
  | "windsurf"
  | "opencode"
  | "gemini-cli"
  | "generic-agents-md";

export type InstallSupportTier = "native" | "compatible" | "generic";

export type AdapterStatus = "implemented" | "planned";

export type ExportMode =
  | "agents-md"
  | "skills-md"
  | "rules-md"
  | "commands"
  | "extensions"
  | "mcp"
  | "config"
  | "state"
  | "manifest";

export interface InstallTargetDefinition {
  id: InstallTargetId;
  label: string;
  summary: string;
  supportTier: InstallSupportTier;
  adapterStatus: AdapterStatus;
  scopes: InstallScope[];
  aliases: string[];
  exportModes: ExportMode[];
  runtimeConventions: string[];
}

export type ImplementedInstallTargetId = "claude-code" | "generic-agents-md";
