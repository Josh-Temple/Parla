import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { JapaneseSupportToggle } from "@/components/JapaneseSupportToggle";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "Parla",
  description: "High-tempo English phrase recall trainer",
  manifest: "/manifest.webmanifest",
  applicationName: "Parla",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Parla",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: "/icons/icon-192.svg",
    icon: [
      { url: "/icons/icon-192.svg", type: "image/svg+xml" },
      { url: "/icons/icon-512.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegistration />
        <header className="topnav">
          <div className="topnav-inner">
            <strong>Parla</strong>
            <nav className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/drill">Drill</Link>
              <Link href="/browse">Browse</Link>
              <Link href="/review">Review</Link>
              <JapaneseSupportToggle />
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
