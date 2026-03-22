# Technical Architecture — PC Parts Store

**Version:** 2.0  
**Last Updated:** March 22, 2026

---

## 1. Overview
This project is a full-stack e-commerce platform built with **NestJS** (API) and **Angular 17+** (UI). It follows **Clean Architecture** principles, **Domain-Driven Design (DDD)**, and a **Use Case Pattern** for business logic orchestration.

### Core Principles
- **Separation of Concerns:** Distinct layers for Presentation, Application, Domain, and Infrastructure.
- **Rich Domain Model:** Business logic and invariants live inside Domain Entities.
- **Use Case Driven:** Every action (Command/Query) is an isolated class with a dedicated Handler.
- **Database as Source of Truth:** Schema is defined by hand-written SQL migrations.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| **Backend** | NestJS (Node.js) |
| **Frontend** | Angular 17+ (Standalone Components, Signals) |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | TypeORM |
| **Documentation** | Swagger (API) & Bruno (Testing) |
| **Styling** | Vanilla CSS / SCSS + Angular Material 3 |
| **Testing** | Jest & Supertest |

---

## 3. Project Structure

The project is organized as a monorepo with three main top-level directories:

### `api/` (NestJS)
Follows a structured approach to Clean Architecture:
- `src/domain/`: Entities with business logic and repository interfaces.
- `src/application/`:
  - `features/`: Commands, Queries, Handlers, and Mappers (organized by domain).
  - `contracts/`: Interfaces and base classes for the use case pattern.
  - `base/`: Common service base classes.
- `src/infra/`: TypeORM configurations, database implementations, and external service adapters.
- `src/presentation/`: Controllers, Guards, Filters, and Interceptors.
- `test/`: Integration tests using `BaseIntegrationTest` with real database connectivity.

### `ui/` (Angular)
Modern Angular architecture:
- `src/app/core/`: Singleton services (Auth, API) and guards.
- `src/app/shared/`: Generic reusable UI components and models.
- `src/app/features/`: Domain-specific components and logic (Lazy-loaded).
- `src/app/showcase/`: Development tool to verify shared components.

### `database/` (SQL)
- `sql/migrations/`: Hand-written SQL files (Source of Truth).
- `sql/seeds/`: Initial data for RBAC, Categories, and Products.

---

## 4. Backend Patterns (DDD + Use Case)

### The Flow of a Request
1. **Controller:** Receives a **Command** (write) or **Query** (read) via `@Body` or `@Query`.
2. **Service:** Coordinates the execution of the specific Handler.
3. **Handler:**
   - Uses a **Mapper** to convert input to a **Domain Entity**.
   - Executes business logic within the Entity.
   - Persists changes via a **Repository**.
   - Uses a **Mapper** to return a **Response DTO**.

### Testing Strategy
- **Integration Tests:** Priority. Uses `BaseIntegrationTest` to boot the full NestJS app and run tests against a real database.
- **Cleanup:** Automatic teardown via `registerCleanup` to ensure test isolation.

---

## 5. Frontend Patterns
- **Standalone Components:** No `NgModules`.
- **Signals:** Primary mechanism for state management and reactivity.
- **Generic Components:** High-reusability components (tables, buttons, inputs) in `shared/`.
- **Path Aliases:** Uses `@core/*`, `@shared/*`, `@features/*` for clean imports.

---

## 6. Database & Auth
- **Migrations:** Managed via SQL scripts first, then wrapped in TypeORM if needed for consistency.
- **Auth:** JWT-based using Passport.js.
- **RBAC:** Policy-based access control managed in the database (`roles`, `policies`, `role_policy`).

---

**Next Steps:**
- Complete the implementation of the `Order` and `Cart` features.
- Expand the integration test suite for complex business flows.
- Implement the admin management dashboard in the UI.
