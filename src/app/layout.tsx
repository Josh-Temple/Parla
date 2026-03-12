import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parla",
  description: "High-tempo English phrase recall trainer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="topnav">
          <div className="topnav-inner">
            <strong>Parla</strong>
            <nav className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/drill">Drill</Link>
              <Link href="/browse">Browse</Link>
              <Link href="/review">Review</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
