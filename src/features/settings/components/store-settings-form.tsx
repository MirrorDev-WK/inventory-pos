"use client";

import { FormEvent, useState } from "react";

type StoreSettingsValues = { name: string; address: string; taxId: string; receiptFooter: string | null };

export function StoreSettingsForm({ initialValues }: { initialValues: StoreSettingsValues }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setIsSubmitting(true);
    setMessage(null);
    const response = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), address: form.get("address"), taxId: form.get("taxId"), receiptFooter: form.get("receiptFooter") || null }) });
    setIsSubmitting(false);
    setMessage(response.ok ? "Store settings saved." : (await response.json().catch(() => null))?.error ?? "Unable to save settings.");
  }

  return <form className="data-form" onSubmit={submit}><label>Store name<input defaultValue={initialValues.name} name="name" required /></label><label>Address<textarea defaultValue={initialValues.address} name="address" required rows={3} /></label><label>Tax ID<input defaultValue={initialValues.taxId} name="taxId" required /></label><label>Receipt footer <span>(optional)</span><textarea defaultValue={initialValues.receiptFooter ?? ""} name="receiptFooter" rows={3} /></label>{message ? <p className="pos-message" role="status">{message}</p> : null}<div className="form-actions"><button disabled={isSubmitting} type="submit">{isSubmitting ? "Saving…" : "Save store settings"}</button></div></form>;
}
