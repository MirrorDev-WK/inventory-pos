import { z } from "zod";

export const checkoutSchema = z.object({
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().positive() })).min(1),
  paymentMethod: z.enum(["CASH", "CARD"]),
  cashReceivedSatang: z.number().int().nonnegative().optional(),
  discountSatang: z.number().int().nonnegative().default(0),
  discountReason: z.string().trim().max(280).optional(),
}).superRefine((value, context) => {
  if (value.discountSatang > 0 && !value.discountReason) context.addIssue({ code: "custom", path: ["discountReason"], message: "A discount reason is required." });
  if (value.paymentMethod === "CASH" && value.cashReceivedSatang === undefined) context.addIssue({ code: "custom", path: ["cashReceivedSatang"], message: "Cash received is required for cash payments." });
});

export const voidSaleSchema = z.object({ reason: z.string().trim().min(3).max(280) });

export type CheckoutInput = z.infer<typeof checkoutSchema>;
