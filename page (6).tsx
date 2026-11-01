import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOrderByNumber } from "@/lib/data";
import { deliveryMethods, formatDate, formatMoney, paymentMethods } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order confirmation",
  description: "Thank you for your V Glow PH order.",
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  const delivery =
    deliveryMethods.find((method) => method.id === order.deliveryMethod) ?? deliveryMethods[0];
  const payment = paymentMethods.find((method) => method.id === order.paymentMethod);
  const eta = new Date(order.createdAt);
  eta.setDate(eta.getDate() + (order.deliveryMethod === "same-day" ? 1 : order.deliveryMethod === "express" ? 2 : 4));

  return (
    <div className="container-luxe py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 text-gold">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M4 12.5l5.2 5.2L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="eyebrow mt-5">Order confirmed</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.03]">
            Thank you, {order.firstName}.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mocha">
            Your glow is officially in motion. We&apos;ve sent a confirmation to{" "}
            <span className="text-espresso">{order.email}</span> with your receipt and tracking
            details.
          </p>
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border border-ink/15 px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] text-espresso">
            <span>Order {order.orderNumber}</span>
            <span className="text-ink/20">|</span>
            <span className="text-mocha">{formatDate(order.createdAt)}</span>
            <span className="text-ink/20">|</span>
            <span className="text-gold">{order.status}</span>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Confirmed", note: "We have your order", active: true },
            { title: "Packed in Makati", note: "Within 24 business hours", active: false },
            { title: "On the way", note: `Estimated ${formatDate(eta)}`, active: false },
          ].map((stage, index) => (
            <div
              key={stage.title}
              className={`border p-4 ${stage.active ? "border-gold/50 bg-cream/50" : "border-ink/10"}`}
            >
              <p className="text-[9px] uppercase tracking-[0.18em] text-gold">
                Step {index + 1}
              </p>
              <p className="mt-1.5 font-display text-lg">{stage.title}</p>
              <p className="mt-0.5 text-[11px] text-mocha">{stage.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="border border-ink/10 p-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-gold">Delivering to</p>
            <p className="mt-2 text-[13px] leading-relaxed text-espresso">
              {order.firstName} {order.lastName}
              <br />
              {order.addressLine1}
              {order.addressLine2 && (
                <>
                  <br />
                  {order.addressLine2}
                </>
              )}
              <br />
              {order.city}, {order.province} {order.postalCode}
              <br />
              {order.phone}
            </p>
          </div>
          <div className="border border-ink/10 p-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-gold">Delivery & payment</p>
            <p className="mt-2 text-[13px] leading-relaxed text-espresso">
              {delivery.label}
              <br />
              <span className="text-mocha">{delivery.description}</span>
              <br />
              {payment?.label ?? order.paymentMethod}
              <br />
              <span className="text-mocha">
                {order.paymentMethod === "gcash"
                  ? "A GCash QR code was emailed to you."
                  : order.paymentMethod === "card"
                    ? "Demo order — no payment was captured."
                    : `Please prepare ${formatMoney(order.totalCents)} in cash.`}
              </span>
            </p>
            {order.notes && (
              <p className="mt-3 border-t border-ink/10 pt-3 text-[11px] text-mocha">
                Notes: {order.notes}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 border border-ink/10">
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-espresso">
              Your ritual ({order.itemCount} {order.itemCount === 1 ? "piece" : "pieces"})
            </p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-mocha">
              {order.items.length} {order.items.length === 1 ? "product" : "products"}
            </p>
          </div>
          <ul className="divide-y divide-ink/10 px-5">
            {order.items.map((item) => (
              <li key={`${item.productId}-${item.size}`} className="flex items-center gap-4 py-4">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-cream">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-display text-lg leading-tight hover:text-gold"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-mocha">
                    {item.size} · qty {item.quantity}
                  </p>
                </div>
                <p className="text-[13px] tabular-nums">
                  {formatMoney(item.unitPriceCents * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-ink/10 bg-cream/40 px-5 py-4 text-[12px]">
            <div className="flex justify-between">
              <dt className="text-mocha">Subtotal</dt>
              <dd className="tabular-nums">{formatMoney(order.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mocha">Shipping</dt>
              <dd className="tabular-nums">
                {order.shippingCents === 0 ? "Free" : formatMoney(order.shippingCents)}
              </dd>
            </div>
            {order.discountCents > 0 && (
              <div className="flex justify-between text-gold">
                <dt>Discount {order.discountCode ? `(${order.discountCode})` : ""}</dt>
                <dd className="tabular-nums">−{formatMoney(order.discountCents)}</dd>
              </div>
            )}
            <div className="flex items-baseline justify-between border-t border-ink/10 pt-2">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-espresso">Total paid</dt>
              <dd className="font-display text-2xl tabular-nums">{formatMoney(order.totalCents)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-9 flex flex-col items-center justify-between gap-4 border border-gold/30 bg-cream/50 px-5 py-5 sm:flex-row">
          <div>
            <p className="font-display text-xl">Every order ships verified.</p>
            <p className="mt-1 text-[12px] text-mocha">
              Your authenticity card and batch code are in the box — scan to verify your Luxxe White.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/shop" className="btn btn-primary">
              Keep glowing
            </Link>
            <Link href="/help" className="btn btn-outline">
              Need help?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
