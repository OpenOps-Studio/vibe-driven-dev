import { z } from "zod";
import type { VddPublicCommand } from "./engine.js";

export const publicCommandSchema = z.union([
  z.literal("/vibe.init"),
  z.literal("/vibe.plan"),
  z.literal("/vibe.research"),
  z.literal("/vibe.blueprint"),
  z.literal("/vibe.detail"),
  z.literal("/vibe.scaffold"),
  z.literal("/vibe.qa"),
  z.literal("/vibe.next"),
  z.literal("/vibe.resume"),
  z.literal("/vibe.status"),
  z.literal("/vibe.assumptions"),
  z.literal("/vibe.decide"),
  z.literal("/vibe.handoff-to-spec")
]);

export const commandActionSchema = z.union([
  z.literal("init"),
  z.literal("plan"),
  z.literal("research"),
  z.literal("blueprint"),
  z.literal("detail"),
  z.literal("scaffold"),
  z.literal("qa"),
  z.literal("next"),
  z.literal("resume"),
  z.literal("status"),
  z.literal("assumptions"),
  z.literal("decide"),
  z.literal("handoff-to-spec")
]);

export interface ParsedCommand {
  raw: string;
  normalized: VddPublicCommand;
  action: z.infer<typeof commandActionSchema>;
  args: Record<string, string | boolean>;
}

const ACTION_BY_COMMAND: Record<VddPublicCommand, ParsedCommand["action"]> = {
  "/vibe.init": "init",
  "/vibe.plan": "plan",
  "/vibe.research": "research",
  "/vibe.blueprint": "blueprint",
  "/vibe.detail": "detail",
  "/vibe.scaffold": "scaffold",
  "/vibe.qa": "qa",
  "/vibe.next": "next",
  "/vibe.resume": "resume",
  "/vibe.status": "status",
  "/vibe.assumptions": "assumptions",
  "/vibe.decide": "decide",
  "/vibe.handoff-to-spec": "handoff-to-spec"
};

const COMMAND_ALIASES: Record<string, VddPublicCommand> = {
  "/start.vibe": "/vibe.init",
  "/vibe.start": "/vibe.init",
  "/vibe.begin": "/vibe.init",
  "/vibe.handoff": "/vibe.handoff-to-spec"
};

function normalizeWhitespace(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

function splitArgs(input: string): string[] {
  return normalizeWhitespace(input).split(" ").filter(Boolean);
}

function parseArgs(tokens: string[]): Record<string, string | boolean> {
  const args: Record<string, string | boolean> = {};

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];

    if (!token || !token.startsWith("--")) {
      continue;
    }

    const withoutPrefix = token.slice(2);

    if (!withoutPrefix) {
      continue;
    }

    const [key, inlineValue] = withoutPrefix.split("=");

    if (!key) {
      continue;
    }

    if (inlineValue !== undefined) {
      args[key] = inlineValue;
      continue;
    }

    const next = tokens[i + 1];
    if (next && !next.startsWith("--")) {
      args[key] = next;
      i += 1;
      continue;
    }

    args[key] = true;
  }

  return args;
}

export class CommandParser {
  parse(rawInput: string): ParsedCommand {
    const cleaned = normalizeWhitespace(rawInput);

    if (!cleaned) {
      throw new Error("No command was provided.");
    }

    const tokens = splitArgs(cleaned);
    const firstToken = tokens[0] ?? "";

    const aliased = COMMAND_ALIASES[firstToken] ?? firstToken;
    const normalized = publicCommandSchema.parse(aliased) as VddPublicCommand;

    const args = parseArgs(tokens.slice(1));

    return {
      raw: rawInput,
      normalized,
      action: ACTION_BY_COMMAND[normalized],
      args
    };
  }

  isPublicCommand(input: string): input is VddPublicCommand {
    const cleaned = normalizeWhitespace(input);
    const candidate = COMMAND_ALIASES[cleaned] ?? cleaned;
    return publicCommandSchema.safeParse(candidate).success;
  }
}
