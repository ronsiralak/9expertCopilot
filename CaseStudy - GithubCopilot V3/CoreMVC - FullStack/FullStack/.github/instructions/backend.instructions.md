# ASP.NET Core Backend Standards

## Controllers

* Controllers should be thin.
* Controllers should only handle HTTP concerns.
* Business logic belongs in Services or Handlers.

## DTO Usage

* Always use DTOs.
* Never expose Entity Framework entities directly.

## Dependency Injection

* Register services using built-in DI container.
* Depend on abstractions rather than implementations.

## Validation

* Use FluentValidation.
* Validate all requests before processing.

## API Design

* Follow REST conventions.
* Use IActionResult.
* Return appropriate HTTP status codes.

## Logging

* Use ILogger<T>.
* Use structured logging.
* Do not log passwords or sensitive data.

## Async Programming

* Use async/await everywhere.
* Avoid .Result and .Wait().

## Clean Architecture

Application Layer:

* Business rules
* Use cases
* DTOs

Infrastructure Layer:

* EF Core
* External APIs
* File Storage

Presentation Layer:

* Controllers
* Middleware

Domain Layer:

* Entities
* Value Objects
* Domain Events
