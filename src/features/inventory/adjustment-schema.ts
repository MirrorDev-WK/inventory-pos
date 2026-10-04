import { z } from "zod";

export const inventoryAdjustmentSchema = z.object({
  productId: z.string().min(1),
  action: z.enum(["STOCK_IN", "STOCK_OUT", "STOCK_COUNT"]),
  quantity: z.number().int().min(0),
  reason: z.string().trim().min(3).max(280),
});

export type InventoryAdjustmentInput = z.infer<typeof inventoryAdjustmentSchema>;
