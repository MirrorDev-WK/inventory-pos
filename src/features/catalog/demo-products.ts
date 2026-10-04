import type { ProductListItem } from "./types";

export const demoProducts: ProductListItem[] = [
  { id: "p-001", sku: "DRK-001", barcode: "8850123456789", name: "Sparkling Water 500 ml", categoryName: "Drinks", sellingPrice: 15, stockOnHand: 26, reorderLevel: 8 },
  { id: "p-002", sku: "SNK-001", barcode: "8850123456796", name: "Seaweed Crisps", categoryName: "Snacks", sellingPrice: 25, stockOnHand: 5, reorderLevel: 6 },
  { id: "p-003", sku: "HOU-001", barcode: "8850123456802", name: "Kitchen Towel Roll", categoryName: "Household", sellingPrice: 45, stockOnHand: 0, reorderLevel: 4 },
  { id: "p-004", sku: "PER-001", barcode: null, name: "Hand Sanitiser 50 ml", categoryName: "Personal Care", sellingPrice: 39, stockOnHand: 14, reorderLevel: 5 },
];
