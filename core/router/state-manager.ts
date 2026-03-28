import fs from "fs-extra";
import path from "node:path";
import { z } from "zod";

export const gateStatusSchema = z.union([
  z.literal("pending"),
  z.literal("passed"),
  z.literal("warning"),
  z.literal("failed")
]);

export const stageSchema = z.union([
  z.literal("init"),
  z.literal("plan"),
  z.literal("research"),
  z.literal("blueprint"),
  z.literal("detail"),
  z.literal("scaffold"),
  z.literal("qa"),
  z.literal("handoff")
]);

export const statusSchema = z.union([
  z.literal("idle"),
  z.literal("active"),
  z.literal("halted"),
  z.literal("failed"),
  z.literal("handoff-ready"),
  z.literal("completed")
]);

export const projectStateSchema = z.object({
  projectId: z.string().min(1),
  stage: stageSchema,
  status: statusSchema,
  platform: z.string().optional(),
  targetUser: z.string().optional(),
  successDefinition: z.string().optional(),
  assumptions: z.array(z.string()),
  decisions: z.array(z.string()),
  artifacts: z.array(z.string()),
  gates: z.object({
    security: gateStatusSchema,
    measurement: gateStatusSchema,
    realityCheck: gateStatusSchema
  }),
  handoff: z.object({
    target: z.literal("spec-kit"),
    ready: z.boolean()
  })
});

export type ProjectState = z.infer<typeof projectStateSchema>;

export interface StateManagerOptions {
  projectRoot?: string;
  stateFilePath?: string;
}

export class StateManager {
  private readonly projectRoot: string;
  private readonly stateFilePath: string;

  constructor(options: StateManagerOptions = {}) {
    this.projectRoot = options.projectRoot ?? process.cwd();
    this.stateFilePath =
      options.stateFilePath ??
      path.join(this.projectRoot, ".vdd", "project-state.json");
  }

  getStateFilePath(): string {
    return this.stateFilePath;
  }

  createInitialState(input?: {
    projectId?: string;
    platform?: string;
    targetUser?: string;
    successDefinition?: string;
  }): ProjectState {
    return {
      projectId: input?.projectId ?? "proj_local",
      stage: "init",
      status: "active",
      platform: input?.platform,
      targetUser: input?.targetUser,
      successDefinition: input?.successDefinition,
      assumptions: [],
      decisions: [],
      artifacts: [],
      gates: {
        security: "pending",
        measurement: "pending",
        realityCheck: "pending"
      },
      handoff: {
        target: "spec-kit",
        ready: false
      }
    };
  }

  async ensureStateDir(): Promise<void> {
    await fs.ensureDir(path.dirname(this.stateFilePath));
  }

  async exists(): Promise<boolean> {
    return fs.pathExists(this.stateFilePath);
  }

  async load(): Promise<ProjectState | null> {
    const exists = await this.exists();
    if (!exists) {
      return null;
    }

    const raw = await fs.readFile(this.stateFilePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return projectStateSchema.parse(parsed);
  }

  async save(state: ProjectState): Promise<void> {
    const validated = projectStateSchema.parse(state);
    await this.ensureStateDir();
    await fs.writeJson(this.stateFilePath, validated, { spaces: 2 });
  }

  async init(input?: {
    projectId?: string;
    platform?: string;
    targetUser?: string;
    successDefinition?: string;
  }): Promise<ProjectState> {
    const state = this.createInitialState(input);
    await this.save(state);
    return state;
  }

  async update(
    updater: (current: ProjectState) => ProjectState | Promise<ProjectState>
  ): Promise<ProjectState> {
    const current = await this.load();
    if (!current) {
      throw new Error(
        "No project state found. Initialize the project before updating state."
      );
    }

    const next = await updater(current);
    await this.save(next);
    return next;
  }

  async markStage(
    stage: ProjectState["stage"],
    status?: ProjectState["status"]
  ): Promise<ProjectState> {
    return this.update((current) => ({
      ...current,
      stage,
      status: status ?? current.status
    }));
  }

  async addArtifacts(artifacts: string[]): Promise<ProjectState> {
    return this.update((current) => ({
      ...current,
      artifacts: Array.from(new Set([...current.artifacts, ...artifacts]))
    }));
  }

  async addDecision(decisionId: string): Promise<ProjectState> {
    return this.update((current) => ({
      ...current,
      decisions: Array.from(new Set([...current.decisions, decisionId]))
    }));
  }

  async addAssumption(assumption: string): Promise<ProjectState> {
    return this.update((current) => ({
      ...current,
      assumptions: Array.from(new Set([...current.assumptions, assumption]))
    }));
  }

  async setGate(
    gate: keyof ProjectState["gates"],
    value: ProjectState["gates"][keyof ProjectState["gates"]]
  ): Promise<ProjectState> {
    return this.update((current) => ({
      ...current,
      gates: {
        ...current.gates,
        [gate]: value
      }
    }));
  }

  async setHandoffReady(ready: boolean): Promise<ProjectState> {
    return this.update((current) => ({
      ...current,
      handoff: {
        ...current.handoff,
        ready
      },
      status: ready ? "handoff-ready" : current.status
    }));
  }
}
