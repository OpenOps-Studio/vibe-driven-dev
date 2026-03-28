export type OnboardingProjectType =
  | "saas"
  | "internal-tool"
  | "mvp"
  | "content-site"
  | "wrapper-app";

export type DeliveryPreference = "mvp" | "foundation";
export type OnboardingMode = "guided" | "autopilot";
export type OnboardingReadiness = "questions-needed" | "ready-for-init";

export interface OnboardingSeed {
  projectType: OnboardingProjectType;
  targetUser?: string | undefined;
  problemStatement: string;
  successDefinition?: string | undefined;
  platform?: string | undefined;
  hasAiFeatures: boolean;
  deliveryPreference: DeliveryPreference;
  constraints: string[];
  assumptions: string[];
}

export interface OnboardingAssessment {
  mode: OnboardingMode;
  readiness: OnboardingReadiness;
  needsMoreAnswers: boolean;
  questionBudget: number;
  questions: string[];
  missingSignals: string[];
  summary: string;
  plainLanguageNextStep: string;
  canInitializeState: boolean;
  canAutoRunEarlyJourney: boolean;
  recommendedCommands: string[];
  seed: OnboardingSeed;
}

export interface OnboardingAssessmentInput {
  state: {
    targetUser?: string | undefined;
    successDefinition?: string | undefined;
    platform?: string | undefined;
    problemStatement?: string | undefined;
    projectType?: string | undefined;
    hasAiFeatures?: boolean | undefined;
    deliveryPreference?: string | undefined;
    assumptions?: string[] | undefined;
  } | null;
  args?: Record<string, string | boolean> | undefined;
}

function readStringArg(
  args: Record<string, string | boolean> | undefined,
  keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = args?.[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
}

function readBooleanArg(
  args: Record<string, string | boolean> | undefined,
  keys: string[]
): boolean | undefined {
  for (const key of keys) {
    const value = args?.[key];
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "yes", "1"].includes(normalized)) {
        return true;
      }

      if (["false", "no", "0"].includes(normalized)) {
        return false;
      }
    }
  }

  return undefined;
}

function normalizeMode(
  args: Record<string, string | boolean> | undefined
): OnboardingMode {
  const explicitMode = readStringArg(args, ["mode"]);
  if (explicitMode === "autopilot") {
    return "autopilot";
  }

  if (args?.autopilot === true) {
    return "autopilot";
  }

  return "guided";
}

function inferProjectType(prompt: string, explicit?: string): OnboardingProjectType {
  const candidate = explicit?.trim().toLowerCase();
  if (candidate === "saas" || candidate === "internal-tool" || candidate === "mvp" || candidate === "content-site" || candidate === "wrapper-app") {
    return candidate;
  }

  const text = prompt.toLowerCase();

  if (/(internal tool|ops tool|admin tool|backoffice)/.test(text)) {
    return "internal-tool";
  }

  if (/(content site|blog|marketing site|landing page|documentation)/.test(text)) {
    return "content-site";
  }

  if (/(wrapper|copilot|assistant app|chat app|ai app)/.test(text)) {
    return "wrapper-app";
  }

  if (/(saas|subscription|dashboard|workspace|team)/.test(text)) {
    return "saas";
  }

  return "mvp";
}

function inferHasAiFeatures(
  prompt: string,
  explicit: boolean | undefined,
  stateValue: boolean | undefined
): boolean {
  if (explicit !== undefined) {
    return explicit;
  }

  if (stateValue !== undefined) {
    return stateValue;
  }

  return /(ai|llm|prompt|chatbot|generation|summarize|summarise|copilot|assistant)/i.test(prompt);
}

function inferDeliveryPreference(
  prompt: string,
  explicit?: string,
  stateValue?: string
): DeliveryPreference {
  const candidate = (explicit ?? stateValue ?? "").trim().toLowerCase();
  if (candidate === "foundation" || candidate === "robust" || candidate === "stronger-foundation") {
    return "foundation";
  }

  if (candidate === "mvp" || candidate === "fast" || candidate === "quick") {
    return "mvp";
  }

  return /(fast|quick|mvp|prototype|ship fast)/i.test(prompt) ? "mvp" : "foundation";
}

function inferPlatform(prompt: string, explicit?: string, stateValue?: string): string {
  const candidate = explicit?.trim() || stateValue?.trim();
  if (candidate) {
    return candidate;
  }

  const text = prompt.toLowerCase();
  if (/(mobile app|ios|android)/.test(text)) {
    return "mobile";
  }

  if (/(web app|dashboard|site|browser|saas)/.test(text)) {
    return "web";
  }

  return "web";
}

function buildQuestions(seed: OnboardingSeed, promptPresent: boolean): string[] {
  const questions: string[] = [];

  if (!promptPresent) {
    questions.push("What kind of project do you want to build?");
  }

  if (!seed.targetUser) {
    questions.push("Who is this project for?");
  }

  if (seed.problemStatement.trim().length < 40) {
    questions.push("What problem should this project solve for them?");
  }

  if (seed.successDefinition?.trim().length ?? 0 < 24) {
    questions.push("What would a good first version help the user do successfully?");
  }

  questions.push(
    seed.hasAiFeatures
      ? "Should AI be a core product feature or just a helper inside the workflow?"
      : "Do you want AI inside the product itself, or should the first version stay non-AI?"
  );

  if (questions.length > 5) {
    return questions.slice(0, 5);
  }

  return questions;
}

function buildMissingSignals(seed: OnboardingSeed, promptPresent: boolean): string[] {
  const missing: string[] = [];

  if (!promptPresent) {
    missing.push("project concept");
  }

  if (!seed.targetUser) {
    missing.push("target user");
  }

  if (seed.problemStatement.trim().length < 40) {
    missing.push("problem framing");
  }

  if (!seed.successDefinition || seed.successDefinition.trim().length < 24) {
    missing.push("success definition");
  }

  return missing;
}

export class OnboardingEngine {
  assess(input: OnboardingAssessmentInput): OnboardingAssessment {
    const idea =
      readStringArg(input.args, ["idea", "prompt", "project", "goal"]) ??
      input.state?.problemStatement ??
      "";
    const targetUser =
      readStringArg(input.args, ["target-user", "audience", "for"]) ??
      input.state?.targetUser;
    const explicitProblem = readStringArg(input.args, ["problem"]);
    const problemStatement = explicitProblem ?? idea;
    const successDefinition =
      readStringArg(input.args, ["success-definition", "outcome", "success"]) ??
      input.state?.successDefinition;
    const hasAiFeatures = inferHasAiFeatures(
      `${idea} ${problemStatement}`,
      readBooleanArg(input.args, ["ai", "uses-ai", "has-ai"]),
      input.state?.hasAiFeatures
    );
    const deliveryPreference = inferDeliveryPreference(
      `${idea} ${problemStatement}`,
      readStringArg(input.args, ["delivery", "speed"]),
      input.state?.deliveryPreference
    );
    const projectType = inferProjectType(
      `${idea} ${problemStatement}`,
      readStringArg(input.args, ["project-type", "type"]) ?? input.state?.projectType
    );
    const platform = inferPlatform(
      `${idea} ${problemStatement}`,
      readStringArg(input.args, ["platform"]),
      input.state?.platform
    );
    const constraintsRaw = readStringArg(input.args, ["constraints", "constraint", "deadline"]);
    const constraints = constraintsRaw
      ? constraintsRaw.split(/[;,]/).map((value) => value.trim()).filter(Boolean)
      : [];
    const assumptions = [
      deliveryPreference === "mvp"
        ? "Default to a fast MVP unless the user asks for deeper robustness."
        : "Bias toward a stronger foundation even if it slows the first build.",
      platform === "web"
        ? "Default to a web product surface unless the user asks for another platform."
        : `The initial platform preference is ${platform}.`
    ];
    const seed: OnboardingSeed = {
      projectType,
      targetUser,
      problemStatement,
      successDefinition,
      platform,
      hasAiFeatures,
      deliveryPreference,
      constraints,
      assumptions
    };
    const promptPresent = idea.trim().length > 0 || (explicitProblem?.trim().length ?? 0) > 0;
    const missingSignals = buildMissingSignals(seed, promptPresent);
    const needsMoreAnswers = missingSignals.length > 0;
    const mode = normalizeMode(input.args);
    const canInitializeState = !needsMoreAnswers;
    const questions = canInitializeState ? [] : buildQuestions(seed, promptPresent);
    const recommendedCommands = canInitializeState
      ? ["/vibe.init", "/vibe.plan", "/vibe.research"]
      : ["/vibe.start"];
    const summary = canInitializeState
      ? `I understand the project as a ${projectType} for ${targetUser ?? "a defined audience"} that solves: ${problemStatement}`
      : "The project idea is started, but the system still needs a few plain-language answers before it can trust the setup.";
    const plainLanguageNextStep = canInitializeState
      ? "The idea is grounded enough to initialize the project and continue into planning."
      : "Ask the remaining onboarding questions, then initialize the project state.";

    return {
      mode,
      readiness: canInitializeState ? "ready-for-init" : "questions-needed",
      needsMoreAnswers,
      questionBudget: 5,
      questions,
      missingSignals,
      summary,
      plainLanguageNextStep,
      canInitializeState,
      canAutoRunEarlyJourney: canInitializeState && mode === "autopilot",
      recommendedCommands,
      seed
    };
  }
}
