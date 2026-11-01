import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductGallery } from "@/components/product/product-gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { ReviewsSection } from "@/components/product/reviews-section";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { StarRating } from "@/components/star-rating";
import { getProductBySlug, getProductReviews, getRelatedProducts } from "@/lib/data";
import { collectionLabel, ratingValue } from "@/lib/product";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.subtitle + " — " + product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: product.images.slice(0, 1),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getProductReviews(product.id),
    getRelatedProducts(product.collection, product.slug, 3),
  ]);

  const rating = ratingValue(product);
  const reviewViews = reviews.map((review) => ({
    ...review,
    createdAt: review.createdAt.toISOString(),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => `https://vglow.ph${image}`),
    sku: product.slug,
    brand: { "@type": "Brand", name: "V Glow PH" },
    offers: {
      "@type": "Offer",
      priceCurrency: "PHP",
      price: (product.priceCents / 100).toFixed(2),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://vglow.ph/products/${product.slug}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating.toFixed(1),
      reviewCount: Math.max(1, product.reviewCount),
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="border-b border-ink/10">
        <div className="container-luxe flex flex-wrap items-center gap-2 py-4 text-[10px] uppercase tracking-[0.18em] text-mocha">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-ink">
            Shop
          </Link>
          <span>/</span>
          <Link href={`/shop?collection=${product.collection}`} className="hover:text-ink">
            {collectionLabel[product.collection] ?? product.collection}
          </Link>
          <span>/</span>
          <span className="text-espresso">{product.name}</span>
        </div>
      </div>

      <div className="container-luxe py-8 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductGallery images={product.images} name={product.name} badge={product.badge} />
            <div className="mt-5 hidden grid-cols-3 gap-3 lg:grid">
              {[
                { label: "Sealed & authentic", note: "Verified batch code" },
                { label: "FDA registered", note: "CPR checked" },
                { label: "Fast dispatch", note: "Ships from Makati" },
              ].map((item) => (
                <div key={item.label} className="border border-ink/10 px-3 py-2.5">
                  <p className="text-[9px] uppercase tracking-[0.16em] text-espresso">{item.label}</p>
                  <p className="mt-0.5 text-[10px] text-mocha">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">{collectionLabel[product.collection] ?? product.collection}</p>
            <h1 className="mt-3 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.04]">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-mocha">{product.subtitle}</p>

            <a href="#reviews" className="mt-4 flex items-center gap-2.5">
              <StarRating rating={rating} size={14} />
              <span className="text-[11px] uppercase tracking-[0.14em] text-espresso">
                {rating.toFixed(1)}
              </span>
              <span className="text-[11px] text-mocha underline decoration-ink/20 underline-offset-4">
                {product.reviewCount} reviews
              </span>
            </a>

            <p className="mt-5 quote-serif text-xl leading-snug text-gold">{product.tagline}</p>
            <p className="mt-4 text-[14px] leading-relaxed text-mocha">{product.description}</p>

            <div className="mt-7">
              <PurchasePanel product={product} />
            </div>

            <div className="mt-8 border-t border-ink/10">
              {[
                { title: "What it does", body: product.description, open: true },
                {
                  title: "Benefits",
                  body: (
                    <ul className="space-y-2">
                      {product.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2.5">
                          <span className="mt-[7px] h-1 w-3 shrink-0 bg-gold" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  ),
                },
                { title: "How to use", body: product.ritual },
                { title: "Ingredients", body: product.ingredients },
                {
                  title: "Shipping & returns",
                  body: "Dispatched from Makati within 24 hours on business days. Free standard shipping over ₱2,000; express and same-day options at checkout. Every bottle and bar arrives sealed with its authenticity code intact. Unopened products can be returned within 30 days under our glow guarantee.",
                },
              ].map((item) => (
                <details key={item.title} className="group border-b border-ink/10" open={item.open}>
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[11px] uppercase tracking-[0.18em] text-espresso">
                    {item.title}
                    <span className="text-gold transition duration-300 group-open:rotate-45">＋</span>
                  </summary>
                  <div className="pb-5 text-[13px] leading-relaxed text-mocha">{item.body}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="border-y border-ink/10 bg-parchment/40">
        <div className="container-luxe grid grid-cols-2 divide-x divide-ink/10 md:grid-cols-4">
          {[
            { value: "24h", label: "Dispatch from Makati" },
            { value: "4.9★", label: "Average product rating" },
            { value: "30 days", label: "Glow-back guarantee" },
            { value: "100%", label: "Sealed & authentic" },
          ].map((stat) => (
            <div key={stat.label} className="px-4 py-6 text-center md:py-8">
              <p className="font-display text-2xl text-espresso">{stat.value}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-mocha">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container-luxe py-14 md:py-20">
        <ReviewsSection
          productId={product.id}
          productName={product.name}
          reviews={reviewViews}
          rating={rating}
        />
      </div>

      {related.length > 0 && (
        <section className="border-t border-ink/10 bg-cream/40 py-16 md:py-20">
          <div className="container-luxe">
            <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">Pairs beautifully with</p>
                <h2 className="mt-3 font-display text-[clamp(1.8rem,3.4vw,2.7rem)] leading-tight">
                  Complete the ritual
                </h2>
              </div>
              <Link
                href="/shop"
                className="link-underline text-[10px] uppercase tracking-[0.2em] text-espresso"
              >
                Shop all products
              </Link>
            </Reveal>
            <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-6">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 80}>
                  <ProductCard product={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-luxe pb-8">
        <div className="relative overflow-hidden bg-espresso px-6 py-12 text-center text-ivory md:px-16">
          <Image
            src="/images/texture.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-20"
          />
          <div className="relative">
            <p className="eyebrow text-gold-soft">The glow guarantee</p>
            <h2 className="mx-auto mt-3 max-w-xl font-display text-[clamp(1.9rem,3.6vw,2.8rem)] leading-tight">
              Love it in 30 days, or we&apos;ll make it right.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-ivory/65">
              If your skin doesn&apos;t love the Luxxe White ritual, message us. We&apos;ll refund or
              swap it — no awkward questions.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/shop" className="btn btn-ivory">
                Keep shopping
              </Link>
              <Link href="/help" className="btn border border-ivory/30 text-ivory hover:bg-ivory/10">
                Our care policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
