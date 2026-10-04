# Project context

## Current milestone

Milestone 2 — catalogue and inventory. The immediate goal is a clean Admin interface for products, current stock, low-stock status, and immutable movement history. Database writes follow once a PostgreSQL connection and authentication are configured.

## Information architecture

- Dashboard: today’s sales, transaction count, gross-profit estimate, low-stock products.
- POS: Cashier checkout screen (next milestone).
- Products: product catalogue and product creation/editing.
- Inventory: adjustments and stock movement history.
- Sales: transaction history, receipt details, and Admin-only voids.
- Settings: store profile and staff accounts.

## Data conventions

- Display money as `฿1,234.50`.
- Product prices include VAT. VAT amount is extracted for receipts and reports.
- Current stock is a whole number of sellable units.
- `stockOnHand <= reorderLevel` means low stock; zero is out of stock.
- Product SKU is required. Barcode is optional but unique when supplied.
