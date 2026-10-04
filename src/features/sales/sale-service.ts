import { Prisma, SaleStatus, StockMovementType } from "@prisma/client";
import { getBusinessDate, createReceiptNumber } from "@/lib/business-date";
import { calculateSaleTotals, type CartLine } from "@/features/pos/calculations";
import { prisma } from "@/lib/prisma";
import type { CheckoutInput } from "./checkout-schema";

function toSatang(value: Prisma.Decimal): number {
  const [whole, fraction = ""] = value.toFixed(2).split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

function toMoney(satang: number): Prisma.Decimal {
  return new Prisma.Decimal(satang).div(100);
}

export async function checkoutSale(input: CheckoutInput, cashierId: string) {
  const quantities = new Map<string, number>();
  for (const item of input.items) quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);

  return prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({ where: { id: { in: [...quantities.keys()] }, archivedAt: null } });
    if (products.length !== quantities.size) throw new Error("One or more products are unavailable.");

    const lines: CartLine[] = products.map((product) => ({ productId: product.id, productName: product.name, unitPriceSatang: toSatang(product.sellingPrice), quantity: quantities.get(product.id) ?? 0, stockOnHand: product.stockOnHand }));
    for (const line of lines) if (line.quantity > line.stockOnHand) throw new Error(`${line.productName} does not have enough stock.`);

    const totals = calculateSaleTotals(lines, input.discountSatang);
    if (input.paymentMethod === "CASH" && (input.cashReceivedSatang ?? 0) < totals.totalSatang) throw new Error("Cash received is less than the sale total.");

    for (const line of lines) {
      const result = await tx.product.updateMany({ where: { id: line.productId, stockOnHand: { gte: line.quantity } }, data: { stockOnHand: { decrement: line.quantity } } });
      if (result.count !== 1) throw new Error(`${line.productName} was just sold out. Review the cart and try again.`);
    }

    const businessDate = getBusinessDate();
    const counter = await tx.receiptCounter.upsert({ where: { date: businessDate }, create: { date: businessDate, nextNumber: 2 }, update: { nextNumber: { increment: 1 } } });
    const receiptNumber = createReceiptNumber(businessDate, counter.nextNumber - 1);
    const sale = await tx.sale.create({
      data: {
        receiptNumber,
        cashierId,
        paymentMethod: input.paymentMethod,
        subtotal: toMoney(totals.subtotalSatang),
        discountAmount: toMoney(totals.discountSatang),
        discountReason: totals.discountSatang > 0 ? input.discountReason : null,
        vatAmount: toMoney(totals.vatSatang),
        total: toMoney(totals.totalSatang),
        cashReceived: input.paymentMethod === "CASH" ? toMoney(input.cashReceivedSatang ?? 0) : null,
        changeGiven: input.paymentMethod === "CASH" ? toMoney((input.cashReceivedSatang ?? 0) - totals.totalSatang) : null,
        items: { create: lines.map((line) => { const product = products.find((item) => item.id === line.productId); return { productId: line.productId, productName: line.productName, quantity: line.quantity, unitPrice: toMoney(line.unitPriceSatang), unitCost: product!.costPrice, vatAmount: toMoney(calculateSaleTotals([line]).vatSatang), lineTotal: toMoney(line.unitPriceSatang * line.quantity) }; }) },
      },
    });
    await tx.stockMovement.createMany({ data: lines.map((line) => ({ productId: line.productId, saleId: sale.id, type: StockMovementType.SALE, quantityDelta: -line.quantity, reason: receiptNumber, createdById: cashierId })) });
    return { id: sale.id, receiptNumber, totalSatang: totals.totalSatang, changeSatang: input.paymentMethod === "CASH" ? (input.cashReceivedSatang ?? 0) - totals.totalSatang : 0 };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function voidSale(saleId: string, reason: string, adminId: string) {
  return prisma.$transaction(async (tx) => {
    const sale = await tx.sale.findUnique({ where: { id: saleId }, include: { items: true } });
    if (!sale) throw new Error("Sale not found.");
    if (sale.status !== SaleStatus.COMPLETED) throw new Error("Only completed sales can be voided.");
    if (getBusinessDate(sale.createdAt) !== getBusinessDate()) throw new Error("Only same-day sales can be voided.");

    const updated = await tx.sale.updateMany({ where: { id: sale.id, status: SaleStatus.COMPLETED }, data: { status: SaleStatus.VOIDED, voidReason: reason, voidedAt: new Date() } });
    if (updated.count !== 1) throw new Error("This sale was already voided.");
    for (const item of sale.items) await tx.product.update({ where: { id: item.productId }, data: { stockOnHand: { increment: item.quantity } } });
    await tx.stockMovement.createMany({ data: sale.items.map((item) => ({ productId: item.productId, saleId: sale.id, type: StockMovementType.VOID, quantityDelta: item.quantity, reason, createdById: adminId })) });
    return sale;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function listSales() {
  return prisma.sale.findMany({ include: { cashier: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 100 });
}

export async function getReceipt(saleId: string, userId: string, role: "ADMIN" | "CASHIER") {
  const sale = await prisma.sale.findUnique({ where: { id: saleId }, include: { cashier: { select: { name: true } }, items: true } });
  if (!sale || (role !== "ADMIN" && sale.cashierId !== userId)) throw new Error("Receipt not found.");
  const store = await prisma.storeSettings.findUnique({ where: { id: "default-store" } });
  if (!store) throw new Error("Store settings have not been seeded.");
  return { sale, store };
}
