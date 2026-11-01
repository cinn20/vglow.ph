"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/db/schema";
import { useCart } from "@/components/cart/cart-context";
import { formatMoney } from "@/lib/pricing";
import { defaultSizeFor } from "@/lib/product";

export function PurchasePanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const initial = defaultSizeFor(product);
  const [sizeLabel, setSizeLabel] = useState(initial?.label ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = product.sizes.find((size) => size.label === sizeLabel) ?? initial;
  const price = selected?.priceCents ?? product.priceCents;
  const compareAt = selected?.compareAtCents ?? product.compareAtCents ?? null;
  const savings = compareAt && compareAt > price ? compareAt - price : 0;
  const maxQuantity = Math.min(10, Math.max(1, product.stock));

  const add = (openDrawer: boolean) => {
    if (!selected) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        size: selected.label,
        image: product.images[0],
        unitPriceCents: selected.priceCents,
        compareAtCents: selected.compareAtCents ?? product.compareAtCents ?? null,
        maxQuantity,
        quantity,
      },
      { openDrawer },
    );
    if (openDrawer) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-3">
        <p className="font-display text-[32px] leading-none text-espresso">{formatMoney(price)}</p>
        {compareAt && compareAt > price && (
          <>
            <span className="text-sm text-mocha line-through">{formatMoney(compareAt)}</span>
            <span className="bg-gold/15 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-gold">
              Save {formatMoney(savings)}
            </span>
          </>
        )}
      </div>
      <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-mocha">
        or 3 × {formatMoney(Math.round(price / 3))} with BillEase · 0% interest
      </p>

      {product.sizes.length > 0 && (
        <div className="mt-7">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.2em] text-espresso">Size</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-mocha">
              {product.sizes.length} options
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const active = size.label === sizeLabel;
              return (
                <button
                  key={size.label}
                  type="button"
                  onClick={() => setSizeLabel(size.label)}
                  aria-pressed={active}
                  className={`min-w-[92px] border px-4 py-3 text-left transition ${
                    active
                      ? "border-ink bg-ink text-ivory"
                      : "border-ink/20 text-espresso hover:border-ink/60"
                  }`}
                >
                  <span className="block text-[11px] uppercase tracking-[0.12em]">{size.label}</span>
                  <span
                    className={`mt-1 block text-[11px] tabular-nums ${active ? "text-ivory/70" : "text-mocha"}`}
                  >
                    {formatMoney(size.priceCents)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex w-fit items-center border border-ink/20">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="flex h-12 w-11 items-center justify-center text-lg text-mocha transition hover:bg-cream hover:text-ink"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))}
            className="flex h-12 w-11 items-center justify-center text-lg text-mocha transition hover:bg-cream hover:text-ink disabled:opacity-30"
            disabled={quantity >= maxQuantity}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => add(true)}
          className="btn btn-primary flex-1 px-8 py-4"
          disabled={product.stock <= 0}
        >
          {product.stock <= 0 ? "Sold out" : added ? "Added to bag ✓" : "Add to bag"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          add(false);
          router.push("/checkout");
        }}
        className="btn btn-outline mt-3 w-full"
        disabled={product.stock <= 0}
      >
        Buy it now
      </button>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-mocha">
        <span className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${product.stock > 30 ? "bg-sage" : "bg-gold"}`} />
          {product.stock > 30 ? "In stock · ships in 24h" : `Only ${product.stock} left in this batch`}
        </span>
        <span>Free shipping over ₱2,000</span>
        <span>30-day glow guarantee</span>
      </div>

      <div className="mt-6 border border-gold/25 bg-cream/60 p-4">
        <p className="text-[11px] leading-relaxed text-espresso">
          <span className="uppercase tracking-[0.14em] text-gold">The full ritual</span> — pair with{" "}
          {product.category === "sets"
            ? "a silk pouch and ritual card, included."
            : "Luxxe White Ultima capsules and the Brilliant SPF 30 for the complete routine."}
        </p>
      </div>
    </div>
  );
}
