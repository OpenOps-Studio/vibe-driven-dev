export interface ModelRecommendation {
  provider: "anthropic" | "openai";
  model: string;
  rationale: string;
  reasoningEffort?: "xhigh";
  url: string;
}

export interface ModelEscalationAdvice {
  shouldRecommend: boolean;
  stage: "prd-heavy" | "architecture-heavy" | "none";
  summary: string;
  recommendations: ModelRecommendation[];
  fallback: string;
}

export interface ModelEscalationInput {
  command: "/vibe.scaffold" | "/vibe.detail" | "/vibe.blueprint";
  projectType?: string | undefined;
  hasAiFeatures?: boolean | undefined;
  artifacts?: string[] | undefined;
  stackComplexity?: "high" | "medium" | "low" | undefined;
}

export class ModelEscalationAdvisor {
  advise(input: ModelEscalationInput): ModelEscalationAdvice {
    const artifacts = input.artifacts ?? [];
    const prdHeavy =
      input.command === "/vibe.scaffold" ||
      artifacts.includes("PRD.md") ||
      artifacts.includes("Logic.md") ||
      artifacts.includes("Structure.md");
    const architectureHeavy =
      input.command === "/vibe.detail" ||
      input.command === "/vibe.blueprint" ||
      input.stackComplexity === "high" ||
      input.projectType === "saas" ||
      input.projectType === "wrapper-app" ||
      input.hasAiFeatures === true;

    if (!prdHeavy && !architectureHeavy) {
      return {
        shouldRecommend: false,
        stage: "none",
        summary: "The current workflow step does not justify a temporary model upgrade yet.",
        recommendations: [],
        fallback: "Continue with the current model and revisit escalation when the workflow reaches PRD or deep architecture work."
      };
    }

    const stage = prdHeavy ? "prd-heavy" : "architecture-heavy";
    const summary =
      stage === "prd-heavy"
        ? "This step creates PRD-heavy and long-form project truth. A stronger model is worth recommending for this stage."
        : "This step is architecture-heavy enough that a stronger planning model may improve quality.";

    return {
      shouldRecommend: true,
      stage,
      summary,
      recommendations: [
        {
          provider: "anthropic",
          model: "Claude Opus 4.6",
          rationale:
            "Use when you want deeper long-form product writing and structured planning. Recommend the latest active Anthropic flagship where available, currently Opus 4.6.",
          url: "https://www.anthropic.com/news/claude-opus-4-6"
        },
        {
          provider: "openai",
          model: "GPT-5.4 / Codex",
          rationale:
            "Use when you want high-detail structured planning and tool-using reliability inside the OpenAI stack.",
          reasoningEffort: "xhigh",
          url: "https://openai.com/index/introducing-gpt-5-4/"
        }
      ],
      fallback:
        "If the user stays on the current model, continue normally and mark the PRD as a draft rather than pretending it has the same depth."
    };
  }
}
