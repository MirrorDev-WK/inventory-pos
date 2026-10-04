import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { errorResponse } from "@/lib/api-response";
import { getStoreSettings, saveStoreSettings } from "@/features/settings/store-settings-service";
import { storeSettingsSchema } from "@/features/settings/store-settings-schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const access = await getApiUser([Role.ADMIN]);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
  return NextResponse.json(await getStoreSettings());
}

export async function PUT(request: Request) {
  const access = await getApiUser([Role.ADMIN]);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
  try {
    const parsed = storeSettingsSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid store settings.", details: parsed.error.flatten() }, { status: 422 });
    return NextResponse.json(await saveStoreSettings(parsed.data));
  } catch (error) {
    return errorResponse(error, "Unable to update settings.");
  }
}
