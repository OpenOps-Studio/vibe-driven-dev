import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveVddPaths, resolveAgentInstallPath } from "./paths.js";
import { renderAllAgentTemplates, renderInstallManifest } from "./templates.js";
import { loadPacks } from "../runtime/pack-loader.js";
import type { InstallScope } from "./target-types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function resolveVddSourceRoot(projectRoot: string): Promise<string> {
  const candidates = [
    projectRoot,
    path.resolve(__dirname, "../.."),
    path.resolve(__dirname, "../../..")
  ];

  for (const candidate of candidates) {
    if (await fs.pathExists(path.join(candidate, "agents"))) {
      return candidate;
    }
  }

  throw new Error("Unable to locate the canonical VDD source root.");
}

export interface InstallResult {
  ok: boolean;
  scope: InstallScope;
  agentsInstalled: string[];
  skipped: string[];
  vddDir: string;
  agentsDir: string;
  manifestPath: string;
  errors: string[];
}

export async function installClaude(
  projectRoot: string,
  scope: InstallScope
): Promise<InstallResult> {
  const vddSourceRoot = await resolveVddSourceRoot(projectRoot);
  const paths = resolveVddPaths(projectRoot);
  const agentsInstallDir = resolveAgentInstallPath(projectRoot, "claude-code", scope);

  const errors: string[] = [];
  const agentsInstalled: string[] = [];
  const skipped: string[] = [];

  // 1. Scaffold .vdd/ structure
  await fs.ensureDir(paths.vddDir);
  await fs.ensureDir(paths.addonsDir);
  await fs.ensureDir(path.join(paths.addonsDir, "installed", "local"));

  // 2. Scaffold project-state.json if missing
  if (!(await fs.pathExists(paths.stateFile))) {
    await fs.writeJson(
      paths.stateFile,
      {
        vdd: true,
        stage: "init",
        status: "active",
        createdAt: new Date().toISOString()
      },
      { spaces: 2 }
    );
  }

  // 3. Ensure target agents directory exists
  await fs.ensureDir(agentsInstallDir);

  // 4. Render and write all core agents
  const agents = await renderAllAgentTemplates(vddSourceRoot);

  for (const agent of agents) {
    const destFile = path.join(agentsInstallDir, agent.fileName);

    if (await fs.pathExists(destFile)) {
      skipped.push(agent.name);
      continue;
    }

    try {
      await fs.writeFile(destFile, agent.content, "utf8");
      agentsInstalled.push(agent.name);
    } catch (err) {
      errors.push(
        `Failed to write agent ${agent.name}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  // 5. Write install manifest
  let activePacks: string[] = [];
  try {
    const packs = await loadPacks(projectRoot);
    activePacks = packs.map((p) => p.manifest.name);
  } catch {
    // Non-fatal — packs may not be configured yet
  }

  const manifest = renderInstallManifest({
    version: "0.1.0",
    target: "claude-code",
    scope,
    agentsInstalled,
    packs: activePacks
  });

  await fs.writeFile(paths.manifestFile, manifest, "utf8");

  return {
    ok: errors.length === 0,
    scope,
    agentsInstalled,
    skipped,
    vddDir: paths.vddDir,
    agentsDir: agentsInstallDir,
    manifestPath: paths.manifestFile,
    errors
  };
}
