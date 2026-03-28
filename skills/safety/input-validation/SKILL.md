---
name: input-validation
description: "Validates all raw external inputs (commands, configuration overrides) provided to the VDD runtime to prevent path traversal, prototype pollution, or injection."
stage_alignment: "init"
category: "safety"
---

# Input Validation

Operates at the lowest layer of the orchestration runtime. Ensures that arguments passed by the user or by external pack manifestations do not subvert the VDD framework.

## Responsibilities

1. **Path Traversal Prevention**: Ensures `workspaceDir`, `targetFile`, or any filesystem-bound arguments cannot resolve to sensitive system directories (like `~/.ssh` or `/etc/`).
2. **Sanitization**: Escapes shell characters if the input is ever handed off to a terminal command execution context.
3. **Schema Compliance**: Re-verifies arguments against Zod schemas.

## Halting Procedure

- If malicious input patterns are detected, immediately halt the engine and log the violation. Do NOT attempt to intelligently "clean" known-malicious inputs (fail closed).