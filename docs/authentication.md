# Authentication and Session Flow

## Summary

Authentication is based on PocketBase user records and JWT tokens. The app stores auth state in secure HTTP-only cookies and uses the external 1C user id to scope business data queries.

## Cookie Strategy

Cookie constants are defined in `src/lib/auth/auth.ts`.

- `pb_token` - PocketBase JWT
- `pb_external_id` - external 1C user id (taken from PocketBase user record)

Cookie settings are defined in `getAuthCookieSettings` (`src/lib/auth/pocketbase.ts`):

- `httpOnly: true`
- `sameSite: "strict"`
- `secure: true` in production
- `path: "/"`
- `maxAge: 7 days`

## Phone Number Normalization

Before login, phone input is normalized to `+7xxxxxxxxxx` format:

- Non-digit symbols are removed
- If 10 digits are provided, `7` is prepended
- If input has 11 digits and starts with `8`, it is converted to `7`
- Invalid formats return `null`

Implemented in `normalizeKzPhone` (`src/lib/auth/auth.ts`).

## Auth API Endpoints

### `POST /api/auth/login`

- Input: `{ phone, password }`
- Normalizes phone number
- Calls PocketBase `auth-with-password`
- Stores both `pb_token` and `pb_external_id`
- Returns user data and session metadata

### `GET /api/auth/session`

- Reads `pb_token`
- Parses JWT (`id`, `exp`) and validates expiry
- Refreshes token when below `PB_TOKEN_EXPIRY_THRESHOLD`
- Fetches current user from PocketBase
- Updates `pb_external_id` from fresh user record
- Returns `session` and `user`

### `GET /api/auth/refresh`

- Reads `pb_token`
- Calls PocketBase `auth-refresh`
- Replaces `pb_token`
- Returns new `expiry` and `timeLeft`

### `GET|POST /api/auth/logout`

- Deletes both `pb_token` and `pb_external_id`
- Returns success response

### `GET /api/auth/impersonate?t=<JWT>`

- Used by login page when `t` query param is present
- Validates provided token and user access
- Stores both `pb_token` and `pb_external_id`
- Returns user and session metadata

## Server Auth Context

`getAuthRequestContext` (`src/lib/auth/server.ts`) is used by protected API routes and returns:

- `pocketBaseUserId`
- `pocketBaseToken`
- `externalUserId`

`externalUserId` comes from `pb_external_id` and is used in 1C/OData filtering for orders and reports.

## Client Auth Provider

`src/providers/auth.tsx` manages client-side auth state:

- Stores lightweight `isAuthenticated` and `user` in localStorage
- Checks session every 60 seconds when authenticated
- Updates stored user when backend user data changes
- Logs out on unauthorized session response
- Redirects to `/` on logout

## Umami Analytics Events

Defined in `src/lib/events.ts` and used in auth flows:

- `auth_login_success`
- `auth_login_failed`
- `auth_logout`
- `auth_session_expired`

The provider also calls `window.umami.identify` with user metadata after the analytics script is ready.
