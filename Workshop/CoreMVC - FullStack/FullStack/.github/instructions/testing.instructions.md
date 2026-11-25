# Testing Standards

## Unit Testing

* Use xUnit.
* Follow Arrange Act Assert pattern.
* One logical assertion per test.

## Naming

Format:

MethodName_Scenario_ExpectedResult

Example:

CreateOrder_InvalidCustomer_ThrowsException

## Mocking

* Mock external dependencies.
* Do not mock business logic.

## Coverage

Minimum target:

* Service Layer: 80%
* Application Layer: 80%

## Test Data

* Use builders or factories.
* Avoid duplicated setup code.

## Integration Tests

* Test database interactions.
* Test API endpoints.

## What To Test

* Business rules
* Validation
* Authorization
* Error handling

## What Not To Test

* EF Core internals
* Framework code
* Third-party libraries
