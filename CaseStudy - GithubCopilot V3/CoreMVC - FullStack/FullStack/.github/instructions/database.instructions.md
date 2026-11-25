# Entity Framework Core Standards

## Query Performance

* Use AsNoTracking() for read-only queries.
* Avoid N+1 queries.
* Use Select() projections.
* Avoid loading unnecessary columns.

## DbContext

* Keep DbContext focused.
* Use one DbContext per database.

## Migrations

* Use EF Core migrations.
* Never modify migration history manually.

## Repository Usage

* Use repositories only when they add business value.
* Do not create generic repositories unnecessarily.

## Transactions

* Use explicit transactions only when required.
* Keep transactions short.

## Entity Design

* Use meaningful keys.
* Configure relationships explicitly.
* Use nullable reference types appropriately.

## SQL Performance

* Index frequently searched columns.
* Avoid SELECT *.
* Monitor slow queries.
