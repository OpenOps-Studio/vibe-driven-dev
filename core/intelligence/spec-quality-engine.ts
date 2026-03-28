import fs from "fs-extra";
import path from "node:path";
import type { ProjectState } from "../router/engine.js";

export type SpecQualityLevel = "blocked" | "weak" | "usable" | "strong";
export type SpecQualitySignalStatus = "missing" | "partial" | "strong";

export interface SpecQualityInput {
  projectRoot: string;
  state: ProjectState | null;
  args?: Record<string, string | boolean> | undefined;
}

export interface SpecQualitySignal {
  id: "problem" | "target-user" | "success-definition" | "constraints" | "execution-readiness";
  label: string;
  score: number;
  status: SpecQualitySignalStatus;
  reasons: string[];
}

export interface SpecQualityAssessment {
  score: number;
  clarityLevel: SpecQualityLevel;
  shouldBlockProgress: boolean;
  blockers: string[];
  warnings: string[];
  strengths: string[];
  recommendedQuestions: string[];
  signals: SpecQualitySignal[];
  summary: string;
  nextBestAction: string;
}

function readJsonIfExists(filePath: string): Record<string, unknown> | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    return fs.readJsonSync(filePath) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function readTextIfExists(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    return "";
  }

  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function splitConstraintText(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(/[,\n;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeText(input: string | undefined): string {
  return (input ?? "").trim();
}

function determineSignalStatus(score: number): SpecQualitySignalStatus {
  if (score >= 17) {
    return "strong";
  }

  if (score >= 9) {
    return "partial";
  }

  return "missing";
}

export class SpecQualityEngine {
  assess(input: SpecQualityInput): SpecQualityAssessment {
    const projectRoot = input.projectRoot;
    const packageJson = readJsonIfExists(path.join(projectRoot, "package.json"));
    const readme = readTextIfExists(path.join(projectRoot, "README.md"));
    const state = input.state;
    const args = input.args ?? {};

    const rootArtifacts = [
      "PRD.md",
      "Logic.md",
      "Structure.md",
      "Dependencies.md",
      "problem-statement.md",
      "scope.md",
      "success-definition.md"
    ].filter((fileName) => fs.existsSync(path.join(projectRoot, fileName)));

    const stateArtifacts = state?.artifacts ?? [];
    const allArtifacts = Array.from(new Set([...rootArtifacts, ...stateArtifacts]));

    const problemText = normalizeText(
      typeof args.problem === "string"
        ? args.problem
        : typeof args.goal === "string"
        ? args.goal
        : ""
    );
    const targetUser = normalizeText(
      typeof args["target-user"] === "string" ? args["target-user"] : state?.targetUser
    );
    const successDefinition = normalizeText(
      typeof args["success-definition"] === "string"
        ? args["success-definition"]
        : state?.successDefinition
    );
    const constraints = Array.from(
      new Set([
        ...splitConstraintText(
          typeof args.constraint === "string"
            ? args.constraint
            : typeof args.constraints === "string"
            ? args.constraints
            : ""
        ),
        ...(state?.assumptions ?? [])
      ])
    );

    const packageSignals = [
      ...(Array.isArray(packageJson?.keywords)
        ? packageJson?.keywords.filter((value): value is string => typeof value === "string")
        : []),
      ...Object.keys(
        (packageJson?.dependencies as Record<string, unknown> | undefined) ?? {}
      ),
      ...Object.keys(
        (packageJson?.devDependencies as Record<string, unknown> | undefined) ?? {}
      )
    ];

    const signals: SpecQualitySignal[] = [];

    const problemReasons: string[] = [];
    let problemScore = 0;
    if (problemText.length >= 30) {
      problemScore += 14;
      problemReasons.push("A direct problem statement was supplied to the spec-quality pass.");
    } else if (problemText.length >= 10) {
      problemScore += 8;
      problemReasons.push("A short problem statement exists, but it may still be underspecified.");
    }

    if (
      allArtifacts.includes("problem-statement.md") ||
      allArtifacts.includes("PRD.md") ||
      /problem|pain point|workflow/i.test(readme)
    ) {
      problemScore += 6;
      problemReasons.push("Project artifacts already contain evidence of problem framing.");
    }

    if (state?.stage && state.stage !== "init") {
      problemScore += 2;
      problemReasons.push("The workflow has already moved past the initial capture stage.");
    }

    signals.push({
      id: "problem",
      label: "Problem framing",
      score: Math.min(problemScore, 20),
      status: determineSignalStatus(problemScore),
      reasons: problemReasons
    });

    const userReasons: string[] = [];
    let userScore = 0;
    if (targetUser.length >= 12) {
      userScore += 14;
      userReasons.push("A concrete target user or audience is captured.");
    } else if (targetUser.length > 0) {
      userScore += 8;
      userReasons.push("A target user exists but is still quite generic.");
    }

    if (/customer|team|buyer|founder|creator|sales|marketing/i.test(readme)) {
      userScore += 4;
      userReasons.push("Repository docs mention real user groups or stakeholders.");
    }

    signals.push({
      id: "target-user",
      label: "Target user clarity",
      score: Math.min(userScore, 20),
      status: determineSignalStatus(userScore),
      reasons: userReasons
    });

    const successReasons: string[] = [];
    let successScore = 0;
    if (successDefinition.length >= 20) {
      successScore += 14;
      successReasons.push("A success definition exists in project state or command input.");
    } else if (successDefinition.length > 0) {
      successScore += 8;
      successReasons.push("A short success definition exists, but it is not yet measurable enough.");
    }

    if (
      allArtifacts.includes("success-definition.md") ||
      allArtifacts.includes("scope.md") ||
      /success|goal|measure|outcome/i.test(readme)
    ) {
      successScore += 6;
      successReasons.push("Artifacts or docs indicate some success criteria work has started.");
    }

    signals.push({
      id: "success-definition",
      label: "Success definition",
      score: Math.min(successScore, 20),
      status: determineSignalStatus(successScore),
      reasons: successReasons
    });

    const constraintReasons: string[] = [];
    let constraintScore = 0;
    if (constraints.length >= 2) {
      constraintScore += 14;
      constraintReasons.push("The project already records multiple explicit constraints or assumptions.");
    } else if (constraints.length === 1) {
      constraintScore += 8;
      constraintReasons.push("There is at least one known constraint or assumption.");
    }

    if (/mvp|deadline|budget|cost|simple|fast/i.test(`${successDefinition} ${readme}`)) {
      constraintScore += 4;
      constraintReasons.push("The docs or state contain delivery-pressure signals such as speed, scope, or budget.");
    }

    signals.push({
      id: "constraints",
      label: "Constraints and assumptions",
      score: Math.min(constraintScore, 20),
      status: determineSignalStatus(constraintScore),
      reasons: constraintReasons
    });

    const executionReasons: string[] = [];
    let executionScore = 0;
    if (allArtifacts.length >= 3) {
      executionScore += 12;
      executionReasons.push("The repo already contains multiple planning or structure artifacts.");
    } else if (allArtifacts.length > 0) {
      executionScore += 7;
      executionReasons.push("The repo contains at least one artifact that can anchor execution.");
    }

    if (state?.stage && ["plan", "research", "blueprint", "detail", "scaffold", "qa", "handoff"].includes(state.stage)) {
      executionScore += 6;
      executionReasons.push("The workflow state is already beyond basic initialization.");
    }

    if (packageSignals.length > 0) {
      executionScore += 2;
      executionReasons.push("The repo contains codebase/package signals that help ground implementation scope.");
    }

    signals.push({
      id: "execution-readiness",
      label: "Execution readiness",
      score: Math.min(executionScore, 20),
      status: determineSignalStatus(executionScore),
      reasons: executionReasons
    });

    const totalScore = signals.reduce((sum, signal) => sum + Math.min(signal.score, 20), 0);
    const blockers: string[] = [];
    const warnings: string[] = [];
    const strengths: string[] = [];
    const recommendedQuestions: string[] = [];

    for (const signal of signals) {
      if (signal.status === "strong") {
        strengths.push(`${signal.label} is already grounded.`);
      }
    }

    const problemSignal = signals.find((signal) => signal.id === "problem");
    const userSignal = signals.find((signal) => signal.id === "target-user");
    const successSignal = signals.find((signal) => signal.id === "success-definition");
    const constraintSignal = signals.find((signal) => signal.id === "constraints");
    const readinessSignal = signals.find((signal) => signal.id === "execution-readiness");

    if (problemSignal && problemSignal.score < 10) {
      blockers.push("The project still lacks a concrete problem statement. The system can build features, but not yet with trustworthy intent.");
      recommendedQuestions.push("What specific problem is this project supposed to solve?");
    }

    if (userSignal && userSignal.score < 10) {
      blockers.push("The target user is not clear enough yet. That makes scope and product judgment fragile.");
      recommendedQuestions.push("Who is this for, in real-world terms?");
    }

    if (successSignal && successSignal.score < 10) {
      blockers.push("Success is not yet defined clearly enough to review or validate later.");
      recommendedQuestions.push("How will we know this project is working well enough?");
    }

    if (constraintSignal && constraintSignal.score < 10) {
      warnings.push("Constraints are still thin. The system may overbuild unless speed, budget, or simplicity boundaries are made explicit.");
      recommendedQuestions.push("Do you want the fastest MVP or a stronger foundation?");
    }

    if (readinessSignal && readinessSignal.score < 10) {
      warnings.push("Execution artifacts are still sparse. Planning should stay in front of implementation.");
      recommendedQuestions.push("What is the smallest useful version we should build first?");
    }

    const clarityLevel: SpecQualityLevel =
      totalScore >= 80 ? "strong" : totalScore >= 60 ? "usable" : totalScore >= 35 ? "weak" : "blocked";

    const shouldBlockProgress =
      clarityLevel === "blocked" ||
      blockers.length >= 2;

    const summary =
      clarityLevel === "strong"
        ? "The spec is strong enough to support specialist execution with low ambiguity."
        : clarityLevel === "usable"
        ? "The spec is usable, but a few weak spots should be tightened before deeper implementation."
        : clarityLevel === "weak"
        ? "The spec is still thin. Planning can continue, but implementation should remain gated."
        : "The project intent is too weak to trust downstream implementation yet.";

    const nextBestAction =
      shouldBlockProgress
        ? input.state
          ? "/vibe.plan"
          : "/vibe.init"
        : input.state?.stage === "init"
        ? "/vibe.plan"
        : input.state
        ? input.state.stage === "handoff"
          ? "/vibe.handoff-to-spec"
          : "continue-current-journey"
        : "/vibe.init";

    return {
      score: totalScore,
      clarityLevel,
      shouldBlockProgress,
      blockers,
      warnings,
      strengths,
      recommendedQuestions: Array.from(new Set(recommendedQuestions)).slice(0, 5),
      signals,
      summary,
      nextBestAction
    };
  }
}
