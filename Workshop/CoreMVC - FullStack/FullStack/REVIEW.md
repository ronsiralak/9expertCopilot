# CustomerPortal review

## Summary

The implementation uses Clean Architecture: domain entities are separate from application DTOs, validation, services, and interfaces; EF Core is in Infrastructure; controllers handle HTTP concerns. The API uses DTOs, asynchronous I/O, FluentValidation, structured logging, and Swagger. The frontend uses React, TypeScript, functional components, React Query, and a centralized service.

## Findings and recommended actions

1. **High — unsupported runtime.** .NET 8 reached end of support on November 10, 2026. It is retained to satisfy the requested target. Upgrade the application and its dependencies to a supported .NET release before production use. [Microsoft support policy](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core).
2. **High — no authentication or authorization.** This is an explicitly selected local-development demo. The host refuses to run outside Development, but a Development host exposed to a network is still accessible without credentials. Add an appropriate identity provider and authorization before any deployment, and keep the demo bound to a trusted local interface.
3. **Medium — SQL Server behavior not exercised against a real server.** API integration tests use SQLite. The SQL Server migration was generated and its forward and rollback scripts reviewed, but was not applied to a database. Add SQL Server integration tests, including concurrent duplicate-email inserts, and verify migrations against an authorized disposable database.
4. **Medium — search scalability.** Search uses substring matching and may scan rows despite the result limit. Measure SQL Server query plans on representative data; consider an appropriate search index and pagination if data volume requires them.
5. **Medium — frontend coverage.** Automated frontend tests cover service error handling and query encoding, not rendered page workflows. Add component and browser tests for form validation, editing, deletion, and server failures.
6. **Low — frontend build warnings.** Vite reports ignored `use client` directives from React Query dependencies. The build succeeds; review the bundler/dependency combination before enforcing a warning-free frontend build.

## Verification

- Backend: 16 xUnit unit tests and 5 integration tests passed on .NET 8.
- Unit-test line coverage: Application 100%; `CustomerService` 33/33 instrumented lines. These are line-coverage measurements, not branch coverage.
- Frontend: 2 service tests passed and the TypeScript/Vite build succeeded with the warnings above.
- The SQL migration creates the customer table and a unique email index; its rollback drops the table. The migration was not applied to the user's SQL Server.

## Refactoring

Shared create/update validation rules were consolidated, customer reads use no-tracking queries, search projects only required fields and is capped at 100, and frontend mutations share centralized API and cache logic. Customer email uniqueness is checked by the service and enforced by a database index.
