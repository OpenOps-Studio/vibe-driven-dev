/**
 * Bootstrap Planner Intelligence
 *
 * Decides exactly which bootstrap artifacts a given project requires based on its
 * architectural profile. Prevents dumping massive amounts of irrelevant docs
 * safely prior to the scaffold stage.
 */

export interface BootstrapPlanningInput {
  projectType: "saas" | "internal-tool" | "mvp" | "content-site" | "wrapper-app";
  hasAiFeatures: boolean;
  hasDesignHeavyUx: boolean;
  stackComplexity: "high" | "medium" | "low";
  prdArtifact?: "PRD.full.md" | "PRD.draft.md" | undefined;
}

export type BootstrapFileType =
  | "PRD.full.md"
  | "PRD.draft.md"
  | "PRD.md"
  | "Logic.md"
  | "Structure.md"
  | "Dependencies.md"
  | "Memory.md"
  | "anti-hallucination.md"
  | "repo.md"
  | "Design.md";

export interface BootstrapPlan {
  filesToGenerate: BootstrapFileType[];
  rationale: string;
}

export class BootstrapPlanner {
  plan(input: BootstrapPlanningInput): BootstrapPlan {
    // Every project requires the foundational three
    const files: Set<BootstrapFileType> = new Set([
      input.prdArtifact ?? "PRD.draft.md",
      "Structure.md"
    ]);

    // If it has business logic (not just a pure content site), it needs Logic.md
    if (input.projectType !== "content-site") {
      files.add("Logic.md");
    }

    // Complex stacks require Dependency strategy documentation
    if (input.stackComplexity === "high" || input.stackComplexity === "medium") {
      files.add("Dependencies.md");
    }

    // AI requires Memory and Guardrails
    if (input.hasAiFeatures) {
      files.add("Memory.md");
      files.add("anti-hallucination.md");
    }

    // Specific product types with teams need Repo conventions
    if (input.projectType === "saas" || input.stackComplexity === "high") {
      files.add("repo.md");
    }

    // UX focus needs Design systems and tokens mapped out
    if (input.hasDesignHeavyUx || input.projectType === "saas") {
      files.add("Design.md");
    }

    const fileList = Array.from(files);

    return {
      filesToGenerate: fileList,
      rationale: `Generated specialized scaffolding blueprint tailored for a ${input.stackComplexity} complexity ${input.projectType}.`,
    };
  }
}
