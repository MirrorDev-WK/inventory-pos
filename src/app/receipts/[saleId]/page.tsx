import Link from "next/link";
import { requireUser } from "@/lib/authorization";
import { getReceipt } from "@/features/sales/sale-service";
import { formatDateTime, formatThb } from "@/lib/format";
import { PrintButton } from "@/features/sales/components/print-button";

export const dynamic = "force-dynamic";

export default async function ReceiptPage({ params }: { params: Promise<{ saleId: string }> }) {
  const user = await requireUser();
  const { saleId } = await params;
  const { sale, store } = await getReceipt(saleId, user.id, user.role);
  return <main className="receipt-page"><div className="receipt-actions no-print"><Link className="button secondary" href="/pos">New sale</Link><PrintButton /></div><article className="receipt"><header><h1>{store.name}</h1><p>{store.address}</p><p>Tax ID: {store.taxId}</p></header><div className="receipt-meta"><span>{sale.receiptNumber}</span><span>{formatDateTime(sale.createdAt.toISOString())}</span><span>Cashier: {sale.cashier.name}</span></div><table><thead><tr><th>Item</th><th>Qty</th><th>Total</th></tr></thead><tbody>{sale.items.map((item) => <tr key={item.id}><td>{item.productName}<small>{formatThb(Number(item.unitPrice))} each</small></td><td>{item.quantity}</td><td>{formatThb(Number(item.lineTotal))}</td></tr>)}</tbody></table><div className="receipt-totals"><div><span>Subtotal</span><strong>{formatThb(Number(sale.subtotal))}</strong></div>{Number(sale.discountAmount) > 0 ? <div><span>Discount</span><strong>−{formatThb(Number(sale.discountAmount))}</strong></div> : null}<div><span>VAT included (7%)</span><strong>{formatThb(Number(sale.vatAmount))}</strong></div><div className="receipt-grand-total"><span>Total</span><strong>{formatThb(Number(sale.total))}</strong></div><div><span>Payment</span><strong>{sale.paymentMethod}</strong></div>{sale.paymentMethod === "CASH" ? <><div><span>Cash received</span><strong>{formatThb(Number(sale.cashReceived))}</strong></div><div><span>Change</span><strong>{formatThb(Number(sale.changeGiven))}</strong></div></> : null}</div><footer>{store.receiptFooter}</footer></article></main>;
}
