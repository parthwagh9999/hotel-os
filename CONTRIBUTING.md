# Contributing to Hotel OS

Thank you for your interest in contributing to Hotel OS! This guide will help you get started.

## 📋 Table of Contents

- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Development Workflow

### 1. Fork & Clone

```bash
git clone https://github.com/<your-username>/hotel-os.git
cd hotel-os
npm install
```

### 2. Create a Branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Start Development

```bash
# Start database services
cd docker && docker compose up -d postgres redis && cd ..

# Generate Prisma client
npm run db:generate

# Start dev servers
npm run dev
```

### 4. Run Checks Before Committing

```bash
npm run lint
npm run type-check
npm run test
npm run build
```

## Code Style

### TypeScript

- Use **strict mode** — no `any` types unless absolutely necessary
- Prefer **functional components** with hooks in React
- Use **barrel exports** (`index.ts`) for public module APIs
- Follow the existing naming conventions:
  - `PascalCase` for components, classes, types, and interfaces
  - `camelCase` for functions, variables, and methods
  - `SCREAMING_SNAKE_CASE` for constants
  - `kebab-case` for file and directory names

### Python (AI Engine)

- Follow **PEP 8** and use **Ruff** for linting
- Use **type hints** everywhere
- Use **Pydantic** models for request/response schemas

### General

- Write **meaningful comments** for complex logic
- Keep functions **small and focused** (single responsibility)
- Add **JSDoc / docstrings** for public APIs
- Prefer **composition over inheritance**

## Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, semicolons, etc.) |
| `refactor` | Code refactoring (no feature or fix) |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `build` | Build system or dependency changes |
| `ci` | CI/CD configuration changes |
| `chore` | Other changes (tooling, configs) |

### Scopes

`web`, `api`, `database`, `ui`, `shared`, `ai-engine`, `docker`, `ci`

### Examples

```
feat(web): add room availability calendar component
fix(api): resolve JWT refresh token race condition
docs: update README with Docker instructions
test(api): add e2e tests for booking module
```

## Pull Request Process

1. **Update documentation** if your changes affect public APIs or user-facing features
2. **Add tests** for new features and bug fixes
3. **Ensure all CI checks pass** (lint, type-check, build, test)
4. **Fill out the PR template** completely
5. **Request review** from at least one maintainer
6. **Squash commits** before merging (handled automatically)

### PR Title

Follow the same commit conventions: `feat(scope): description`

### Review Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review completed
- [ ] Tests added for new/changed functionality
- [ ] Documentation updated if needed
- [ ] No breaking changes (or documented in PR)

## Issue Reporting

- Use the **Bug Report** template for bugs
- Use the **Feature Request** template for new features
- Search existing issues before creating a new one
- Include reproduction steps for bugs
- Be as specific as possible

---

Thank you for contributing to Hotel OS! 🏨
