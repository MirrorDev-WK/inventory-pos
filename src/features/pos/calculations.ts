import { calculateIncludedVat } from "@/lib/money";

export type CartLine = {
  productId: string;
  productName: string;
  unitPriceSatang: number;
  quantity: number;
  stockOnHand: number;
};

export type SaleTotals = {
  subtotalSatang: number;
  discountSatang: number;
  totalSatang: number;
  vatSatang: number;
};

export function calculateSaleTotals(lines: CartLine[], discountSatang = 0): SaleTotals {
  const subtotalSatang = lines.reduce((total, line) => total + line.unitPriceSatang * line.quantity, 0);
  const safeDiscountSatang = Math.min(Math.max(discountSatang, 0), subtotalSatang);
  const totalSatang = subtotalSatang - safeDiscountSatang;

  return { subtotalSatang, discountSatang: safeDiscountSatang, totalSatang, vatSatang: calculateIncludedVat(totalSatang) };
}

export function canIncreaseCartQuantity(line: CartLine): boolean {
  return line.quantity < line.stockOnHand;
}
