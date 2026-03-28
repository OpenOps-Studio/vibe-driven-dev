import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import fs from "fs-extra";
import { StateManager } from "../../core/router/state-manager.js";

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "vdd-test-"));
}

describe("StateManager — init creates file", () => {
  let tmpDir: string;
  let sm: StateManager;

  beforeEach(() => {
    tmpDir = makeTempDir();
    sm = new StateManager({ projectRoot: tmpDir });
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("creates project-state.json on init", async () => {
    const state = await sm.init();
    const filePath = sm.getStateFilePath();
    expect(await fs.pathExists(filePath)).toBe(true);
    expect(state.stage).toBe("init");
    expect(state.status).toBe("active");
  });

  it("uses default projectId when none provided", async () => {
    const state = await sm.init();
    expect(state.projectId).toBe("proj_local");
  });

  it("uses provided projectId", async () => {
    const state = await sm.init({ projectId: "my-project" });
    expect(state.projectId).toBe("my-project");
  });

  it("initializes empty arrays", async () => {
    const state = await sm.init();
    expect(state.assumptions).toEqual([]);
    expect(state.decisions).toEqual([]);
    expect(state.artifacts).toEqual([]);
  });

  it("initializes all gates as pending", async () => {
    const state = await sm.init();
    expect(state.gates.security).toBe("pending");
    expect(state.gates.measurement).toBe("pending");
    expect(state.gates.realityCheck).toBe("pending");
  });

  it("initializes handoff as not ready targeting spec-kit", async () => {
    const state = await sm.init();
    expect(state.handoff.target).toBe("spec-kit");
    expect(state.handoff.ready).toBe(false);
  });
});

describe("StateManager — load reads valid state", () => {
  let tmpDir: string;
  let sm: StateManager;

  beforeEach(() => {
    tmpDir = makeTempDir();
    sm = new StateManager({ projectRoot: tmpDir });
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("returns null when no state file exists", async () => {
    const loaded = await sm.load();
    expect(loaded).toBeNull();
  });

  it("loads and validates persisted state", async () => {
    await sm.init({ projectId: "proj-read-test" });
    const loaded = await sm.load();
    expect(loaded?.projectId).toBe("proj-read-test");
    expect(loaded?.stage).toBe("init");
  });

  it("exists() returns false before init", async () => {
    expect(await sm.exists()).toBe(false);
  });

  it("exists() returns true after init", async () => {
    await sm.init();
    expect(await sm.exists()).toBe(true);
  });
});

describe("StateManager — update persists changes", () => {
  let tmpDir: string;
  let sm: StateManager;

  beforeEach(async () => {
    tmpDir = makeTempDir();
    sm = new StateManager({ projectRoot: tmpDir });
    await sm.init();
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("markStage advances the stage", async () => {
    const updated = await sm.markStage("plan");
    expect(updated.stage).toBe("plan");
  });

  it("markStage with status updates status", async () => {
    const updated = await sm.markStage("plan", "halted");
    expect(updated.stage).toBe("plan");
    expect(updated.status).toBe("halted");
  });

  it("addArtifacts appends without duplicates", async () => {
    await sm.addArtifacts(["PRD.md", "Logic.md"]);
    const second = await sm.addArtifacts(["PRD.md", "Structure.md"]);
    expect(second.artifacts).toContain("PRD.md");
    expect(second.artifacts).toContain("Logic.md");
    expect(second.artifacts).toContain("Structure.md");
    expect(second.artifacts.filter((a) => a === "PRD.md")).toHaveLength(1);
  });

  it("addDecision appends without duplicates", async () => {
    await sm.addDecision("dec-001");
    const state = await sm.addDecision("dec-001");
    expect(state.decisions.filter((d) => d === "dec-001")).toHaveLength(1);
  });

  it("addAssumption appends assumption", async () => {
    const state = await sm.addAssumption("Using Next.js for frontend");
    expect(state.assumptions).toContain("Using Next.js for frontend");
  });

  it("setGate updates a specific gate", async () => {
    const state = await sm.setGate("security", "passed");
    expect(state.gates.security).toBe("passed");
    expect(state.gates.measurement).toBe("pending");
  });

  it("setHandoffReady sets handoff.ready and status", async () => {
    const state = await sm.setHandoffReady(true);
    expect(state.handoff.ready).toBe(true);
    expect(state.status).toBe("handoff-ready");
  });

  it("update throws when no state exists", async () => {
    const emptySm = new StateManager({ projectRoot: makeTempDir() });
    await expect(emptySm.update((s) => s)).rejects.toThrow(
      "No project state found"
    );
  });
});

describe("StateManager — invalid schema throws", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = makeTempDir();
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("throws when state file contains invalid JSON structure", async () => {
    const statePath = path.join(tmpDir, ".vdd", "project-state.json");
    await fs.ensureDir(path.dirname(statePath));
    await fs.writeJson(statePath, { stage: "invalid-stage", projectId: "" });
    const sm = new StateManager({ projectRoot: tmpDir });
    await expect(sm.load()).rejects.toThrow();
  });

  it("throws on missing required fields", async () => {
    const statePath = path.join(tmpDir, ".vdd", "project-state.json");
    await fs.ensureDir(path.dirname(statePath));
    await fs.writeJson(statePath, { projectId: "x" });
    const sm = new StateManager({ projectRoot: tmpDir });
    await expect(sm.load()).rejects.toThrow();
  });
});
