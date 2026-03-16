# Skazka orders 2026

## Documentation

Detailed project documentation is available in:

- `docs/README.md`

## Summary

This web app is used by sales agents and managers to work with order and report data from centralized 1C via OData (through internal server routes).

## Current Features

- Authentication via PocketBase (phone/password + token impersonation)
- Session cookies with linked external 1C user id
- Orders by creation date
- Orders by delivery date
- Full order details view
- Sales reports:
  - by goods
  - by clients
  - by goods and clients
- Debts report grouped by counterparty
- Sale document details with debt status and links to related orders
- Utility page for 1C ID and UUID conversions

## Technologies Used

- Next.js (App Router)
- Mantine UI
- SWR
- PocketBase (user auth and records)
- Redis (OData response cache)
- 1C OData REST API (business data source)
