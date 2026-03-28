import path from "node:path";
import fs from "fs-extra";
import fg from "fast-glob";
import matter from "gray-matter";
import { z } from "zod";
import { loadPacks } from "./pack-loader.js";

export const sourceKindSchema = z.union([
  z.literal("core-skill"),
  z.literal("core-agent"),
  z.literal("project-skill"),
  z.literal("project-agent"),
  z.literal("global-skill"),
  z.literal("global-agent"),
  z.literal("archive-learning-skill"),
  z.literal("archive-learning-agent"),
  z.literal("pack-skill"),
  z.literal("pack-agent")
]);

export const trustTierSchema = z.union([
  z.literal("trusted-core"),
  z.literal("installed-local"),
  z.literal("installed-global"),
  z.literal("archive-learning-only"),
  z.literal("installed-pack")
]);

export const runtimeEligibilitySchema = z.union([
  z.literal("executable"),
  z.literal("restricted"),
  z.literal("learning-only")
]);

export const loadedSourceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  kind: sourceKindSchema,
  absolutePath: z.string().min(1),
  relativePath: z.string().min(1),
  trustTier: trustTierSchema,
  runtimeEligibility: runtimeEligibilitySchema,
  description: z.string().optional(),
  frontmatter: z.record(z.string(), z.unknown()),
  body: z.string(),
  fileType: z.union([z.literal("skill"), z.literal("agent")])
});

export type LoadedSource = z.infer<typeof loadedSourceSchema>;

export interface SourceLoaderOptions {
  projectRoot?: string;
  globalRoot?: string;
}

function makeId(kind: string, relativePath: string): string {
  return `${kind}:${relativePath}`.replaceAll("\\", "/");
}

function toRelative(projectRoot: string, absolutePath: string): string {
  return path.relative(projectRoot, absolutePath).replaceAll("\\", "/");
}

function classifySkillSource(relativePath: string): {
  kind: LoadedSource["kind"];
  trustTier: LoadedSource["trustTier"];
  runtimeEligibility: LoadedSource["runtimeEligibility"];
} {
  if (relativePath.startsWith("skills/")) {
    return {
      kind: "core-skill",
      trustTier: "trusted-core",
      runtimeEligibility: "executable"
    };
  }

  if (relativePath.startsWith(".vdd/addons/installed/local/")) {
    return {
      kind: "project-skill",
      trustTier: "installed-local",
      runtimeEligibility: "executable"
    };
  }

  if (relativePath.startsWith(".vdd/addons/installed/global/")) {
    return {
      kind: "global-skill",
      trustTier: "installed-global",
      runtimeEligibility: "restricted"
    };
  }

  return {
    kind: "archive-learning-skill",
    trustTier: "archive-learning-only",
    runtimeEligibility: "learning-only"
  };
}

function classifyAgentSource(relativePath: string): {
  kind: LoadedSource["kind"];
  trustTier: LoadedSource["trustTier"];
  runtimeEligibility: LoadedSource["runtimeEligibility"];
} {
  if (relativePath.startsWith("agents/")) {
    return {
      kind: "core-agent",
      trustTier: "trusted-core",
      runtimeEligibility: "executable"
    };
  }

  if (relativePath.startsWith(".vdd/agents/")) {
    return {
      kind: "project-agent",
      trustTier: "installed-local",
      runtimeEligibility: "executable"
    };
  }

  if (relativePath.startsWith(".vdd/global-agents/")) {
    return {
      kind: "global-agent",
      trustTier: "installed-global",
      runtimeEligibility: "restricted"
    };
  }

  return {
    kind: "archive-learning-agent",
    trustTier: "archive-learning-only",
    runtimeEligibility: "learning-only"
  };
}

async function readMarkdownContract(
  absolutePath: string
): Promise<{ frontmatter: Record<string, unknown>; body: string }> {
  const raw = await fs.readFile(absolutePath, "utf8");
  const parsed = matter(raw);

  return {
    frontmatter: parsed.data as Record<string, unknown>,
    body: parsed.content
  };
}

export class SourceLoader {
  private readonly projectRoot: string;
  private readonly globalRoot: string;

  constructor(options: SourceLoaderOptions = {}) {
    this.projectRoot = options.projectRoot ?? process.cwd();
    this.globalRoot =
      options.globalRoot ?? path.join(this.projectRoot, ".vdd", "addons", "installed", "global");
  }

  async loadSkills(): Promise<LoadedSource[]> {
    const patterns = [
      "skills/**/SKILL.md",
      ".vdd/addons/installed/local/**/SKILL.md",
      ".vdd/addons/installed/global/**/SKILL.md",
      "archive/learning-sources/**/SKILL.md"
    ];

    const matches = await fg(patterns, {
      cwd: this.projectRoot,
      absolute: true,
      onlyFiles: true,
      unique: true
    });

    const loaded: LoadedSource[] = [];

    for (const absolutePath of matches) {
      const relativePath = toRelative(this.projectRoot, absolutePath);
      const classification = classifySkillSource(relativePath);
      const { frontmatter, body } = await readMarkdownContract(absolutePath);

      const name =
        typeof frontmatter.name === "string" && frontmatter.name.trim().length > 0
          ? frontmatter.name.trim()
          : path.basename(path.dirname(absolutePath));

      loaded.push(
        loadedSourceSchema.parse({
          id: makeId(classification.kind, relativePath),
          name,
          kind: classification.kind,
          absolutePath,
          relativePath,
          trustTier: classification.trustTier,
          runtimeEligibility: classification.runtimeEligibility,
          description:
            typeof frontmatter.description === "string"
              ? frontmatter.description
              : undefined,
          frontmatter,
          body,
          fileType: "skill"
        })
      );
    }

    return loaded;
  }

  async loadAgents(): Promise<LoadedSource[]> {
    const patterns = [
      "agents/**/AGENT.md",
      ".vdd/agents/**/AGENT.md",
      ".vdd/global-agents/**/AGENT.md",
      "archive/learning-sources/**/AGENT.md"
    ];

    const matches = await fg(patterns, {
      cwd: this.projectRoot,
      absolute: true,
      onlyFiles: true,
      unique: true
    });

    const loaded: LoadedSource[] = [];

    for (const absolutePath of matches) {
      const relativePath = toRelative(this.projectRoot, absolutePath);
      const classification = classifyAgentSource(relativePath);
      const { frontmatter, body } = await readMarkdownContract(absolutePath);

      const name =
        typeof frontmatter.name === "string" && frontmatter.name.trim().length > 0
          ? frontmatter.name.trim()
          : path.basename(path.dirname(absolutePath));

      loaded.push(
        loadedSourceSchema.parse({
          id: makeId(classification.kind, relativePath),
          name,
          kind: classification.kind,
          absolutePath,
          relativePath,
          trustTier: classification.trustTier,
          runtimeEligibility: classification.runtimeEligibility,
          description:
            typeof frontmatter.description === "string"
              ? frontmatter.description
              : undefined,
          frontmatter,
          body,
          fileType: "agent"
        })
      );
    }

    return loaded;
  }

  async loadPacks(): Promise<LoadedSource[]> {
    const packs = await loadPacks(this.projectRoot);
    const loaded: LoadedSource[] = [];

    for (const pack of packs) {
      for (const skill of pack.skills) {
        const { frontmatter, body } = await readMarkdownContract(skill.path);
        loaded.push(
          loadedSourceSchema.parse({
            id: `pack-skill:${pack.manifest.name}/${skill.name}`,
            name: skill.name,
            kind: "pack-skill",
            absolutePath: skill.path,
            relativePath: path.relative(this.projectRoot, skill.path).replaceAll("\\", "/"),
            trustTier: "installed-pack",
            runtimeEligibility: "executable",
            description: skill.description || undefined,
            frontmatter,
            body,
            fileType: "skill"
          })
        );
      }

      for (const agent of pack.agents) {
        const { frontmatter, body } = await readMarkdownContract(agent.path);
        loaded.push(
          loadedSourceSchema.parse({
            id: `pack-agent:${pack.manifest.name}/${agent.name}`,
            name: agent.name,
            kind: "pack-agent",
            absolutePath: agent.path,
            relativePath: path.relative(this.projectRoot, agent.path).replaceAll("\\", "/"),
            trustTier: "installed-pack",
            runtimeEligibility: "executable",
            description: agent.description || undefined,
            frontmatter,
            body,
            fileType: "agent"
          })
        );
      }
    }

    return loaded;
  }

  async loadAll(): Promise<LoadedSource[]> {
    const [skills, agents, packs] = await Promise.all([
      this.loadSkills(),
      this.loadAgents(),
      this.loadPacks()
    ]);

    return [...skills, ...agents, ...packs];
  }

  async summarize(): Promise<{
    total: number;
    executable: number;
    restricted: number;
    learningOnly: number;
    skills: number;
    agents: number;
  }> {
    const all = await this.loadAll();

    return {
      total: all.length,
      executable: all.filter((item) => item.runtimeEligibility === "executable").length,
      restricted: all.filter((item) => item.runtimeEligibility === "restricted").length,
      learningOnly: all.filter((item) => item.runtimeEligibility === "learning-only").length,
      skills: all.filter((item) => item.fileType === "skill").length,
      agents: all.filter((item) => item.fileType === "agent").length
    };
  }
}
