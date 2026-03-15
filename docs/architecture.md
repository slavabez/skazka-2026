# Architecture

## High-Level Overview

Skazka Dashboard follows a server-assisted frontend architecture:

- **Frontend**: Next.js App Router with client/server components.
- **Auth backend integration**: PocketBase REST API.
- **Business data source**: 1C OData API.
- **Cache layer**: Redis for OData responses.

The browser does not talk to PocketBase or 1C directly for sensitive operations. Authentication and business data access are handled in server routes and server-side libraries.

## Main Source Directories

- `src/app` - pages and API routes
- `src/components` - UI components (shell, orders, reports)
- `src/providers` - global providers (auth, theme, SWR)
- `src/lib/auth` - auth utilities and PocketBase API wrappers
- `src/lib/odata` - OData request helpers and domain services
- `src/lib/orders`, `src/lib/reports`, `src/lib/sale` - adapters and report logic
- `src/config` - infrastructure config (Redis)
- `src/types` - generated and app-level TypeScript types

## Data Flow

### Authentication flow

1. User signs in via `/login` with phone and password (or token impersonation via `?t=`).
2. `POST /api/auth/login` normalizes phone number and authenticates against PocketBase.
3. App stores two HTTP-only cookies:
   - `pb_token` - PocketBase JWT
   - `pb_external_id` - external 1C user id from PocketBase record
4. Auth provider validates session via `GET /api/auth/session` on an interval.
5. Session endpoint refreshes token when close to expiry and keeps `pb_external_id` in sync.

### OData flow

1. Server code builds OData query URL from request parameters and authenticated user context.
2. OData responses are cached in Redis (keyed by full OData URL).
3. Adapters transform raw 1C records into UI/API response models.

## Protected Routes

Route protection is implemented via `src/proxy.ts`.

Currently protected route groups:

- `/orders/*`
- `/reports/*`
- `/profile/*`
- `/sale-document/*`

If the `pb_token` cookie is missing, user is redirected to `/login`.

## UI Shell Structure

`src/components/Shell/Shell.tsx` provides:

- Header with app name and mobile burger menu
- Sidebar navigation for home, utilities, orders, and reports
- Auth section in nav:
  - If logged out: link to login
  - If logged in: profile link, user avatar, logout button

The shell is disabled on `/login` to keep the auth screen focused.
