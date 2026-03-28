import type { OnboardingAssessment } from "../intelligence/onboarding-engine.js";
import type { EventTopologyAdvice } from "../intelligence/event-topology-advisor.js";
import type { ModelEscalationAdvice } from "../intelligence/model-escalation-advisor.js";
import type { ProviderRecommendation } from "../intelligence/provider-selector.js";
import type { StackRecommendation } from "../intelligence/stack-selector.js";
import { ConfidenceEngine, type ConfidenceAssessment } from "./confidence-engine.js";

export type AutopilotMission =
  | "capture-intent"
  | "build-planning-package"
  | "lock-technical-direction"
  | "build-prd-package";

export type AutopilotCheckpoint =
  | "intent-captured"
  | "planning-package-complete"
  | "technical-strategy-locked"
  | "detail-package-complete"
  | "prd-threshold-reached";

export interface AutopilotStep {
  command: "/vibe.plan" | "/vibe.research" | "/vibe.blueprint";
  reason: string;
}

export interface AutopilotPlan {
  mode: "guided" | "autopilot";
  mission: AutopilotMission;
  checkpointBefore: AutopilotCheckpoint;
  checkpointAfter: AutopilotCheckpoint;
  continueAutomatically: boolean;
  confidence: ConfidenceAssessment;
  summary: string;
  steps: AutopilotStep[];
  humanNextStep: string[];
}

export type CheckpointApprovalType =
  | "stack"
  | "provider"
  | "events"
  | "model-escalation";

export interface CheckpointApproval {
  type: CheckpointApprovalType;
  status: "not-needed" | "review" | "accepted" | "deferred";
  requiresApproval: boolean;
  summary: string;
  recommendedAction: string;
}

export interface StageCheckpointSummary {
  checkpoint: AutopilotCheckpoint;
  mission: AutopilotMission;
  summary: string;
  artifacts: string[];
  approvals: CheckpointApproval[];
  humanNextStep: string[];
}

export interface AutopilotInput {
  onboarding: OnboardingAssessment;
  currentStage: "init" | "plan" | "research" | "blueprint" | "detail" | "scaffold" | "qa" | "handoff";
}

export interface StageCheckpointInput {
  command: "/vibe.blueprint" | "/vibe.detail" | "/vibe.scaffold";
  artifactsCreated: string[];
  stack?: StackRecommendation;
  provider?: ProviderRecommendation;
  events?: EventTopologyAdvice;
  modelEscalation?: ModelEscalationAdvice;
  nextRecommendedCommand?: string | null;
}

function inferCheckpoint(stage: AutopilotInput["currentStage"]): AutopilotCheckpoint {
  if (stage === "research") {
    return "planning-package-complete";
  }

  if (stage === "blueprint" || stage === "detail" || stage === "scaffold" || stage === "qa" || stage === "handoff") {
    return "technical-strategy-locked";
  }

  return "intent-captured";
}

function buildSteps(input: AutopilotInput, confidence: ConfidenceAssessment): AutopilotStep[] {
  const steps: AutopilotStep[] = [];

  if (!confidence.canContinuePlanningPackage) {
    return steps;
  }

  if (input.currentStage === "init") {
    steps.push(
      {
        command: "/vibe.plan",
        reason: "Turn the captured idea into a scoped planning package."
      },
      {
        command: "/vibe.research",
        reason: "Ground the project with assumptions, risks, and a first research pass."
      }
    );
  } else if (input.currentStage === "plan") {
    steps.push({
      command: "/vibe.research",
      reason: "Complete the planning package with a first research pass."
    });
  }

  if (confidence.canContinueBlueprint && (input.currentStage === "init" || input.currentStage === "plan" || input.currentStage === "research")) {
    steps.push({
      command: "/vibe.blueprint",
      reason: "The idea is specific enough to lock a first technical direction."
    });
  }

  return steps;
}

function inferMission(steps: AutopilotStep[]): AutopilotMission {
  if (steps.some((step) => step.command === "/vibe.blueprint")) {
    return "lock-technical-direction";
  }

  if (steps.length > 0) {
    return "build-planning-package";
  }

  return "capture-intent";
}

function inferCheckpointAfter(steps: AutopilotStep[], current: AutopilotCheckpoint): AutopilotCheckpoint {
  if (steps.some((step) => step.command === "/vibe.blueprint")) {
    return "technical-strategy-locked";
  }

  if (steps.some((step) => step.command === "/vibe.research")) {
    return "planning-package-complete";
  }

  return current;
}

function buildSummary(mission: AutopilotMission, steps: AutopilotStep[]): string {
  if (steps.length === 0) {
    return "Autopilot captured the idea but should stop at the current checkpoint before it continues.";
  }

  const labels = steps.map((step) => step.command).join(" -> ");

  if (mission === "lock-technical-direction") {
    return `Autopilot can complete the planning package and continue into technical strategy: ${labels}.`;
  }

  return `Autopilot can continue through the planning package: ${labels}.`;
}

function buildHumanNextStep(steps: AutopilotStep[], confidence: ConfidenceAssessment): string[] {
  if (steps.length === 0) {
    return [
      "Answer the next onboarding question so the system can safely continue.",
      "Review the assumptions the system already inferred before moving on."
    ];
  }

  const nextActions = [
    `Autopilot will continue with ${steps.map((step) => step.command).join(", ")}.`,
    "The system will stop at the next checkpoint and summarize what it created."
  ];

  if (confidence.canContinueBlueprint) {
    nextActions.push("Expect a technical-direction checkpoint after blueprint completes.");
  }

  return nextActions;
}

export class AutopilotConductor {
  plan(input: AutopilotInput): AutopilotPlan {
    const confidence = new ConfidenceEngine().assess({
      onboarding: input.onboarding
    });
    const checkpointBefore = inferCheckpoint(input.currentStage);
    const steps = buildSteps(input, confidence);
    const mission = inferMission(steps);
    const checkpointAfter = inferCheckpointAfter(steps, checkpointBefore);

    return {
      mode: input.onboarding.mode,
      mission,
      checkpointBefore,
      checkpointAfter,
      continueAutomatically: steps.length > 0 && input.onboarding.mode === "autopilot",
      confidence,
      summary: buildSummary(mission, steps),
      steps,
      humanNextStep: buildHumanNextStep(steps, confidence)
    };
  }

  summarizeStage(input: StageCheckpointInput): StageCheckpointSummary {
    const approvals: CheckpointApproval[] = [];

    if (input.stack) {
      approvals.push({
        type: "stack",
        status: "review",
        requiresApproval: true,
        summary: `Recommended stack: ${input.stack.recommendedStack.frontend} + ${input.stack.recommendedStack.backend} + ${input.stack.recommendedStack.database}.`,
        recommendedAction: "Review and confirm the proposed application stack before deeper execution."
      });
    }

    if (input.provider) {
      approvals.push({
        type: "provider",
        status: "review",
        requiresApproval: true,
        summary: `Recommended AI provider path: ${input.provider.topProvider} using ${input.provider.topModel}.`,
        recommendedAction: "Review and confirm the project AI provider direction before implementation locks in."
      });
    }

    if (input.events) {
      approvals.push({
        type: "events",
        status: input.events.relevance.requiresEventArchitecture ? "review" : "not-needed",
        requiresApproval: input.events.relevance.requiresEventArchitecture,
        summary: input.events.relevance.summary,
        recommendedAction: input.events.relevance.requiresEventArchitecture
          ? "Review whether event architecture should be locked now."
          : "No event architecture approval is needed yet."
      });
    }

    if (input.modelEscalation) {
      approvals.push({
        type: "model-escalation",
        status:
          input.modelEscalation.decision === "accepted"
            ? "accepted"
            : input.modelEscalation.decision === "deferred"
            ? "deferred"
            : "not-needed",
        requiresApproval: input.modelEscalation.shouldRecommend,
        summary: input.modelEscalation.summary,
        recommendedAction: input.modelEscalation.handoffPrompt
      });
    }

    const checkpoint =
      input.command === "/vibe.blueprint"
        ? "technical-strategy-locked"
        : input.command === "/vibe.detail"
        ? "detail-package-complete"
        : "prd-threshold-reached";
    const mission =
      input.command === "/vibe.scaffold"
        ? "build-prd-package"
        : "lock-technical-direction";
    const humanNextStep = approvals
      .filter((approval) => approval.requiresApproval || approval.status === "deferred")
      .map((approval) => approval.recommendedAction);

    if (humanNextStep.length === 0 && input.nextRecommendedCommand) {
      humanNextStep.push(`Continue to ${input.nextRecommendedCommand}.`);
    }

    return {
      checkpoint,
      mission,
      summary:
        input.command === "/vibe.blueprint"
          ? "Blueprint completed. The system now has a first technical direction and can surface the highest-impact approvals."
          : input.command === "/vibe.detail"
          ? "Detail completed. The system now has enough implementation structure to expose approval-sensitive technical decisions."
          : "Scaffold completed. The PRD threshold has been reached and the remaining user choice is mostly about quality depth and approval-sensitive direction.",
      artifacts: input.artifactsCreated,
      approvals,
      humanNextStep
    };
  }
}
