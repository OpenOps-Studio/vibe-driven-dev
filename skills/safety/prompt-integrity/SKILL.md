---
name: prompt-integrity
description: "Verifies the structure, safety, and guardrails of system prompts generated within the project to prevent unintended behavior, hallucination, and prompt injection."
stage_alignment: "scaffold"
category: "safety"
---

# Prompt Integrity

For AI-centric applications, the system prompt is code. This skill validates that any defined AI persona or system prompt is structured safely.

## Responsibilities

1. **Injection Guardrails**: Ensures the generated text contains explicit instructions ignoring malicious user overrides (e.g., "ignore all previous instructions").
2. **Format Enforcement**: Verifies that the prompt clearly dictates the expected output format (JSON, Markdown, Markdown with Tags) and limits hallucinated fields.
3. **Constraint Verifiability**: Ensures the prompt isn't too ambiguous (e.g., "be helpful and safe") but provides actionable boundaries.

## Checkpoint

- If a project uses an AI provider, the `Memory.md` and `anti-hallucination.md` artifacts MUST be checked by this skill.
- Outputs actionable suggestions or rewrites for prompt segments that score low on structural density.