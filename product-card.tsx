"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/db/schema";
import { useCart } from "./cart/cart-context";
import { StarRating } from "./star-rating";
import { formatMoney } from "@/lib/pricing";
import { compareAtFor, defaultSizeFor, ratingValue } from "@/lib/product";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const size = defaultSizeFor(product);
  const compareAt = compareAtFor(product);
  const rating = ratingValue(product);
  const image = product.images[0];
  const hoverImage = product.images[1] ?? image;

  const handleAdd = () => {
    if (!size) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: size.label,
      image,
      unitPriceCents: size.priceCents,
      compareAtCents: size.compareAtCents ?? product.compareAtCents ?? null,
      maxQuantity: Math.min(10, Math.max(1, product.stock)),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="group relative flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-cream"
        aria-label={product.name}
      >
        <Image
          src={image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 80vw"
          className="object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.04] group-hover:opacity-0"
        />
        <Image
          src={hoverImage}
          alt=""
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 80vw"
          className="scale-[1.02] object-cover opacity-0 transition duration-[1200ms] ease-out group-hover:scale-105 group-hover:opacity-100"
        />

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.badge && (
            <span className="bg-ivory/95 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-espresso backdrop-blur">
              {product.badge}
            </span>
          )}
          {product.isNew && !product.badge && (
            <span className="bg-ivory/95 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-espresso">
              New
            </span>
          )}
        </div>

        <span className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-2 items-center justify-center bg-ivory/95 px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-espresso opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:flex">
          View the ritual
        </span>
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-mocha">
          <StarRating rating={rating} size={11} />
          <span className="tabular-nums">{rating.toFixed(1)}</span>
          <span className="text-mocha/50">({product.reviewCount})</span>
        </div>
        <h3 className="mt-1.5 font-display text-[19px] leading-snug text-ink">
          <Link href={`/products/${product.slug}`} className="link-underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-mocha">{product.subtitle}</p>
        <div className="mt-2 flex items-end justify-between gap-2">
          <p className="flex items-baseline gap-2">
            <span className="text-sm tabular-nums text-ink">{formatMoney(product.priceCents)}</span>
            {compareAt && (
              <span className="text-[11px] text-mocha line-through tabular-nums">
                {formatMoney(compareAt)}
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="group/add flex items-center gap-1.5 border border-ink/20 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.16em] text-espresso transition hover:border-ink hover:bg-ink hover:text-ivory"
            aria-label={`Add ${product.name} to bag`}
          >
            {added ? (
              <>Added ✓</>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
