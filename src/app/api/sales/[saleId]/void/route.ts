import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { errorResponse } from "@/lib/api-response";
import { voidSaleSchema } from "@/features/sales/checkout-schema";
import { voidSale } from "@/features/sales/sale-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ saleId: string }> }) {
  const access = await getApiUser([Role.ADMIN]);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
  try {
    const parsed = voidSaleSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "A void reason is required.", details: parsed.error.flatten() }, { status: 422 });
    const { saleId } = await params;
    const sale = await voidSale(saleId, parsed.data.reason, access.user.id);
    return NextResponse.json({ id: sale.id, receiptNumber: sale.receiptNumber, status: sale.status });
  } catch (error) {
    return errorResponse(error, "Unable to void sale.");
  }
}
