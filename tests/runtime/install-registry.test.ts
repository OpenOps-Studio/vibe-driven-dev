import { describe, expect, it } from "vitest";
import {
  getInstallTarget,
  isImplementedInstallTarget,
  listInstallTargets,
  resolveInstallTarget
} from "../../core/install/registry.js";

describe("install target registry", () => {
  it("resolves legacy aliases to canonical target ids", () => {
    expect(resolveInstallTarget("claude")?.id).toBe("claude-code");
    expect(resolveInstallTarget("generic")?.id).toBe("generic-agents-md");
    expect(resolveInstallTarget("agents-md-family")?.id).toBe("generic-agents-md");
  });

  it("marks only shipped adapters as implemented", () => {
    expect(isImplementedInstallTarget("claude-code")).toBe(true);
    expect(isImplementedInstallTarget("generic-agents-md")).toBe(true);
    expect(isImplementedInstallTarget("codex")).toBe(false);
  });

  it("lists all canonical install targets", () => {
    const ids = listInstallTargets().map((target) => target.id);

    expect(ids).toEqual(
      expect.arrayContaining([
        "claude-code",
        "codex",
        "cursor",
        "windsurf",
        "opencode",
        "gemini-cli",
        "generic-agents-md"
      ])
    );

    expect(getInstallTarget("cursor")?.runtimeConventions).toContain(".cursor/rules/");
  });
});
