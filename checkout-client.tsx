"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import {
  computeTotals,
  deliveryMethods,
  formatMoney,
  FREE_SHIPPING_THRESHOLD_CENTS,
  paymentMethods,
  type DeliveryMethodId,
  type PaymentMethodId,
} from "@/lib/pricing";

const provinces = [
  "Metro Manila",
  "Cavite",
  "Laguna",
  "Batangas",
  "Rizal",
  "Bulacan",
  "Pampanga",
  "Cebu",
  "Iloilo",
  "Negros Occidental",
  "Davao del Sur",
  "Misamis Oriental",
  "Benguet",
  "Albay",
  "Pangasinan",
  "Other province",
];

const steps = ["Details", "Delivery & payment", "Review"] as const;

type Fields = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
  notes: string;
};

const initialFields: Fields = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  province: "Metro Manila",
  postalCode: "",
  notes: "",
};

export function CheckoutClient() {
  const { items, subtotalCents, itemCount, hydrated, clearCart, setQuantity, removeItem } =
    useCart();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState<Fields>(initialFields);
  const [delivery, setDelivery] = useState<DeliveryMethodId>("standard");
  const [payment, setPayment] = useState<PaymentMethodId>("gcash");
  const [codeInput, setCodeInput] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totals = useMemo(
    () =>
      computeTotals({
        lines: items.map((line) => ({
          unitPriceCents: line.unitPriceCents,
          quantity: line.quantity,
        })),
        deliveryMethod: delivery,
        discountCode: appliedCode || null,
      }),
    [items, delivery, appliedCode],
  );

  const set = (key: keyof Fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields((current) => ({ ...current, [key]: event.target.value }));

  const validateStepOne = () => {
    const missing: string[] = [];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email)) missing.push("a valid email");
    if (fields.firstName.trim().length < 2) missing.push("first name");
    if (fields.lastName.trim().length < 2) missing.push("last name");
    if (fields.phone.replace(/\D/g, "").length < 10) missing.push("mobile number");
    if (fields.addressLine1.trim().length < 4) missing.push("street address");
    if (fields.city.trim().length < 2) missing.push("city");
    if (fields.postalCode.trim().length < 4) missing.push("postal code");
    if (missing.length) {
      setError(`Please add ${missing.join(", ")}.`);
      return false;
    }
    setError("");
    return true;
  };

  const applyCode = () => {
    const candidate = codeInput.trim().toUpperCase();
    if (!candidate) return;
    const result = computeTotals({
      lines: items.map((line) => ({
        unitPriceCents: line.unitPriceCents,
        quantity: line.quantity,
      })),
      deliveryMethod: delivery,
      discountCode: candidate,
    });
    if (result.discountError) {
      setCodeError(result.discountError);
      setAppliedCode("");
      return;
    }
    setCodeError("");
    setAppliedCode(candidate);
    setCodeInput("");
  };

  const placeOrder = async () => {
    if (items.length === 0) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          deliveryMethod: delivery,
          paymentMethod: payment,
          discountCode: appliedCode,
          items: items.map((line) => ({
            productId: line.productId,
            size: line.size,
            quantity: line.quantity,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not place order.");
      clearCart();
      router.push(`/order/${data.orderNumber}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not place order.");
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="container-luxe flex min-h-[50vh] items-center justify-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-mocha">Preparing checkout…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-luxe flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
        <p className="eyebrow">Checkout</p>
        <h1 className="font-display text-4xl">Your bag is quiet.</h1>
        <p className="max-w-sm text-sm text-mocha">
          Add a little Luxxe White to your bag and we&apos;ll be right here — free shipping kicks in at{" "}
          {formatMoney(FREE_SHIPPING_THRESHOLD_CENTS)}.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/shop" className="btn btn-primary">
            Shop the collection
          </Link>
          <Link href="/products/luxxe-white-ultima-glow-bundle" className="btn btn-outline">
            Shop the glow bundle
          </Link>
        </div>
      </div>
    );
  }

  const deliveryChoice =
    deliveryMethods.find((method) => method.id === delivery) ?? deliveryMethods[0];

  return (
    <div className="container-luxe py-10 md:py-14">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Secure checkout</p>
          <h1 className="mt-3 font-display text-[clamp(2.1rem,4.4vw,3.2rem)] leading-none">
            Let&apos;s get you glowing.
          </h1>
        </div>
        <Link href="/shop" className="link-underline text-[10px] uppercase tracking-[0.18em] text-mocha">
          Continue shopping
        </Link>
      </div>

      <ol className="mt-8 flex items-center gap-2 border-y border-ink/10 py-4 md:gap-6">
        {steps.map((label, index) => {
          const state = index === step ? "current" : index < step ? "done" : "todo";
          return (
            <li key={label} className="flex flex-1 items-center gap-2 md:gap-3">
              <button
                type="button"
                onClick={() => index < step && setStep(index)}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] tabular-nums transition ${
                  state === "current"
                    ? "border-ink bg-ink text-ivory"
                    : state === "done"
                      ? "border-gold bg-gold/15 text-gold"
                      : "border-ink/20 text-mocha"
                }`}
                aria-current={state === "current" ? "step" : undefined}
              >
                {state === "done" ? "✓" : index + 1}
              </button>
              <span
                className={`text-[9px] uppercase tracking-[0.14em] md:text-[10px] md:tracking-[0.18em] ${
                  state === "current" ? "text-espresso" : "text-mocha"
                }`}
              >
                {label}
              </span>
              {index < steps.length - 1 && <span className="ml-auto hidden h-px flex-1 bg-ink/10 md:block" />}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          {step === 0 && (
            <div className="animate-fade-up">
              <h2 className="font-display text-2xl">Contact & shipping</h2>
              <p className="mt-1 text-[12px] text-mocha">
                We&apos;ll send your order confirmation and tracking here.
              </p>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="label-luxe" htmlFor="email">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="input-luxe"
                    value={fields.email}
                    onChange={set("email")}
                    placeholder="you@email.com"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label-luxe" htmlFor="firstName">
                      First name
                    </label>
                    <input
                      id="firstName"
                      autoComplete="given-name"
                      className="input-luxe"
                      value={fields.firstName}
                      onChange={set("firstName")}
                    />
                  </div>
                  <div>
                    <label className="label-luxe" htmlFor="lastName">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      autoComplete="family-name"
                      className="input-luxe"
                      value={fields.lastName}
                      onChange={set("lastName")}
                    />
                  </div>
                </div>
                <div>
                  <label className="label-luxe" htmlFor="phone">
                    Mobile number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    className="input-luxe"
                    value={fields.phone}
                    onChange={set("phone")}
                    placeholder="+63 917 000 0000"
                  />
                </div>
                <div>
                  <label className="label-luxe" htmlFor="addressLine1">
                    Street address
                  </label>
                  <input
                    id="addressLine1"
                    autoComplete="address-line1"
                    className="input-luxe"
                    value={fields.addressLine1}
                    onChange={set("addressLine1")}
                    placeholder="Unit, building, street, barangay"
                  />
                </div>
                <div>
                  <label className="label-luxe" htmlFor="addressLine2">
                    Landmark / delivery notes (optional)
                  </label>
                  <input
                    id="addressLine2"
                    className="input-luxe"
                    value={fields.addressLine2}
                    onChange={set("addressLine2")}
                    placeholder="Near the corner pharmacy, gate 2"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="label-luxe" htmlFor="city">
                      City
                    </label>
                    <input
                      id="city"
                      autoComplete="address-level2"
                      className="input-luxe"
                      value={fields.city}
                      onChange={set("city")}
                    />
                  </div>
                  <div>
                    <label className="label-luxe" htmlFor="province">
                      Province
                    </label>
                    <select
                      id="province"
                      className="input-luxe"
                      value={fields.province}
                      onChange={set("province")}
                    >
                      {provinces.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-luxe" htmlFor="postalCode">
                      Postal code
                    </label>
                    <input
                      id="postalCode"
                      autoComplete="postal-code"
                      className="input-luxe"
                      value={fields.postalCode}
                      onChange={set("postalCode")}
                    />
                  </div>
                </div>
              </div>

              {error && <p className="mt-4 text-[12px] text-wine">{error}</p>}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => validateStepOne() && setStep(1)}
                  className="btn btn-primary w-full sm:w-auto sm:px-10"
                >
                  Continue to delivery
                </button>
                <p className="text-[10px] uppercase tracking-[0.12em] text-mocha">
                  Step 1 of 3 · takes about 40 seconds
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-up">
              <h2 className="font-display text-2xl">Delivery</h2>
              <div className="mt-4 space-y-2.5">
                {deliveryMethods.map((method) => {
                  const active = delivery === method.id;
                  const free = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS && method.id !== "same-day";
                  return (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-start justify-between gap-4 border px-4 py-3.5 transition ${
                        active ? "border-ink bg-cream/60" : "border-ink/15 hover:border-ink/40"
                      }`}
                    >
                      <span className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            active ? "border-ink" : "border-ink/30"
                          }`}
                        >
                          {active && <span className="h-2 w-2 rounded-full bg-ink" />}
                        </span>
                        <span>
                          <span className="block text-[12px] uppercase tracking-[0.1em] text-espresso">
                            {method.label}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-mocha">
                            {method.description}
                          </span>
                        </span>
                      </span>
                      <span className="text-[12px] tabular-nums text-espresso">
                        {free ? "Free" : formatMoney(method.feeCents)}
                      </span>
                      <input
                        type="radio"
                        name="delivery"
                        value={method.id}
                        checked={active}
                        onChange={() => setDelivery(method.id)}
                        className="sr-only"
                      />
                    </label>
                  );
                })}
              </div>

              <h2 className="mt-9 font-display text-2xl">Payment</h2>
              <div className="mt-4 space-y-2.5">
                {paymentMethods.map((method) => {
                  const active = payment === method.id;
                  return (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-start gap-3 border px-4 py-3.5 transition ${
                        active ? "border-ink bg-cream/60" : "border-ink/15 hover:border-ink/40"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          active ? "border-ink" : "border-ink/30"
                        }`}
                      >
                        {active && <span className="h-2 w-2 rounded-full bg-ink" />}
                      </span>
                      <span className="flex-1">
                        <span className="block text-[12px] uppercase tracking-[0.1em] text-espresso">
                          {method.label}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-mocha">
                          {method.description}
                        </span>
                      </span>
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={active}
                        onChange={() => setPayment(method.id)}
                        className="sr-only"
                      />
                    </label>
                  );
                })}
              </div>

              <div className="mt-8">
                <label className="label-luxe" htmlFor="notes">
                  Order notes (optional)
                </label>
                <textarea
                  id="notes"
                  className="input-luxe min-h-[80px] resize-y"
                  value={fields.notes}
                  onChange={set("notes")}
                  placeholder="Gift note, preferred delivery window, allergies…"
                />
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => setStep(0)} className="btn btn-outline sm:w-auto">
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn btn-primary w-full sm:w-auto sm:px-10"
                >
                  Review order
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-up">
              <h2 className="font-display text-2xl">Review & place order</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="border border-ink/10 p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-gold">Ship to</p>
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="text-[10px] uppercase tracking-[0.12em] text-mocha underline decoration-ink/20 underline-offset-4 hover:text-ink"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-espresso">
                    {fields.firstName} {fields.lastName}
                    <br />
                    {fields.addressLine1}
                    {fields.addressLine2 && (
                      <>
                        <br />
                        {fields.addressLine2}
                      </>
                    )}
                    <br />
                    {fields.city}, {fields.province} {fields.postalCode}
                    <br />
                    {fields.phone}
                    <br />
                    {fields.email}
                  </p>
                </div>
                <div className="border border-ink/10 p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-gold">Method</p>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[10px] uppercase tracking-[0.12em] text-mocha underline decoration-ink/20 underline-offset-4 hover:text-ink"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-espresso">
                    {deliveryChoice.label}
                    <br />
                    <span className="text-mocha">{deliveryChoice.description}</span>
                    <br />
                    {paymentMethods.find((method) => method.id === payment)?.label}
                    <br />
                    <span className="text-mocha">
                      {payment === "gcash"
                        ? "QR sent via email after confirmation."
                        : payment === "card"
                          ? "Demo checkout — no card is charged."
                          : "Please prepare exact change."}
                    </span>
                  </p>
                </div>
              </div>

              <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                {items.map((line) => (
                  <li key={line.id} className="flex items-center gap-4 py-3.5">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-cream">
                      <Image src={line.image} alt={line.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-base leading-tight">{line.name}</p>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-mocha">
                        {line.size} · qty {line.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden items-center border border-ink/15 sm:flex">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.id, line.quantity - 1)}
                          className="h-7 w-7 text-mocha hover:text-ink"
                          aria-label={`Decrease ${line.name}`}
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-[11px] tabular-nums">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.id, line.quantity + 1)}
                          className="h-7 w-7 text-mocha hover:text-ink"
                          aria-label={`Increase ${line.name}`}
                        >
                          +
                        </button>
                      </div>
                      <p className="w-20 text-right text-[12px] tabular-nums">
                        {formatMoney(line.unitPriceCents * line.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(line.id)}
                        className="text-[10px] uppercase tracking-[0.1em] text-mocha hover:text-wine"
                        aria-label={`Remove ${line.name}`}
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {error && <p className="mt-4 text-[12px] text-wine">{error}</p>}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => setStep(1)} className="btn btn-outline">
                  Back
                </button>
                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={submitting}
                  className="btn btn-gold w-full sm:w-auto sm:px-10"
                >
                  {submitting ? "Placing order…" : `Place order · ${formatMoney(totals.totalCents)}`}
                </button>
              </div>
              <p className="mt-3 text-center text-[10px] leading-relaxed text-mocha sm:text-right">
                By placing your order you agree to our terms and privacy policy. Demo store — no
                payment is captured.
              </p>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-ink/10 bg-white/70 p-5 md:p-6">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.2em] text-espresso">Order summary</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-mocha">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>

            <ul className="mt-5 max-h-[240px] space-y-4 overflow-y-auto pr-1">
              {items.map((line) => (
                <li key={line.id} className="flex gap-3">
                  <div className="relative h-[68px] w-[56px] shrink-0 overflow-hidden bg-cream">
                    <Image src={line.image} alt={line.name} fill sizes="56px" className="object-cover" />
                    <span className="absolute right-0 top-0 bg-ink px-1 text-[9px] text-ivory tabular-nums">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-espresso">{line.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-mocha">{line.size}</p>
                    <p className="mt-1 text-[11px] tabular-nums text-espresso">
                      {formatMoney(line.unitPriceCents * line.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-ink/10 pt-4">
              <label className="label-luxe" htmlFor="discount">
                Discount code
              </label>
              <div className="flex gap-2">
                <input
                  id="discount"
                  className="input-luxe"
                  value={codeInput}
                  onChange={(event) => setCodeInput(event.target.value)}
                  placeholder="GLOW10"
                />
                <button
                  type="button"
                  onClick={applyCode}
                  className="shrink-0 border border-ink/20 px-4 text-[10px] uppercase tracking-[0.14em] text-espresso transition hover:bg-ink hover:text-ivory"
                >
                  Apply
                </button>
              </div>
              {codeError && <p className="mt-2 text-[11px] text-wine">{codeError}</p>}
              {appliedCode && totals.discount && (
                <p className="mt-2 flex items-center justify-between text-[11px] text-gold">
                  <span>{totals.discount.code} applied</span>
                  <button
                    type="button"
                    onClick={() => setAppliedCode("")}
                    className="text-mocha underline decoration-ink/20 underline-offset-2"
                  >
                    Remove
                  </button>
                </p>
              )}
              <p className="mt-2 text-[10px] text-mocha">
                Try <span className="text-espresso">GLOW10</span> for 10% off.
              </p>
            </div>

            <dl className="mt-5 space-y-2.5 border-t border-ink/10 pt-4 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-mocha">Subtotal</dt>
                <dd className="tabular-nums">{formatMoney(totals.subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-mocha">Shipping</dt>
                <dd className="tabular-nums">
                  {totals.shippingCents === 0 ? "Free" : formatMoney(totals.shippingCents)}
                </dd>
              </div>
              {totals.discountCents > 0 && (
                <div className="flex justify-between text-gold">
                  <dt>Discount</dt>
                  <dd className="tabular-nums">−{formatMoney(totals.discountCents)}</dd>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-ink/10 pt-3">
                <dt className="text-[10px] uppercase tracking-[0.18em] text-espresso">Total</dt>
                <dd className="font-display text-2xl tabular-nums">{formatMoney(totals.totalCents)}</dd>
              </div>
            </dl>

            {totals.freeShippingRemainingCents > 0 ? (
              <p className="mt-4 bg-cream/70 px-3 py-2.5 text-[10px] uppercase tracking-[0.1em] text-mocha">
                Add {formatMoney(totals.freeShippingRemainingCents)} for free shipping
              </p>
            ) : (
              <p className="mt-4 bg-sage/15 px-3 py-2.5 text-[10px] uppercase tracking-[0.1em] text-[#5d6b54]">
                Free shipping unlocked ✦
              </p>
            )}

            <ul className="mt-4 space-y-1.5 text-[10px] uppercase tracking-[0.1em] text-mocha">
              <li>· 30-day glow guarantee</li>
              <li>· Ships in 24h from Makati</li>
              <li>· Complimentary ritual card & samples</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
