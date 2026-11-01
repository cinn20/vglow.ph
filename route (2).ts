import { db } from "@/db";
import { orders, products, type OrderItem } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import {
  computeTotals,
  deliveryMethods,
  generateOrderNumber,
  normalizeCode,
  paymentMethods,
} from "@/lib/pricing";

export const dynamic = "force-dynamic";

type IncomingItem = { productId: number; size?: string; quantity?: number };

function stringField(value: unknown, max = 240) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = await request.json().catch(() => null);
    if (!body) {
      return Response.json({ error: "Invalid request." }, { status: 400 });
    }

    const incomingItems: IncomingItem[] = Array.isArray(body.items) ? body.items : [];
    if (incomingItems.length === 0) {
      return Response.json({ error: "Your bag is empty." }, { status: 400 });
    }

    const shipping = body.shipping ?? {};
    const email = stringField(body.email ?? shipping.email, 200).toLowerCase();
    const firstName = stringField(body.firstName ?? shipping.firstName, 120);
    const lastName = stringField(body.lastName ?? shipping.lastName, 120);
    const phone = stringField(body.phone ?? shipping.phone, 40);
    const addressLine1 = stringField(body.addressLine1 ?? shipping.addressLine1, 240);
    const addressLine2 = stringField(body.addressLine2 ?? shipping.addressLine2, 240);
    const city = stringField(body.city ?? shipping.city, 120);
    const province = stringField(body.province ?? shipping.province, 120);
    const postalCode = stringField(body.postalCode ?? shipping.postalCode, 20);
    const notes = stringField(body.notes, 600);
    const deliveryMethod = stringField(body.deliveryMethod, 60) || deliveryMethods[0].id;
    const paymentMethod = stringField(body.paymentMethod, 60) || paymentMethods[0].id;
    const discountCode = normalizeCode(stringField(body.discountCode, 40));

    const missing: string[] = [];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) missing.push("a valid email");
    if (firstName.length < 2) missing.push("first name");
    if (lastName.length < 2) missing.push("last name");
    if (phone.replace(/\D/g, "").length < 10) missing.push("a valid mobile number");
    if (addressLine1.length < 4) missing.push("street address");
    if (city.length < 2) missing.push("city");
    if (province.length < 2) missing.push("province");
    if (postalCode.length < 4) missing.push("postal code");

    if (missing.length) {
      return Response.json(
        { error: `Please add ${missing.join(", ")}.` },
        { status: 400 },
      );
    }

    if (!deliveryMethods.some((method) => method.id === deliveryMethod)) {
      return Response.json({ error: "Please choose a delivery method." }, { status: 400 });
    }
    if (!paymentMethods.some((method) => method.id === paymentMethod)) {
      return Response.json({ error: "Please choose a payment method." }, { status: 400 });
    }

    const productIds = Array.from(
      new Set(
        incomingItems
          .map((item) => Number(item.productId))
          .filter((id) => Number.isInteger(id) && id > 0),
      ),
    );
    if (productIds.length === 0) {
      return Response.json({ error: "Your bag is empty." }, { status: 400 });
    }

    const catalog = await db.select().from(products);
    const catalogById = new Map(catalog.map((product) => [product.id, product]));

    const lineItems: OrderItem[] = [];
    for (const item of incomingItems) {
      const product = catalogById.get(Number(item.productId));
      if (!product) continue;

      const requestedSize = stringField(item.size, 80);
      const size =
        product.sizes.find((entry) => entry.label === requestedSize) ?? product.sizes[0];
      if (!size) continue;

      const quantity = Math.min(
        Math.max(1, Math.round(Number(item.quantity) || 1)),
        Math.max(1, product.stock),
        20,
      );

      lineItems.push({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        size: size.label,
        image: product.images[0] ?? "",
        unitPriceCents: size.priceCents,
        quantity,
      });
    }

    if (lineItems.length === 0) {
      return Response.json(
        { error: "Those products are no longer available. Please refresh your bag." },
        { status: 400 },
      );
    }

    const totals = computeTotals({
      lines: lineItems.map((line) => ({
        unitPriceCents: line.unitPriceCents,
        quantity: line.quantity,
      })),
      deliveryMethod,
      discountCode,
    });

    const orderNumber = generateOrderNumber();

    const [created] = await db
      .insert(orders)
      .values({
        orderNumber,
        email,
        firstName,
        lastName,
        phone,
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        province,
        postalCode,
        deliveryMethod,
        paymentMethod,
        notes: notes || null,
        discountCode: totals.discount ? totals.discount.code : null,
        subtotalCents: totals.subtotalCents,
        shippingCents: totals.shippingCents,
        discountCents: totals.discountCents,
        totalCents: totals.totalCents,
        itemCount: totals.itemCount,
        items: lineItems,
        status: "confirmed",
      })
      .returning({ orderNumber: orders.orderNumber });

    return Response.json({ ok: true, orderNumber: created?.orderNumber ?? orderNumber });
  } catch {
    return Response.json(
      { error: "We couldn't place your order. Please try again in a moment." },
      { status: 500 },
    );
  }
}
