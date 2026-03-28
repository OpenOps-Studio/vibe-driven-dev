import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs-extra";
import path from "node:path";
import os from "node:os";
import { addPack, listPacks, loadPacks, removePack } from "../../core/runtime/pack-loader.js";

describe("pack-loader", () => {
  let tmpDir: string;
  let packRoot: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "vdd-pack-test-"));
    packRoot = path.join(tmpDir, "local-pack");

    await fs.ensureDir(path.join(packRoot, "skills", "quality-check"));
    await fs.ensureDir(path.join(packRoot, "agents", "quality-orchestrator"));

    await fs.writeFile(
      path.join(packRoot, "SKILL.md"),
      `---\nname: local-pack\ndescription: Local pack root.\n---\n\n# Local Pack\n`
    );

    await fs.writeFile(
      path.join(packRoot, "skills", "quality-check", "SKILL.md"),
      `---\nname: quality-check\ndescription: Keep quality standards high.\n---\n\n# Quality Check\n`
    );

    await fs.writeFile(
      path.join(packRoot, "agents", "quality-orchestrator", "AGENT.md"),
      `---\nname: quality-orchestrator\ndescription: Coordinate quality work.\n---\n\n# Quality Orchestrator\n`
    );
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("adds, lists, and removes packs", async () => {
    const addResult = await addPack(
      tmpDir,
      "local-pack",
      "local:./local-pack",
      "1.2.3"
    );
    expect(addResult.success).toBe(true);

    const packs = await listPacks(tmpDir);
    expect(packs).toHaveLength(1);
    expect(packs[0]).toMatchObject({
      name: "local-pack",
      source: "local:./local-pack",
      version: "1.2.3",
      description: "Local pack root."
    });

    const removeResult = await removePack(tmpDir, "local-pack");
    expect(removeResult.success).toBe(true);
    expect(await listPacks(tmpDir)).toHaveLength(0);
  });

  it("rejects duplicate packs and missing paths", async () => {
    const firstAdd = await addPack(tmpDir, "local-pack", "local:./local-pack");
    expect(firstAdd.success).toBe(true);

    const duplicateAdd = await addPack(tmpDir, "local-pack", "local:./local-pack");
    expect(duplicateAdd.success).toBe(false);
    expect(duplicateAdd.message).toContain("already installed");

    const missingAdd = await addPack(tmpDir, "missing-pack", "local:./does-not-exist");
    expect(missingAdd.success).toBe(false);
    expect(missingAdd.message).toContain("does not exist");
  });

  it("loads pack skills and agents with metadata", async () => {
    await addPack(tmpDir, "local-pack", "local:./local-pack");

    const loaded = await loadPacks(tmpDir);
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.manifest.name).toBe("local-pack");
    expect(loaded[0]?.skills).toHaveLength(2);
    expect(loaded[0]?.agents).toHaveLength(1);
    expect(loaded[0]?.skills).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "local-pack",
          description: "Local pack root.",
          packName: "local-pack",
          source: "pack"
        }),
        expect.objectContaining({
          name: "quality-check",
          description: "Keep quality standards high.",
          packName: "local-pack",
          source: "pack"
        })
      ])
    );
    expect(loaded[0]?.agents[0]).toMatchObject({
      name: "quality-orchestrator",
      description: "Coordinate quality work.",
      packName: "local-pack",
      source: "pack"
    });
  });
});
