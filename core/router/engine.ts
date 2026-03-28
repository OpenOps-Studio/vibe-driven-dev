import { StackSelector, StackRecommendation } from "../intelligence/stack-selector.js";
import { ProviderSelector, ProviderRecommendation } from "../intelligence/provider-selector.js";
import { BootstrapPlanner, BootstrapPlan } from "../intelligence/bootstrap-planner.js";

export type VddPublicCommand =
  | "/vibe.init"
  | "/vibe.plan"
  | "/vibe.research"
  | "/vibe.blueprint"
  | "/vibe.detail"
  | "/vibe.scaffold"
  | "/vibe.qa"
  | "/vibe.next"
  | "/vibe.resume"
  | "/vibe.status"
  | "/vibe.assumptions"
  | "/vibe.decide"
  | "/vibe.handoff-to-spec";

export type VddStage =
  | "init"
  | "plan"
  | "research"
  | "blueprint"
  | "detail"
  | "scaffold"
  | "qa"
  | "handoff";

export type VddStatus =
  | "idle"
  | "active"
  | "halted"
  | "failed"
  | "handoff-ready"
  | "completed";

export type GateStatus = "pending" | "passed" | "warning" | "failed";

export interface ProjectState {
  projectId: string;
  stage: VddStage;
  status: VddStatus;
  platform?: string | undefined;
  targetUser?: string | undefined;
  successDefinition?: string | undefined;
  assumptions: string[];
  decisions: string[];
  artifacts: string[];
  gates: {
    security: GateStatus;
    measurement: GateStatus;
    realityCheck: GateStatus;
  };
  handoff: {
    target: "spec-kit";
    ready: boolean;
  };
}

export interface RoutingContext {
  command: VddPublicCommand;
  state: ProjectState | null;
}

export interface RoutingResult {
  ok: boolean;
  command: VddPublicCommand;
  stageBefore: VddStage | null;
  stageAfter: VddStage | null;
  statusBefore: VddStatus | null;
  statusAfter: VddStatus | null;
  resolvedAgent: string | null;
  resolvedSkill: string | null;
  artifactsCreated: string[];
  warnings: string[];
  blockers: string[];
  nextRecommendedCommand: VddPublicCommand | null;
  message: string;
  intelligence?: {
    stack?: StackRecommendation;
    provider?: ProviderRecommendation;
    bootstrap?: BootstrapPlan;
  } | undefined;
}

const STAGE_ORDER: VddStage[] = [
  "init",
  "plan",
  "research",
  "blueprint",
  "detail",
  "scaffold",
  "qa",
  "handoff"
];

const STAGE_COMMAND_MAP: Partial<Record<VddStage, VddPublicCommand>> = {
  init: "/vibe.init",
  plan: "/vibe.plan",
  research: "/vibe.research",
  blueprint: "/vibe.blueprint",
  detail: "/vibe.detail",
  scaffold: "/vibe.scaffold",
  qa: "/vibe.qa",
  handoff: "/vibe.handoff-to-spec"
};

function createInitialState(): ProjectState {
  return {
    projectId: "proj_local",
    stage: "init",
    status: "active",
    assumptions: [],
    decisions: [],
    artifacts: [],
    gates: {
      security: "pending",
      measurement: "pending",
      realityCheck: "pending"
    },
    handoff: {
      target: "spec-kit",
      ready: false
    }
  };
}

function nextStage(stage: VddStage): VddStage | null {
  const currentIndex = STAGE_ORDER.indexOf(stage);
  if (currentIndex === -1 || currentIndex === STAGE_ORDER.length - 1) {
    return null;
  }
  return STAGE_ORDER[currentIndex + 1] ?? null;
}

function recommendNext(stage: VddStage): VddPublicCommand | null {
  const next = nextStage(stage);
  if (!next) {
    return null;
  }
  return STAGE_COMMAND_MAP[next] ?? null;
}

function resolveAgent(command: VddPublicCommand): string | null {
  switch (command) {
    case "/vibe.init":
    case "/vibe.next":
    case "/vibe.resume":
    case "/vibe.status":
      return "orchestrator";

    case "/vibe.plan":
      return "planner";

    case "/vibe.research":
      return "researcher";

    case "/vibe.blueprint":
      return "architect";

    case "/vibe.detail":
      return "detailer";

    case "/vibe.scaffold":
      return "orchestrator";

    case "/vibe.qa":
      return "qa-guardian";

    case "/vibe.handoff-to-spec":
      return "handoff-manager";

    case "/vibe.assumptions":
    case "/vibe.decide":
      return "orchestrator";

    default:
      return null;
  }
}

function resolveSkill(command: VddPublicCommand): string | null {
  switch (command) {
    case "/vibe.init":
      return "vibe-init";
    case "/vibe.plan":
      return "vibe-plan";
    case "/vibe.research":
      return "vibe-research";
    case "/vibe.blueprint":
      return "vibe-blueprint";
    case "/vibe.detail":
      return "vibe-detail";
    case "/vibe.scaffold":
      return "vibe-scaffold";
    case "/vibe.qa":
      return "vibe-qa";
    case "/vibe.next":
      return "vibe-next";
    case "/vibe.resume":
      return "vibe-resume";
    case "/vibe.status":
      return "vibe-status";
    case "/vibe.assumptions":
      return "assumptions-manager";
    case "/vibe.decide":
      return "decision-ledger";
    case "/vibe.handoff-to-spec":
      return "vibe-handoff-to-spec";
    default:
      return null;
  }
}

function commandToExpectedStage(command: VddPublicCommand): VddStage | null {
  switch (command) {
    case "/vibe.init":
      return "init";
    case "/vibe.plan":
      return "plan";
    case "/vibe.research":
      return "research";
    case "/vibe.blueprint":
      return "blueprint";
    case "/vibe.detail":
      return "detail";
    case "/vibe.scaffold":
      return "scaffold";
    case "/vibe.qa":
      return "qa";
    case "/vibe.handoff-to-spec":
      return "handoff";
    default:
      return null;
  }
}

function isReadOnlyCommand(command: VddPublicCommand): boolean {
  return (
    command === "/vibe.status" ||
    command === "/vibe.resume" ||
    command === "/vibe.assumptions"
  );
}

function validateTransition(
  command: VddPublicCommand,
  state: ProjectState | null
): { valid: boolean; blockers: string[] } {
  const blockers: string[] = [];

  if (command === "/vibe.init") {
    return { valid: true, blockers };
  }

  if (!state) {
    blockers.push("No project state is loaded. Run /vibe.init first.");
    return { valid: false, blockers };
  }

  if (state.status === "failed") {
    blockers.push("Project state is failed and requires recovery before continuing.");
    return { valid: false, blockers };
  }

  if (command === "/vibe.next" || command === "/vibe.decide" || isReadOnlyCommand(command)) {
    return { valid: true, blockers };
  }

  const expectedStage = commandToExpectedStage(command);
  if (!expectedStage) {
    blockers.push("Command is not mapped to a canonical stage.");
    return { valid: false, blockers };
  }

  const currentIndex = STAGE_ORDER.indexOf(state.stage);
  const expectedIndex = STAGE_ORDER.indexOf(expectedStage);

  if (expectedIndex === -1 || currentIndex === -1) {
    blockers.push("State machine indices could not be resolved.");
    return { valid: false, blockers };
  }

  if (expectedIndex > currentIndex + 1) {
    blockers.push(
      `Cannot jump from stage "${state.stage}" directly to "${expectedStage}".`
    );
  }

  if (expectedIndex <= currentIndex && command !== STAGE_COMMAND_MAP[state.stage]) {
    blockers.push(
      `Command "${command}" does not match the current stage "${state.stage}".`
    );
  }

  if (command === "/vibe.handoff-to-spec" && state.status !== "handoff-ready") {
    blockers.push("Project is not marked handoff-ready yet.");
  }

  return {
    valid: blockers.length === 0,
    blockers
  };
}

function simulateArtifacts(command: VddPublicCommand): string[] {
  switch (command) {
    case "/vibe.plan":
      return ["problem-statement.md", "scope.md", "success-definition.md"];
    case "/vibe.research":
      return ["research-summary.md", "risk-register.md", "assumptions-log.md"];
    case "/vibe.blueprint":
      return ["architecture-baseline.md", "system-boundaries.md", "analytics-outline.md"];
    case "/vibe.detail":
      return ["technical-detail.md", "validation-plan.md", "execution-notes.md"];
    case "/vibe.scaffold": {
      const planner = new BootstrapPlanner();
      // Default to high-complexity SaaS for initial scaffold if no input
      return planner.plan({
        projectType: "saas",
        hasAiFeatures: true,
        hasDesignHeavyUx: true,
        stackComplexity: "high"
      }).filesToGenerate;
    }
    case "/vibe.qa":
      return ["qa-report.md", "go-no-go.md"];
    case "/vibe.handoff-to-spec":
      return ["spec-handoff.md", "execution-entry-summary.md", "initial-decisions.json"];
    default:
      return [];
  }
}

export class RouterEngine {
  run(context: RoutingContext): RoutingResult {
    const initialState = context.state;
    const stageBefore = initialState?.stage ?? null;
    const statusBefore = initialState?.status ?? null;

    const transition = validateTransition(context.command, initialState);
    if (!transition.valid) {
      return {
        ok: false,
        command: context.command,
        stageBefore,
        stageAfter: stageBefore,
        statusBefore,
        statusAfter: statusBefore,
        resolvedAgent: resolveAgent(context.command),
        resolvedSkill: resolveSkill(context.command),
        artifactsCreated: [],
        warnings: [],
        blockers: transition.blockers,
        nextRecommendedCommand: stageBefore ? STAGE_COMMAND_MAP[stageBefore] ?? null : "/vibe.init",
        message: "Routing blocked by state or transition constraints."
      };
    }

    if (context.command === "/vibe.init") {
      const created = createInitialState();

      return {
        ok: true,
        command: context.command,
        stageBefore,
        stageAfter: created.stage,
        statusBefore,
        statusAfter: created.status,
        resolvedAgent: resolveAgent(context.command),
        resolvedSkill: resolveSkill(context.command),
        artifactsCreated: [],
        warnings: [],
        blockers: [],
        nextRecommendedCommand: "/vibe.plan",
        message: "Project initialized successfully.",
        intelligence: {
          stack: new StackSelector().evaluate({
            projectType: "saas",
            speedPriority: "high",
            complexityTolerance: "medium",
            needsAuth: true,
            needsDb: true
          })
        }
      };
    }

    const state = initialState!;
    const artifactsCreated = simulateArtifacts(context.command);

    if (context.command === "/vibe.status") {
      return {
        ok: true,
        command: context.command,
        stageBefore: state.stage,
        stageAfter: state.stage,
        statusBefore: state.status,
        statusAfter: state.status,
        resolvedAgent: resolveAgent(context.command),
        resolvedSkill: resolveSkill(context.command),
        artifactsCreated: [],
        warnings: [],
        blockers: [],
        nextRecommendedCommand: recommendNext(state.stage),
        message: "Status inspected successfully."
      };
    }

    if (context.command === "/vibe.resume") {
      return {
        ok: true,
        command: context.command,
        stageBefore: state.stage,
        stageAfter: state.stage,
        statusBefore: state.status,
        statusAfter: state.status,
        resolvedAgent: resolveAgent(context.command),
        resolvedSkill: resolveSkill(context.command),
        artifactsCreated: [],
        warnings: [],
        blockers: [],
        nextRecommendedCommand: recommendNext(state.stage),
        message: "Project context resumed successfully."
      };
    }

    if (context.command === "/vibe.next") {
      const nextCommand =
        state.status === "handoff-ready"
          ? "/vibe.handoff-to-spec"
          : recommendNext(state.stage);

      return {
        ok: true,
        command: context.command,
        stageBefore: state.stage,
        stageAfter: state.stage,
        statusBefore: state.status,
        statusAfter: state.status,
        resolvedAgent: resolveAgent(context.command),
        resolvedSkill: resolveSkill(context.command),
        artifactsCreated: [],
        warnings: [],
        blockers: [],
        nextRecommendedCommand: nextCommand,
        message: nextCommand
          ? `Next recommended command is ${nextCommand}.`
          : "No further stage transition is available."
      };
    }

    if (context.command === "/vibe.decide" || context.command === "/vibe.assumptions") {
      return {
        ok: true,
        command: context.command,
        stageBefore: state.stage,
        stageAfter: state.stage,
        statusBefore: state.status,
        statusAfter: state.status,
        resolvedAgent: resolveAgent(context.command),
        resolvedSkill: resolveSkill(context.command),
        artifactsCreated,
        warnings: [],
        blockers: [],
        nextRecommendedCommand: recommendNext(state.stage),
        message: "Cross-stage governance action completed."
      };
    }

    const targetStage = commandToExpectedStage(context.command);
    const statusAfter =
      context.command === "/vibe.qa"
        ? "handoff-ready"
        : context.command === "/vibe.handoff-to-spec"
        ? "completed"
        : "active";

    return {
      ok: true,
      command: context.command,
      stageBefore: state.stage,
      stageAfter: targetStage,
      statusBefore: state.status,
      statusAfter,
      resolvedAgent: resolveAgent(context.command),
      resolvedSkill: resolveSkill(context.command),
      artifactsCreated,
      warnings: [],
      blockers: [],
      nextRecommendedCommand:
        context.command === "/vibe.handoff-to-spec"
          ? null
          : context.command === "/vibe.qa"
          ? "/vibe.handoff-to-spec"
          : targetStage
          ? recommendNext(targetStage)
          : null,
      message: "Routing completed successfully.",
      intelligence: context.command === "/vibe.plan" ? {
        provider: new ProviderSelector().evaluate({
          reasoningQualityRequired: "high",
          writingQualityRequired: "high",
          costSensitivity: "medium",
          latencyTolerance: "medium",
          structuredOutputRequired: true
        })
      } : context.command === "/vibe.scaffold" ? {
        bootstrap: new BootstrapPlanner().plan({
          projectType: "saas",
          hasAiFeatures: true,
          hasDesignHeavyUx: true,
          stackComplexity: "high"
        })
      } : undefined
    };
  }
}
