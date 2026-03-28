import os from "node:os";
import path from "node:path";
import type {
  ImplementedInstallTargetId,
  InstallScope
} from "./target-types.js";

export interface VddPaths {
  vddDir: string;
  addonsDir: string;
  stateFile: string;
  manifestFile: string;
  agentsDir: string;
}

const VDD_DIR = ".vdd";
const CLAUDE_PROJECT_AGENTS_DIR = ".claude/agents";
const CLAUDE_GLOBAL_AGENTS_DIR = path.join(os.homedir(), ".claude", "agents");
const GENERIC_AGENTS_DIR = path.join(VDD_DIR, "agents");

export function resolveVddPaths(projectRoot: string): VddPaths {
  const vddDir = path.join(projectRoot, VDD_DIR);
  return {
    vddDir,
    addonsDir: path.join(vddDir, "addons"),
    stateFile: path.join(vddDir, "project-state.json"),
    manifestFile: path.join(vddDir, "install-manifest.json"),
    agentsDir: path.join(vddDir, "agents")
  };
}

export function resolveAgentInstallPath(
  projectRoot: string,
  target: ImplementedInstallTargetId,
  scope: InstallScope
): string {
  if (target === "claude-code") {
    return scope === "project"
      ? path.join(projectRoot, CLAUDE_PROJECT_AGENTS_DIR)
      : CLAUDE_GLOBAL_AGENTS_DIR;
  }
  return path.join(projectRoot, GENERIC_AGENTS_DIR);
}

export function getAgentFileName(agentName: string): string {
  return `vdd-${agentName}.md`;
}
