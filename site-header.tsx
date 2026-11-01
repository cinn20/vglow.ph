"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./cart/cart-context";

const navLinks = [
  { href: "/shop", label: "Shop all" },
  { href: "/shop?collection=glow-capsules", label: "Luxxe capsules" },
  { href: "/shop?collection=skin-bars", label: "Luxxe bars" },
  { href: "/shop?collection=aivee", label: "AIVEE" },
  { href: "/shop?category=sets", label: "Bundles" },
  { href: "/about", label: "Our story" },
];

const mobileCollections = [
  { href: "/shop?collection=glow-capsules", label: "Velorian Luxxe Capsules" },
  { href: "/shop?collection=skin-bars", label: "Velorian Luxxe 01 · 02 · 03 Bars" },
  { href: "/shop?collection=facial-ritual", label: "Brilliant Facial Ritual" },
  { href: "/shop?collection=aivee", label: "AIVEE Cosmetics" },
  { href: "/shop?category=sets", label: "Sets & Bundles" },
  { href: "/shop?sort=rating", label: "Top rated" },
];

export function SiteHeader() {
  const { itemCount, openCart, hydrated } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : "/shop");
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <>
      <div className="bg-ink text-ivory/90">
        <div className="relative flex h-9 items-center overflow-hidden">
          <div className="marquee-track gap-12 whitespace-nowrap text-[10px] uppercase tracking-[0.26em]">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center gap-12" aria-hidden={copy === 1}>
                <span>Free nationwide shipping over ₱2,000</span>
                <span className="text-gold-soft">✦</span>
                <span>Use GLOW10 for 10% off your first order</span>
                <span className="text-gold-soft">✦</span>
                <span>Velorian Luxxe White · AIVEE Cosmetics</span>
                <span className="text-gold-soft">✦</span>
                <span>Sealed & verified · ships from Makati in 24h</span>
                <span className="text-gold-soft">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-ink/10 bg-ivory/95 shadow-[0_10px_30px_-24px_rgba(34,28,23,0.5)] backdrop-blur-md"
            : "border-transparent bg-ivory"
        }`}
      >
        <div className="container-luxe">
          <div className="flex h-[68px] items-center justify-between gap-4 md:h-[78px]">
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="p-2 text-ink"
                aria-label="Open menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <Link href="/" className="group flex flex-col items-center leading-none lg:items-start">
              <span className="font-display text-[24px] tracking-[0.16em] text-ink md:text-[29px] md:tracking-[0.2em]">
                V GLOW
              </span>
              <span className="mt-[3px] text-[7px] uppercase tracking-[0.26em] text-gold md:text-[8px] md:tracking-[0.3em]">
                Luxxe White &amp; AIVEE · PH
              </span>
            </Link>

            <nav className="hidden items-center gap-6 lg:flex xl:gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="link-underline text-[11px] uppercase tracking-[0.2em] text-espresso/80 transition hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 md:gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen((open) => !open)}
                className="p-2 text-ink transition hover:text-gold"
                aria-label="Search products"
                aria-expanded={searchOpen}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m16 16 4.5 4.5" strokeLinecap="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={openCart}
                className="relative flex items-center gap-2 p-2 text-ink transition hover:text-gold"
                aria-label={`Open cart with ${itemCount} items`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <path d="M6 8h12l-1.2 12H7.2L6 8Z" />
                  <path d="M9 8a3 3 0 0 1 6 0" />
                </svg>
                <span
                  className={`flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] tabular-nums transition ${
                    hydrated && itemCount > 0 ? "bg-gold text-white" : "bg-cream text-mocha"
                  }`}
                  aria-hidden
                >
                  {hydrated ? itemCount : 0}
                </span>
              </button>
            </div>
          </div>

          <div
            className={`grid overflow-hidden transition-all duration-300 ${
              searchOpen ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <form onSubmit={submitSearch} className="min-h-0">
              <div className="flex items-center gap-3 border-b border-ink/20 pb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-mocha">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m16 16 4.5 4.5" strokeLinecap="round" />
                </svg>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search capsules, bars, sets…"
                  aria-label="Search products"
                  className="w-full bg-transparent py-1 text-sm outline-none placeholder:text-mocha/70"
                  autoFocus={searchOpen}
                />
                <button type="submit" className="text-[10px] uppercase tracking-[0.2em] text-gold">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-espresso/40 backdrop-blur-[2px] animate-fade-in"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[86%] max-w-[360px] overflow-y-auto bg-ivory px-6 py-6 shadow-lift animate-slide-in">
            <div className="flex items-center justify-between">
              <span className="flex flex-col leading-none">
                <span className="font-display text-2xl tracking-[0.16em]">V GLOW</span>
                <span className="mt-1 text-[7px] uppercase tracking-[0.24em] text-gold">
                  Luxxe White &amp; AIVEE · PH
                </span>
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-2 text-mocha"
                aria-label="Close menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="mt-8 space-y-1">
              {[{ href: "/shop", label: "Shop all" }, ...mobileCollections, { href: "/about", label: "Our story" }].map(
                (link, index) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between border-b border-ink/10 py-3.5 font-display text-xl text-espresso"
                  >
                    {link.label}
                    <span className="text-[10px] tabular-nums tracking-[0.2em] text-gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>
                ),
              )}
            </nav>

            <div className="mt-8 border border-gold/30 bg-cream/60 p-5">
              <p className="eyebrow">The ritual</p>
              <p className="mt-2 quote-serif text-lg leading-snug text-espresso">
                “Velorian Luxxe White & AIVEE, sealed and verified.”
              </p>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openCart();
                }}
                className="btn btn-primary mt-4 w-full"
              >
                View bag ({hydrated ? itemCount : 0})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
