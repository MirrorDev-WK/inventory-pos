export const VAT_BASIS_POINTS = 700;
export const VAT_INCLUSIVE_DIVISOR = 10_000 + VAT_BASIS_POINTS;

export function formatSatang(satang: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(satang / 100);
}

export function calculateIncludedVat(totalSatang: number): number {
  return Math.round((totalSatang * VAT_BASIS_POINTS) / VAT_INCLUSIVE_DIVISOR);
}

export function parseThbToSatang(value: string): number | null {
  const normalized = value.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const [whole, fraction = ""] = normalized.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}
