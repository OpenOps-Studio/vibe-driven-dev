import { describe, it, expect } from "vitest";
import { CommandParser } from "../../core/router/command-parser.js";

const parser = new CommandParser();

describe("CommandParser — valid command parsing", () => {
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

  it("parses all valid journey commands", () => {
    const commands = [
      "/vibe.init",
      "/vibe.plan",
      "/vibe.research",
      "/vibe.blueprint",
      "/vibe.detail",
      "/vibe.scaffold",
      "/vibe.qa",
      "/vibe.next",
      "/vibe.resume",
      "/vibe.status",
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
  it("resolves /start.vibe → /vibe.init", () => {
    const result = parser.parse("/start.vibe");
    expect(result.normalized).toBe("/vibe.init");
    expect(result.action).toBe("init");
  });

  it("resolves /vibe.start → /vibe.init", () => {
    const result = parser.parse("/vibe.start");
    expect(result.normalized).toBe("/vibe.init");
  });

  it("resolves /vibe.begin → /vibe.init", () => {
    const result = parser.parse("/vibe.begin");
    expect(result.normalized).toBe("/vibe.init");
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
