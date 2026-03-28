import { describe, it, expect } from "vitest";
import { CommandParser } from "../../core/router/command-parser.js";

const parser = new CommandParser();

describe("CommandParser — valid command parsing", () => {
  it("parses /vibe.start correctly", () => {
    const result = parser.parse("/vibe.start --idea AI copilot for sales teams");
    expect(result.normalized).toBe("/vibe.start");
    expect(result.action).toBe("start");
    expect(result.args["idea"]).toBe("AI copilot for sales teams");
  });

  it("parses /vibe.spec-quality correctly", () => {
    const result = parser.parse(
      "/vibe.spec-quality --problem=lead-routing-manual --target-user sales-teams"
    );
    expect(result.normalized).toBe("/vibe.spec-quality");
    expect(result.action).toBe("spec-quality");
    expect(result.args["problem"]).toBe("lead-routing-manual");
    expect(result.args["target-user"]).toBe("sales-teams");
  });

  it("parses /vibe.events correctly", () => {
    const result = parser.parse("/vibe.events --notifications true --webhooks true");
    expect(result.normalized).toBe("/vibe.events");
    expect(result.action).toBe("events");
    expect(result.args["notifications"]).toBe("true");
    expect(result.args["webhooks"]).toBe("true");
  });

  it("parses /vibe.init correctly", () => {
    const result = parser.parse("/vibe.init");
    expect(result.normalized).toBe("/vibe.init");
    expect(result.action).toBe("init");
    expect(result.args).toEqual({});
  });

  it("parses /vibe.plan correctly", () => {
    const result = parser.parse("/vibe.plan");
    expect(result.normalized).toBe("/vibe.plan");
    expect(result.action).toBe("plan");
  });

  it("parses /vibe.scaffold correctly", () => {
    const result = parser.parse("/vibe.scaffold");
    expect(result.normalized).toBe("/vibe.scaffold");
    expect(result.action).toBe("scaffold");
  });

  it("parses /vibe.handoff-to-spec correctly", () => {
    const result = parser.parse("/vibe.handoff-to-spec");
    expect(result.action).toBe("handoff-to-spec");
  });

  it("parses /vibe.skills correctly", () => {
    const result = parser.parse("/vibe.skills --top 5 --category testing");
    expect(result.normalized).toBe("/vibe.skills");
    expect(result.action).toBe("skills");
    expect(result.args).toEqual({ top: "5", category: "testing" });
  });

  it("parses all valid journey commands", () => {
    const commands = [
      "/vibe.start",
      "/vibe.init",
      "/vibe.spec-quality",
      "/vibe.events",
      "/vibe.plan",
      "/vibe.research",
      "/vibe.blueprint",
      "/vibe.detail",
      "/vibe.scaffold",
      "/vibe.qa",
      "/vibe.next",
      "/vibe.resume",
      "/vibe.status",
      "/vibe.skills",
      "/vibe.assumptions",
      "/vibe.decide",
      "/vibe.handoff-to-spec",
    ] as const;

    for (const cmd of commands) {
      expect(() => parser.parse(cmd)).not.toThrow();
    }
  });
});

describe("CommandParser — alias parsing", () => {
  it("resolves /start.vibe → /vibe.start", () => {
    const result = parser.parse("/start.vibe");
    expect(result.normalized).toBe("/vibe.start");
    expect(result.action).toBe("start");
  });

  it("resolves /vibe.spec → /vibe.spec-quality", () => {
    const result = parser.parse("/vibe.spec");
    expect(result.normalized).toBe("/vibe.spec-quality");
    expect(result.action).toBe("spec-quality");
  });

  it("resolves /vibe.event → /vibe.events", () => {
    const result = parser.parse("/vibe.event");
    expect(result.normalized).toBe("/vibe.events");
    expect(result.action).toBe("events");
  });

  it("keeps /vibe.start as a first-class command", () => {
    const result = parser.parse("/vibe.start");
    expect(result.normalized).toBe("/vibe.start");
    expect(result.action).toBe("start");
  });

  it("resolves /vibe.begin → /vibe.start", () => {
    const result = parser.parse("/vibe.begin");
    expect(result.normalized).toBe("/vibe.start");
    expect(result.action).toBe("start");
  });

  it("resolves /vibe.handoff → /vibe.handoff-to-spec", () => {
    const result = parser.parse("/vibe.handoff");
    expect(result.normalized).toBe("/vibe.handoff-to-spec");
  });
});

describe("CommandParser — argument parsing", () => {
  it("parses --project flag as boolean", () => {
    const result = parser.parse("/vibe.init --force");
    expect(result.args["force"]).toBe(true);
  });

  it("parses --key=value inline", () => {
    const result = parser.parse("/vibe.init --id=my-proj");
    expect(result.args["id"]).toBe("my-proj");
  });

  it("parses --key value as pair", () => {
    const result = parser.parse("/vibe.init --id my-proj");
    expect(result.args["id"]).toBe("my-proj");
  });

  it("preserves multi-word values until the next flag", () => {
    const result = parser.parse(
      "/vibe.spec-quality --problem Sales teams still route leads manually --target-user B2B sales teams"
    );
    expect(result.args["problem"]).toBe("Sales teams still route leads manually");
    expect(result.args["target-user"]).toBe("B2B sales teams");
  });

  it("parses multiple flags", () => {
    const result = parser.parse("/vibe.init --force --id=abc");
    expect(result.args["force"]).toBe(true);
    expect(result.args["id"]).toBe("abc");
  });

  it("preserves raw input", () => {
    const raw = "/vibe.init --force";
    const result = parser.parse(raw);
    expect(result.raw).toBe(raw);
  });
});

describe("CommandParser — invalid command rejection", () => {
  it("throws on empty input", () => {
    expect(() => parser.parse("")).toThrow("No command was provided.");
  });

  it("throws on unknown command", () => {
    expect(() => parser.parse("/vibe.unknown")).toThrow();
  });

  it("throws on plain text without prefix", () => {
    expect(() => parser.parse("init the project")).toThrow();
  });

  it("throws on whitespace-only input", () => {
    expect(() => parser.parse("   ")).toThrow();
  });
});

describe("CommandParser — isPublicCommand", () => {
  it("returns true for valid command", () => {
    expect(parser.isPublicCommand("/vibe.init")).toBe(true);
  });

  it("returns true for valid alias", () => {
    expect(parser.isPublicCommand("/vibe.handoff")).toBe(true);
  });

  it("returns false for unknown command", () => {
    expect(parser.isPublicCommand("/vibe.unknown")).toBe(false);
  });
});
