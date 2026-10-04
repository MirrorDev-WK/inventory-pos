import Link from "next/link";
import { AdminShell } from "@/components/layout/admin-shell";
import { getDashboardMetrics } from "@/features/dashboard/dashboard-service";
import { formatThb } from "@/lib/format";
import { requireRole } from "@/lib/authorization";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireRole(Role.ADMIN);
  const metrics = await getDashboardMetrics();
  const cards = [["Today’s sales", formatThb(metrics.salesTotal)], ["Transactions", String(metrics.transactionCount)], ["Gross profit", formatThb(metrics.grossProfit)], ["Low-stock products", String(metrics.lowStockCount)]];
  return <AdminShell title="Good morning." description="Here is today’s store performance." action={<Link className="button primary" href="/pos">Open POS</Link>}><section className="metrics">{cards.map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>Live data for today</small></article>)}</section><section className="empty-state"><h2>Inventory-aware reporting.</h2><p>Gross profit is calculated from VAT-exclusive sales minus the cost snapshot on every sale item.</p></section></AdminShell>;
}
