"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-luxe flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">A small interruption</p>
      <h1 className="mt-4 max-w-xl font-display text-[clamp(2.2rem,4.8vw,3.4rem)] leading-[1.03]">
        The glow needs a moment to reload.
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-mocha">
        Something didn&apos;t load quite right. Try again, or head back to the collection — your bag
        is still saved.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn btn-primary">
          Try again
        </button>
        <Link href="/shop" className="btn btn-outline">
          Shop the collection
        </Link>
      </div>
    </div>
  );
}
