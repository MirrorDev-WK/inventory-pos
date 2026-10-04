"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function VoidSaleButton({ saleId }: { saleId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isVoiding, setIsVoiding] = useState(false);

  async function handleVoid() {
    const reason = window.prompt("Why is this sale being voided?");
    if (!reason) return;
    setIsVoiding(true);
    setError(null);
    const response = await fetch(`/api/sales/${saleId}/void`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason }) });
    setIsVoiding(false);
    if (!response.ok) return setError((await response.json().catch(() => null))?.error ?? "Unable to void sale.");
    router.refresh();
  }

  return <span>{error ? <small className="form-error">{error}</small> : null}<button className="text-button" disabled={isVoiding} onClick={handleVoid} type="button">{isVoiding ? "Voiding…" : "Void"}</button></span>;
}
