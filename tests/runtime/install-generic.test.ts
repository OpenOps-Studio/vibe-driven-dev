import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { installGeneric } from "../../core/install/install-generic.js";

describe("installGeneric", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "vdd-install-generic-"));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("writes AGENTS.md and canonical agent exports", async () => {
    const result = await installGeneric(tmpDir);

    expect(result.ok).toBe(true);
    expect(result.agentsInstalled).toEqual(
      expect.arrayContaining([
        "orchestrator",
        "planner",
        "architect",
        "detailer",
        "researcher",
        "qa-guardian",
        "handoff-manager"
      ])
    );

    const agentsMd = await fs.readFile(path.join(tmpDir, "AGENTS.md"), "utf8");
    expect(agentsMd).toContain("# Vibe Driven Dev Compatibility Layer");
    expect(agentsMd).toContain(".vdd/agents/vdd-researcher.md");

    const exportedAgents = await fs.readdir(path.join(tmpDir, ".vdd", "agents"));
    expect(exportedAgents).toEqual(
      expect.arrayContaining([
        "vdd-orchestrator.md",
        "vdd-planner.md",
        "vdd-architect.md",
        "vdd-detailer.md",
        "vdd-researcher.md",
        "vdd-qa-guardian.md",
        "vdd-handoff-manager.md"
      ])
    );
  });
});
