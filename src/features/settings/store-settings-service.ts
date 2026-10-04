import { prisma } from "@/lib/prisma";
import type { z } from "zod";
import { storeSettingsSchema } from "./store-settings-schema";

type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;

export function getStoreSettings() {
  return prisma.storeSettings.findUnique({ where: { id: "default-store" } });
}

export function saveStoreSettings(input: StoreSettingsInput) {
  return prisma.storeSettings.upsert({ where: { id: "default-store" }, update: input, create: { id: "default-store", ...input } });
}
