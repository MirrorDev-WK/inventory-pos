import { z } from "zod";

export const productInputSchema = z.object({
  sku: z.string().trim().min(1).max(40),
  barcode: z.string().trim().min(1).max(60).nullable().optional(),
  name: z.string().trim().min(1).max(140),
  categoryName: z.string().trim().min(1).max(60),
  costPriceSatang: z.number().int().min(0),
  sellingPriceSatang: z.number().int().min(0),
  reorderLevel: z.number().int().min(0),
});

export type ProductInput = z.infer<typeof productInputSchema>;
