import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ImportExtractor } from "../../core/runtime/import-extractor.js";
import fs from "fs-extra";
import path from "node:path";
import os from "node:os";

describe("ImportExtractor", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "vdd-rules-test-"));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("should extract rules from a directory of JSON files", async () => {
    const ruleFile = path.join(tmpDir, "test.rules.json");
    await fs.writeJson(ruleFile, {
      ruleSetName: "Test Rules",
      description: "Testing rule extraction",
      rules: [
        {
          ruleId: "TEST-01",
          name: "Sample Rule",
          description: "This is a test rule"
        }
      ]
    });

    const extractor = new ImportExtractor();
    const result = await extractor.extractFromDirectory(tmpDir);

    expect(result).toContain("# VDD Promotion Proposal");
    expect(result).toContain("## Test Rules");
    expect(result).toContain("[TEST-01] Sample Rule");
    expect(result).toContain("**Requirement**: This is a test rule");
  });

  it("should handle empty or invalid rule sets gracefully", async () => {
    const invalidFile = path.join(tmpDir, "invalid.rules.json");
    await fs.writeFile(invalidFile, "not-json");

    const extractor = new ImportExtractor();
    const result = await extractor.extractFromDirectory(tmpDir);

    // It should skip the invalid file
    expect(result).not.toContain("invalid.rules.json");
  });
});
