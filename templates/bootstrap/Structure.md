# Repository Structure

```text
src/
├── app/               # Application routing and entry
├── components/        # Reusable UI elements
│   ├── ui/            # Dumb/Presentational components
│   └── blocks/        # Stateful complex components
├── lib/               # Utility functions and shared core code
├── hooks/             # Custom React hooks
├── services/          # External API adaptors and integrations
├── types/             # Global TypeScript definitions
```

## Architectural Boundaries
- **Components** must never directly mutate databases.
- **Services** are the only modules allowed to perform external `fetch` calls.
- **UI folder** remains strictly stateless unless explicitly documented.
