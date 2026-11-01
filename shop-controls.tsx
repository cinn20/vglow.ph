"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { categories, concerns } from "@/lib/catalog-filters";
import { collectionFilters, priceBands, sortOptions } from "@/lib/shop-params";

function useParamWriter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  return useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const query = params.toString();
      startTransition(() => {
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-ink/10 py-5 first:border-t-0 first:pt-0">
      <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-espresso">{title}</p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="group flex cursor-pointer items-center justify-between gap-3 text-[13px] text-mocha transition hover:text-ink">
      <span className="flex items-center gap-2.5">
        <span
          className={`flex h-[15px] w-[15px] items-center justify-center border transition ${
            checked ? "border-ink bg-ink text-ivory" : "border-ink/25 bg-transparent"
          }`}
        >
          {checked && (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4">
              <path d="M4 12.5l5.2 5.2L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        {label}
      </span>
      {typeof count === "number" && (
        <span className="text-[11px] tabular-nums text-mocha/60">{count}</span>
      )}
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );
}

export function FilterPanel({
  categoryCounts,
  collectionCounts,
}: {
  categoryCounts: Record<string, number>;
  collectionCounts: Record<string, number>;
}) {
  const writeParams = useParamWriter();
  const searchParams = useSearchParams();

  const activeCollection = searchParams.get("collection") ?? "";
  const activeCategory = searchParams.get("category") ?? "";
  const activeConcerns = (searchParams.get("concern") ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const activePrice = searchParams.get("price") ?? "";

  const toggleConcern = (value: string) => {
    writeParams((params) => {
      const next = activeConcerns.includes(value)
        ? activeConcerns.filter((entry) => entry !== value)
        : [...activeConcerns, value];
      if (next.length) params.set("concern", next.join(","));
      else params.delete("concern");
    });
  };

  const hasFilters =
    Boolean(activeCollection) ||
    Boolean(activeCategory) ||
    activeConcerns.length > 0 ||
    Boolean(activePrice);

  return (
    <div>
      <div className="flex items-center justify-between pb-5">
        <p className="eyebrow">Refine</p>
        {hasFilters && (
          <button
            type="button"
            onClick={() =>
              writeParams((params) => {
                params.delete("collection");
                params.delete("category");
                params.delete("concern");
                params.delete("price");
              })
            }
            className="text-[10px] uppercase tracking-[0.14em] text-mocha underline decoration-ink/20 underline-offset-4 hover:text-wine"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterGroup title="Collection">
        {collectionFilters.map((option) => (
          <CheckRow
            key={option.value || "all"}
            label={option.label}
            checked={activeCollection === option.value}
            count={option.value ? collectionCounts[option.value] : undefined}
            onChange={() =>
              writeParams((params) => {
                if (!option.value || activeCollection === option.value) params.delete("collection");
                else params.set("collection", option.value);
              })
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Category">
        {categories.map((option) => (
          <CheckRow
            key={option.slug}
            label={option.label}
            checked={activeCategory === option.slug}
            count={categoryCounts[option.slug]}
            onChange={() =>
              writeParams((params) => {
                if (activeCategory === option.slug) params.delete("category");
                else params.set("category", option.slug);
              })
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Skin concern">
        {concerns.map((concern) => (
          <CheckRow
            key={concern.slug}
            label={concern.label}
            checked={activeConcerns.includes(concern.slug)}
            onChange={() => toggleConcern(concern.slug)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        {priceBands.map((band) => (
          <CheckRow
            key={band.value}
            label={band.label}
            checked={activePrice === band.value}
            onChange={() =>
              writeParams((params) => {
                if (activePrice === band.value) params.delete("price");
                else params.set("price", band.value);
              })
            }
          />
        ))}
      </FilterGroup>
    </div>
  );
}

export function SortSelect() {
  const writeParams = useParamWriter();
  const searchParams = useSearchParams();
  const value = searchParams.get("sort") ?? "featured";

  return (
    <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-mocha">
      <span className="hidden sm:inline">Sort by</span>
      <select
        value={value}
        onChange={(event) =>
          writeParams((params) => {
            if (event.target.value === "featured") params.delete("sort");
            else params.set("sort", event.target.value);
          })
        }
        className="cursor-pointer border border-ink/15 bg-transparent px-3 py-2 text-[11px] uppercase tracking-[0.1em] text-espresso outline-none transition hover:border-ink/40 focus:border-gold"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function MobileFilterTrigger({
  categoryCounts,
  collectionCounts,
}: {
  categoryCounts: Record<string, number>;
  collectionCounts: Record<string, number>;
}) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const activeCount =
    ["collection", "category", "price"].filter((key) => searchParams.get(key)).length +
    (searchParams.get("concern") ? searchParams.get("concern")!.split(",").length : 0);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border border-ink/15 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-espresso lg:hidden"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 6h18M7 12h10M10 18h4" strokeLinecap="round" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] text-white">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-espresso/40 backdrop-blur-[2px]"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[86vh] overflow-y-auto rounded-t-lg bg-ivory px-6 pb-8 pt-5 animate-fade-up">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-2xl">Filters</p>
              <button type="button" onClick={() => setOpen(false)} className="p-2 text-mocha" aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <FilterPanel categoryCounts={categoryCounts} collectionCounts={collectionCounts} />
            <button type="button" onClick={() => setOpen(false)} className="btn btn-primary mt-6 w-full">
              Show results
            </button>
          </div>
        </div>
      )}
    </>
  );
}
