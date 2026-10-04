"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { parseThbToSatang } from "@/lib/money";

export function ProductForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const costPriceSatang = parseThbToSatang(String(form.get("costPrice")));
    const sellingPriceSatang = parseThbToSatang(String(form.get("sellingPrice")));
    if (costPriceSatang === null || sellingPriceSatang === null) return setError("Enter prices with up to two decimal places.");
    setIsSubmitting(true);
    setError(null);
    const response = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sku: form.get("sku"), barcode: form.get("barcode") || null, name: form.get("name"), categoryName: form.get("category"), costPriceSatang, sellingPriceSatang, reorderLevel: Number(form.get("reorderLevel")) }) });
    setIsSubmitting(false);
    if (!response.ok) return setError((await response.json().catch(() => null))?.error ?? "Unable to create product.");
    router.push("/products");
    router.refresh();
  }

  return <form className="data-form" onSubmit={submit}><label>Product name<input name="name" required /></label><label>SKU<input name="sku" required /></label><label>Barcode <span>(optional)</span><input name="barcode" /></label><label>Category<input name="category" required placeholder="Drinks" /></label><label>Cost price (THB)<input inputMode="decimal" name="costPrice" required placeholder="0.00" /></label><label>Selling price (THB, VAT included)<input inputMode="decimal" name="sellingPrice" required placeholder="0.00" /></label><label>Low-stock level<input min="0" name="reorderLevel" required type="number" defaultValue="5" /></label>{error ? <p className="form-error" role="alert">{error}</p> : null}<div className="form-actions"><button className="button secondary" onClick={() => router.back()} type="button">Cancel</button><button disabled={isSubmitting} type="submit">{isSubmitting ? "Saving…" : "Save product"}</button></div></form>;
}
