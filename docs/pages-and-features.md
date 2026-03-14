# Pages and Features

## Public Pages

### `/`

- Current minimal home page

### `/login`

- Manual login form with phone + password
- Supports token impersonation via query parameter:
  - `/login?t=<jwt>`

### `/utils` (Utilities)

ID conversion tools:

- Convert `1C ID` (32 chars) to UUID
- Convert UUID to `1C ID`
- Parse `ref` from a 1C link and convert to UUID
  - Example input:
    - `e1cib/data/Справочник.Пользователи?ref=8936000c29dddd3811ecc9c9312e175a`
- Copy buttons for output values

Core logic:

- `src/lib/utils/ids.ts`

## Protected Pages

Protected by `src/proxy.ts` (requires `pb_token` cookie).

### `/profile`

- Displays user avatar (generated from name), name, and phone
- Includes logout button

### `/orders/by-date`

- Placeholder page for order view filtered by order date

### `/orders/by-delivery`

- Placeholder page for order view filtered by delivery date

### `/reports/goods`

- Placeholder page for goods sales report

### `/reports/clients`

- Placeholder page for client sales report

### `/reports/goods-and-clients`

- Placeholder page for combined goods/client report

### `/reports/debts`

- Placeholder page for debts report

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
