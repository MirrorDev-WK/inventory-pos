import { StockMovementType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { InventoryAdjustmentInput } from "./adjustment-schema";

export async function createInventoryAdjustment(input: InventoryAdjustmentInput, userId: string) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: input.productId } });
    if (!product || product.archivedAt) throw new Error("Product is unavailable.");

    const quantityDelta = input.action === "STOCK_IN" ? input.quantity : input.action === "STOCK_OUT" ? -input.quantity : input.quantity - product.stockOnHand;
    if (product.stockOnHand + quantityDelta < 0) throw new Error("Stock cannot go below zero.");

    const type = input.action === "STOCK_IN" ? StockMovementType.ADJUSTMENT_IN : input.action === "STOCK_OUT" ? StockMovementType.ADJUSTMENT_OUT : StockMovementType.STOCK_COUNT;
    await tx.product.update({ where: { id: product.id }, data: { stockOnHand: { increment: quantityDelta } } });
    const [adjustment] = await Promise.all([
      tx.inventoryAdjustment.create({ data: { productId: product.id, createdById: userId, type, quantity: input.quantity, reason: input.reason } }),
      tx.stockMovement.create({ data: { productId: product.id, type, quantityDelta, reason: input.reason, createdById: userId } }),
    ]);
    return adjustment;
  });
}

export async function listStockMovements() {
  return prisma.stockMovement.findMany({
    include: { product: { select: { name: true } }, createdBy: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
