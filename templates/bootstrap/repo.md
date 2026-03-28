# Repository Conventions

## Git Branching
- All active dev happens on `develop` or feature branches (e.g., `feat/auth`, `fix/login-bug`).
- Direct commits to `main` are restricted.

## Commit Messages
Follow Conventional Commits:
- `feat: added user authentication`
- `fix: resolved race condition in cart checkout`
- `chore: updated dependencies`

## Naming Conventions
- React Components: PascalCase (e.g., `UserProfile.tsx`)
- Hooks: camelCase (e.g., `useSession.ts`)
- Utility functions: camelCase (e.g., `formatDate.ts`)
- CSS Modules / Tokens: kebab-case
