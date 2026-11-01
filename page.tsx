import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "V Glow PH is the trusted Philippine store for Velorian Luxxe White and AIVEE Cosmetics — Ultima, Enhanced Glutathione, Renew, Slim, Protect, the 01 · 02 · 03 bars, and Aivee Skin clinic-grade care.",
};

const standards = [
  {
    title: "Authentic, always",
    body: "Every bottle and bar arrives sealed with its manufacturer authenticity code. We verify each batch against its FDA registration before it reaches the shelf — no repacks, no relabels, no fakes.",
  },
  {
    title: "Two houses we trust",
    body: "Velorian Luxxe White from Ultima to the 01 · 02 · 03 bars, plus Dr. Aivee Teo's AIVEE Cosmetics — the Glass Ampoule, The One Cream, and Lumi SPF44. One trusted source instead of five sellers.",
  },
  {
    title: "Proof over promises",
    body: "We publish every review, including the three-star ones, and we explain what the capsules can and cannot do. Realistic timelines — usually four to eight weeks — keep expectations honest.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-cream">
        <div className="container-luxe grid gap-10 py-14 md:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Our story</p>
            <h1 className="mt-4 font-display text-[clamp(2.6rem,5.6vw,4.4rem)] leading-[0.98]">
              Velorian Luxxe White
              <span className="block italic text-gold">and AIVEE Cosmetics, authenticated.</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mocha">
              V Glow PH began in 2019 at a small Makati counter with one rule: only sell what we would
              take ourselves. Today, 18,000 orders later, that rule still decides everything — which
              batches we accept, how we store them, and which brands earn a place on the shelf.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn btn-primary px-9">
                Shop all products
              </Link>
              <Link href="/help" className="btn btn-outline px-9">
                Talk to our team
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand lg:max-w-[480px] lg:justify-self-end">
            <Image
              src="/images/hero.jpg"
              alt="A V Glow PH customer holding authentic Luxxe White products"
              fill
              priority
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-luxe py-16 md:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Since 2019</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.1rem)] leading-[1.03]">
            A small store with a long memory.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-mocha">
            We still read every message. We still check every batch code by hand. And we still refuse
            to sell a product we wouldn&apos;t send to our own sisters.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {standards.map((item, index) => (
            <Reveal key={item.title} delay={index * 110}>
              <div className="h-full border-t border-ink/15 pt-6">
                <span className="font-display text-3xl text-gold/50">0{index + 1}</span>
                <h3 className="mt-3 font-display text-2xl">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-mocha">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-espresso text-ivory">
        <div className="container-luxe grid gap-10 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative aspect-[5/4] w-full overflow-hidden">
            <Image
              src="/images/products/set.jpg"
              alt="The Luxxe White ritual set"
              fill
              sizes="(min-width: 1024px) 620px, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={100}>
            <p className="eyebrow text-gold-soft">The V Glow PH promise</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,3.8vw,3rem)] leading-[1.05]">
              If your skin doesn&apos;t love it, we&apos;ll make it right.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/65">
              Thirty days, no awkward questions. Message us with your order number and we&apos;ll
              arrange a refund or a swap — because a product that doesn&apos;t work for you should
              never become clutter in your cabinet.
            </p>
            <ul className="mt-7 space-y-3 text-[13px] text-ivory/80">
              {[
                "Free standard shipping on orders over ₱2,000",
                "Dispatched from Makati within 24 business hours",
                "GCash, card, and cash-on-delivery accepted",
                "Sealed products with verified FDA registration",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-[7px] h-1 w-3 shrink-0 bg-gold-soft" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/shop" className="btn btn-ivory mt-8">
              Shop the full range
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-16 md:py-24">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">From the founder</p>
          <p className="quote-serif mt-5 text-[clamp(1.5rem,3vw,2.3rem)] leading-[1.35] text-espresso">
            “Brightening should feel like something you choose for yourself — not something you owe
            the world. Our job is simple: get you the real product, at a fair price, with honest
            answers about what it can do.”
          </p>
          <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-gold">
            Veronique Lagman · Founder, V Glow PH
          </p>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { value: "18,000+", label: "Orders delivered" },
            { value: "4.9 / 5", label: "Average rating" },
            { value: "21", label: "Curated products" },
            { value: "100%", label: "Sealed & authentic" },
          ].map((stat) => (
            <div key={stat.label} className="border border-ink/10 px-4 py-6 text-center">
              <p className="font-display text-3xl text-espresso">{stat.value}</p>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-mocha">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
