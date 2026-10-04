import { PosTerminal } from "@/features/pos/components/pos-terminal";
import { requireUser } from "@/lib/authorization";

export const dynamic = "force-dynamic";

export default async function PosPage() {
  const user = await requireUser();
  return <main className="pos-page"><header><div><p className="eyebrow">CASHIER TERMINAL</p><h1>New sale</h1></div><p>Prices include 7% VAT · Cashier: {user.name ?? user.email}</p></header><PosTerminal /></main>;
}
