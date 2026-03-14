# Architecture

## High-Level Overview

Skazka Dashboard follows a server-assisted frontend architecture:

- **Frontend**: Next.js App Router with client/server components.
- **Auth backend integration**: PocketBase REST API.
- **Business data source**: 1C OData API.
- **Cache layer**: Redis for OData responses.

The browser does not talk to PocketBase or 1C directly for sensitive operations. Authentication and data access logic are handled in server routes and server-side libraries.

## Main Source Directories

- `src/app` — pages and API routes
- `src/components` — UI components (e.g., app shell)
- `src/providers` — global providers (auth, theme)
- `src/lib/auth` — auth utilities and PocketBase API wrappers
- `src/lib/odata` — OData request helpers and order service
- `src/config` — infrastructure config (Redis)
- `src/types` — generated and app-level TypeScript types

## Data Flow

### Authentication flow

1. User submits phone + password on `/login`.
2. `POST /api/auth/login` normalizes the phone, authenticates against PocketBase.
3. PocketBase JWT is stored in an **HTTP-only cookie** (`pb_token`).
4. Auth provider periodically validates session via `GET /api/auth/session`.
5. Session endpoint can refresh token when close to expiry.

### OData flow

1. Server code builds OData query URL from parameters.
2. Response is cached in Redis (keyed by full OData URL).
3. Cached data is returned on subsequent requests until TTL expires.

## Protected Routes

Middleware-like route protection is implemented via `src/proxy.ts`.

Currently protected route groups:

- `/orders/*`
- `/reports/*`
- `/profile/*`

If the `pb_token` cookie is missing, user is redirected to `/login`.

## UI Shell Structure

`src/components/Shell/Shell.tsx` provides:

- Header with app name and mobile burger menu
- Sidebar navigation for home, utilities, orders, and reports
- Auth section in nav:
  - If logged out: link to login
  - If logged in: profile link, user avatar, logout button

The shell is disabled on `/login` to show a focused auth screen.
