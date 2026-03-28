# Project Constraints & Guardrails

This document defines the strict boundaries within which the AI coding agent must operate. 
Failure to adhere to these constraints will trigger a /vibe.qa failure.

## 🏗️ Architectural Constraints
- **Framework**: [Next.js | Vite | Node.js]
- **Language**: TypeScript (Strict Mode: Required)
- **Styling**: Tailwind CSS (No inline styles)
- **Components**: Shadcn UI (Custom variants only)

## 🛡️ Security Constraints
- No hardcoded secrets or API keys.
- All database queries must use parameterized inputs or ORM/Query Builder with RLS.
- PII must be encrypted at rest.

## 🧪 Testing Constraints
- Component testing: Required for all UI elements.
- Integration testing: Required for all API endpoints.
- Coverage threshold: 80% minimum.

## 🤖 AI Interaction Constraints
- Agents must follow the **Vibe Driven Dev** journey phases.
- No unauthorized tool usage outside of approved MCPs.
- Mandatory human-in-the-loop for dependency major version upgrades.
