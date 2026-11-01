import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const productId = Number(body?.productId);
    const rating = Number(body?.rating);
    const authorName = typeof body?.authorName === "string" ? body.authorName.trim() : "";
    const authorLocation =
      typeof body?.authorLocation === "string" ? body.authorLocation.trim() : "";
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const reviewBody = typeof body?.body === "string" ? body.body.trim() : "";

    if (!Number.isInteger(productId) || productId <= 0) {
      return Response.json({ error: "Invalid product." }, { status: 400 });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return Response.json({ error: "Please choose a rating from 1 to 5 stars." }, { status: 400 });
    }
    if (authorName.length < 2) {
      return Response.json({ error: "Please add your name." }, { status: 400 });
    }
    if (title.length < 3) {
      return Response.json({ error: "Please add a short review title." }, { status: 400 });
    }
    if (reviewBody.length < 12) {
      return Response.json(
        { error: "Tell us a little more — at least 12 characters." },
        { status: 400 },
      );
    }

    const [product] = await db
      .select({ id: products.id, slug: products.slug })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      return Response.json({ error: "Product not found." }, { status: 404 });
    }

    const [inserted] = await db
      .insert(reviews)
      .values({
        productId,
        authorName: authorName.slice(0, 120),
        authorLocation: authorLocation ? authorLocation.slice(0, 120) : "Philippines",
        rating,
        title: title.slice(0, 160),
        body: reviewBody.slice(0, 2000),
        isVerified: false,
        helpfulCount: 0,
      })
      .returning();

    const [aggregate] = await db
      .select({
        average: sql<string>`round(avg(${reviews.rating})::numeric, 2)`,
        count: sql<number>`count(*)::int`,
      })
      .from(reviews)
      .where(eq(reviews.productId, productId));

    if (aggregate) {
      await db
        .update(products)
        .set({ rating: aggregate.average, reviewCount: aggregate.count })
        .where(eq(products.id, productId));
    }

    revalidatePath(`/products/${product.slug}`);
    revalidatePath("/shop");
    revalidatePath("/");

    return Response.json({ ok: true, review: inserted });
  } catch {
    return Response.json(
      { error: "We couldn't post your review. Please try again." },
      { status: 500 },
    );
  }
}
