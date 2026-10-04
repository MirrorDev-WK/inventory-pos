import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stockwise POS",
  description: "Inventory POS for a mini-market",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
