import { formatThb } from "@/lib/format";
import { getProductStockStatus, type ProductListItem } from "@/features/catalog/types";
import { StockStatusBadge } from "./status-badge";

export function ProductTable({ products }: { products: ProductListItem[] }) {
  return (
    <div className="table-wrap"><table><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead>
      <tbody>{products.map((product) => <tr key={product.id}><td><strong>{product.name}</strong><small>{product.barcode ?? "No barcode"}</small></td><td>{product.sku}</td><td>{product.categoryName}</td><td>{formatThb(product.sellingPrice)}</td><td>{product.stockOnHand} units</td><td><StockStatusBadge status={getProductStockStatus(product)} /></td></tr>)}</tbody>
    </table></div>
  );
}
