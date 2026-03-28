import fg from "fast-glob";
import matter from "gray-matter";
import fs from "fs-extra";
import path from "path";

export interface PackManifest {
  name: string;
  source: string;
  version: string;
  description?: string;
}

export interface PacksConfig {
  packs: PackManifest[];
}

export interface PackSkill {
  name: string;
  description: string;
  path: string;
  packName: string;
  source: "pack";
}

export interface PackAgent {
  name: string;
  description: string;
  path: string;
  packName: string;
  source: "pack";
}

export interface LoadedPack {
  manifest: PackManifest;
  skills: PackSkill[];
  agents: PackAgent[];
  resolvedPath: string;
}

const PACKS_CONFIG_FILE = ".vdd/packs.json";

/**
 * Resolve a pack source string to an absolute path.
 * Supported formats:
 *   - local:<relative-or-absolute-path>
 *   - github:<user/repo>  (future: clones or fetches)
 */
function resolvePackSource(source: string, projectRoot: string): string | null {
  if (source.startsWith("local:")) {
    const localPath = source.slice("local:".length);
    if (path.isAbsolute(localPath)) {
      return localPath;
    }
    return path.resolve(projectRoot, localPath);
  }

  // Future: github: support
  if (source.startsWith("github:")) {
    console.warn(
      `[pack-loader] GitHub pack sources are not yet supported: ${source}`
    );
    return null;
  }

  // Treat bare paths as local
  if (path.isAbsolute(source)) return source;
  return path.resolve(projectRoot, source);
}

/**
 * Read the packs.json config from the project's .vdd directory.
 */
async function readPacksConfig(projectRoot: string): Promise<PacksConfig> {
  const configPath = path.join(projectRoot, PACKS_CONFIG_FILE);
  const exists = await fs.pathExists(configPath);
  if (!exists) {
    return { packs: [] };
  }

  try {
    const raw = await fs.readJSON(configPath);
    if (!raw.packs || !Array.isArray(raw.packs)) {
      return { packs: [] };
    }
    return raw as PacksConfig;
  } catch {
    console.warn(`[pack-loader] Could not read packs config: ${configPath}`);
    return { packs: [] };
  }
}

/**
 * Write or update the packs.json config.
 */
async function writePacksConfig(
  projectRoot: string,
  config: PacksConfig
): Promise<void> {
  const configPath = path.join(projectRoot, PACKS_CONFIG_FILE);
  await fs.ensureDir(path.dirname(configPath));
  await fs.writeJSON(configPath, config, { spaces: 2 });
}

/**
 * Discover skills inside a pack directory.
 */
async function discoverPackSkills(
  packPath: string,
  packName: string
): Promise<PackSkill[]> {
  const skillFiles = await fg("**/SKILL.md", {
    cwd: packPath,
    absolute: true,
    ignore: ["**/node_modules/**"],
  });

  const skills: PackSkill[] = [];

  for (const filePath of skillFiles) {
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const { data } = matter(raw);
      skills.push({
        name: data.name ?? path.basename(path.dirname(filePath)),
        description: data.description ?? "",
        path: filePath,
        packName,
        source: "pack",
      });
    } catch {
      // skip malformed files
    }
  }

  return skills;
}

/**
 * Discover agents inside a pack directory.
 */
async function discoverPackAgents(
  packPath: string,
  packName: string
): Promise<PackAgent[]> {
  const agentFiles = await fg("**/AGENT.md", {
    cwd: packPath,
    absolute: true,
    ignore: ["**/node_modules/**"],
  });

  const agents: PackAgent[] = [];

  for (const filePath of agentFiles) {
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const { data } = matter(raw);
      agents.push({
        name: data.name ?? path.basename(path.dirname(filePath)),
        description: data.description ?? "",
        path: filePath,
        packName,
        source: "pack",
      });
    } catch {
      // skip malformed files
    }
  }

  return agents;
}

/**
 * Load all installed packs for a project.
 */
export async function loadPacks(projectRoot: string): Promise<LoadedPack[]> {
  const config = await readPacksConfig(projectRoot);
  const loadedPacks: LoadedPack[] = [];

  for (const manifest of config.packs) {
    const resolvedPath = resolvePackSource(manifest.source, projectRoot);

    if (!resolvedPath) {
      console.warn(
        `[pack-loader] Could not resolve pack source: ${manifest.source}`
      );
      continue;
    }

    const exists = await fs.pathExists(resolvedPath);
    if (!exists) {
      console.warn(
        `[pack-loader] Pack path does not exist: ${resolvedPath} (pack: ${manifest.name})`
      );
      continue;
    }

    const skills = await discoverPackSkills(resolvedPath, manifest.name);
    const agents = await discoverPackAgents(resolvedPath, manifest.name);

    loadedPacks.push({
      manifest,
      skills,
      agents,
      resolvedPath,
    });
  }

  return loadedPacks;
}

/**
 * Add a new pack to the project's packs.json.
 * Returns false if a pack with the same name already exists.
 */
export async function addPack(
  projectRoot: string,
  name: string,
  source: string,
  version = "0.1.0"
): Promise<{ success: boolean; message: string }> {
  const config = await readPacksConfig(projectRoot);

  const existing = config.packs.find((p) => p.name === name);
  if (existing) {
    return {
      success: false,
      message: `Pack "${name}" is already installed (source: ${existing.source}).`,
    };
  }

  // Validate the source resolves
  const resolvedPath = resolvePackSource(source, projectRoot);
  if (!resolvedPath) {
    return {
      success: false,
      message: `Could not resolve pack source: ${source}`,
    };
  }

  const exists = await fs.pathExists(resolvedPath);
  if (!exists) {
    return {
      success: false,
      message: `Pack path does not exist: ${resolvedPath}`,
    };
  }

  // Try to read a description from the pack's SKILL.md or README
  let description = "";
  const skillMd = path.join(resolvedPath, "SKILL.md");
  if (await fs.pathExists(skillMd)) {
    const raw = await fs.readFile(skillMd, "utf-8");
    const { data } = matter(raw);
    description = data.description ?? "";
  }

  config.packs.push({ name, source, version, description });
  await writePacksConfig(projectRoot, config);

  return {
    success: true,
    message: `Pack "${name}" added from ${source}.`,
  };
}

/**
 * Remove a pack from the project's packs.json.
 */
export async function removePack(
  projectRoot: string,
  name: string
): Promise<{ success: boolean; message: string }> {
  const config = await readPacksConfig(projectRoot);
  const idx = config.packs.findIndex((p) => p.name === name);

  if (idx === -1) {
    return {
      success: false,
      message: `Pack "${name}" is not installed.`,
    };
  }

  config.packs.splice(idx, 1);
  await writePacksConfig(projectRoot, config);

  return {
    success: true,
    message: `Pack "${name}" removed.`,
  };
}

/**
 * List all installed packs.
 */
export async function listPacks(
  projectRoot: string
): Promise<PackManifest[]> {
  const config = await readPacksConfig(projectRoot);
  return config.packs;
}
