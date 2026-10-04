import type { ProductStockStatus } from "@/features/catalog/types";

const labels: Record<ProductStockStatus, string> = {
  IN_STOCK: "In stock",
  LOW_STOCK: "Low stock",
  OUT_OF_STOCK: "Out of stock",
};

export function StockStatusBadge({ status }: { status: ProductStockStatus }) {
  return <span className={`status status-${status.toLowerCase().replace("_", "-")}`}>{labels[status]}</span>;
}
