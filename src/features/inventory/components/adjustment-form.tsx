"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ProductOption = { id: string; name: string; sku: string };

export function AdjustmentForm() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/products").then(async (response) => response.ok ? response.json() : []).then((data: ProductOption[]) => setProducts(data)).catch(() => setError("Unable to load products."));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    setIsSubmitting(true);
    const response = await fetch("/api/inventory/adjustments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: form.get("productId"), action: form.get("action"), quantity: Number(form.get("quantity")), reason: form.get("reason") }) });
    setIsSubmitting(false);
    if (!response.ok) return setError((await response.json().catch(() => null))?.error ?? "Unable to save adjustment.");
    router.push("/inventory");
    router.refresh();
  }

  return <form className="data-form" onSubmit={submit}><label>Product<select disabled={products.length === 0} name="productId" required><option value="">Select a product</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name} ({product.sku})</option>)}</select></label><label>Adjustment type<select name="action"><option value="STOCK_IN">Stock in</option><option value="STOCK_OUT">Stock out</option><option value="STOCK_COUNT">Set verified stock count</option></select></label><label>Quantity<input min="0" name="quantity" required type="number" /></label><label>Reason<textarea minLength={3} name="reason" required rows={4} /></label>{error ? <p className="form-error" role="alert">{error}</p> : null}<div className="form-actions"><button className="button secondary" onClick={() => router.back()} type="button">Cancel</button><button disabled={isSubmitting || products.length === 0} type="submit">{isSubmitting ? "Saving…" : "Save adjustment"}</button></div></form>;
}
