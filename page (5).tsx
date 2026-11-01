import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer care",
  description:
    "Shipping, returns, order tracking, authenticity checks, and contact details for V Glow PH — your source for Velorian Luxxe White and AIVEE Cosmetics.",
};

const faqs = [
  {
    question: "How long does delivery take?",
    answer:
      "Metro Manila standard orders arrive in 3–5 business days; provincial orders in 4–7. Express delivery is 1–2 business days nationwide. Same-day delivery is available in Metro Manila for orders placed before 12nn.",
  },
  {
    question: "When is shipping free?",
    answer:
      "Standard shipping is free on all orders over ₱2,000. Below that, standard is ₱99, express ₱199, and same-day ₱299. Cash-on-delivery adds ₱49.",
  },
  {
    question: "Are your products safe for sensitive skin?",
    answer:
      "All Velorian Luxxe White and AIVEE Cosmetics products we stock are FDA registered and free from hydroquinone, mercury, and steroids. If you are pregnant, nursing, or on medication, please check with your doctor before starting glutathione capsules. For topicals like the Brilliant exfoliating cream, patch test on your inner arm for 24 hours first.",
  },
  {
    question: "Can I use the serum with tretinoin?",
    answer:
      "Yes — many of our customers do. Alternate mornings and nights when you first start, or layer the serum first, wait two minutes, then apply tretinoin. Always follow with SPF in the morning.",
  },
  {
    question: "How do I track my order?",
    answer:
      "You will receive an email with a tracking link the moment your parcel leaves our Makati studio. You can also message us your order number and we will send an update the same day.",
  },
  {
    question: "What is the glow guarantee?",
    answer:
      "Unopened, sealed products can be returned within 30 days of delivery for a refund or exchange. If a topical formula irritates your skin, send us a photo on Instagram or email and we will make it right. For safety reasons, opened capsules cannot be returned.",
  },
];

export default function HelpPage() {
  return (
    <div>
      <section className="border-b border-ink/10 bg-cream">
        <div className="container-luxe py-12 md:py-16">
          <p className="eyebrow">Customer care</p>
          <h1 className="mt-3 max-w-2xl font-display text-[clamp(2.3rem,5vw,3.6rem)] leading-[1.02]">
            Whatever you need, we&apos;re a message away.
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-mocha">
            Real humans in Makati, replying within one business day. Authenticity checks, dosage
            questions, delivery updates — ask us anything.
          </p>
        </div>
      </section>

      <div className="container-luxe grid gap-10 py-12 md:py-16 lg:grid-cols-[220px_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">On this page</p>
          <nav className="mt-4 space-y-2.5 text-[12px] text-mocha">
            {[
              { href: "#shipping", label: "Shipping & delivery" },
              { href: "#returns", label: "Returns & exchanges" },
              { href: "#track", label: "Track my order" },
              { href: "#contact", label: "Contact us" },
              { href: "#faq", label: "Frequently asked" },
            ].map((link) => (
              <a key={link.href} href={link.href} className="block hover:text-ink">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-7 border border-gold/30 bg-cream/60 p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-gold">Need it urgently?</p>
            <p className="mt-2 text-[12px] leading-relaxed text-espresso">
              Message us on Instagram{" "}
              <a href="https://instagram.com" className="underline decoration-ink/20 underline-offset-2">
                @vglowph
              </a>{" "}
              — we usually reply within the hour during business days.
            </p>
          </div>
        </aside>

        <div className="space-y-12">
          <section id="shipping" className="scroll-mt-28">
            <h2 className="font-display text-3xl">Shipping & delivery</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-mocha">
              Everything is dispatched from our Makati studio within 24 business hours, sealed,
              batch-verified, and wrapped in recyclable outer packaging so your gift stays a surprise.
            </p>
            <div className="mt-5 overflow-hidden border border-ink/10">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-cream/60 text-[9px] uppercase tracking-[0.14em] text-mocha">
                  <tr>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Timeframe</th>
                    <th className="px-4 py-3 text-right">Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10 text-espresso">
                  <tr>
                    <td className="px-4 py-3">Standard</td>
                    <td className="px-4 py-3 text-mocha">3–5 business days</td>
                    <td className="px-4 py-3 text-right tabular-nums">₱99 · free over ₱2,000</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Express</td>
                    <td className="px-4 py-3 text-mocha">1–2 business days</td>
                    <td className="px-4 py-3 text-right tabular-nums">₱199</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Same-day (Metro Manila)</td>
                    <td className="px-4 py-3 text-mocha">Order before 12nn</td>
                    <td className="px-4 py-3 text-right tabular-nums">₱299</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Cash on delivery</td>
                    <td className="px-4 py-3 text-mocha">Nationwide</td>
                    <td className="px-4 py-3 text-right tabular-nums">No extra fee</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="returns" className="scroll-mt-28">
            <h2 className="font-display text-3xl">Returns & exchanges</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-mocha">
              If a formula doesn&apos;t agree with your skin, tell us within 30 days. Unopened items
              receive a full refund or store credit; opened items that caused irritation are covered
              by our glow guarantee. Return shipping is on us for damaged or incorrect items.
            </p>
            <ul className="mt-4 space-y-2 text-[13px] text-mocha">
              {[
                "Start a return by emailing hello@vglow.ph with your order number.",
                "Refunds are processed to your original payment method within 5–7 business days.",
                "Sealed bottles and bars can be exchanged for store credit of equal value.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-[7px] h-1 w-3 shrink-0 bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section id="track" className="scroll-mt-28">
            <h2 className="font-display text-3xl">Track my order</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-mocha">
              Your tracking link arrives by email as soon as your parcel is scanned by our courier.
              If you have lost it, send us your order number (it starts with <span className="text-espresso">VG-</span>)
              and the email you used at checkout. We can also confirm your bottle&apos;s batch code and
              authenticity on request.
            </p>
            <p className="mt-3 text-[13px] text-mocha">
              You can also view the confirmation page again using the link in that email — it always
              reflects your current order status.
            </p>
            <Link href="/shop" className="btn btn-outline mt-5">
              Back to the shop
            </Link>
          </section>

          <section id="contact" className="scroll-mt-28">
            <h2 className="font-display text-3xl">Contact us</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Email", value: "hello@vglow.ph", note: "Replies within 1 business day" },
                { label: "Viber / WhatsApp", value: "+63 917 555 0132", note: "Mon–Sat, 9am–6pm PHT" },
                { label: "Instagram", value: "@vglowph", note: "DMs open, fastest response" },
                { label: "Studio", value: "24 Cordova St., Makati", note: "Pickup by appointment only" },
              ].map((item) => (
                <div key={item.label} className="border border-ink/10 p-4">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-gold">{item.label}</p>
                  <p className="mt-1.5 font-display text-lg text-espresso">{item.value}</p>
                  <p className="mt-0.5 text-[11px] text-mocha">{item.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="faq" className="scroll-mt-28">
            <h2 className="font-display text-3xl">Frequently asked</h2>
            <div className="mt-4 border-t border-ink/10">
              {faqs.map((faq) => (
                <details key={faq.question} className="group border-b border-ink/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[13px] text-espresso">
                    {faq.question}
                    <span className="text-gold transition group-open:rotate-45">＋</span>
                  </summary>
                  <p className="pb-4 text-[13px] leading-relaxed text-mocha">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
