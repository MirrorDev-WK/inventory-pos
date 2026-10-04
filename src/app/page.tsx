import Link from "next/link";

export default function Home() {
  return (
    <main className="welcome">
      <section>
        <p className="eyebrow">MINI-MARKET INVENTORY POS</p>
        <h1>Stockwise POS</h1>
        <p className="lead">Sell with confidence. Every transaction updates inventory, records VAT, and leaves an audit trail.</p>
        <div className="actions">
          <Link className="button primary" href="/login">Open demo</Link>
          <Link className="button secondary" href="/dashboard">View dashboard</Link>
        </div>
      </section>
      <aside className="scope-card">
        <strong>MVP foundation</strong>
        <ul>
          <li>Admin and Cashier roles</li>
          <li>Inventory movement ledger</li>
          <li>VAT-inclusive checkout</li>
          <li>Stock-safe sales and voids</li>
        </ul>
      </aside>
    </main>
  );
}
