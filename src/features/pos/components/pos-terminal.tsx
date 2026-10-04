"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { demoProducts } from "@/features/catalog/demo-products";
import { formatSatang, parseThbToSatang } from "@/lib/money";
import { calculateSaleTotals, canIncreaseCartQuantity, type CartLine } from "../calculations";

type PosProduct = { id: string; name: string; categoryName: string; sellingPriceSatang: number; stockOnHand: number };

const fallbackProducts: PosProduct[] = demoProducts.map((product) => ({ id: product.id, name: product.name, categoryName: product.categoryName, sellingPriceSatang: product.sellingPrice * 100, stockOnHand: product.stockOnHand }));

function productToCartLine(product: PosProduct): CartLine {
  return { productId: product.id, productName: product.name, unitPriceSatang: product.sellingPriceSatang, quantity: 1, stockOnHand: product.stockOnHand };
}

export function PosTerminal() {
  const router = useRouter();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [products, setProducts] = useState<PosProduct[]>(fallbackProducts);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD">("CARD");
  const [cashReceived, setCashReceived] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totals = useMemo(() => calculateSaleTotals(cart), [cart]);

  useEffect(() => {
    fetch("/api/products").then(async (response) => response.ok ? response.json() : null).then((data: unknown) => {
      if (!Array.isArray(data)) return;
      const liveProducts = data.map((product) => ({ id: String(product.id), name: String(product.name), categoryName: String(product.category), sellingPriceSatang: parseThbToSatang(String(product.sellingPrice)) ?? 0, stockOnHand: Number(product.stockOnHand) }));
      setProducts(liveProducts);
    }).catch(() => undefined);
  }, []);

  function addProduct(product: PosProduct) {
    if (product.stockOnHand === 0) return;
    setCart((currentCart) => {
      const existingLine = currentCart.find((line) => line.productId === product.id);
      if (!existingLine) return [...currentCart, productToCartLine(product)];
      if (!canIncreaseCartQuantity(existingLine)) return currentCart;
      return currentCart.map((line) => line.productId === product.id ? { ...line, quantity: line.quantity + 1 } : line);
    });
  }

  function changeQuantity(productId: string, change: -1 | 1) {
    setCart((currentCart) => currentCart.flatMap((line) => {
      if (line.productId !== productId) return [line];
      if (change === -1) return line.quantity === 1 ? [] : [{ ...line, quantity: line.quantity - 1 }];
      return canIncreaseCartQuantity(line) ? [{ ...line, quantity: line.quantity + 1 }] : [line];
    }));
  }

  async function completeCheckout() {
    const cashReceivedSatang = paymentMethod === "CASH" ? parseThbToSatang(cashReceived) : undefined;
    if (paymentMethod === "CASH" && cashReceivedSatang === null) return setMessage("Enter cash received using a valid THB amount.");
    setIsSubmitting(true);
    setMessage(null);
    const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: cart.map((line) => ({ productId: line.productId, quantity: line.quantity })), paymentMethod, cashReceivedSatang }) });
    setIsSubmitting(false);
    const data = await response.json().catch(() => null);
    if (!response.ok) return setMessage(data?.error ?? "Payment could not be completed.");
    setMessage(`Payment complete · ${data.receiptNumber}${paymentMethod === "CASH" ? ` · Change ${formatSatang(data.changeSatang)}` : ""}`);
    setCart([]);
    setCashReceived("");
    router.push(`/receipts/${data.id}`);
  }

  return <div className="pos-layout"><section className="pos-products"><div className="pos-search"><input aria-label="Scan barcode or search products" placeholder="Scan barcode or search product" /><span>{products.length} products</span></div><div className="product-grid">{products.map((product) => <button className="product-tile" disabled={product.stockOnHand === 0} key={product.id} onClick={() => addProduct(product)} type="button"><span>{product.categoryName}</span><strong>{product.name}</strong><small>{product.stockOnHand} in stock</small><b>{formatSatang(product.sellingPriceSatang)}</b></button>)}</div></section><aside className="cart-panel"><div className="cart-heading"><div><p className="eyebrow">CURRENT SALE</p><h2>Cart</h2></div><button className="text-button" onClick={() => setCart([])} type="button">Clear</button></div><div className="cart-lines">{cart.length === 0 ? <p className="empty-cart">Add a product to begin a sale.</p> : cart.map((line) => <article className="cart-line" key={line.productId}><div><strong>{line.productName}</strong><span>{formatSatang(line.unitPriceSatang)} each</span></div><div className="cart-line-controls"><button aria-label={`Remove one ${line.productName}`} onClick={() => changeQuantity(line.productId, -1)} type="button">−</button><span>{line.quantity}</span><button aria-label={`Add one ${line.productName}`} disabled={!canIncreaseCartQuantity(line)} onClick={() => changeQuantity(line.productId, 1)} type="button">+</button></div><b>{formatSatang(line.unitPriceSatang * line.quantity)}</b></article>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{formatSatang(totals.subtotalSatang)}</strong></div><div><span>VAT included (7%)</span><strong>{formatSatang(totals.vatSatang)}</strong></div><div className="cart-total"><span>Total</span><strong>{formatSatang(totals.totalSatang)}</strong></div><div className="payment-options"><button className={paymentMethod === "CARD" ? "selected" : ""} onClick={() => setPaymentMethod("CARD")} type="button">Card</button><button className={paymentMethod === "CASH" ? "selected" : ""} onClick={() => setPaymentMethod("CASH")} type="button">Cash</button></div>{paymentMethod === "CASH" ? <label className="cash-input">Cash received (THB)<input inputMode="decimal" onChange={(event) => setCashReceived(event.target.value)} placeholder="0.00" value={cashReceived} /></label> : null}{message ? <p className="pos-message" role="status">{message}</p> : null}<button className="checkout-button" disabled={cart.length === 0 || isSubmitting} onClick={completeCheckout} type="button">{isSubmitting ? "Completing payment…" : `Complete ${paymentMethod.toLowerCase()} payment`}</button></div></aside></div>;
}
