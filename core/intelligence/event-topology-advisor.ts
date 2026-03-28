import {
  EventRelevanceCheck,
  type EventRelevanceInput,
  type EventRelevanceResult
} from "./event-relevance-check.js";

export type EventTopologyChoice =
  | "no-bus"
  | "internal-app-events"
  | "queue-workers"
  | "pubsub-bus"
  | "event-stream";

export interface EventTopologyAdvice {
  relevance: EventRelevanceResult;
  topology: EventTopologyChoice;
  rationale: string;
  requiredRules: string[];
  optionalRules: string[];
}

export class EventTopologyAdvisor {
  advise(input: EventRelevanceInput): EventTopologyAdvice {
    const relevance = new EventRelevanceCheck().evaluate(input);

    if (!relevance.requiresEventArchitecture) {
      return {
        relevance,
        topology: "no-bus",
        rationale:
          "The current project does not yet justify a dedicated event bus. Keep coordination simple and synchronous until more async or multi-consumer pressure appears.",
        requiredRules: [],
        optionalRules: ["Document that event architecture is not justified yet."]
      };
    }

    if (
      input.backgroundJobs === true &&
      input.aiAsyncFlows === true &&
      input.externalIntegrations !== true
    ) {
      return {
        relevance,
        topology: "queue-workers",
        rationale:
          "The main pressure is deferred work rather than broad cross-system fan-out. A queue plus workers is the smallest honest topology.",
        requiredRules: [
          "Define retry policy.",
          "Define dead-letter handling expectations.",
          "Make consumers conceptually idempotent.",
          "Attach correlation IDs to queued work."
        ],
        optionalRules: ["Add causation IDs when one queued task emits follow-up events."]
      };
    }

    if (relevance.score >= 5 && input.multiModuleConsumers === true) {
      return {
        relevance,
        topology: "pubsub-bus",
        rationale:
          "Multiple subsystems need to react to the same business actions. A pub/sub bus is justified to preserve decoupling between producers and consumers.",
        requiredRules: [
          "Document producer and consumer ownership.",
          "Require correlation IDs.",
          "Make consumer idempotency explicit.",
          "Document ordering assumptions and replay expectations.",
          "Define dead-letter and retry paths."
        ],
        optionalRules: ["Add causation IDs where events trigger downstream events."]
      };
    }

    if (relevance.score >= 6 && input.analyticsSideEffects === true && input.auditLogging === true) {
      return {
        relevance,
        topology: "event-stream",
        rationale:
          "The project shows enough volume and observability pressure to justify an append-oriented event stream model rather than ad hoc event fan-out.",
        requiredRules: [
          "Version event contracts.",
          "Make replay assumptions explicit.",
          "Require correlation IDs and timestamps.",
          "Document partitioning or ordering expectations.",
          "Define retention and dead-letter strategy."
        ],
        optionalRules: ["Define causation IDs for multi-step event chains."]
      };
    }

    return {
      relevance,
      topology: "internal-app-events",
      rationale:
        "The project needs explicit event thinking, but the smallest viable move is still internal application events with documented producers, consumers, and failure expectations.",
      requiredRules: [
        "List core events and their business meaning.",
        "Document producer and consumer ownership.",
        "Require correlation IDs for async handoffs.",
        "Make idempotency expectations explicit."
      ],
      optionalRules: ["Escalate to queue-workers or pub/sub later if fan-out or async pressure increases."]
    };
  }
}
