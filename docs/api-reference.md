# API Reference

## Internal API Routes

All routes below are implemented in `src/app/api`.

## Authentication

### `POST /api/auth/login`

- Purpose: authenticate user with PocketBase using phone/password
- Request body:
  - `phone: string`
  - `password: string`
- Behavior:
  - normalizes phone to `+7xxxxxxxxxx`
  - calls PocketBase `/api/collections/users/auth-with-password`
  - sets `pb_token` HTTP-only cookie
- Success response:
  - `200` JSON with `user`, `expiry`, `session`
- Error responses:
  - `400` missing data or invalid phone format
  - `401` invalid credentials

### `GET /api/auth/session`

- Purpose: validate current cookie session and return user data
- Behavior:
  - reads `pb_token` cookie
  - parses JWT (`id`, `exp`)
  - auto-refreshes token if below refresh threshold
  - fetches user from PocketBase `/users/records/:id`
- Success response:
  - `200` JSON with `session` and `user`
- Error responses:
  - `401` missing/invalid/expired session

### `GET /api/auth/refresh`

- Purpose: force-refresh current token
- Behavior:
  - reads `pb_token`
  - calls PocketBase `/users/auth-refresh`
  - updates cookie with new token
- Success response:
  - `200` JSON with new `expiry` and `timeLeft`
- Error responses:
  - `401` missing token
  - `500` refresh failure

### `GET /api/auth/impersonate?t=<token>`

- Purpose: sign in with externally provided token
- Behavior:
  - validates token and expiration
  - checks user availability in PocketBase
  - stores token in cookie
- Success response:
  - `200` JSON with `user`, `expiry`, `session`
- Error responses:
  - `401` invalid or expired token

### `GET|POST /api/auth/logout`

- Purpose: clear auth cookie
- Behavior:
  - deletes `pb_token` cookie
- Success response:
  - `200` text response

## OData Service Layer

The app currently exposes OData access through server-side libraries:

- `src/lib/odata/odata.ts`
- `src/lib/odata/orders.service.ts`

Key functions:

- `getOrderById(orderId)`
- `getOrdersForUserByDate({ userId, startDate, endDate })`
- `getOrdersForUserByDeliveryDate({ userId, startDate, endDate })`
- `getOrderContent(orderId)`
- `getOrderAdditionalProperties(orderId)`
- `getMultipleOrderAdditionalProperties(orderIds)`

All OData calls use:

- Base URL from `ODATA_API_URL`
- Authorization header from `ODATA_API_AUTH_HEADER`
- Redis cache key format: `odata:<fullUrl>`
