---
name: import-extractor
description: "Evaluates raw reference material from the archive (e.g., imported JSON rules or standard guidelines) and extracts them into usable VDD skills, constraints, or rule sets. Safely promotes learning material to executable context."
stage_alignment: "plan"
category: "governance"
---

# Import Extractor

## Purpose

The VDD architecture enforces that external material imported into `archive/` is **learning-only by default** and cannot be executed or relied upon blindly. This skill serves as the bridge. It evaluates archived guidelines, scripts, or prompt fragments, extracts the relevant pieces, and proposes them as properly formatted VVD skills or project constraints.

## When to Use

- When migrating external coding standard packs (e.g., legacy `System_Prompt` or `master-rules.json`).
- When a user asks: "Adapt our old coding standards to this project."
- When promoting material from `archive/` to `packs/`.

## Input

- The path to the archived reference file.
- The target domain (e.g., "UI/UX Rules", "Security Rules").

## Workflow

1. **Read & Parse**: Read the source archived document.
2. **Filter Context**: Remove legacy instructions that conflict with the VDD core constitution (e.g., references to old toolings, out-of-scope CLI commands).
3. **Format & Extract**: Convert the viable rules into structured output.
4. **Target Decision**: Suggest whether the extracted logic should become a new `.md` SKILL, be appended to the current `Constraints.md` artifact, or form a new Pack.

## Promotion Constraints

- **Do not silently promote**. The result of this extraction MUST be presented to the user for confirmation before it can be written to the active workspace.
- Provide a clear rationale for why certain complex or conflicting rules were dropped.
