import { SaleStatus } from "@prisma/client";
import { getBusinessDate } from "@/lib/business-date";
import { prisma } from "@/lib/prisma";

export async function getDashboardMetrics() {
  const businessDate = getBusinessDate();
  const start = new Date(`${businessDate}T00:00:00+07:00`);
  const end = new Date(start.getTime() + 86_400_000);
  const [sales, products] = await Promise.all([
    prisma.sale.findMany({ where: { status: SaleStatus.COMPLETED, createdAt: { gte: start, lt: end } }, include: { items: true } }),
    prisma.product.findMany({ where: { archivedAt: null }, select: { stockOnHand: true, reorderLevel: true } }),
  ]);
  const salesTotal = sales.reduce((total, sale) => total + Number(sale.total), 0);
  const grossProfit = sales.reduce((total, sale) => total + Number(sale.total) - Number(sale.vatAmount) - sale.items.reduce((cost, item) => cost + Number(item.unitCost) * item.quantity, 0), 0);
  return { salesTotal, transactionCount: sales.length, grossProfit, lowStockCount: products.filter((product) => product.stockOnHand <= product.reorderLevel).length };
}
