/**
 * ArtifactRegistry — Minimal Functional Implementation
 *
 * This registry tracks all known artifact contracts in VDD.
 * It maps artifact names to their metadata: which stage produces them,
 * what trust level they hold, and whether they are required or optional.
 *
 * Per the Core Constitution:
 *   - Artifacts not in the registry must not be treated as authoritative.
 *   - Trust level is explicit, not implied.
 *   - Stage association is mandatory for every registered artifact.
 */

export type ArtifactTrustLevel = "trusted" | "unverified" | "learning-only" | "archived";
export type VddStage =
  | "init"
  | "plan"
  | "research"
  | "blueprint"
  | "detail"
  | "scaffold"
  | "qa"
  | "handoff";

export interface ArtifactContract {
  /** Canonical file name of the artifact */
  name: string;
  /** Human-readable description of what this artifact represents */
  description: string;
  /** The VDD stage that produces this artifact */
  producedByStage: VddStage;
  /** Whether this artifact is required for the stage to be complete */
  required: boolean;
  /** Trust classification of this artifact */
  trustLevel: ArtifactTrustLevel;
}

const registry = new Map<string, ArtifactContract>();

/**
 * Register an artifact contract.
 * Overwrites any existing registration with the same name.
 */
export function registerArtifact(contract: ArtifactContract): void {
  registry.set(contract.name, contract);
}

/**
 * Retrieve a single artifact contract by name.
 * Returns undefined if the artifact is not registered.
 */
export function getArtifact(name: string): ArtifactContract | undefined {
  return registry.get(name);
}

/**
 * List all registered artifact contracts.
 */
export function listArtifacts(): ArtifactContract[] {
  return Array.from(registry.values());
}

/**
 * List all artifacts required for a specific stage to be considered complete.
 */
export function getRequiredArtifactsForStage(stage: VddStage): ArtifactContract[] {
  return Array.from(registry.values()).filter(
    (a) => a.producedByStage === stage && a.required
  );
}

/**
 * Check whether a named artifact is registered and at what trust level.
 * Returns null if the artifact is not registered.
 */
export function checkArtifactTrust(name: string): ArtifactTrustLevel | null {
  return registry.get(name)?.trustLevel ?? null;
}

/**
 * Clear all registered artifacts.
 * Intended for use in tests only.
 */
export function clearRegistry(): void {
  registry.clear();
}

// ─── Bootstrap: Register All Core VDD Artifact Contracts ─────────────────────

const CORE_ARTIFACTS: ArtifactContract[] = [
  // init stage
  {
    name: "project-state.json",
    description: "Authoritative VDD project state",
    producedByStage: "init",
    required: true,
    trustLevel: "trusted",
  },
  {
    name: "assumptions-log.md",
    description: "Running log of project assumptions",
    producedByStage: "init",
    required: false,
    trustLevel: "trusted",
  },

  // plan stage
  {
    name: "problem-statement.md",
    description: "Structured problem framing",
    producedByStage: "plan",
    required: true,
    trustLevel: "trusted",
  },
  {
    name: "scope.md",
    description: "Project scope boundaries",
    producedByStage: "plan",
    required: true,
    trustLevel: "trusted",
  },
  {
    name: "success-definition.md",
    description: "Measurable success criteria",
    producedByStage: "plan",
    required: true,
    trustLevel: "trusted",
  },

  // research stage
  {
    name: "research-summary.md",
    description: "Consolidated research insights",
    producedByStage: "research",
    required: true,
    trustLevel: "trusted",
  },
  {
    name: "risk-register.md",
    description: "Identified risks and mitigations",
    producedByStage: "research",
    required: true,
    trustLevel: "trusted",
  },

  // blueprint stage
  {
    name: "architecture-baseline.md",
    description: "High-level system architecture",
    producedByStage: "blueprint",
    required: true,
    trustLevel: "trusted",
  },
  {
    name: "system-boundaries.md",
    description: "System component boundaries and responsibilities",
    producedByStage: "blueprint",
    required: true,
    trustLevel: "trusted",
  },

  // detail stage
  {
    name: "technical-detail.md",
    description: "Execution-ready technical constraints",
    producedByStage: "detail",
    required: true,
    trustLevel: "trusted",
  },
  {
    name: "validation-plan.md",
    description: "Test and validation strategy",
    producedByStage: "detail",
    required: true,
    trustLevel: "trusted",
  },
  {
    name: "execution-notes.md",
    description: "Warnings and caveats for implementation",
    producedByStage: "detail",
    required: false,
    trustLevel: "trusted",
  },

  // scaffold stage
  {
    name: "PRD.md",
    description: "Product Requirements Document",
    producedByStage: "scaffold",
    required: true,
    trustLevel: "trusted",
  },
  {
    name: "Logic.md",
    description: "Core business and interaction logic",
    producedByStage: "scaffold",
    required: true,
    trustLevel: "trusted",
  },
  {
    name: "Structure.md",
    description: "Conceptual repository structure",
    producedByStage: "scaffold",
    required: true,
    trustLevel: "trusted",
  },
  {
    name: "Dependencies.md",
    description: "Technology and dependency strategy",
    producedByStage: "scaffold",
    required: true,
    trustLevel: "trusted",
  },
  {
    name: "Memory.md",
    description: "Persistent agent grounding context",
    producedByStage: "scaffold",
    required: true,
    trustLevel: "trusted",
  },
  {
    name: "anti-hallucination.md",
    description: "Agent reliability guardrails",
    producedByStage: "scaffold",
    required: true,
    trustLevel: "trusted",
  },
  {
    name: "repo.md",
    description: "Repository identity and conventions",
    producedByStage: "scaffold",
    required: false,
    trustLevel: "trusted",
  },
  {
    name: "Design.md",
    description: "Visual and UX direction",
    producedByStage: "scaffold",
    required: false,
    trustLevel: "trusted",
  },

  // qa stage
  {
    name: "qa-report.md",
    description: "Quality assurance findings",
    producedByStage: "qa",
    required: true,
    trustLevel: "trusted",
  },
  {
    name: "go-no-go.md",
    description: "Handoff readiness decision",
    producedByStage: "qa",
    required: true,
    trustLevel: "trusted",
  },

  // handoff stage
  {
    name: "spec-handoff.md",
    description: "Final handoff package for Spec-Kit",
    producedByStage: "handoff",
    required: true,
    trustLevel: "trusted",
  },
  {
    name: "execution-entry-summary.md",
    description: "Execution entry point summary",
    producedByStage: "handoff",
    required: true,
    trustLevel: "trusted",
  },
  {
    name: "initial-decisions.json",
    description: "Key decisions for downstream execution",
    producedByStage: "handoff",
    required: true,
    trustLevel: "trusted",
  },
];

// Register all core contracts on module load
for (const contract of CORE_ARTIFACTS) {
  registerArtifact(contract);
}
