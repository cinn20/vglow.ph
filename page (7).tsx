import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { StarRating } from "@/components/star-rating";
import { NewsletterForm } from "@/components/newsletter-form";
import { collections } from "@/db/seed-data";
import { getBestsellers, getFeaturedProducts, getStoreStats, getTopReviews } from "@/lib/data";
import { formatMoney } from "@/lib/pricing";
import { compareAtFor, defaultSizeFor, ratingValue } from "@/lib/product";

export const dynamic = "force-dynamic";

const values = [
  { label: "Two houses, one store", note: "Velorian Luxxe White & AIVEE" },
  { label: "FDA registered", note: "CPR verified · cGMP labs" },
  { label: "No shortcuts", note: "No hydroquinone, no mercury" },
  { label: "Free shipping", note: "On all orders over ₱2,000" },
];

const ritualSteps = [
  {
    step: "01",
    title: "Brighten within",
    body: "One Velorian Luxxe White Ultima capsule with breakfast — 1400 mg of enhanced glutathione plus collagen doing the quiet work.",
    product: "Luxxe White Ultima",
  },
  {
    step: "02",
    title: "Lather & lift",
    body: "The 01 Kojic bar daily, the 02 oatmeal exfoliant twice a week, the 03 orange papaya bar for the body.",
    product: "01 · 02 · 03 Bars",
  },
  {
    step: "03",
    title: "Finish clinic-grade",
    body: "Press in the AIVEE Glass Ampoule at night, seal with The One Cream, and never skip Lumi SPF44 by day.",
    product: "AIVEE Cosmetics",
  },
];

export default async function HomePage() {
  const [featured, bestsellers, topReviews, stats] = await Promise.all([
    getFeaturedProducts(4),
    getBestsellers(4),
    getTopReviews(3),
    getStoreStats(),
  ]);

  const heroProduct = featured.find((product) => product.slug === "luxxe-white-ultima") ?? featured[0];
  const heroSize = heroProduct ? defaultSizeFor(heroProduct) : null;

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-cream">
        <div className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full border border-gold/20" />
        <div className="pointer-events-none absolute -right-24 top-28 h-[360px] w-[360px] rounded-full border border-gold/15" />
        <div className="container-luxe grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
          <div className="relative z-10 order-2 lg:order-1">
            <div className="animate-fade-up flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <p className="eyebrow">Velorian Luxxe White · AIVEE Cosmetics</p>
            </div>
            <h1
              className="animate-fade-up mt-5 font-display text-[clamp(2.5rem,6.4vw,5.1rem)] leading-[0.95] text-espresso"
              style={{ animationDelay: "80ms" }}
            >
              Two houses of glow.
              <span className="block italic text-gold">Only at V Glow PH.</span>
            </h1>
            <p
              className="animate-fade-up mt-6 max-w-md text-[15px] leading-relaxed text-mocha"
              style={{ animationDelay: "160ms" }}
            >
              The full Velorian Luxxe White range — Ultima, Enhanced Glutathione, Renew, Slim,
              Protect, and the 01 · 02 · 03 bars — alongside Dr. Aivee Teo&apos;s AIVEE Cosmetics.
              Sealed, FDA registered, and verified before it reaches you.
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "240ms" }}
            >
              <Link href="/shop" className="btn btn-primary px-9">
                Shop all products
              </Link>
              <Link href="/shop?collection=aivee" className="btn btn-outline px-9">
                Discover AIVEE
              </Link>
            </div>
            <div
              className="animate-fade-up mt-9 flex flex-wrap items-center gap-x-7 gap-y-3"
              style={{ animationDelay: "320ms" }}
            >
              <div className="flex items-center gap-2">
                <StarRating rating={stats.ratingAverage} size={14} />
                <span className="text-[11px] uppercase tracking-[0.14em] text-espresso">
                  {stats.ratingAverage.toFixed(1)} · {stats.reviewCount.toLocaleString()} verified
                  reviews
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-mocha">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                Sealed & verified · ships in 24h from Makati
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="animate-scale-in relative ml-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden bg-sand shadow-soft">
              <Image
                src="/images/hero.jpg"
                alt="A woman with luminous skin holding an authentic Luxxe White bottle"
                fill
                priority
                sizes="(min-width: 1024px) 520px, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/25 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 border border-ivory/30 bg-ivory/85 px-4 py-3 backdrop-blur-md">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.24em] text-gold">Hero product</p>
                  <p className="mt-0.5 font-display text-lg leading-tight text-espresso">
                    {heroProduct?.name ?? "Luxxe White Ultima"}
                  </p>
                </div>
                <Link
                  href={heroProduct ? `/products/${heroProduct.slug}` : "/shop"}
                  className="shrink-0 border border-ink/20 px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-espresso transition hover:bg-ink hover:text-ivory"
                >
                  {heroSize ? formatMoney(heroSize.priceCents) : "Shop"}
                </Link>
              </div>
            </div>
            <div className="absolute -left-3 top-8 hidden rotate-[-4deg] bg-ivory px-4 py-3 shadow-soft md:block lg:-left-8">
              <p className="text-[9px] uppercase tracking-[0.22em] text-gold">Ultima 1400 mg</p>
              <p className="mt-1 font-display text-base text-espresso">Results in 4–8 weeks</p>
            </div>
            <div className="absolute -right-2 bottom-24 hidden h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-ivory/90 text-center backdrop-blur md:flex lg:-right-6">
              <p className="font-display text-[11px] leading-tight text-espresso">
                FDA
                <br />
                verified
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-ink/10 bg-ivory/70">
          <div className="container-luxe grid grid-cols-2 divide-ink/10 md:grid-cols-4 md:divide-x">
            {values.map((value) => (
              <div key={value.label} className="px-1 py-4 md:px-6 md:py-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-espresso">{value.label}</p>
                <p className="mt-1 text-[11px] leading-snug text-mocha">{value.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured collections ───────────────────────────── */}
      <section className="container-luxe py-20 md:py-24">
        <Reveal className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Featured collections</p>
            <h2 className="mt-3 max-w-lg font-display text-[clamp(2rem,4vw,3.1rem)] leading-[1.02]">
              Velorian Luxxe White, and clinic-grade AIVEE.
            </h2>
          </div>
          <Link
            href="/shop"
            className="link-underline text-[11px] uppercase tracking-[0.2em] text-espresso"
          >
            Explore all {stats.productCount} products
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {collections.map((collection, index) => (
            <Reveal key={collection.slug} delay={index * 110}>
              <Link
                href={collection.href}
                className="group relative block aspect-[3/4] overflow-hidden bg-cream"
              >
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <p className="text-[9px] uppercase tracking-[0.26em] text-gold-soft">
                    {collection.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-ivory md:text-[27px]">
                    {collection.name}
                  </h3>
                  <p className="mt-2 max-w-[92%] text-[13px] leading-relaxed text-ivory/70">
                    {collection.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-ivory">
                    Shop the edit
                    <svg
                      width="16"
                      height="8"
                      viewBox="0 0 16 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="transition-transform duration-300 group-hover:translate-x-1.5"
                    >
                      <path d="M0 4h14M11 1l3 3-3 3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Bestsellers ────────────────────────────────────── */}
      <section className="bg-parchment/50 py-20 md:py-24">
        <div className="container-luxe">
          <Reveal className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">The icons</p>
              <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.1rem)] leading-[1.02]">
                The bottles everyone reorders.
              </h2>
            </div>
            <Link
              href="/shop?sort=rating"
              className="link-underline text-[11px] uppercase tracking-[0.2em] text-espresso"
            >
              Shop bestsellers
            </Link>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-7">
            {bestsellers.map((product, index) => (
              <Reveal key={product.id} delay={index * 90}>
                <ProductCard product={product} priority={index < 2} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product spotlight ─────────────────────────────── */}
      {heroProduct && (
        <section className="relative overflow-hidden bg-espresso text-ivory">
          <div className="container-luxe grid gap-10 py-16 md:py-24 lg:grid-cols-2 lg:items-center lg:gap-20">
            <Reveal className="relative order-2 aspect-[4/5] w-full max-w-[520px] overflow-hidden lg:order-1">
              <Image
                src="/images/products/capsules.jpg"
                alt={heroProduct.name}
                fill
                sizes="(min-width: 1024px) 520px, 100vw"
                className="object-cover"
              />
              <div className="absolute left-4 top-4 bg-ivory/90 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-espresso">
                {heroProduct.reviewCount} reviews · {ratingValue(heroProduct).toFixed(1)}★
              </div>
            </Reveal>
            <Reveal delay={120} className="order-1 lg:order-2">
              <p className="eyebrow text-gold-soft">The one everyone asks about</p>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.02]">
                {heroProduct.name}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/65">
                {heroProduct.description}
              </p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {heroProduct.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-[13px] text-ivory/80">
                    <span className="mt-[7px] h-1 w-3 shrink-0 bg-gold-soft" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <div>
                  <p className="font-display text-3xl">
                    {formatMoney(heroProduct.priceCents)}
                    {compareAtFor(heroProduct) && (
                      <span className="ml-2 text-base text-ivory/40 line-through">
                        {formatMoney(compareAtFor(heroProduct)!)}
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ivory/45">
                    {heroSize?.label} · free shipping
                  </p>
                </div>
                <Link href={`/products/${heroProduct.slug}`} className="btn btn-ivory">
                  Shop Ultima
                </Link>
              </div>
              <div className="mt-8 border-t border-ivory/15 pt-5">
                <p className="quote-serif text-lg leading-snug text-ivory/80">
                  “Week six and my skin is luminous. Always sealed and authentic.”
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-gold-soft">
                  Alyssa M. · Makati City · Verified buyer
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── The ritual ────────────────────────────────────── */}
      <section className="container-luxe py-20 md:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">The ritual</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.03]">
            One capsule, one bar, one ampoule.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-mocha">
            A routine built for a real Filipino day — humid commutes, air-conditioned offices, and
            weekends by the sea. Velorian Luxxe White from within, AIVEE on the surface, every single
            day.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {ritualSteps.map((step, index) => (
            <Reveal key={step.step} delay={index * 110}>
              <div className="group relative h-full border-t border-ink/15 pt-6">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-4xl text-gold/50 transition group-hover:text-gold">
                    {step.step}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-mocha">
                    {step.product}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-mocha">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex justify-center">
          <Link href="/shop" className="btn btn-outline px-9">
            Build my routine
          </Link>
        </Reveal>
      </section>

      {/* ── Reviews ───────────────────────────────────────── */}
      <section className="bg-ivory py-20 md:py-24">
        <div className="container-luxe">
          <Reveal className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Real skin, real words</p>
              <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.1rem)] leading-[1.02]">
                {stats.ratingAverage.toFixed(1)} stars from {stats.reviewCount} reviews.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <StarRating rating={stats.ratingAverage} size={18} />
              <span className="text-[11px] uppercase tracking-[0.16em] text-mocha">
                Verified purchases
              </span>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {topReviews.map((review, index) => (
              <Reveal key={review.id} delay={index * 100}>
                <figure className="flex h-full flex-col border border-ink/10 bg-white/60 p-6">
                  <StarRating rating={review.rating} size={13} />
                  <blockquote className="mt-4 flex-1">
                    <p className="font-display text-xl leading-snug text-espresso">
                      “{review.title}”
                    </p>
                    <p className="mt-3 text-[13px] leading-relaxed text-mocha">{review.body}</p>
                  </blockquote>
                  <figcaption className="mt-5 border-t border-ink/10 pt-4">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-espresso">
                      {review.authorName}
                    </p>
                    <p className="mt-0.5 text-[11px] text-mocha">{review.authorLocation}</p>
                    <Link
                      href={`/products/${review.productSlug}`}
                      className="mt-2 inline-block text-[10px] uppercase tracking-[0.16em] text-gold hover:text-ink"
                    >
                      on {review.productName}
                    </Link>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story ─────────────────────────────────────────── */}
      <section className="container-luxe pb-20 md:pb-24">
        <div className="grid items-stretch gap-0 overflow-hidden border border-ink/10 bg-cream lg:grid-cols-2">
          <Reveal className="relative min-h-[320px] lg:min-h-[520px]">
            <Image
              src="/images/texture.jpg"
              alt="Authentic Luxxe White capsules and cream texture"
              fill
              sizes="(min-width: 1024px) 680px, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={120} className="flex flex-col justify-center p-8 md:p-14">
            <p className="eyebrow">Our story</p>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.04]">
              Two houses. One standard.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-mocha">
              V Glow PH began in 2019 as a small Makati counter with one stubborn rule: only sell what
              we would take ourselves. Today we stock two houses we trust completely — Velorian Luxxe
              White, from Ultima to the 01 · 02 · 03 bars, and Dr. Aivee Teo&apos;s AIVEE Cosmetics,
              the clinic-grade line behind the famous glass skin.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-mocha">
              Every bottle, jar, and bar ships sealed with its authenticity code intact. We verify each
              batch against its registration, store it properly, and pack it by hand. No fakes, no
              repacks, no mercury — because the best glow is the one you don&apos;t have to doubt.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-4 border-t border-ink/10 pt-6">
              {[
                { value: "18k+", label: "Orders delivered" },
                { value: "4.9★", label: "Average rating" },
                { value: "2019", label: "Trusted since" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-display text-2xl text-espresso">{item.value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-mocha">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/about"
              className="link-underline mt-8 w-fit text-[11px] uppercase tracking-[0.2em] text-espresso"
            >
              Read our story
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────── */}
      <section className="container-luxe pb-4">
        <Reveal className="relative overflow-hidden bg-ink px-6 py-14 text-center text-ivory md:px-16 md:py-20">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full border border-gold/20" />
          <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full border border-gold/15" />
          <p className="eyebrow text-gold-soft">Join the inside glow</p>
          <h2 className="mx-auto mt-4 max-w-xl font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05]">
            Ten percent off your first ritual.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ivory/60">
            Ritual notes, restock alerts, and first access to seasonal sets. One thoughtful email a
            week — we respect your inbox.
          </p>
          <div className="mx-auto mt-8 max-w-md text-left">
            <NewsletterForm variant="dark" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
