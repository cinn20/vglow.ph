export const CURRENCY = "PHP";

export const FREE_SHIPPING_THRESHOLD_CENTS = 200000;

export const deliveryMethods = [
  {
    id: "standard",
    label: "Standard delivery",
    description: "Metro Manila & major cities · 3–5 business days",
    feeCents: 9900,
  },
  {
    id: "express",
    label: "Express delivery",
    description: "Nationwide air freight · 1–2 business days",
    feeCents: 19900,
  },
  {
    id: "same-day",
    label: "Same-day (Metro Manila)",
    description: "Order before 12nn, delivered by 8pm",
    feeCents: 29900,
  },
] as const;

export type DeliveryMethodId = (typeof deliveryMethods)[number]["id"];

export const paymentMethods = [
  {
    id: "gcash",
    label: "GCash",
    description: "Scan a QR code at checkout confirmation",
  },
  {
    id: "card",
    label: "Credit / Debit card",
    description: "Visa, Mastercard, JCB — secured by 3D Secure",
  },
  {
    id: "cod",
    label: "Cash on delivery",
    description: "Pay the rider in cash when your order arrives",
  },
] as const;

export type PaymentMethodId = (typeof paymentMethods)[number]["id"];

export type DiscountCode = {
  code: string;
  label: string;
  percentOff?: number;
  amountOffCents?: number;
  minSubtotalCents?: number;
};

export const discountCodes: DiscountCode[] = [
  {
    code: "GLOW10",
    label: "10% off your order",
    percentOff: 10,
    minSubtotalCents: 100000,
  },
  {
    code: "WELCOME15",
    label: "15% off orders over ₱2,500",
    percentOff: 15,
    minSubtotalCents: 250000,
  },
  {
    code: "FREESHIP",
    label: "Free standard shipping",
    amountOffCents: 9900,
  },
];

export function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

export function findDiscount(code: string | null | undefined) {
  if (!code) return null;
  const normalized = normalizeCode(code);
  return discountCodes.find((entry) => entry.code === normalized) ?? null;
}

export function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export type PricingLine = {
  unitPriceCents: number;
  quantity: number;
};

export type PricingResult = {
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  totalCents: number;
  itemCount: number;
  discount: DiscountCode | null;
  discountError: string | null;
  freeShippingRemainingCents: number;
};

export function computeTotals({
  lines,
  deliveryMethod,
  discountCode,
}: {
  lines: PricingLine[];
  deliveryMethod: string;
  discountCode?: string | null;
}): PricingResult {
  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
  const subtotalCents = lines.reduce(
    (total, line) => total + line.unitPriceCents * line.quantity,
    0,
  );

  const method =
    deliveryMethods.find((entry) => entry.id === deliveryMethod) ?? deliveryMethods[0];

  const qualifiesForFreeShipping =
    subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS && method.id !== "same-day";
  let shippingCents = qualifiesForFreeShipping ? 0 : method.feeCents;

  const discount = findDiscount(discountCode);
  let discountCents = 0;
  let discountError: string | null = null;

  if (discountCode && !discount) {
    discountError = "That code isn't valid. Try GLOW10.";
  }

  if (discount) {
    if (discount.minSubtotalCents && subtotalCents < discount.minSubtotalCents) {
      discountError = `Spend ${formatMoney(discount.minSubtotalCents)} to use ${discount.code}.`;
    } else if (discount.percentOff) {
      discountCents = Math.round(subtotalCents * (discount.percentOff / 100));
    } else if (discount.amountOffCents) {
      // Shipping credit — shown as a shipping reduction, not a line discount.
      shippingCents = Math.max(0, shippingCents - discount.amountOffCents);
    }
  }

  const totalCents = Math.max(0, subtotalCents + shippingCents - discountCents);

  return {
    subtotalCents,
    shippingCents,
    discountCents,
    totalCents,
    itemCount,
    discount: discountError ? null : discount,
    discountError,
    freeShippingRemainingCents: Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents),
  };
}

export function formatDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const random = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `VG-${stamp}${random}`;
}
