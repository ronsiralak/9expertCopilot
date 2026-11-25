# Project Overview

This repository contains an ASP.NET Core 8 Web API backend and a React TypeScript frontend.

## Architecture

* Follow Clean Architecture principles.
* Keep business logic inside Application layer.
* Infrastructure layer must contain external integrations.
* Presentation layer must not contain business logic.

## General Coding Standards

* Follow SOLID principles.
* Prefer composition over inheritance.
* Use dependency injection.
* Use async/await for all I/O operations.
* Avoid code duplication.
* Prefer readability over clever code.

## Naming Conventions

### C#

* Classes: PascalCase
* Methods: PascalCase
* Properties: PascalCase
* Private Fields: _camelCase
* Local Variables: camelCase

### React

* Components: PascalCase
* Hooks: usePascalCase
* Variables: camelCase

## Error Handling

* Never swallow exceptions.
* Log all unexpected exceptions.
* Return meaningful error responses.

## Security

* Validate all user input.
* Never store secrets in source code.
* Use configuration providers and environment variables.

## Documentation

* Add XML comments to public APIs.
* Document complex business rules.

## Pull Request Requirements

* Build must succeed.
* Tests must pass.
* No compiler warnings.
* No duplicated code.
