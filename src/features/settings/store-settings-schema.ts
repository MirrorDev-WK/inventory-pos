import { z } from "zod";

export const storeSettingsSchema = z.object({
  name: z.string().trim().min(1).max(120),
  address: z.string().trim().min(1).max(300),
  taxId: z.string().trim().min(1).max(60),
  receiptFooter: z.string().trim().max(300).nullable().optional(),
});
