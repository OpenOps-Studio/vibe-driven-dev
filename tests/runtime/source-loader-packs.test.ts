import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs-extra";
import path from "node:path";
import os from "node:os";
import { SourceLoader } from "../../core/runtime/source-loader.js";

describe("SourceLoader pack discovery", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "vdd-pack-loader-"));

    await fs.ensureDir(path.join(tmpDir, ".vdd"));
    await fs.writeJson(path.join(tmpDir, ".vdd", "packs.json"), {
      packs: [
        {
          name: "quality-pack",
          source: "local:./packs/quality-pack",
          version: "0.1.0"
        }
      ]
    });

    const packRoot = path.join(tmpDir, "packs", "quality-pack");
    await fs.ensureDir(path.join(packRoot, "coding-standards-enforcer"));
    await fs.writeFile(
      path.join(packRoot, "coding-standards-enforcer", "SKILL.md"),
      `---
name: coding-standards-enforcer
description: Enforce strict coding rules.
---

# Coding Standards Enforcer
`
    );
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("loads pack skills registered in .vdd/packs.json", async () => {
    const loader = new SourceLoader({ projectRoot: tmpDir });
    const all = await loader.loadAll();

    const packSkill = all.find(
      (entry) => entry.id === "pack-skill:quality-pack/coding-standards-enforcer"
    );

    expect(packSkill).toBeDefined();
    expect(packSkill?.trustTier).toBe("installed-pack");
    expect(packSkill?.runtimeEligibility).toBe("executable");
    expect(packSkill?.description).toBe("Enforce strict coding rules.");
    expect(packSkill?.body).toContain("# Coding Standards Enforcer");
  });
});
