import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pos", label: "POS" },
  { href: "/products", label: "Products" },
  { href: "/inventory", label: "Inventory" },
  { href: "/sales", label: "Sales" },
  { href: "/settings", label: "Settings" },
];

type AppShellProps = { children: ReactNode; title: string; description: string; userName: string; userRole: "ADMIN" | "CASHIER"; action?: ReactNode };

export function AppShell({ children, title, description, userName, userRole, action }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/dashboard">Stockwise <span>POS</span></Link>
        <nav aria-label="Main navigation">{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
        <div className="account"><strong>{userName}</strong><span>{userRole === "ADMIN" ? "Administrator" : "Cashier"}</span></div>
      </aside>
      <main className="app-main">
        <header className="page-header"><div><p className="eyebrow">MINI-MARKET · ADMIN</p><h1>{title}</h1><p>{description}</p></div>{action}</header>
        {children}
      </main>
    </div>
  );
}
