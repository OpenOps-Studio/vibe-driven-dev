import type { OnboardingAssessment, OnboardingSeed } from "../intelligence/onboarding-engine.js";

export type ConfidenceDecision = "ask" | "continue" | "checkpoint";
export type ConfidenceLevel = "low" | "medium" | "high";

export interface ConfidenceAssessment {
  level: ConfidenceLevel;
  decision: ConfidenceDecision;
  reasons: string[];
  assumptionSafe: boolean;
  canContinuePlanningPackage: boolean;
  canContinueBlueprint: boolean;
}

export interface ConfidenceInput {
  onboarding: OnboardingAssessment;
}

function scoreSeed(seed: OnboardingSeed): number {
  let score = 0;

  if (seed.problemStatement.trim().length >= 40) {
    score += 1;
  }

  if ((seed.targetUser?.trim().length ?? 0) >= 8) {
    score += 1;
  }

  if ((seed.successDefinition?.trim().length ?? 0) >= 24) {
    score += 1;
  }

  if (seed.constraints.length > 0) {
    score += 1;
  }

  if (seed.deliveryPreference === "foundation") {
    score += 1;
  }

  if (seed.hasAiFeatures || seed.projectType === "saas" || seed.projectType === "wrapper-app") {
    score += 1;
  }

  return score;
}

export class ConfidenceEngine {
  assess(input: ConfidenceInput): ConfidenceAssessment {
    const { onboarding } = input;
    const score = scoreSeed(onboarding.seed);
    const reasons: string[] = [];

    if (!onboarding.canInitializeState) {
      reasons.push("Intent capture is still incomplete.");
      return {
        level: "low",
        decision: "ask",
        reasons,
        assumptionSafe: false,
        canContinuePlanningPackage: false,
        canContinueBlueprint: false
      };
    }

    if (score >= 5) {
      reasons.push("Intent capture is strong enough for the planning package.");
    }

    if (onboarding.canAutoRunBlueprint) {
      reasons.push("The idea is specific enough to continue into blueprint with a checkpointed summary.");
    }

    if (onboarding.canAutoRunBlueprint) {
      return {
        level: "high",
        decision: "checkpoint",
        reasons,
        assumptionSafe: true,
        canContinuePlanningPackage: true,
        canContinueBlueprint: true
      };
    }

    if (onboarding.canAutoRunEarlyJourney) {
      return {
        level: "medium",
        decision: "continue",
        reasons,
        assumptionSafe: true,
        canContinuePlanningPackage: true,
        canContinueBlueprint: false
      };
    }

    reasons.push("The system should initialize state but not continue beyond a single guided checkpoint.");
    return {
      level: "medium",
      decision: "checkpoint",
      reasons,
      assumptionSafe: true,
      canContinuePlanningPackage: false,
      canContinueBlueprint: false
    };
  }
}
