# 📚 Master Coding Rules - Usage Guide

## 📖 Overview

The **`master.json`** file is the comprehensive and unified reference for all coding rules in the {{PROJECT_NAME}} platform. This file gathers all architectural, programming, and security rules in one place.

## ⚡ Quick Summary of Main Rules

- **Architecture**: Flow Pages→Components→Hooks/Utils→Types with prevention of circular dependencies, incremental construction M1→M3, and usage of the eight Contexts with `storageManager`.
- **Components and UI**: Single responsibility per Component (≤150 lines, 3 `useEffect` max), extraction of logic to hooks, adherence to React Portal inside Modals, and Framer Motion system with official tokens.
- **Design and Experience**: Tailwind v4 with design tokens, Arabic/RTL support, default responsiveness via unified breakpoints, and asset management via `public/assets` with WebP/AVIF formats.
- **State and Data**: All Contexts use `loadFromStorage/saveToStorage` with compatible versions, defensive rendering with three states (loading/error/success), and REST interfaces with `{ success, data, error }` structure and Zod verification.
- **Performance and Quality**: Memoization for non-trivial components, Lazy loading for heavy libraries, cleanup of every side effect, test coverage ≥80%, and prevention of any functional regression without documentation and tests.
- **Security and Privacy**: Private by default, no hardcoded secrets, encrypted storage policies, standard tracking with privacy respect, and Codacy security checks (ESLint, Semgrep, Trivy, Lizard).
- **Infrastructure**: `@/` alias imports only, unified environments (`.nvmrc` and lockfiles), standard workflows, and PR checklist that verifies icons, tokens, coverage, and lint.

## 🎯 Purpose

- **Single Source of Truth** for all programming rules.
- **Quick Reference** for developers and mini AI Agents.
- **Comprehensive Documentation** for all standards and practices.
- **Audit Tool** for code reviews and CI/CD.

## 📁 File Location

```text
/coding rules/master.json
```

## 🏗️ File Structure

### 1️⃣ Metadata

```json
{
  "masterRuleSet": "{{PROJECT_NAME}} Master Coding Rules",
  "version": "2.0.0",
  "lastUpdated": "2025-10-18"
}
```

### 2️⃣ Philosophy

Project core philosophy:

- Consistency beats creativity at scale
- Rules are mandatory, not optional
- Untested code = broken code

### 3️⃣ Enforcement

Enforcement and verification mechanisms:

- TypeScript Compiler
- ESLint
- Vitest (80% coverage)
- Security scans
- Dependency audits

### 4️⃣ Rules Categories

#### 🏛️ Architecture

- **Unidirectional Dependencies**: Pages → Components → Hooks → Types
- **Import Rules**: Strict rules for imports
- **No Circular Dependencies**: Prevention of circular dependencies

#### 🧩 Component Modularity

- **SRP**: Single Responsibility Principle
- **Size Limits**: 150 soft / 250 hard lines
- **Decomposition Pattern**: Decomposition of large components
- **Custom Hooks**: Extraction of complex logic

#### 🎨 Styling

- **Tailwind CSS v4**: CSS-based config only
- **Design Tokens**: All colors and distances from tokens
- **Responsive Design**: Mobile-first approach

#### 🎬 Motion System

- **Framer Motion**: Official animation library
- **Timing Scale**: micro (100ms) → xlong (800ms)
- **Motion Tokens**: fade_in, slide_up, scale_in, etc.
- **Accessibility**: Support prefers-reduced-motion

#### 🎭 Icons

- **React Icons Only**: Inline SVG forbidden
- **Central File**: src/designSystem/icons/index.ts
- **Theming**: Always use `useTheme()`
- **ESLint Rule**: no-inline-svg enforced

#### 🔒 Security

- **Private by Default**: Everything is private unless specified otherwise
- **Storage Policy**: Use `storageManager.ts` only
- **No Secrets**: Hardcoded secrets forbidden
- **API Access Control**: Whitelist for external APIs

#### ⚠️ Error Handling

- **Global Error Boundary**: Comprehensive protection for the application
- **API Error Handling**: Handle `isError` state
- **Form Validation**: Zod + react-hook-form

#### 🧪 Testing

- **Coverage**: 80% minimum
- **Unit Tests**: All business logic
- **Component Tests**: All UI components
- **E2E Tests**: Critical flows

#### 📦 State Management

- **Context Pattern**: 8 Context providers
- **Custom Hooks**: usePosts(), useProfile(), etc.
- **Immutability**: useMemo, useCallback
- **Storage Integration**: loadFromStorage, saveToStorage

#### 🔗 Path Resolution

- **@ Alias**: To refer to the `src` folder
- **No Extensions**: Do not add .tsx/.ts
- **Relative for Siblings**: Same folder only

#### ⚡ Performance

- **Memoization**: useMemo, useCallback, React.memo
- **Code Splitting**: React.lazy() + Suspense
- **Bundle Size**: < 200KB initial gzipped

#### ♿ Accessibility

- **Semantic HTML**: Use semantic elements
- **ARIA Labels**: For interactive elements
- **Keyboard Navigation**: Full keyboard support
- **Color Contrast**: WCAG AA compliance

#### 📝 Type System

- **SSOT**: All types in `types.ts`
- **Strict Mode**: TypeScript strict enabled
- **Type Imports**: import type { ... }

#### 🌐 API

- **Endpoints**: Specified in `vite.config.ts`
- **Environment Variables**: process.env.*
- **Error Handling**: Try-catch + retry logic

#### 📚 Documentation

- **Code Comments**: For complex code
- **README Files**: For each main module
- **Type Annotations**: Explicit return types

## 🔍 How to Use

### For Developers

1. **Before starting any feature**:

   ```bash
   # Read rules related to what you are working on
   cat "coding rules/master.json" | jq '.rules.componentModularity'
   ```

2. **During writing**:
   - Review the PR Checklist in the file
   - Ensure you follow the rules for the specific category

3. **Before commit**:

   ```bash
   npm run typecheck
   npm run lint
   npm run test:coverage
   npm run debug:deps
   ```

### AI Agent Integration

```json
{
  "instruction": "Always refer to coding rules/master.json before making any code changes",
  "priority": "critical",
  "validation": "Every edit must comply with master.json rules"
}
```

## ✅ PR Checklist

Before sending any Pull Request, make sure:

- [ ] Component size < 250 lines
- [ ] No circular dependencies
- [ ] All icons from @/designSystem/icons
- [ ] All colors from design tokens
- [ ] Motion tokens followed
- [ ] Error boundaries present
- [ ] Tests coverage > 80%
- [ ] No hardcoded secrets
- [ ] Storage via storageManager.ts only
- [ ] Dependencies follow rules
- [ ] No inline SVG
- [ ] TypeScript strict mode passes
- [ ] ESLint passes
- [ ] All tests pass
- [ ] No console.log statements
- [ ] Arabic UI text where applicable

## 🛠️ Verification Tools

### TypeScript

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

### Testing

```bash
npm run test:coverage
```

### Architecture

```bash
npm run debug:deps      # Dependency graph
npm run debug:links     # Link validator
npm run debug:logic     # Logic analyzer
npm run debug:structure # All audits
```

## 📊 Measuring Rule Adherence

### Metrics Dashboard

- **Code Coverage**: Target 80%+
- **Bundle Size**: < 200KB initial
- **TypeScript Errors**: 0
- **ESLint Errors**: 0
- **Circular Dependencies**: 0
- **Security Vulnerabilities**: 0

## 🚨 Emergency Protocols

### Build Failure

1. Check TypeScript errors
2. Check ESLint violations
3. Check component size violations
4. Check circular dependencies

### Test Failure

1. Check coverage drop
2. Check unit tests
3. Check component tests
4. Check mock data

### Runtime Errors

1. Check error boundary
2. Check API error handling
3. Check form validation
4. Check storage migration

## 📖 Important Reference Files

| File | Description |
| ------- | ------- |
| `master.json` | This file - Unified Reference |
| `ruleset-index.json` | Index of individual rules |
| `App.tsx` | Provider layering + Routes |
| `themeContext.tsx` | Theme system |
| `types.ts` | Single source of truth for types |
| `storageManager.ts` | Storage management |

## 🔄 Updating Rules

### When adding a new rule

1. Update `master.json` first
2. Update individual files in `coding rules/`
3. Update `ruleset-index.json`
4. Update `.github/copilot-instructions.md`
5. Update documentation
6. Test implementation in CI/CD

### Version Control

```json
{
  "version": "2.0.0",
  "lastUpdated": "2025-10-18",
  "changelog": "See CHANGELOG.md"
}
```

## 💡 Best Practices

### 1. Read the rules first

Before starting any feature, read the rules related to it.

### 2. Use the tools

All tools are there to help you, use them constantly.

### 3. Ask for review

If you are not sure, ask for a review from the AI Staff Engineer.

### 4. Document exceptions

If there is a strong reason to break a rule, document the reason clearly.

### 5. Update knowledge

When learning something new, share it with the team and update documentation.

## 🎓 Training

### For New Developers

1. **Day 1**: Read `master.json` completely
2. **Week 1**: Review all individual rule files
3. **Week 2**: Start applying rules in small features
4. **Month 1**: Rules have become part of your daily work

### AI Agent Guidelines

```text
CRITICAL: Always load master.json context before any code generation.
```

## 📞 Support

### For questions about rules

- Consult `master.json`
- Consult individual files
- Ask the AI Staff Engineer

### To report issues

- Open an issue in GitHub
- Use tag: `coding-rules`
- Clarify the affected rule

## 🎯 Final Goal

> **"Unified, maintainable, secure, and high-quality code"**

These rules are not restrictions, but rather:

- ✅ **Guardrails** to protect you from common mistakes
- ✅ **Best Practices** collected from years of experience
- ✅ **Quality Gates** to ensure excellence
- ✅ **Team Alignment** to unify efforts

---

**Version**: 2.0.1
**Last Updated**: November 4, 2025
**Maintained by**: {{PROJECT_NAME}} Engineering Team
**Status**: 🟢 Active & Enforced
