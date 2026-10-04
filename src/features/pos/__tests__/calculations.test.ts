import { describe, expect, it } from "vitest";
import { calculateSaleTotals, canIncreaseCartQuantity } from "../calculations";
import { parseThbToSatang } from "@/lib/money";

describe("POS calculations", () => {
  it("calculates a VAT-inclusive total with no floating-point arithmetic", () => {
    const totals = calculateSaleTotals([{ productId: "p1", productName: "Water", unitPriceSatang: 1_500, quantity: 2, stockOnHand: 3 }]);

    expect(totals).toEqual({ subtotalSatang: 3_000, discountSatang: 0, totalSatang: 3_000, vatSatang: 196 });
  });

  it("never lets a discount make the total negative", () => {
    const totals = calculateSaleTotals([{ productId: "p1", productName: "Water", unitPriceSatang: 1_500, quantity: 1, stockOnHand: 1 }], 9_999);

    expect(totals.totalSatang).toBe(0);
    expect(totals.discountSatang).toBe(1_500);
  });

  it("prevents a cart quantity from exceeding current stock", () => {
    expect(canIncreaseCartQuantity({ productId: "p1", productName: "Water", unitPriceSatang: 1_500, quantity: 2, stockOnHand: 2 })).toBe(false);
  });

  it("parses THB input without converting through floating point", () => {
    expect(parseThbToSatang("107.50")).toBe(10_750);
    expect(parseThbToSatang("10.999")).toBeNull();
  });
});
