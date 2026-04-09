# Testing RetailConnect Angular App

## Local Development Setup

1. Ensure Node.js 18+ is available (`nvm use 18`)
2. Run `npm install` in the repo root
3. Start dev server: `npm start` — serves at http://localhost:4200
4. The app uses localStorage for data persistence — no backend required
5. Build check: `npx ng build` to verify compilation

## Login Credentials

See the demo hint displayed on the login page for credentials. No external secrets are needed.

## App Navigation

After login, the app has a sidebar with 4 sections:
- **Dashboard** (`/dashboard`) — KPI stat cards, Recent Orders table, Low Stock Alerts list
- **Products** (`/products`) — Product table with search, category filter, pagination, edit/delete actions
- **Orders** (`/orders`) — Order table with date range picker, status chip filters, view/advance actions
- **Customers** (`/customers`) — Customer table with tier chips, spend data

## Key Features to Verify

- **Login/Logout flow**: Login redirects to /dashboard, logout redirects to /login, auth guard blocks unauthenticated access
- **Dashboard**: 4 KPI stat cards (Total Revenue, Active Customers, Pending Orders, Low Stock Alerts), Recent Orders table, Low Stock Alerts with truncate pipe
- **Products**: Table with sortable columns, category dropdown filter, search input, low stock warning icons, Add Product button
- **Orders**: `mat-chip-set` status filter chips (All, Pending, Processing, Shipped, Completed, Cancelled), date range picker, order detail view via click
- **Customers**: Colored tier chips (Gold, Silver, Standard, Platinum), active/inactive status badges

## Angular Architecture Notes

- All components are standalone (no NgModules)
- Routes use lazy loading via `loadComponent` and `loadChildren`
- Services use Angular Signals (`signal()`) with `toObservable()` for backward compat
- Templates use control flow syntax (`@if`, `@for`, `@else`, `@empty`)
- Material components use MDC variants (e.g., `mat-chip-set` not `mat-chip-list`)
- Auth guard is functional (`CanActivateFn`), interceptor is functional (`HttpInterceptorFn`)
- The `@` character in templates (like email addresses) must be escaped as `&#64;` to avoid being parsed as control flow syntax

## Common Build Issues

- `@use` rules in SCSS must come before all other rules — use `@import` for files that need to come after theme definitions
- M3 theming API uses different palette names than legacy Material (e.g., `$violet-palette` instead of `$indigo-palette`)
- Currency pipe returns `string | null` — use nullish coalescing (`?? ''`) when binding to inputs that expect `string | number`
- Budget warning (initial bundle >512KB) is expected and not a build failure

## Devin Secrets Needed

No secrets required — the app runs entirely locally with localStorage.
