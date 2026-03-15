# Skazka Dashboard Documentation

Welcome to the technical documentation for **Skazka Dashboard**.

Skazka Dashboard is an internal web application used by sales agents and sales managers to view order and report data coming from 1C through an OData API (via backend-for-frontend routes).

## Documentation Map

- [Architecture](./architecture.md)
- [Authentication and Session Flow](./authentication.md)
- [API Reference](./api-reference.md)
- [Pages and Features](./pages-and-features.md)
- [Development Guide](./development.md)
- [Testing Strategy](./testing-strategy.md)
- [Deployment and Containerization](./deployment.md)

## Quick Start

1. Install dependencies:
   - `npm install`
2. Configure environment variables:
   - Copy `.env.example` values into `.env.local`
3. Run development server:
   - `npm run dev`

## Current Stack

- Next.js (App Router)
- React
- Mantine UI
- PocketBase (user auth and user records)
- Redis (OData response cache)
- 1C OData API (primary business data source)
- Vitest (unit tests)
