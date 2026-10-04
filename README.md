# Stockwise POS

An inventory-aware, one-store mini-market POS for full-stack practice. It uses Thai baht (THB) with VAT-inclusive 7% product pricing.

## What is implemented

- Email/password authentication with Admin and Cashier roles.
- Product catalogue, categories, archive-ready product records, and low-stock thresholds.
- Immutable stock-movement ledger plus Admin-only stock-in, stock-out, and stock-count adjustments.
- Cash/card POS checkout with transaction-safe stock decrements, VAT, change calculation, daily sequential receipt numbers, and overselling protection.
- Immutable sales and sale-item price/cost/VAT snapshots.
- Admin-only, reason-required same-day full-sale voids that restore inventory.
- Dashboard metrics, sales history, printable receipts, and editable store/receipt details.
- Unit tests for money parsing, VAT, discount limits, and stock limits.

## Run it locally

1. Create a PostgreSQL database (Neon or Supabase are suitable) and copy its connection string.
2. Run `Copy-Item .env.example .env` in PowerShell.
3. Put your database connection string in `DATABASE_URL` and a secure random string in `AUTH_SECRET`.
4. Install packages: `npm install`.
5. Generate and apply the first migration: `npx prisma migrate dev --name init`.
6. Seed demo staff, store data, products, and initial stock: `npm run db:seed`.
7. Start it: `npm run dev`.

Open `http://localhost:3000/login` and sign in with `admin@stockwise.demo` / `DemoPass123!`.

## Useful commands

- `npm run test` — run unit tests.
- `npm run lint` — check code quality.
- `npm run build` — create a production build.
- `npx prisma studio` — inspect local database records.

## Business guarantees

Stock cannot become negative. Checkout and void operations run in serializable database transactions. Sales, sale items, and stock movements are immutable. Products are archived rather than deleted. Historical reports retain the exact selling price, cost, discount, and VAT recorded at the moment of sale.

## Deliberately out of scope

Suppliers, purchase orders, multi-store stock, variants, weighted goods, expiry batches, partial returns, loyalty, coupons, real payment gateways, cash shifts, and hardware receipt printers.
