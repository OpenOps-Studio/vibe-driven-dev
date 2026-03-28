# Anti-Hallucination Guardrails

**CRITICAL INSTRUCTIONS FOR ALL AI AGENTS OPERATING IN THIS WORKSPACE:**

1. **Verify Before Generating**: Never guess the structure of a Shadcn UI component, Tailwind classes, or API object properties. Use your `view_file` or `grep_search` tools to find the actual implementation first.
2. **Stick to the Output Contract**: If asked to return JSON, return ONLY valid JSON. No markdown blocks, no chatty preambles.
3. **Say 'I Don't Know'**: If a requested library update references a version you are unfamiliar with, halt and ask the user or search the web. Do not guess the API surface of a minor version upgrade.
4. **No Placeholder Code**: Avoid writing `// ... implement logic here`. If asked to build a component, build the completely functional component.
5. **Aesthetics Warning**: Default Tailwind generic utility colors (e.g., `text-blue-500`) are forbidden. Always use semantic design tokens `hsl(var(--primary))`.
