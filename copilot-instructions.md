# didactic-madness — Copilot Instructions

## Overview

E-commerce platform for purchasing PC hardware components. Customers can browse products, manage a shopping cart, place orders, and track order status. Administration features include product management, order processing, and user management with role-based access control.

---

## Stack

| Concern | Tool / Technology |
|---|---|
| Language / Runtime | TypeScript / Node.js (API) · TypeScript / Node.js (UI) |
| Backend Framework | NestJS 11 |
| Frontend Framework | Angular 21 — Standalone Components, Signals |
| UI Component Library | Angular Material 3 |
| Database | PostgreSQL (Supabase) |
| ORM | TypeORM |
| Auth | Passport.js · JWT |
| API Documentation | Swagger |
| Testing — Unit/Integration | Jest |
| Testing — E2E Automation | xUnit · .NET 10 (project in `test/`) |
| Testing — API | Bruno (collection in `docs/bruno/`) |
| CI/CD | GitHub Actions |

---

## Folder Structure

| Folder | Scope |
|---|---|
| `api/` | NestJS backend — Clean Architecture / DDD |
| `api/src/domain/` | Domain entities and repository interfaces |
| `api/src/application/` | Use cases — Commands, Queries, Handlers, Mappers |
| `api/src/infra/` | TypeORM implementations, database config, external adapters |
| `api/src/presentation/` | Controllers, Guards, Filters, Interceptors |
| `ui/` | Angular frontend — Standalone Components |
| `ui/src/app/core/` | Singleton services (Auth, API) and guards |
| `ui/src/app/shared/` | Reusable components and models |
| `ui/src/app/features/` | Domain-specific feature modules (lazy-loaded) |
| `database/` | Hand-written SQL migrations and seed scripts |
| `database/sql/migrations/` | Source-of-truth schema migrations |
| `database/sql/seeds/` | RBAC, category, and product seed data |
| `docs/` | Architecture docs, UX design, Bruno API collection |
| `test/` | .NET 10 / xUnit E2E automation project |
| `.github/workflows/` | GitHub Actions CI/CD pipelines |

---

## Feature Folder

All feature documents (spec, plan, tasks, implementation) are stored under:

```
features/
└── {feature-name}-AB#{AZURE_ITEM_NUMBER}/
    ├── proposal.md
    ├── spec.md
    ├── plan.md
    ├── tasks.md
    └── implementation.md
```

---

## Knowledge Base & Instructions

This repository uses the shared knowledge base installed in the user profile:

- `~/.lore`

Ensure VS Code user settings include these locations:

- `chat.agentFilesLocations` → `~/.lore/agents`
- `chat.instructionsFilesLocations` → `~/.lore/instructions`
- `chat.promptFilesLocations` → `~/.lore/prompts`

All agents must read and follow the instructions there. Key files:

| Instruction | Path |
|---|---|
| Instructions Index | `~/.lore/instructions/index.md` |
| Agent Roster | `~/.lore/agents/index.md` |
| Feature Workflow | `~/.lore/instructions/feature-workflow.md` |
| Git Conventions | `~/.lore/instructions/git-conventions.md` |
| Coding Style | `~/.lore/instructions/coding-style.md` |
| Principles | `~/.lore/instructions/principles.md` |
| Design Patterns | `~/.lore/instructions/design-patterns.md` |
| Testing Strategy | `~/.lore/instructions/testing-strategy.md` |

---

## Repo-Specific Conventions

No overrides — follow global instructions.

---

*Generated: 2026-05-10*
*Last updated: 2026-05-10*
