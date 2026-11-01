import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-luxe flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 max-w-xl font-display text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.02]">
        This one slipped through the glow.
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-mocha">
        The page you were looking for has moved or sold out. Let&apos;s get you back to something
        beautiful.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link href="/shop" className="btn btn-primary">
          Shop the collection
        </Link>
        <Link href="/" className="btn btn-outline">
          Back home
        </Link>
      </div>
    </div>
  );
}
