# CustomerPortal

Customer management demo using ASP.NET Core 8, SQL Server, EF Core, and React with TypeScript.

**Development only:** the API has no authentication and refuses to start outside the Development environment. Do not expose it to untrusted networks or use it for production data.

## Projects

- `CustomerPortal.Domain`: customer entity and domain types.
- `CustomerPortal.Application`: customer use cases, DTOs, validation, and persistence interfaces.
- `CustomerPortal.Infrastructure`: EF Core SQL Server persistence and migrations.
- `CustomerPortal.WebAPI`: HTTP controllers, dependency injection, error handling, and Swagger.
- `CustomerPortal.UnitTests`: xUnit tests for application rules and validation.
- `CustomerPortal.IntegrationTests`: API and persistence integration tests using an isolated SQLite database.
- `clientapp`: React TypeScript customer list, create, and edit pages.

## Requirements

- .NET 8 runtime and a compatible SDK. Building `CustomerPortal.slnx` requires an SDK that supports the `.slnx` format (such as .NET 11).
- SQL Server and the EF Core 8 command-line tool.
- Node.js and npm.

.NET 8 reached end of support on November 10, 2026. It is retained here because it was explicitly requested; upgrade to a supported .NET release before production use.

## Database and backend

Set a SQL Server connection string through configuration or an environment variable. For example, with Windows authentication in PowerShell:

```powershell
$env:ASPNETCORE_ENVIRONMENT = 'Development'
$env:ConnectionStrings__CustomerPortal = 'Server=localhost;Database=CustomerPortal;Integrated Security=true;TrustServerCertificate=true'
```

Use an authorized development database. Review and apply the migration explicitly; the application does not create or migrate a database automatically:

```powershell
dotnet ef migrations script --project src\CustomerPortal.Infrastructure --startup-project src\CustomerPortal.WebAPI
dotnet ef database update --project src\CustomerPortal.Infrastructure --startup-project src\CustomerPortal.WebAPI
dotnet run --project src\CustomerPortal.WebAPI --launch-profile http
```

Swagger is available at `http://localhost:5000/swagger`. Example requests are in `src\CustomerPortal.WebAPI\CustomerPortal.WebAPI.http`.

The API supports `GET /api/customers`, `GET /api/customers/{id}`, `POST /api/customers`, `PUT /api/customers/{id}`, and `DELETE /api/customers/{id}`. Search accepts a `search` query parameter of up to 200 characters and returns at most 100 results. Name and email are required; emails are normalized to lowercase and must be unique.

## Frontend

```powershell
cd clientapp
npm install
npm run dev
```

The Vite development server proxies `/api` requests to `http://localhost:5000`.

## Build and test

```powershell
dotnet build CustomerPortal.slnx
dotnet test CustomerPortal.slnx
cd clientapp
npm test
npm run build
```

Integration tests use SQLite and do not modify the configured SQL Server database.
