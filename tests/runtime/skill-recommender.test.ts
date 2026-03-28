import { describe, expect, it } from "vitest";
import { SkillRecommender } from "../../core/intelligence/skill-recommender.js";

describe("SkillRecommender", () => {
  const recommender = new SkillRecommender();

  it("recommends auth and testing skills for an AI SaaS project", () => {
    const result = recommender.recommend({
      runtimeTarget: "claude-code",
      top: 4,
      project: {
        projectType: "saas",
        platform: "Next.js",
        successDefinition: "AI SaaS with auth, testing, and MCP integrations",
        hasAiFeatures: true,
        needsAuth: true,
        needsDatabase: true,
        frontendHeavy: true,
        needsTesting: true,
        stackHints: ["next", "react", "auth", "mcp"]
      }
    });

    expect(result.recommendations).toHaveLength(4);
    expect(result.projectNeeds).toEqual(
      expect.arrayContaining(["AI integration", "auth", "testing"])
    );
    expect(result.installPlan.every((command) => command.startsWith("npx skills add "))).toBe(true);
    expect(
      result.recommendations.some((entry) => entry.skill.name === "better-auth-best-practices")
    ).toBe(true);
  });

  it("filters by category and removes already installed skills", () => {
    const result = recommender.recommend({
      runtimeTarget: "generic-agents-md",
      category: "testing",
      installedSkills: ["test-driven-development"],
      top: 3,
      project: {
        projectType: "mvp",
        frontendHeavy: true,
        needsTesting: true,
        stackHints: ["react", "testing"]
      }
    });

    expect(result.recommendations).toHaveLength(3);
    expect(result.recommendations.some((entry) => entry.skill.name === "test-driven-development")).toBe(false);
    expect(
      result.recommendations.every((entry) => entry.skill.categories.includes("testing"))
    ).toBe(true);
    expect(result.recommendations.every((entry) => entry.score >= 0)).toBe(true);
  });

  it("recommends a frontend bundle and impeccable for design-sensitive apps", () => {
    const result = recommender.recommend({
      runtimeTarget: "claude-code",
      top: 3,
      project: {
        projectType: "saas",
        currentStage: "blueprint",
        frontendHeavy: true,
        designSensitive: true,
        stackHints: ["react", "dashboard", "design", "tailwind"]
      }
    });

    expect(result.recommendedBundles[0]?.bundle.id).toBe("frontend-polish");
    expect(result.recommendedSpecialists[0]?.agent).toBe("architect");
    expect(result.recommendations.some((entry) => entry.skill.name === "impeccable")).toBe(true);
  });

  it("supports bundle-specific recommendation for execution handoff", () => {
    const result = recommender.recommend({
      runtimeTarget: "codex",
      bundle: "execution-handoff",
      top: 3,
      project: {
        projectType: "saas",
        currentStage: "scaffold",
        needsExecutionDiscipline: true,
        handoffReady: true,
        stackHints: ["workflow", "spec", "execution"]
      }
    });

    expect(result.selectedBundle).toBe("execution-handoff");
    expect(result.recommendedSpecialists[0]?.agent).toBe("handoff-manager");
    expect(result.recommendations.some((entry) => entry.skill.name === "spec-kit")).toBe(true);
    expect(
      result.installPlan.some((command) => command.includes("specify-cli"))
    ).toBe(true);
  });
});
