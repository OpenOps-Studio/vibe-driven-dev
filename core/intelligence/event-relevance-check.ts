export interface EventRelevanceInput {
  backgroundJobs?: boolean | undefined;
  notifications?: boolean | undefined;
  webhooks?: boolean | undefined;
  auditLogging?: boolean | undefined;
  analyticsSideEffects?: boolean | undefined;
  aiAsyncFlows?: boolean | undefined;
  multiModuleConsumers?: boolean | undefined;
  externalIntegrations?: boolean | undefined;
  eventualConsistencyAcceptable?: boolean | undefined;
}

export interface EventRelevanceResult {
  score: number;
  matchedSignals: string[];
  requiresEventArchitecture: boolean;
  requiresEventCatalog: boolean;
  requiresEventContracts: boolean;
  recommendation: "not-justified-yet" | "event-architecture-required" | "full-event-model-required";
  recommendedArtifacts: string[];
  summary: string;
}

const SIGNALS: Array<{
  key: keyof EventRelevanceInput;
  label: string;
  weight: number;
}> = [
  { key: "backgroundJobs", label: "background jobs", weight: 1 },
  { key: "notifications", label: "notifications", weight: 1 },
  { key: "webhooks", label: "webhooks", weight: 1 },
  { key: "auditLogging", label: "audit logging", weight: 1 },
  { key: "analyticsSideEffects", label: "analytics side effects", weight: 1 },
  { key: "aiAsyncFlows", label: "AI generation or deferred async flows", weight: 1 },
  { key: "multiModuleConsumers", label: "multiple consumers for the same business action", weight: 1 },
  { key: "externalIntegrations", label: "external integrations", weight: 1 },
  { key: "eventualConsistencyAcceptable", label: "eventual consistency is acceptable", weight: 1 }
];

export class EventRelevanceCheck {
  evaluate(input: EventRelevanceInput): EventRelevanceResult {
    const matchedSignals = SIGNALS.filter((signal) => input[signal.key] === true).map(
      (signal) => signal.label
    );

    const score = matchedSignals.length;
    const requiresEventArchitecture = score >= 2;
    const requiresEventCatalog = score >= 4;
    const requiresEventContracts = score >= 4;

    const recommendation = !requiresEventArchitecture
      ? "not-justified-yet"
      : requiresEventCatalog || requiresEventContracts
      ? "full-event-model-required"
      : "event-architecture-required";

    const recommendedArtifacts = requiresEventArchitecture
      ? [
          "Event-Architecture.md",
          ...(requiresEventCatalog ? ["Event-Catalog.md"] : []),
          ...(requiresEventContracts ? ["Event-Contracts.md"] : [])
        ]
      : [];

    const summary =
      recommendation === "not-justified-yet"
        ? "An event architecture is not justified yet. Request-response and simple in-process coordination should remain the default."
        : recommendation === "event-architecture-required"
        ? "The project has enough async or multi-consumer behavior to require an explicit event architecture before leaving blueprint."
        : "The project has enough event complexity to require explicit event architecture, event catalog, and event contracts before deeper implementation.";

    return {
      score,
      matchedSignals,
      requiresEventArchitecture,
      requiresEventCatalog,
      requiresEventContracts,
      recommendation,
      recommendedArtifacts,
      summary
    };
  }
}
