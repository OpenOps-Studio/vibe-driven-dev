# Dependency Strategy

## Selected Core Stack
- **Framework**: [e.g., Next.js 14 App Router]
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS

## Utility Libraries
- **Forms**: react-hook-form + zod
- **State Management**: [e.g., Zustand or React Context]
- **Icons**: lucide-react

## Hard Restrictions
- **Do not install Moment.js** (Use `date-fns` or native `Intl` instead).
- **Avoid Lodash** unless a specific named function is critically needed. Native Array/Object methods preferred.
