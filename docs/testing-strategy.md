# Testing Strategy

## Goals

The app is a server-assisted dashboard with critical auth/session behavior and data-mapping logic from 1C OData. For this scale, the test strategy should prioritize fast feedback and confidence in business transformations over heavy end-to-end coverage.

## Recommended Pyramid for This Project

- Unit tests (primary, fast):
  - formatters, validators, id conversion, date helpers
  - data adapters (1C -> UI/API shape)
  - auth/session utility logic
- Route-level tests (targeted):
  - request validation and error handling for key API routes
  - auth guard behavior with missing/expired cookies
- UI tests (selective):
  - only for critical flows with non-trivial interactions
- End-to-end tests (minimal smoke):
  - login and one happy-path report/orders flow in staging

## Current Coverage Baseline

The following unit tests are now in place:

- `src/lib/auth/auth.test.ts`
- `src/lib/auth/server.test.ts`
- `src/lib/utils/ids.test.ts`
- `src/lib/orders/format.test.ts`
- `src/lib/orders/adapter.test.ts`
- `src/lib/reports/date.test.ts`
- `src/lib/sale/adapter.test.ts`

This baseline covers auth token parsing/time checks, cookie-context validation, pure formatters, conversion utilities, and core 1C data mapping.

## What to Add Next

1. API route tests for:
   - `/api/orders/by-date`
   - `/api/reports/sales/goods`
   - `/api/auth/session`
2. Focus each route test on:
   - validation errors (400)
   - unauthorized path (401)
   - success shape consistency
3. Add one lightweight E2E smoke test in CI for deploy confidence.

## Practical Rules

- Keep unit tests deterministic (mock time with fake timers where needed).
- Mock network-bound dependencies (PocketBase, OData, Redis) in tests.
- Prefer behavior assertions over snapshots for API/data logic.
- Treat auth/session and report totals as high-priority regression areas.
