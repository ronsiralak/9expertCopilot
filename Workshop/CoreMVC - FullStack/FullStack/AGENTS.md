# AGENTS.md

## Project Overview

This repository contains:

* ASP.NET Core 8 Web API
* React + TypeScript frontend
* SQL Server
* Entity Framework Core
* Clean Architecture
* xUnit tests

The goal is to maintain a scalable, testable, and production-ready application.

---

## Repository Structure

```text
src/
├── Domain/
├── Application/
├── Infrastructure/
├── WebAPI/

tests/
├── UnitTests/
├── IntegrationTests/

clientapp/
├── src/
├── public/
```

## Layer Responsibilities

### Domain

Contains:

* Entities
* Value Objects
* Domain Events

Must not reference:

* EF Core
* ASP.NET Core
* External services

### Application

Contains:

* Business logic
* Use cases
* DTOs
* Interfaces

Must not depend on Infrastructure.

### Infrastructure

Contains:

* EF Core
* Repositories
* External APIs
* File storage
* Email providers

### WebAPI

Contains:

* Controllers
* Middleware
* Authentication
* Dependency Injection registration

### ClientApp

Contains:

* React Components
* Pages
* Hooks
* Services
* State Management

---

## Build Instructions

### Backend

```bash
dotnet restore
dotnet build
```

### Frontend

```bash
cd clientapp
npm install
npm run build
```

---

## Run Instructions

### Backend

```bash
dotnet run --project src/WebAPI
```

### Frontend

```bash
cd clientapp
npm run dev
```

---

## Test Instructions

### Run All Tests

```bash
dotnet test
```

### Run Specific Test Project

```bash
dotnet test tests/UnitTests
```

### Frontend Tests

```bash
cd clientapp
npm test
```

---

## Development Workflow

Before making changes:

1. Understand affected layer.
2. Review existing implementation patterns.
3. Follow existing architecture.

After making changes:

1. Build backend.
2. Build frontend.
3. Run tests.
4. Verify no warnings.
5. Update documentation if necessary.

---

## API Development Rules

When creating APIs:

* Use DTOs.
* Use request validation.
* Return appropriate HTTP status codes.
* Update Swagger documentation.
* Add unit tests.

When modifying APIs:

* Check backward compatibility.
* Update frontend contracts if necessary.

---

## Database Rules

When changing database schema:

1. Create EF Core migration.
2. Review migration script.
3. Ensure migration is reversible.

Example:

```bash
dotnet ef migrations add AddCustomerTable
dotnet ef database update
```

---

## Frontend Rules

When creating UI features:

* Prefer reusable components.
* Use TypeScript types.
* Centralize API calls.
* Avoid duplicated state management.

---

## Testing Expectations

Every business feature should include:

* Unit Tests
* Validation Tests

Critical workflows should include:

* Integration Tests

---

## Logging Rules

Use structured logging.

Log:

* Errors
* Warnings
* Security events

Do not log:

* Passwords
* Access tokens
* Personal sensitive information

---

## Security Rules

Always:

* Validate user input.
* Authorize protected endpoints.
* Use parameterized queries.
* Store secrets in environment variables.

Never:

* Hardcode credentials.
* Disable authentication checks.

---

## Pull Request Checklist

Before creating a pull request:

* Solution builds successfully.
* Tests pass.
* No compiler warnings.
* Migrations reviewed.
* API changes documented.
* Frontend builds successfully.

---

## Agent Instructions

When generating code:

1. Follow Clean Architecture.
2. Preserve existing patterns.
3. Prefer minimal changes.
4. Do not introduce new frameworks unless requested.
5. Add tests for new business logic.
6. Update documentation when behavior changes.

When refactoring:

1. Preserve behavior.
2. Run tests.
3. Avoid unnecessary architectural changes.

When uncertain:

1. Follow existing code patterns.
2. Choose consistency over personal preference.
