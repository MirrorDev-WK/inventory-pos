import { AdminShell } from "@/components/layout/admin-shell";
import { listSales } from "@/features/sales/sale-service";
import { formatDateTime, formatThb } from "@/lib/format";
import Link from "next/link";
import { requireRole } from "@/lib/authorization";
import { Role } from "@prisma/client";
import { VoidSaleButton } from "@/features/sales/components/void-sale-button";

export const dynamic = "force-dynamic";

export default async function SalesPage() {
  await requireRole(Role.ADMIN);
  const sales = await listSales();
  return <AdminShell title="Sales" description="Completed and voided sales are immutable records."><section className="content-card"><div className="section-header"><div><h2>Transaction history</h2><p>Most recent 100 sales.</p></div></div><div className="table-wrap"><table><thead><tr><th>Receipt</th><th>Date</th><th>Cashier</th><th>Payment</th><th>Total</th><th>Status</th><th>Action</th></tr></thead><tbody>{sales.map((sale) => <tr key={sale.id}><td><Link href={`/receipts/${sale.id}`}>{sale.receiptNumber}</Link></td><td>{formatDateTime(sale.createdAt.toISOString())}</td><td>{sale.cashier.name}</td><td>{sale.paymentMethod}</td><td>{formatThb(Number(sale.total))}</td><td><span className={`status ${sale.status === "COMPLETED" ? "status-in-stock" : "status-out-of-stock"}`}>{sale.status}</span></td><td>{sale.status === "COMPLETED" ? <VoidSaleButton saleId={sale.id} /> : "—"}</td></tr>)}</tbody></table></div></section></AdminShell>;
}
