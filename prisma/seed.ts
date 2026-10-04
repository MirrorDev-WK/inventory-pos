import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const productSeeds = [
  { sku: "DRK-001", barcode: "8850123456789", name: "Sparkling Water 500 ml", category: "Drinks", costPrice: 8, sellingPrice: 15, stockOnHand: 26, reorderLevel: 8 },
  { sku: "SNK-001", barcode: "8850123456796", name: "Seaweed Crisps", category: "Snacks", costPrice: 13, sellingPrice: 25, stockOnHand: 5, reorderLevel: 6 },
  { sku: "HOU-001", barcode: "8850123456802", name: "Kitchen Towel Roll", category: "Household", costPrice: 29, sellingPrice: 45, stockOnHand: 0, reorderLevel: 4 },
  { sku: "PER-001", barcode: null, name: "Hand Sanitiser 50 ml", category: "Personal Care", costPrice: 22, sellingPrice: 39, stockOnHand: 14, reorderLevel: 5 },
];

async function main() {
  const passwordHash = await bcrypt.hash("DemoPass123!", 12);
  const admin = await prisma.user.upsert({ where: { email: "admin@stockwise.demo" }, update: {}, create: { email: "admin@stockwise.demo", name: "Niran Admin", passwordHash, role: Role.ADMIN } });
  await prisma.user.upsert({ where: { email: "mali@stockwise.demo" }, update: {}, create: { email: "mali@stockwise.demo", name: "Mali Cashier", passwordHash, role: Role.CASHIER } });
  await prisma.user.upsert({ where: { email: "somchai@stockwise.demo" }, update: {}, create: { email: "somchai@stockwise.demo", name: "Somchai Cashier", passwordHash, role: Role.CASHIER } });
  await prisma.storeSettings.upsert({ where: { id: "default-store" }, update: {}, create: { id: "default-store", name: "Stockwise Mini-Mart", address: "สุขุมวิท, Bangkok 10110", taxId: "0105550123456", receiptFooter: "Thank you for shopping with us." } });

  for (const seed of productSeeds) {
    const { category: categoryName, ...productData } = seed;
    const category = await prisma.category.upsert({ where: { name: categoryName }, update: {}, create: { name: categoryName } });
    const product = await prisma.product.upsert({ where: { sku: productData.sku }, update: {}, create: { ...productData, categoryId: category.id } });
    const movementExists = await prisma.stockMovement.findFirst({ where: { productId: product.id, type: "STOCK_COUNT", reason: "Initial demo stock" } });
    if (!movementExists) await prisma.stockMovement.create({ data: { productId: product.id, type: "STOCK_COUNT", quantityDelta: seed.stockOnHand, reason: "Initial demo stock", createdById: admin.id } });
  }
}

main().finally(async () => prisma.$disconnect());
