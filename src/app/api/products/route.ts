import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { errorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { productInputSchema } from "@/features/catalog/product-schemas";
import { createProduct } from "@/features/catalog/product-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const access = await getApiUser([Role.ADMIN, Role.CASHIER]);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });

  const products = await prisma.product.findMany({
    where: { archivedAt: null },
    orderBy: { name: "asc" },
    include: { category: { select: { name: true } } },
  });
  return NextResponse.json(products.map((product) => ({
    id: product.id,
    sku: product.sku,
    barcode: product.barcode,
    name: product.name,
    category: product.category.name,
    sellingPrice: product.sellingPrice.toFixed(2),
    stockOnHand: product.stockOnHand,
    reorderLevel: product.reorderLevel,
    ...(access.user.role === Role.ADMIN ? { costPrice: product.costPrice.toFixed(2) } : {}),
  })));
}

export async function POST(request: Request) {
  const access = await getApiUser([Role.ADMIN]);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
  try {
    const parsed = productInputSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid product input.", details: parsed.error.flatten() }, { status: 422 });
    const product = await createProduct(parsed.data);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return errorResponse(error, "Unable to create product.");
  }
}
