import { describe, it, expect } from "vitest";
import { RouterEngine } from "../../core/router/engine.js";
import type { ProjectState, RoutingContext } from "../../core/router/engine.js";

const engine = new RouterEngine();

function makeState(overrides: Partial<ProjectState> = {}): ProjectState {
  return {
    projectId: "test-proj",
    stage: "init",
    status: "active",
    assumptions: [],
    decisions: [],
    artifacts: [],
    gates: {
      security: "pending",
      measurement: "pending",
      realityCheck: "pending",
    },
    handoff: {
      target: "spec-kit",
      ready: false,
    },
    ...overrides,
  };
}

function ctx(
  command: RoutingContext["command"],
  state: ProjectState | null
): RoutingContext {
  return { command, state };
}

// ─── Valid Transitions ───────────────────────────────────────────────────────

describe("RouterEngine — valid transitions", () => {
  it("/vibe.init runs without any state", () => {
    const result = engine.run(ctx("/vibe.init", null));
    expect(result.ok).toBe(true);
    expect(result.resolvedAgent).toBe("orchestrator");
    expect(result.resolvedSkill).toBe("vibe-init");
  });

  it("/vibe.plan runs from init stage", () => {
    const result = engine.run(ctx("/vibe.plan", makeState({ stage: "init" })));
    expect(result.ok).toBe(true);
    expect(result.resolvedAgent).toBe("planner");
    expect(result.resolvedSkill).toBe("vibe-plan");
  });

  it("/vibe.research runs from plan stage", () => {
    const result = engine.run(
      ctx("/vibe.research", makeState({ stage: "plan" }))
    );
    expect(result.ok).toBe(true);
    expect(result.resolvedAgent).toBe("researcher");
  });

  it("/vibe.blueprint runs from research stage", () => {
    const result = engine.run(
      ctx("/vibe.blueprint", makeState({ stage: "research" }))
    );
    expect(result.ok).toBe(true);
    expect(result.resolvedAgent).toBe("architect");
  });

  it("/vibe.detail runs from blueprint stage", () => {
    const result = engine.run(
      ctx("/vibe.detail", makeState({ stage: "blueprint" }))
    );
    expect(result.ok).toBe(true);
    expect(result.resolvedAgent).toBe("detailer");
  });

  it("/vibe.scaffold runs from detail stage", () => {
    const result = engine.run(
      ctx("/vibe.scaffold", makeState({ stage: "detail" }))
    );
    expect(result.ok).toBe(true);
    expect(result.resolvedSkill).toBe("vibe-scaffold");
  });

  it("/vibe.qa runs from scaffold stage", () => {
    const result = engine.run(
      ctx("/vibe.qa", makeState({ stage: "scaffold" }))
    );
    expect(result.ok).toBe(true);
    expect(result.resolvedAgent).toBe("qa-guardian");
  });

  it("/vibe.status is always valid regardless of stage", () => {
    const stages = [
      "init",
      "plan",
      "research",
      "blueprint",
      "detail",
      "scaffold",
      "qa",
      "handoff",
    ] as const;
    for (const stage of stages) {
      const result = engine.run(
        ctx("/vibe.status", makeState({ stage }))
      );
      expect(result.ok).toBe(true);
    }
  });

  it("/vibe.next is always valid", () => {
    const result = engine.run(
      ctx("/vibe.next", makeState({ stage: "plan" }))
    );
    expect(result.ok).toBe(true);
  });

  it("/vibe.decide is always valid", () => {
    const result = engine.run(
      ctx("/vibe.decide", makeState({ stage: "research" }))
    );
    expect(result.ok).toBe(true);
  });
});

// ─── Invalid Jumps ───────────────────────────────────────────────────────────

describe("RouterEngine — invalid stage jumps", () => {
  it("blocks /vibe.research from init stage (stage jump)", () => {
    const result = engine.run(
      ctx("/vibe.research", makeState({ stage: "init" }))
    );
    expect(result.ok).toBe(false);
    expect(result.blockers.length).toBeGreaterThan(0);
  });

  it("blocks /vibe.blueprint from init stage", () => {
    const result = engine.run(
      ctx("/vibe.blueprint", makeState({ stage: "init" }))
    );
    expect(result.ok).toBe(false);
  });

  it("blocks /vibe.qa from plan stage (skipping multiple stages)", () => {
    const result = engine.run(
      ctx("/vibe.qa", makeState({ stage: "plan" }))
    );
    expect(result.ok).toBe(false);
  });

  it("returns blockers describing the invalid jump", () => {
    const result = engine.run(
      ctx("/vibe.scaffold", makeState({ stage: "init" }))
    );
    expect(result.ok).toBe(false);
    expect(result.blockers.some((b) => b.toLowerCase().includes("jump") || b.toLowerCase().includes("cannot"))).toBe(true);
  });
});

// ─── Handoff Blocked Before QA ───────────────────────────────────────────────

describe("RouterEngine — handoff blocked before handoff-ready", () => {
  it("blocks /vibe.handoff-to-spec when not handoff-ready", () => {
    const result = engine.run(
      ctx(
        "/vibe.handoff-to-spec",
        makeState({ stage: "qa", handoff: { target: "spec-kit", ready: false } })
      )
    );
    expect(result.ok).toBe(false);
    expect(result.blockers.some((b) => b.toLowerCase().includes("handoff-ready") || b.toLowerCase().includes("not marked"))).toBe(true);
  });

  it("allows /vibe.handoff-to-spec when handoff-ready and on handoff stage", () => {
    const result = engine.run(
      ctx(
        "/vibe.handoff-to-spec",
        makeState({
          stage: "handoff",
          status: "handoff-ready",
          handoff: { target: "spec-kit", ready: true },
        })
      )
    );
    expect(result.ok).toBe(true);
  });
});

// ─── No State Requires Init First ────────────────────────────────────────────

describe("RouterEngine — null state handling", () => {
  it("blocks /vibe.plan when no state exists", () => {
    const result = engine.run(ctx("/vibe.plan", null));
    expect(result.ok).toBe(false);
    expect(result.blockers.some((b) => b.includes("vibe.init"))).toBe(true);
  });

  it("blocks /vibe.qa when no state exists", () => {
    const result = engine.run(ctx("/vibe.qa", null));
    expect(result.ok).toBe(false);
  });
});

// ─── Next Recommendation ─────────────────────────────────────────────────────

describe("RouterEngine — /vibe.next recommendation", () => {
  it("recommends /vibe.plan after init", () => {
    const result = engine.run(ctx("/vibe.next", makeState({ stage: "init" })));
    expect(result.ok).toBe(true);
    expect(result.nextRecommendedCommand).toBe("/vibe.plan");
  });

  it("recommends /vibe.research after plan", () => {
    const result = engine.run(ctx("/vibe.next", makeState({ stage: "plan" })));
    expect(result.nextRecommendedCommand).toBe("/vibe.research");
  });

  it("recommends /vibe.qa after scaffold", () => {
    const result = engine.run(ctx("/vibe.next", makeState({ stage: "scaffold" })));
    expect(result.nextRecommendedCommand).toBe("/vibe.qa");
  });
});

// ─── Artifact Simulation ─────────────────────────────────────────────────────

describe("RouterEngine — artifact simulation", () => {
  it("lists artifacts for /vibe.scaffold", () => {
    const result = engine.run(
      ctx("/vibe.scaffold", makeState({ stage: "detail" }))
    );
    expect(result.artifactsCreated).toContain("PRD.md");
    expect(result.artifactsCreated).toContain("Memory.md");
    expect(result.artifactsCreated).toContain("anti-hallucination.md");
  });

  it("lists artifacts for /vibe.plan", () => {
    const result = engine.run(ctx("/vibe.plan", makeState({ stage: "init" })));
    expect(result.artifactsCreated).toContain("problem-statement.md");
    expect(result.artifactsCreated).toContain("scope.md");
  });
});
