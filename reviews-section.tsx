"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { StarRating } from "@/components/star-rating";
import { formatDate } from "@/lib/pricing";

export type ReviewView = {
  id: number;
  authorName: string;
  authorLocation: string | null;
  rating: number;
  title: string;
  body: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
};

export function ReviewsSection({
  productId,
  productName,
  reviews,
  rating,
}: {
  productId: number;
  productName: string;
  reviews: ReviewView[];
  rating: number;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [values, setValues] = useState({
    authorName: "",
    authorLocation: "",
    title: "",
    body: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, boolean>>({});

  const distribution = useMemo(() => {
    const buckets = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((review) => review.rating === star).length,
    }));
    const total = reviews.length || 1;
    return buckets.map((bucket) => ({
      ...bucket,
      percent: Math.round((bucket.count / total) * 100),
    }));
  }, [reviews]);

  const visible = filter ? reviews.filter((review) => review.rating === filter) : reviews;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating: formRating,
          authorName: values.authorName,
          authorLocation: values.authorLocation,
          title: values.title,
          body: values.body,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("success");
      setMessage("Thank you — your review is live. ✦");
      setValues({ authorName: "", authorLocation: "", title: "", body: "" });
      setFormRating(5);
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  return (
    <section id="reviews" className="border-t border-ink/10 pt-14 md:pt-20">
      <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">Reviews</p>
          <h2 className="mt-3 font-display text-[clamp(1.9rem,3vw,2.6rem)] leading-tight">
            What the community says
          </h2>
          <div className="mt-5 flex items-end gap-4">
            <p className="font-display text-6xl leading-none text-espresso">{rating.toFixed(1)}</p>
            <div className="pb-1">
              <StarRating rating={rating} size={16} />
              <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-mocha">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {distribution.map((bucket) => (
              <button
                key={bucket.star}
                type="button"
                onClick={() => setFilter(filter === bucket.star ? null : bucket.star)}
                className="flex w-full items-center gap-3 text-left"
                aria-label={`Filter ${bucket.star} star reviews`}
              >
                <span className="w-8 text-[10px] uppercase tracking-[0.1em] text-mocha">
                  {bucket.star} ★
                </span>
                <span className="h-[5px] flex-1 bg-cream">
                  <span
                    className={`block h-full transition-all duration-500 ${
                      filter === bucket.star ? "bg-gold" : "bg-ink/25"
                    }`}
                    style={{ width: `${bucket.percent}%` }}
                  />
                </span>
                <span className="w-6 text-right text-[10px] tabular-nums text-mocha">
                  {bucket.count}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setFormOpen((open) => !open);
              setStatus("idle");
              setMessage("");
            }}
            className="btn btn-outline mt-6 w-full"
          >
            {formOpen ? "Close review form" : "Write a review"}
          </button>

          {filter && (
            <button
              type="button"
              onClick={() => setFilter(null)}
              className="mt-3 text-[10px] uppercase tracking-[0.16em] text-gold"
            >
              Showing {filter}★ only · clear
            </button>
          )}
        </div>

        <div>
          {formOpen && (
            <form
              onSubmit={submit}
              className="mb-10 border border-ink/10 bg-white/70 p-6 md:p-8 animate-fade-up"
            >
              <p className="font-display text-2xl">Share your experience</p>
              <p className="mt-1 text-[12px] text-mocha">
                Reviews for {productName}. Honest words only — we publish every star rating.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.18em] text-mocha">Rating</span>
                <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      aria-label={`${star} star${star > 1 ? "s" : ""}`}
                      className="p-0.5"
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 20 20"
                        fill={
                          (hoverRating || formRating) >= star ? "currentColor" : "none"
                        }
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-gold"
                      >
                        <path d="M10 1.6l2.47 5.4 5.9.66-4.4 4 1.2 5.84L10 14.6l-5.17 2.9 1.2-5.84-4.4-4 5.9-.66L10 1.6Z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-mocha">{formRating} of 5</span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-luxe" htmlFor="review-name">
                    Name
                  </label>
                  <input
                    id="review-name"
                    className="input-luxe"
                    value={values.authorName}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, authorName: event.target.value }))
                    }
                    placeholder="Bea R."
                    required
                  />
                </div>
                <div>
                  <label className="label-luxe" htmlFor="review-location">
                    City (optional)
                  </label>
                  <input
                    id="review-location"
                    className="input-luxe"
                    value={values.authorLocation}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, authorLocation: event.target.value }))
                    }
                    placeholder="Cebu City"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="label-luxe" htmlFor="review-title">
                  Review title
                </label>
                <input
                  id="review-title"
                  className="input-luxe"
                  value={values.title}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="My skin has never looked this even"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="label-luxe" htmlFor="review-body">
                  Your review
                </label>
                <textarea
                  id="review-body"
                  className="input-luxe min-h-[110px] resize-y"
                  value={values.body}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, body: event.target.value }))
                  }
                  placeholder="How did your skin respond? How long did you use it?"
                  required
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <button type="submit" disabled={status === "loading"} className="btn btn-primary">
                  {status === "loading" ? "Posting…" : "Post review"}
                </button>
                {message && (
                  <p
                    className={`text-[12px] ${status === "error" ? "text-wine" : "text-gold"}`}
                    role="status"
                  >
                    {message}
                  </p>
                )}
              </div>
            </form>
          )}

          {status === "success" && !formOpen && (
            <div className="mb-6 border border-gold/30 bg-cream/70 px-5 py-4 text-[12px] text-espresso">
              {message}
            </div>
          )}

          <ul className="divide-y divide-ink/10">
            {visible.map((review) => {
              const voted = helpfulVotes[review.id];
              return (
                <li key={review.id} className="py-6 first:pt-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream font-display text-lg text-espresso">
                        {review.authorName.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className="flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-espresso">
                          {review.authorName}
                          {review.isVerified && (
                            <span className="flex items-center gap-1 bg-sage/20 px-1.5 py-0.5 text-[9px] tracking-[0.08em] text-[#5d6b54]">
                              ✓ Verified buyer
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-[11px] text-mocha">
                          {review.authorLocation ?? "Philippines"} · {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size={12} />
                  </div>
                  <p className="mt-4 font-display text-lg leading-snug text-espresso">
                    {review.title}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-mocha">{review.body}</p>
                  <button
                    type="button"
                    onClick={() =>
                      setHelpfulVotes((current) => ({ ...current, [review.id]: !voted }))
                    }
                    className={`mt-3 flex items-center gap-1.5 border px-2.5 py-1.5 text-[9px] uppercase tracking-[0.14em] transition ${
                      voted
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-ink/15 text-mocha hover:border-ink/40 hover:text-ink"
                    }`}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M7 22V10l5-8 1.5 1.2a3 3 0 0 1 1 3V9h5a2 2 0 0 1 2 2.4l-1.6 8.2A2 2 0 0 1 17.9 22H7Z" />
                    </svg>
                    Helpful ({review.helpfulCount + (voted ? 1 : 0)})
                  </button>
                </li>
              );
            })}
          </ul>

          {visible.length === 0 && (
            <p className="py-8 text-sm text-mocha">
              No {filter}★ reviews yet. Be the first to share your experience.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
