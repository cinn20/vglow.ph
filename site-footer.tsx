import Link from "next/link";
import { NewsletterForm } from "./newsletter-form";

const shopLinks = [
  { href: "/shop", label: "All products" },
  { href: "/shop?collection=glow-capsules", label: "Velorian Luxxe Capsules" },
  { href: "/shop?collection=skin-bars", label: "Velorian Luxxe Bars" },
  { href: "/shop?collection=facial-ritual", label: "Brilliant Facial Ritual" },
  { href: "/shop?collection=aivee", label: "AIVEE Cosmetics" },
  { href: "/shop?category=sets", label: "Sets & bundles" },
];

const helpLinks = [
  { href: "/help#shipping", label: "Shipping & delivery" },
  { href: "/help#returns", label: "Returns & exchanges" },
  { href: "/help#contact", label: "Contact us" },
  { href: "/help#track", label: "Track my order" },
  { href: "/help#faq", label: "FAQs" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-espresso text-ivory">
      <div className="container-luxe grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="lg:pr-8">
          <Link href="/" className="inline-flex flex-col leading-none">
            <span className="font-display text-3xl tracking-[0.18em]">V GLOW</span>
            <span className="mt-1 text-[8px] uppercase tracking-[0.3em] text-gold-soft">
              Luxxe White &amp; AIVEE · PH
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/60">
            The trusted Philippine store for Velorian Luxxe White and AIVEE Cosmetics. Enhanced
            glutathione capsules, the 01 · 02 · 03 bars, the Brilliant facial ritual, and Aivee Skin
            clinic-grade care — sealed and verified before it ships.
          </p>
          <div className="mt-6 flex gap-3">
            {["Instagram", "TikTok", "Facebook"].map((label) => (
              <a
                key={label}
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/20 text-[9px] uppercase tracking-wider text-ivory/70 transition hover:border-gold-soft hover:text-gold-soft"
              >
                {label.slice(0, 2)}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] uppercase tracking-[0.28em] text-gold-soft">Shop</h3>
          <ul className="mt-5 space-y-3">
            {shopLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-ivory/65 transition hover:text-ivory"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[10px] uppercase tracking-[0.28em] text-gold-soft">Care</h3>
          <ul className="mt-5 space-y-3">
            {helpLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-ivory/65 transition hover:text-ivory"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-ivory/45">
            V Glow PH · 24 Cordova St.,
            <br />
            Makati City, Metro Manila
            <br />
            hello@vglow.ph · +63 917 555 0132
          </p>
        </div>

        <div>
          <h3 className="text-[10px] uppercase tracking-[0.28em] text-gold-soft">
            The inside glow
          </h3>
          <p className="mt-4 mb-4 text-sm text-ivory/60">
            Join 18,000+ subscribers for restock alerts, ritual notes, and 10% off your first order.
          </p>
          <NewsletterForm variant="dark" />
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-luxe flex flex-col items-center justify-between gap-4 py-6 text-[10px] uppercase tracking-[0.18em] text-ivory/40 md:flex-row">
          <p>© {new Date().getFullYear()} V Glow PH. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span>GCash</span>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>COD</span>
            <span>FDA registered · CPR verified</span>
          </div>
          <div className="flex gap-4">
            <Link href="/about" className="transition hover:text-ivory">
              Privacy
            </Link>
            <Link href="/about" className="transition hover:text-ivory">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
