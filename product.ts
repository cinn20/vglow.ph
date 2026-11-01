import type { Product } from "@/db/schema";

export function defaultSizeFor(product: Product) {
  return (
    product.sizes.find((size) => size.priceCents === product.priceCents) ?? product.sizes[0]
  );
}

export function compareAtFor(product: Product) {
  const size = defaultSizeFor(product);
  const compareAt = size?.compareAtCents ?? product.compareAtCents ?? null;
  if (!compareAt || compareAt <= (size?.priceCents ?? product.priceCents)) return null;
  return compareAt;
}

export function priceFrom(product: Product) {
  if (!product.sizes.length) return product.priceCents;
  return Math.min(...product.sizes.map((size) => size.priceCents));
}

export function ratingValue(product: Product) {
  const numeric = typeof product.rating === "string" ? Number(product.rating) : product.rating;
  return Number.isFinite(numeric) ? numeric : 5;
}

export const collectionLabel: Record<string, string> = {
  "glow-capsules": "Velorian Luxxe Capsules",
  "skin-bars": "Velorian Luxxe Skin Bars",
  "facial-ritual": "Brilliant Facial Ritual",
  aivee: "AIVEE Cosmetics",
};
