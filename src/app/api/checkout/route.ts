import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { errorResponse } from "@/lib/api-response";
import { checkoutSchema } from "@/features/sales/checkout-schema";
import { checkoutSale } from "@/features/sales/sale-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const access = await getApiUser([Role.ADMIN, Role.CASHIER]);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
  try {
    const parsed = checkoutSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid checkout request.", details: parsed.error.flatten() }, { status: 422 });
    const sale = await checkoutSale(parsed.data, access.user.id);
    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    return errorResponse(error, "Unable to complete sale.");
  }
}
