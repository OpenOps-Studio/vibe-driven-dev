import { describe, expect, it } from "vitest";
import { EventRelevanceCheck } from "../../core/intelligence/event-relevance-check.js";
import { EventTopologyAdvisor } from "../../core/intelligence/event-topology-advisor.js";

describe("EventRelevanceCheck", () => {
  it("does not justify event architecture for simple flows", () => {
    const result = new EventRelevanceCheck().evaluate({
      notifications: true
    });

    expect(result.requiresEventArchitecture).toBe(false);
    expect(result.recommendation).toBe("not-justified-yet");
    expect(result.recommendedArtifacts).toEqual([]);
  });

  it("requires Event-Architecture.md once relevance crosses threshold", () => {
    const result = new EventRelevanceCheck().evaluate({
      notifications: true,
      webhooks: true
    });

    expect(result.requiresEventArchitecture).toBe(true);
    expect(result.recommendedArtifacts).toContain("Event-Architecture.md");
    expect(result.requiresEventCatalog).toBe(false);
  });

  it("requires the full event model for higher-complexity systems", () => {
    const result = new EventRelevanceCheck().evaluate({
      backgroundJobs: true,
      notifications: true,
      webhooks: true,
      aiAsyncFlows: true,
      externalIntegrations: true
    });

    expect(result.requiresEventArchitecture).toBe(true);
    expect(result.requiresEventCatalog).toBe(true);
    expect(result.requiresEventContracts).toBe(true);
    expect(result.recommendedArtifacts).toEqual([
      "Event-Architecture.md",
      "Event-Catalog.md",
      "Event-Contracts.md"
    ]);
  });
});

describe("EventTopologyAdvisor", () => {
  it("recommends queue-workers for deferred AI job flows", () => {
    const result = new EventTopologyAdvisor().advise({
      backgroundJobs: true,
      aiAsyncFlows: true,
      notifications: true
    });

    expect(result.topology).toBe("queue-workers");
    expect(result.requiredRules).toContain("Define retry policy.");
  });

  it("recommends pubsub-bus when many subsystems consume the same actions", () => {
    const result = new EventTopologyAdvisor().advise({
      notifications: true,
      webhooks: true,
      analyticsSideEffects: true,
      externalIntegrations: true,
      multiModuleConsumers: true
    });

    expect(result.topology).toBe("pubsub-bus");
    expect(result.requiredRules).toContain("Require correlation IDs.");
  });
});
