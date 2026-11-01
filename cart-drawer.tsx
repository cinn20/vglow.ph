"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-context";
import { formatMoney, FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/pricing";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    setQuantity,
    subtotalCents,
    itemCount,
    savingsCents,
    clearCart,
  } = useCart();
  const router = useRouter();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents);
  const progress = Math.min(100, (subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="absolute inset-0 h-full w-full cursor-default bg-espresso/40 backdrop-blur-[2px] animate-fade-in"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-ivory shadow-lift animate-slide-in">
        <header className="flex items-start justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <p className="eyebrow">Your bag</p>
            <h2 className="mt-1 font-display text-2xl">
              {itemCount === 0 ? "Still empty" : `${itemCount} ${itemCount === 1 ? "piece" : "pieces"} of glow`}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="group -mr-2 mt-1 rounded-full p-2 text-mocha transition hover:bg-cream hover:text-ink"
            aria-label="Close cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {itemCount > 0 && (
          <div className="border-b border-ink/10 bg-cream/60 px-6 py-4">
            <p className="text-[11px] tracking-[0.14em] uppercase text-mocha">
              {remaining > 0 ? (
                <>
                  {formatMoney(remaining)} away from <span className="text-ink">free shipping</span>
                </>
              ) : (
                <span className="text-ink">Free shipping unlocked ✨</span>
              )}
            </p>
            <div className="mt-2 h-[3px] w-full bg-sand">
              <div
                className="h-full bg-gold transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 text-gold">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
                  <path d="M6 8h12l-1 12H7L6 8Z" />
                  <path d="M9 8a3 3 0 0 1 6 0" />
                </svg>
              </span>
              <div>
                <p className="font-display text-xl">Your bag is waiting</p>
                <p className="mt-1 text-sm text-mocha">
                  Begin your routine — start with Luxxe White Ultima.
                </p>
              </div>
              <Link href="/shop" onClick={closeCart} className="btn btn-primary mt-2">
                Shop the collection
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10">
              {items.map((line) => (
                <li key={line.id} className="flex gap-4 py-5">
                  <Link
                    href={`/products/${line.slug}`}
                    onClick={closeCart}
                    className="relative h-24 w-20 shrink-0 overflow-hidden bg-cream"
                  >
                    <Image
                      src={line.image}
                      alt={line.name}
                      fill
                      sizes="80px"
                      className="object-cover transition duration-500 hover:scale-105"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/products/${line.slug}`}
                          onClick={closeCart}
                          className="block truncate font-display text-base leading-tight hover:text-gold"
                        >
                          {line.name}
                        </Link>
                        <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-mocha">
                          {line.size}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.id)}
                        className="text-[11px] uppercase tracking-[0.12em] text-mocha underline decoration-ink/20 underline-offset-4 transition hover:text-wine"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-3">
                      <div className="flex items-center border border-ink/15">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.id, line.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center text-mocha transition hover:bg-cream hover:text-ink"
                          aria-label={`Decrease quantity of ${line.name}`}
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-xs tabular-nums">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.id, line.quantity + 1)}
                          disabled={line.quantity >= line.maxQuantity}
                          className="flex h-8 w-8 items-center justify-center text-mocha transition hover:bg-cream hover:text-ink disabled:opacity-30"
                          aria-label={`Increase quantity of ${line.name}`}
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm tabular-nums">
                          {formatMoney(line.unitPriceCents * line.quantity)}
                        </p>
                        {line.compareAtCents && line.compareAtCents > line.unitPriceCents && (
                          <p className="text-[11px] text-mocha line-through tabular-nums">
                            {formatMoney(line.compareAtCents * line.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-ink/10 bg-cream/40 px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] uppercase tracking-[0.18em] text-mocha">Subtotal</span>
              <span className="font-display text-2xl tabular-nums">{formatMoney(subtotalCents)}</span>
            </div>
            {savingsCents > 0 && (
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gold">
                You save {formatMoney(savingsCents)}
              </p>
            )}
            <p className="mt-2 text-[11px] text-mocha">
              Shipping and discount codes calculated at checkout.
            </p>
            <button
              type="button"
              onClick={() => {
                closeCart();
                router.push("/checkout");
              }}
              className="btn btn-primary mt-4 w-full"
            >
              Checkout · {formatMoney(subtotalCents)}
            </button>
            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={closeCart}
                className="text-[11px] uppercase tracking-[0.16em] text-mocha underline decoration-ink/20 underline-offset-4 hover:text-ink"
              >
                Continue shopping
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="text-[11px] uppercase tracking-[0.16em] text-mocha/70 hover:text-wine"
              >
                Clear bag
              </button>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}
