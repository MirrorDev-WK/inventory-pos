import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ProductInput } from "./product-schemas";

function toMoney(satang: number): Prisma.Decimal {
  return new Prisma.Decimal(satang).div(100);
}

export async function createProduct(input: ProductInput) {
  const category = await prisma.category.upsert({ where: { name: input.categoryName }, update: {}, create: { name: input.categoryName } });
  return prisma.product.create({
    data: {
      sku: input.sku,
      barcode: input.barcode || null,
      name: input.name,
      categoryId: category.id,
      costPrice: toMoney(input.costPriceSatang),
      sellingPrice: toMoney(input.sellingPriceSatang),
      reorderLevel: input.reorderLevel,
    },
  });
}

export async function archiveProduct(productId: string) {
  return prisma.product.update({ where: { id: productId, archivedAt: null }, data: { archivedAt: new Date() } });
}

export async function listProductListItems() {
  const products = await prisma.product.findMany({ where: { archivedAt: null }, include: { category: true }, orderBy: { name: "asc" } });
  return products.map((product) => ({ id: product.id, sku: product.sku, barcode: product.barcode, name: product.name, categoryName: product.category.name, sellingPrice: Number(product.sellingPrice), sellingPriceSatang: Number(product.sellingPrice.mul(100).toFixed(0)), stockOnHand: product.stockOnHand, reorderLevel: product.reorderLevel }));
}
