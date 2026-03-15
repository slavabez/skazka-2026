# Pages and Features

## Public Pages

### `/`

- Minimal home page for quick navigation

### `/login`

- Manual login form (phone + password)
- Supports token impersonation via query parameter:
  - `/login?t=<jwt>`

### `/utils`

ID conversion tools:

- Convert `1C ID` (32 chars) to UUID
- Convert UUID to `1C ID`
- Parse `ref` from a 1C link and convert to UUID
- Copy buttons for output values

Core logic: `src/lib/utils/ids.ts`

## Protected Pages

Protected by `src/proxy.ts` (requires `pb_token` cookie).

### `/profile`

- Displays user avatar, name, and phone
- Includes logout button

### `/orders/by-date`

- Working orders list filtered by order creation date
- Date picker (`?date=YYYY-MM-DD`)
- Shows total count, total sum, and order list

### `/orders/by-delivery`

- Working orders list filtered by delivery date
- Date picker (`?date=YYYY-MM-DD`)
- Shows total count, total sum, and order list

### `/orders/[orderId]`

- Order details page
- Shows header fields (status, payment, delivery info, comment, total)
- Shows order line items with discount breakdown

### `/reports/goods`

- Working sales report grouped by manufacturer and goods
- Date range filtering via query params (`startDate`, `endDate`)
- Quick range buttons for previous/current month
- Group totals and overall summary

### `/reports/clients`

- Working sales report grouped by clients
- Date range filtering and month shortcuts
- Summary totals (sales, discounts)

### `/reports/goods-and-clients`

- Working nested sales report (client -> manufacturer -> goods)
- Date range filtering and month shortcuts
- Summary totals for selected period

### `/reports/debts`

- Working debts report grouped by counterparty
- Displays debt totals and per-document entries
- Links each document to `/sale-document/[id]`

### `/sale-document/[id]`

- Detailed sales document page
- Shows debt status (paid/unpaid), header details, and line items
- Provides link back to related order when available

## Navigation and Layout

Global layout (`src/app/layout.tsx`) wraps pages with:

- Mantine provider
- Auth provider
- App shell

Sidebar (`src/components/Shell/Shell.tsx`) includes:

- Main app navigation
- Contextual auth section:
  - logged out: login link
  - logged in: profile summary + logout action
