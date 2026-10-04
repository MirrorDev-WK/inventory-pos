import Link from "next/link";
import { AdminShell } from "@/components/layout/admin-shell";
import { ProductTable } from "@/components/ui/product-table";
import { listProductListItems } from "@/features/catalog/product-service";
import { requireRole } from "@/lib/authorization";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await requireRole(Role.ADMIN);
  const products = await listProductListItems();
  return <AdminShell title="Products" description="Manage sellable products, pricing, and stock thresholds." action={<Link className="button primary" href="/products/new">Add product</Link>}><section className="content-card"><div className="section-header"><div><h2>Catalogue</h2><p>{products.length} products · Prices include 7% VAT</p></div><input aria-label="Search products" placeholder="Search product or SKU" disabled /></div><ProductTable products={products} /></section></AdminShell>;
}
