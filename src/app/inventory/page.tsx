import Link from "next/link";
import { AdminShell } from "@/components/layout/admin-shell";
import { listStockMovements } from "@/features/inventory/adjustment-service";
import { formatDateTime } from "@/lib/format";
import { requireRole } from "@/lib/authorization";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  await requireRole(Role.ADMIN);
  const movements = await listStockMovements();
  return <AdminShell title="Inventory" description="Every stock change is recorded permanently." action={<Link className="button primary" href="/inventory/adjust">New adjustment</Link>}><section className="content-card"><div className="section-header"><div><h2>Stock movement history</h2><p>Most recent 100 movements.</p></div></div><div className="table-wrap"><table><thead><tr><th>Date</th><th>Product</th><th>Type</th><th>Change</th><th>Reason</th><th>Staff</th></tr></thead><tbody>{movements.map((movement) => <tr key={movement.id}><td>{formatDateTime(movement.createdAt.toISOString())}</td><td><strong>{movement.product.name}</strong></td><td>{movement.type.replaceAll("_", " ")}</td><td className={movement.quantityDelta > 0 ? "quantity-positive" : "quantity-negative"}>{movement.quantityDelta > 0 ? "+" : ""}{movement.quantityDelta}</td><td>{movement.reason ?? "—"}</td><td>{movement.createdBy.name}</td></tr>)}</tbody></table></div></section></AdminShell>;
}
