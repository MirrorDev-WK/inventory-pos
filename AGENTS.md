# Stockwise POS — Project Rules

## Product context

Stockwise is a one-store mini-market inventory POS. It uses Thai baht (THB) and 7% VAT-inclusive product pricing. The two roles are `ADMIN` and `CASHIER`.

The MVP supports products, stock adjustments, checkout, cash/card payments, receipts, same-day full-sale voids, and sales/low-stock reporting. It deliberately excludes suppliers, purchase orders, variants, weighted goods, batches/expiry, partial returns, loyalty, real payment processing, and multi-store support.

## Non-negotiable business rules

- Never allow stock below zero.
- Run checkout and void operations inside a database transaction.
- Never edit or delete completed sales, sale items, or stock movements.
- Archive products rather than deleting them.
- Snapshot product name, selling price, cost price, discount, and VAT on every sale item.
- Cashiers can use POS and view only their own completed sales. Only Admins may adjust inventory, void sales, view cost/profit, change settings, or manage users.
- Require a reason for stock adjustments, sale-wide discounts, and voids.

## Code structure and quality

- Keep routes thin. Put domain logic in `src/features/<feature>` and shared helpers in `src/lib`.
- Prefer server components. Add `"use client"` only where interaction requires it.
- Use TypeScript strictly; do not use `any` or suppress type errors.
- Validate external input at the route boundary. Keep money as integer satang or database decimals; never use JavaScript floating-point arithmetic for totals.
- Use descriptive names, small focused modules, accessible semantic HTML, and user-facing error states.
- Keep demo data isolated from database repositories so it can be replaced without rewriting the UI.
- For every business-rule change, add or update an automated test before calling it complete.

## Verification

Run `npx prisma validate`, `npm run lint`, and `npm run build` after material changes. Do not commit secrets; only `.env.example` is tracked.
