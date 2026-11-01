import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { FilterPanel, MobileFilterTrigger, SortSelect } from "@/components/shop/shop-controls";
import { getCatalog, getProducts } from "@/lib/data";
import { collectionFilters, parseShopParams, priceBands, type SearchParamsRecord } from "@/lib/shop-params";
import { collectionLabel } from "@/lib/product";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Velorian Luxxe White & AIVEE Cosmetics",
  description:
    "Browse every product at V Glow PH — Velorian Luxxe White Ultima, Enhanced Glutathione, Renew, Slim, Protect, the 01 · 02 · 03 bars, plus AIVEE Cosmetics' Glass Ampoule, The One Cream, Lumi SPF44, Crystal Mask, and clinic kits. Filter by concern, category, and price.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>;
}) {
  const resolved = await searchParams;
  const { collection, category, sort, q, concerns, price } = parseShopParams(resolved);

  const [catalog, products] = await Promise.all([
    getCatalog(),
    getProducts({
      collection: collection || undefined,
      category: category || undefined,
      concerns: concerns.length ? concerns : undefined,
      minPriceCents: price?.min,
      maxPriceCents: price?.max,
      search: q || undefined,
      sort,
    }),
  ]);

  const categoryCounts = catalog.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1;
    return acc;
  }, {});
  const collectionCounts = catalog.reduce<Record<string, number>>((acc, product) => {
    acc[product.collection] = (acc[product.collection] ?? 0) + 1;
    return acc;
  }, {});

  const activeChips = [
    collection ? { label: collectionLabel[collection] ?? collection, key: "collection" } : null,
    category
      ? { label: category.replace("-", " ").replace(/\b\w/g, (m) => m.toUpperCase()), key: "category" }
      : null,
    priceBands.find((band) => band.value === price?.value)?.label
      ? { label: priceBands.find((band) => band.value === price?.value)!.label, key: "price" }
      : null,
  ].filter(Boolean) as { label: string; key: string }[];

  const heading = q
    ? `Results for “${q}”`
    : collection
      ? collectionLabel[collection] ?? "The collection"
      : category === "sets"
        ? "Sets & gifting"
        : "Velorian Luxxe White & AIVEE Cosmetics";

  return (
    <div>
      <section className="border-b border-ink/10 bg-cream">
        <div className="container-luxe py-12 md:py-16">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-mocha">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <span>/</span>
            <span className="text-espresso">Shop</span>
          </nav>
          <div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="font-display text-[clamp(2.3rem,5vw,3.8rem)] leading-[1.02]">{heading}</h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-mocha">
                Velorian Luxxe White capsules and bars alongside clinic-grade AIVEE Cosmetics — sealed,
                FDA registered, and verified before it ships. Filter by concern to build your routine.
              </p>
            </div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-mocha">
              {products.length} {products.length === 1 ? "product" : "products"}
              {catalog.length > products.length ? ` of ${catalog.length}` : ""}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="container-luxe no-scrollbar flex gap-2 overflow-x-auto py-4">
          {collectionFilters.map((option) => {
            const active = (collection || "") === option.value;
            return (
              <Link
                key={option.value || "all"}
                href={option.value ? `/shop?collection=${option.value}` : "/shop"}
                className={`shrink-0 border px-4 py-2 text-[10px] uppercase tracking-[0.16em] transition ${
                  active
                    ? "border-ink bg-ink text-ivory"
                    : "border-ink/15 text-espresso hover:border-ink/50"
                }`}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </section>

      <div className="container-luxe py-10 lg:py-14">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <Suspense fallback={<div className="h-8" />}>
                <FilterPanel categoryCounts={categoryCounts} collectionCounts={collectionCounts} />
              </Suspense>
              <div className="mt-8 border border-gold/30 bg-cream/60 p-5">
                <p className="eyebrow">Not sure where to start?</p>
                <p className="mt-2 quote-serif text-lg leading-snug">
                  “Begin with Ultima. It&apos;s the one that changes everything.”
                </p>
                <Link
                  href="/products/luxxe-white-ultima"
                  className="link-underline mt-3 inline-block text-[10px] uppercase tracking-[0.16em] text-gold"
                >
                  Shop the complete ritual
                </Link>
              </div>
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
              <div className="flex items-center gap-3">
                <Suspense fallback={<div className="h-8 w-20" />}>
                  <MobileFilterTrigger
                    categoryCounts={categoryCounts}
                    collectionCounts={collectionCounts}
                  />
                </Suspense>
                <p className="text-[11px] uppercase tracking-[0.16em] text-mocha">
                  Showing {products.length} {products.length === 1 ? "product" : "products"}
                </p>
              </div>
              <Suspense fallback={<div className="h-8 w-28" />}>
                <SortSelect />
              </Suspense>
            </div>

            {(activeChips.length > 0 || q || concerns.length > 0) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {q && (
                  <span className="border border-ink/15 bg-cream px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-espresso">
                    “{q}”
                  </span>
                )}
                {activeChips.map((chip) => (
                  <span
                    key={chip.key}
                    className="border border-ink/15 bg-cream px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-espresso"
                  >
                    {chip.label}
                  </span>
                ))}
                {concerns.map((concern) => (
                  <span
                    key={concern}
                    className="border border-ink/15 bg-cream px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-espresso"
                  >
                    {concern.replace("-", " ")}
                  </span>
                ))}
                <Link
                  href="/shop"
                  className="text-[10px] uppercase tracking-[0.14em] text-mocha underline decoration-ink/20 underline-offset-4 hover:text-ink"
                >
                  Reset
                </Link>
              </div>
            )}

            {products.length === 0 ? (
              <div className="mt-16 flex flex-col items-center justify-center gap-4 border border-dashed border-ink/15 px-6 py-20 text-center">
                <p className="font-display text-3xl">Nothing here — yet.</p>
                <p className="max-w-sm text-sm text-mocha">
                  We couldn&apos;t find a match for those filters. Try widening your search, or let us
                  point you to the icons everyone starts with.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/shop" className="btn btn-primary">
                    Clear filters
                  </Link>
                  <Link href="/shop?sort=rating" className="btn btn-outline">
                    Shop top rated
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:gap-x-6 lg:grid-cols-3">
                {products.map((product, index) => (
                  <Reveal key={product.id} delay={Math.min(index, 5) * 70}>
                    <ProductCard product={product} priority={index < 3} />
                  </Reveal>
                ))}
              </div>
            )}

            <div className="mt-16 flex flex-col items-center justify-between gap-5 border border-ink/10 bg-parchment/50 px-6 py-8 text-center sm:flex-row sm:text-left">
              <div>
                <p className="eyebrow">Two houses, one box</p>
                <p className="mt-2 font-display text-2xl leading-tight">
                  Try both: Luxxe White and AIVEE.
                </p>
                <p className="mt-1 text-[13px] text-mocha">
                  Start with Ultima capsules and the 01 · 02 · 03 bars, then add the AIVEE Glass
                  Ampoule when you want clinic-grade. Sealed and shipped free over ₱2,000.
                </p>
              </div>
              <Link href="/shop?collection=aivee" className="btn btn-gold shrink-0">
                Shop AIVEE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
