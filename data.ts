import { and, asc, desc, eq, gte, ilike, inArray, lte, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import { orders, products, reviews, type Product, type Review } from "@/db/schema";

export type SortKey = "featured" | "price-asc" | "price-desc" | "newest" | "rating";



export type ProductFilters = {
  collection?: string;
  category?: string;
  concerns?: string[];
  minPriceCents?: number;
  maxPriceCents?: number;
  search?: string;
  sort?: SortKey;
  limit?: number;
};

const productOrder: Record<SortKey, SQL[]> = {
  featured: [asc(products.sortOrder)],
  rating: [desc(products.rating), desc(products.reviewCount)],
  "price-asc": [asc(products.priceCents)],
  "price-desc": [desc(products.priceCents)],
  newest: [desc(products.createdAt), desc(products.id)],
};

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  await ensureSeeded();

  const conditions = [];
  if (filters.collection) conditions.push(eq(products.collection, filters.collection));
  if (filters.category) conditions.push(eq(products.category, filters.category));
  if (typeof filters.minPriceCents === "number") {
    conditions.push(gte(products.priceCents, filters.minPriceCents));
  }
  if (typeof filters.maxPriceCents === "number") {
    conditions.push(lte(products.priceCents, filters.maxPriceCents));
  }
  if (filters.search) {
    const needle = `%${filters.search}%`;
    conditions.push(
      or(
        ilike(products.name, needle),
        ilike(products.subtitle, needle),
        ilike(products.description, needle),
      ),
    );
  }

  const order = productOrder[filters.sort ?? "featured"] as ReturnType<typeof asc>[];

  const query = db
    .select()
    .from(products)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(...order);

  const rows = filters.limit ? await query.limit(filters.limit) : await query;

  if (!filters.concerns?.length) return rows;

  return rows.filter((product) =>
    filters.concerns!.some((concern) => product.concerns.includes(concern)),
  );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await ensureSeeded();
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getProductReviews(productId: number): Promise<Review[]> {
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt), desc(reviews.id));
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  await ensureSeeded();
  return db
    .select()
    .from(products)
    .where(eq(products.isFeatured, true))
    .orderBy(asc(products.sortOrder))
    .limit(limit);
}

export async function getBestsellers(limit = 4): Promise<Product[]> {
  await ensureSeeded();
  return db
    .select()
    .from(products)
    .where(eq(products.isBestseller, true))
    .orderBy(asc(products.sortOrder))
    .limit(limit);
}

export async function getRelatedProducts(
  collection: string,
  excludeSlug: string,
  limit = 3,
): Promise<Product[]> {
  await ensureSeeded();
  return db
    .select()
    .from(products)
    .where(and(eq(products.collection, collection), sql`${products.slug} <> ${excludeSlug}`))
    .orderBy(asc(products.sortOrder))
    .limit(limit);
}

export async function getNewArrivals(limit = 3): Promise<Product[]> {
  await ensureSeeded();
  return db
    .select()
    .from(products)
    .where(eq(products.isNew, true))
    .orderBy(asc(products.sortOrder))
    .limit(limit);
}

export async function getCatalog(): Promise<Product[]> {
  await ensureSeeded();
  return db.select().from(products).orderBy(asc(products.sortOrder));
}

export async function getTopReviews(limit = 3) {
  await ensureSeeded();
  return db
    .select({
      id: reviews.id,
      authorName: reviews.authorName,
      authorLocation: reviews.authorLocation,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      createdAt: reviews.createdAt,
      productName: products.name,
      productSlug: products.slug,
    })
    .from(reviews)
    .innerJoin(products, eq(reviews.productId, products.id))
    .where(eq(reviews.rating, 5))
    .orderBy(desc(reviews.helpfulCount))
    .limit(limit);
}

export async function getOrderByNumber(orderNumber: string) {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  return rows[0] ?? null;
}

export async function getStoreStats() {
  await ensureSeeded();
  const [row] = await db
    .select({
      productCount: sql<number>`count(*)::int`,
      reviewCount: sql<number>`coalesce(sum(${products.reviewCount}), 0)::int`,
      ratingAverage: sql<number>`coalesce(avg(${products.rating}), 0)::float`,
    })
    .from(products);
  return row ?? { productCount: 0, reviewCount: 0, ratingAverage: 5 };
}

export async function getProductsByIds(ids: number[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  await ensureSeeded();
  return db.select().from(products).where(inArray(products.id, ids));
}
