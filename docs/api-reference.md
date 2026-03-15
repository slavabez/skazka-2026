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
  - sets `pb_token` and `pb_external_id` HTTP-only cookies
- Success response:
  - `200` JSON with `user`, `expiry`, `session`
- Error responses:
  - `400` missing data or invalid phone format
  - `401` invalid credentials

### `GET /api/auth/session`

- Purpose: validate cookie session and return user data
- Behavior:
  - reads `pb_token`
  - parses JWT (`id`, `exp`)
  - auto-refreshes token if below refresh threshold
  - fetches user from PocketBase `/api/collections/users/records/:id`
  - updates `pb_external_id`
- Success response:
  - `200` JSON with `session` and `user`
- Error responses:
  - `401` missing/invalid/expired session

### `GET /api/auth/refresh`

- Purpose: force-refresh current token
- Behavior:
  - reads `pb_token`
  - calls PocketBase `/api/collections/users/auth-refresh`
  - updates `pb_token`
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
  - sets `pb_token` and `pb_external_id`
- Success response:
  - `200` JSON with `user`, `expiry`, `session`
- Error responses:
  - `401` invalid or expired token

### `GET|POST /api/auth/logout`

- Purpose: clear auth cookies
- Behavior:
  - deletes `pb_token` and `pb_external_id`
- Success response:
  - `200` text response

## Orders

### `GET /api/orders/by-date?date=YYYY-MM-DD`

- Purpose: get current user's orders by creation date
- Query params:
  - `date` (optional, defaults to current date)
- Behavior:
  - validates date format
  - uses authenticated `externalUserId` for manager filter in 1C
  - maps raw 1C data to `OrderListItem`
- Success response:
  - `200` JSON with `date`, `orders[]`, `summary { count, totalSum }`
- Error responses:
  - `400` invalid date format
  - `401` unauthorized
  - `500` server/data error

### `GET /api/orders/by-delivery?date=YYYY-MM-DD`

- Purpose: get current user's orders by delivery date
- Query params:
  - `date` (optional, defaults to current date)
- Response shape and error handling are the same as `/api/orders/by-date`.

### `GET /api/orders/:orderId`

- Purpose: get full order details for one order
- Behavior:
  - requires authenticated session
  - loads order header and order line items from 1C
  - returns mapped `OrderDetail`
- Success response:
  - `200` JSON with `order`
- Error responses:
  - `401` unauthorized
  - `404` order not found
  - `500` server/data error

## Reports

### `GET /api/reports/sales/goods?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

- Purpose: grouped sales report by manufacturer and goods
- Query params:
  - `startDate` (required)
  - `endDate` (required)
- Success response:
  - `200` JSON with `startDate`, `endDate`, `items[]`, `summary { sum, discount }`
- Error responses:
  - `400` missing/invalid dates
  - `401` unauthorized
  - `500` server/data error

### `GET /api/reports/sales/clients?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

- Purpose: grouped sales report by clients
- Success response:
  - `200` JSON with `items[]`, `summary { sum, discount, quantity }`
- Error responses:
  - `400`, `401`, `500`

### `GET /api/reports/sales/goods-and-clients?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

- Purpose: nested grouped report (partner -> manufacturer -> goods)
- Success response:
  - `200` JSON with `items[]`, `summary { sum, discount }`
- Error responses:
  - `400`, `401`, `500`

### `GET /api/reports/debts`

- Purpose: debt report grouped by counterparty with linked sale documents
- Success response:
  - `200` JSON with `items[]`, `summary { totalDebt, counterparties }`
- Error responses:
  - `401`, `500`

## Sale Document

### `GET /api/sale-document/:id`

- Purpose: get detailed sale document data (header, line items, debt)
- Behavior:
  - requires authenticated session
  - fetches sale row, sale content, and debt in parallel
  - maps data to `SaleDetail`
- Success response:
  - `200` JSON with `sale`
- Error responses:
  - `401` unauthorized
  - `404` sale document not found
  - `500` server/data error

## OData Service Layer

Main server-side OData helpers are in:

- `src/lib/odata/odata.ts`
- `src/lib/odata/orders.service.ts`
- `src/lib/odata/sale.service.ts`
- `src/lib/odata/sales.service.ts`
- `src/lib/odata/debt.service.ts`

All OData calls use:

- Base URL from `ODATA_API_URL`
- Authorization header from `ODATA_API_AUTH_HEADER`
- Redis cache key format: `odata:<fullUrl>`
