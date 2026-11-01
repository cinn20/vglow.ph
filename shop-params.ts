import type { SortKey } from "./data";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
];

export type SearchParamsRecord = Record<string, string | string[] | undefined>;

export type PriceBand = "under-500" | "500-1000" | "1000-2000" | "over-2000";

export const priceBands: { value: PriceBand; label: string; min?: number; max?: number }[] = [
  { value: "under-500", label: "Under ₱500", max: 49999 },
  { value: "500-1000", label: "₱500 – ₱1,000", min: 50000, max: 100000 },
  { value: "1000-2000", label: "₱1,000 – ₱2,000", min: 100000, max: 200000 },
  { value: "over-2000", label: "Over ₱2,000", min: 200001 },
];

export const collectionFilters = [
  { value: "", label: "All products" },
  { value: "glow-capsules", label: "Velorian Luxxe Capsules" },
  { value: "skin-bars", label: "Velorian Luxxe Bars" },
  { value: "facial-ritual", label: "Brilliant Facial Ritual" },
  { value: "aivee", label: "AIVEE Cosmetics" },
];

export const sortValues: SortKey[] = [
  "featured",
  "rating",
  "price-asc",
  "price-desc",
  "newest",
];

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseShopParams(searchParams: SearchParamsRecord) {
  const collection = first(searchParams.collection) ?? "";
  const category = first(searchParams.category) ?? "";
  const sortRaw = first(searchParams.sort) ?? "featured";
  const sort = (sortValues as string[]).includes(sortRaw) ? (sortRaw as SortKey) : "featured";
  const q = first(searchParams.q)?.trim() ?? "";
  const concernRaw = first(searchParams.concern) ?? "";
  const concerns = concernRaw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const priceRaw = first(searchParams.price) ?? "";
  const price = priceBands.find((band) => band.value === priceRaw) ?? null;

  return { collection, category, sort, q, concerns, price, priceRaw };
}
