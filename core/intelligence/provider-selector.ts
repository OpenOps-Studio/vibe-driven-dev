/**
 * Provider Selector Intelligence
 *
 * Recommends the optimal AI provider and model for the resulting project's features
 * (not the VDD coding agent itself).
 */

export interface ProviderSelectionInput {
  reasoningQualityRequired: "extreme" | "high" | "moderate";
  writingQualityRequired: "high" | "moderate";
  costSensitivity: "high" | "medium" | "low";
  latencyTolerance: "high" | "medium" | "low";
  structuredOutputRequired: boolean;
}

export interface ProviderRecommendation {
  topProvider: string;
  topModel: string;
  alternatives: { provider: string; model: string; reason: string }[];
  rationale: string;
  caveats: string[];
  freshnessStatus: "verified_static" | "mcp_checked" | "unverified";
}

export class ProviderSelector {
  evaluate(input: ProviderSelectionInput): ProviderRecommendation {
    // Fast, cheap structured output overrides
    if (input.costSensitivity === "high" && input.latencyTolerance === "low") {
      return {
        topProvider: "Google",
        topModel: "gemini-2.5-flash",
        alternatives: [
          { provider: "Anthropic", model: "claude-3-5-haiku", reason: "Good alternative for fast reasoning" },
          { provider: "OpenAI", model: "gpt-4o-mini", reason: "Standard fallback for cheap API tasks" },
        ],
        rationale: "When cost and latency are the primary constraints, Gemini 2.5 Flash provides unmatched speed and competitive output quality.",
        caveats: [
          "Complex reasoning tasks may fail.",
          "Long-context nuanced generation might degrade.",
        ],
        freshnessStatus: "verified_static",
      };
    }

    if (input.reasoningQualityRequired === "extreme") {
      return {
        topProvider: "Anthropic",
        topModel: "claude-3-7-sonnet",
        alternatives: [
          { provider: "OpenAI", model: "o1 / o3-mini", reason: "For pure STEM, math, and dense logic" },
          { provider: "Google", model: "gemini-3.1-pro", reason: "If massive context window (1M+) is needed alongside reasoning" },
        ],
        rationale: "Claude 3.7 Sonnet offers the current state-of-the-art balance in extreme logical reasoning and coding generation without requiring specialized prompting.",
        caveats: [
          "More expensive than Flash/Haiku models.",
          "Rate limits can be strict on Tier 1 developer accounts.",
        ],
        freshnessStatus: "verified_static",
      };
    }

    if (input.writingQualityRequired === "high") {
      return {
        topProvider: "Anthropic",
        topModel: "claude-3-7-sonnet",
        alternatives: [
          { provider: "Google", model: "gemini-3.1-pro", reason: "Excellent nuanced writing and large context" },
        ],
        rationale: "Anthropic models historically have the most natural, least 'AI-sounding' prose generation out of the box.",
        caveats: ["Slightly higher latency for pure text generation than some competitor models."],
        freshnessStatus: "verified_static",
      };
    }

    // Default robust balanced model
    return {
      topProvider: "OpenAI",
      topModel: "gpt-4o",
      alternatives: [
        { provider: "Google", model: "gemini-3.1-pro", reason: "Strong multimodal fallback" },
        { provider: "Anthropic", model: "claude-3-5-sonnet", reason: "Excellent standard balanced model" },
      ],
      rationale: "GPT-4o provides a reliable, broadly supported ecosystem standard across text, reasoning, and JSON structured modes.",
      caveats: [
        "Knowledge cutoffs apply.",
        "Generates somewhat recognizable 'AI tone' in writing if unprompted.",
      ],
      freshnessStatus: "verified_static",
    };
  }
}
