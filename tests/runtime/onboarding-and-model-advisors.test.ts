import { describe, expect, it } from "vitest";
import { OnboardingEngine } from "../../core/intelligence/onboarding-engine.js";
import { ModelEscalationAdvisor } from "../../core/intelligence/model-escalation-advisor.js";

describe("OnboardingEngine", () => {
  it("returns questions when the project idea is still vague", () => {
    const result = new OnboardingEngine().assess({
      state: null,
      args: {
        idea: "I want to build something useful"
      }
    });

    expect(result.needsMoreAnswers).toBe(true);
    expect(result.questions.length).toBeGreaterThan(0);
    expect(result.canInitializeState).toBe(false);
  });

  it("builds a normalized seed when the user gives enough plain-language detail", () => {
    const result = new OnboardingEngine().assess({
      state: null,
      args: {
        idea: "AI assistant for small sales teams that drafts outreach emails from inbound leads",
        "target-user": "small B2B sales teams",
        "success-definition": "A rep can review a lead and send a first draft in under three minutes",
        delivery: "mvp"
      }
    });

    expect(result.canInitializeState).toBe(true);
    expect(result.seed.projectType).toBeDefined();
    expect(result.seed.hasAiFeatures).toBe(true);
  });
});

describe("ModelEscalationAdvisor", () => {
  it("recommends a stronger model for PRD-heavy scaffold work", () => {
    const result = new ModelEscalationAdvisor().advise({
      command: "/vibe.scaffold",
      projectType: "saas",
      hasAiFeatures: true,
      artifacts: ["PRD.md", "Logic.md"],
      stackComplexity: "high"
    });

    expect(result.shouldRecommend).toBe(true);
    expect(result.recommendations[0]?.model).toContain("Claude Opus 4.6");
    expect(result.recommendations[1]?.reasoningEffort).toBe("xhigh");
  });
});
