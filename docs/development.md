# Development Guide

## Requirements

- Node.js (current LTS recommended)
- npm
- Access to:
  - PocketBase backend
  - 1C OData endpoint
  - Redis instance

## Environment Variables

Defined in `.env.example`:

- `DB_URL` — PocketBase base URL
- `ODATA_API_URL` — 1C OData base URL
- `ODATA_API_AUTH_HEADER` — auth header value for OData requests
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`

## Local Setup

1. Install dependencies:
   - `npm install`
2. Configure `.env.local`
3. Start app:
   - `npm run dev`

## Available Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — run standalone build server
- `npm run lint` — Biome lint
- `npm run format` — Biome format/check write
- `npm test` — run Vitest tests
- `npm run test:watch` — watch mode tests
- `npm run pbgen` — regenerate PocketBase TS types into `src/types/user.ts`

## Testing

Current test coverage includes auth utility unit tests:

- `src/lib/auth/auth.test.ts`
  - phone normalization
  - JWT parsing
  - token time-left calculation

Run tests with:

- `npm test`

## Notes for Contributors

- Keep auth route behavior in sync with auth provider logic.
- Do not expose raw 1C backend URLs directly in browser-side code.
- Keep type generation (`src/types/user.ts`) in sync with PocketBase schema changes.
- If adding new protected sections, update matcher list in `src/proxy.ts`.
