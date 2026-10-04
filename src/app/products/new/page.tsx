import { AdminShell } from "@/components/layout/admin-shell";
import { ProductForm } from "@/features/catalog/components/product-form";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return <AdminShell title="Add product" description="Create a sellable product. Stock is recorded separately through an adjustment."><section className="content-card form-card"><ProductForm /></section></AdminShell>;
}
