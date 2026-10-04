import { AdminShell } from "@/components/layout/admin-shell";
import { AdjustmentForm } from "@/features/inventory/components/adjustment-form";

export const dynamic = "force-dynamic";

export default function InventoryAdjustmentPage() {
  return <AdminShell title="Inventory adjustment" description="Record stock in, stock out, or a verified count. A reason is mandatory."><section className="content-card form-card"><AdjustmentForm /></section></AdminShell>;
}
