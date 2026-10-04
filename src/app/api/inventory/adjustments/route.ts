import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { errorResponse } from "@/lib/api-response";
import { inventoryAdjustmentSchema } from "@/features/inventory/adjustment-schema";
import { createInventoryAdjustment } from "@/features/inventory/adjustment-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const access = await getApiUser([Role.ADMIN]);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
  try {
    const parsed = inventoryAdjustmentSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid inventory adjustment.", details: parsed.error.flatten() }, { status: 422 });
    const adjustment = await createInventoryAdjustment(parsed.data, access.user.id);
    return NextResponse.json(adjustment, { status: 201 });
  } catch (error) {
    return errorResponse(error, "Unable to adjust inventory.");
  }
}
