import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const cormorant = localFont({
  src: [
    { path: "../fonts/cormorant-normal.woff2", weight: "300 700", style: "normal" },
    { path: "../fonts/cormorant-italic.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const jost = localFont({
  src: [{ path: "../fonts/jost.woff2", weight: "300 600", style: "normal" }],
  variable: "--font-jost",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vglow.ph"),
  title: {
    default: "V Glow PH — Velorian Luxxe White & AIVEE Cosmetics",
    template: "%s · V Glow PH",
  },
  description:
    "V Glow PH is the trusted Philippine store for Velorian Luxxe White and AIVEE Cosmetics. Shop Ultima, Enhanced Glutathione, Renew, Slim, Protect, the 01/02/03 skin bars, plus the Aivee Glass Ampoule, The One Cream, and Lumi SPF44 — sealed, FDA registered, and verified.",
  keywords: [
    "V Glow PH",
    "Velorian Luxxe White",
    "Luxxe White Ultima",
    "AIVEE Cosmetics",
    "Aivee Skin",
    "glutathione capsules",
    "Luxxe White soap",
    "Aivee Glass Ampoule",
  ],
  openGraph: {
    title: "V Glow PH — Velorian Luxxe White & AIVEE Cosmetics",
    description:
      "Authentic Velorian Luxxe White capsules and bars, plus clinic-grade AIVEE Cosmetics. Sealed, FDA registered, and verified by V Glow PH.",
    type: "website",
    images: ["/images/hero.jpg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="bg-ivory text-ink antialiased">
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
