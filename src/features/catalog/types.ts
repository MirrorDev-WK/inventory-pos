export type ProductStockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export type ProductListItem = {
  id: string;
  sku: string;
  barcode: string | null;
  name: string;
  categoryName: string;
  sellingPrice: number;
  stockOnHand: number;
  reorderLevel: number;
};

export function getProductStockStatus(product: Pick<ProductListItem, "stockOnHand" | "reorderLevel">): ProductStockStatus {
  if (product.stockOnHand === 0) return "OUT_OF_STOCK";
  if (product.stockOnHand <= product.reorderLevel) return "LOW_STOCK";
  return "IN_STOCK";
}
