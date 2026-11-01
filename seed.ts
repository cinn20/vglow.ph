import { db } from "./index";
import { products, reviews } from "./schema";
import { seedProducts } from "./seed-data";
import { sql } from "drizzle-orm";

function daysAgoDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export async function seedDatabase({ force = false }: { force?: boolean } = {}) {
  const existing = await db.select({ count: sql<number>`count(*)::int` }).from(products);
  const count = existing[0]?.count ?? 0;

  if (count > 0 && !force) {
    return { seeded: false, products: count };
  }

  if (force) {
    await db.execute(sql`truncate table ${reviews} restart identity cascade`);
    await db.execute(sql`truncate table ${products} restart identity cascade`);
  }

  for (const product of seedProducts) {
    const ratings = product.reviews.map((review) => review.rating);
    const ratingAverage = ratings.length
      ? (ratings.reduce((total, value) => total + value, 0) / ratings.length).toFixed(2)
      : "5.00";

    const [inserted] = await db
      .insert(products)
      .values({
        slug: product.slug,
        name: product.name,
        subtitle: product.subtitle,
        collection: product.collection,
        category: product.category,
        tagline: product.tagline,
        description: product.description,
        ritual: product.ritual,
        ingredients: product.ingredients,
        benefits: product.benefits,
        concerns: product.concerns,
        images: product.images,
        sizes: product.sizes,
        priceCents: product.priceCents,
        compareAtCents: product.compareAtCents ?? null,
        badge: product.badge ?? null,
        stock: product.stock,
        rating: ratingAverage,
        reviewCount: product.reviews.length,
        isFeatured: product.isFeatured ?? false,
        isBestseller: product.isBestseller ?? false,
        isNew: product.isNew ?? false,
        sortOrder: product.sortOrder,
      })
      .returning({ id: products.id });

    if (!inserted) continue;

    if (product.reviews.length > 0) {
      await db.insert(reviews).values(
        product.reviews.map((review) => ({
          productId: inserted.id,
          authorName: review.authorName,
          authorLocation: review.authorLocation,
          rating: review.rating,
          title: review.title,
          body: review.body,
          isVerified: review.isVerified ?? true,
          helpfulCount: review.helpfulCount ?? 0,
          createdAt: daysAgoDate(review.daysAgo),
        })),
      );
    }
  }

  return { seeded: true, products: seedProducts.length };
}

let seedPromise: Promise<{ seeded: boolean; products: number }> | null = null;

/**
 * Makes sure the storefront always has a catalog, even on a freshly provisioned
 * database. Safe to call on every request — the work happens at most once.
 */
export async function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = seedDatabase().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}
