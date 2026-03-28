import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { SpecQualityEngine } from "../../core/intelligence/spec-quality-engine.js";
import type { ProjectState } from "../../core/router/engine.js";

const tempDirs: string[] = [];

function makeState(overrides: Partial<ProjectState> = {}): ProjectState {
  return {
    projectId: "proj_local",
    stage: "init",
    status: "active",
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
    },
    ...overrides
  };
}

async function makeProject(files: Record<string, string>): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "vdd-spec-quality-"));
  tempDirs.push(dir);

  await Promise.all(
    Object.entries(files).map(async ([relativePath, content]) => {
      const filePath = path.join(dir, relativePath);
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, content, "utf8");
    })
  );

  return dir;
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.remove(dir)));
});

describe("SpecQualityEngine", () => {
  it("blocks weak specs with missing problem, user, and success signals", async () => {
    const projectRoot = await makeProject({
      "package.json": JSON.stringify({ name: "weak-spec-project" }, null, 2)
    });

    const result = new SpecQualityEngine().assess({
      projectRoot,
      state: null
    });

    expect(result.clarityLevel).toBe("blocked");
    expect(result.shouldBlockProgress).toBe(true);
    expect(result.blockers.length).toBeGreaterThan(0);
    expect(result.recommendedQuestions.length).toBeGreaterThan(0);
  });

  it("recognizes usable specs when state and direct inputs are present", async () => {
    const projectRoot = await makeProject({
      "package.json": JSON.stringify(
        {
          name: "usable-spec-project",
          keywords: ["sales", "lead-routing"]
        },
        null,
        2
      ),
      "README.md": "This project helps sales teams move faster with inbound lead qualification.",
      "problem-statement.md": "Manual lead qualification delays first outreach and causes dropped opportunities."
    });

    const result = new SpecQualityEngine().assess({
      projectRoot,
      state: makeState({
        stage: "plan",
        targetUser: "Small B2B sales teams",
        successDefinition: "A rep can qualify a lead and send a first draft in under three minutes.",
        assumptions: ["Prioritize MVP speed", "Keep one simple reviewer workflow"],
        artifacts: ["scope.md", "success-definition.md"]
      }),
      args: {
        problem:
          "Sales teams still review inbound leads manually and lose time before first outreach."
      }
    });

    expect(result.score).toBeGreaterThanOrEqual(60);
    expect(["usable", "strong"]).toContain(result.clarityLevel);
    expect(result.shouldBlockProgress).toBe(false);
  });
});
