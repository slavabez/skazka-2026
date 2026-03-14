# Authentication and Session Flow

## Summary

Authentication is based on PocketBase user records and JWT tokens, but token storage is handled by this app using a secure HTTP-only cookie.

## Cookie Strategy

- Cookie name: `pb_token`
- Constants are defined in `src/lib/auth/auth.ts`
- Cookie is set as:
  - `httpOnly: true`
  - `sameSite: "strict"`
  - `secure: true` in production
  - `path: "/"`
  - `maxAge: 7 days`

## Phone Number Normalization

Before login, phone input is normalized to the `+7xxxxxxxxxx` format:

- Non-digit symbols are removed (`+`, spaces, dashes, brackets)
- If starts with `8` and has 11 digits, it is converted to `7`
- Invalid formats return `null` and login is rejected

Implemented in:

- `normalizeKzPhone` in `src/lib/auth/auth.ts`

## Auth API Endpoints

### `POST /api/auth/login`

- Input: `{ phone, password }`
- Normalizes phone number
- Calls PocketBase `auth-with-password`
- Stores returned JWT in `pb_token` cookie
- Returns:
  - user record
  - expiry timestamp (`exp`)
  - session metadata (`expiry`, `timeLeft`)

### `GET /api/auth/session`

- Reads token from cookie
- Decodes token to get `id` and `exp`
- Validates token time left
- If token is close to expiry (`PB_TOKEN_EXPIRY_THRESHOLD`), refreshes token
- Fetches current user record from PocketBase
- Returns current session + user info

### `GET /api/auth/refresh`

- Reads token from cookie
- Calls PocketBase `auth-refresh`
- Replaces cookie token
- Returns new expiry metadata

### `GET|POST /api/auth/logout`

- Deletes `pb_token` cookie
- Returns success response

### `GET /api/auth/impersonate?t=<JWT>`

- Used by login page if `t` query param exists
- Validates provided token (`exp` and user fetch)
- Stores token in cookie
- Returns user and session info

## Client Auth Provider

`src/providers/auth.tsx` manages client-side auth state:

- Stores lightweight auth state and user data in localStorage
- Runs periodic session checks every 60 seconds when authenticated
- Logs out on unauthorized session response
- Redirects to `/` on logout

## Umami Analytics Events

Defined in `src/lib/events.ts` and used in auth flows:

- `auth_login_success`
- `auth_login_failed`
- `auth_logout`
- `auth_session_expired`

The provider also calls `window.umami.identify` with user metadata when script is ready.
