import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export type ProductSize = {
  label: string;
  priceCents: number;
  compareAtCents?: number;
};

export type OrderItem = {
  productId: number;
  slug: string;
  name: string;
  size: string;
  image: string;
  unitPriceCents: number;
  quantity: number;
};

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  subtitle: text("subtitle").notNull(),
  collection: varchar("collection", { length: 80 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  ritual: text("ritual").notNull(),
  ingredients: text("ingredients").notNull(),
  benefits: jsonb("benefits").$type<string[]>().notNull().default([]),
  concerns: jsonb("concerns").$type<string[]>().notNull().default([]),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  sizes: jsonb("sizes").$type<ProductSize[]>().notNull().default([]),
  priceCents: integer("price_cents").notNull(),
  compareAtCents: integer("compare_at_cents"),
  badge: varchar("badge", { length: 40 }),
  stock: integer("stock").notNull().default(120),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("5.00"),
  reviewCount: integer("review_count").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  isBestseller: boolean("is_bestseller").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  authorName: varchar("author_name", { length: 120 }).notNull(),
  authorLocation: varchar("author_location", { length: 120 }),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  body: text("body").notNull(),
  isVerified: boolean("is_verified").notNull().default(true),
  helpfulCount: integer("helpful_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 32 }).notNull().unique(),
  email: varchar("email", { length: 200 }).notNull(),
  firstName: varchar("first_name", { length: 120 }).notNull(),
  lastName: varchar("last_name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  addressLine1: varchar("address_line1", { length: 240 }).notNull(),
  addressLine2: varchar("address_line2", { length: 240 }),
  city: varchar("city", { length: 120 }).notNull(),
  province: varchar("province", { length: 120 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  region: varchar("region", { length: 40 }).notNull().default("PH"),
  deliveryMethod: varchar("delivery_method", { length: 60 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 60 }).notNull(),
  notes: text("notes"),
  discountCode: varchar("discount_code", { length: 40 }),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull(),
  discountCents: integer("discount_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  itemCount: integer("item_count").notNull(),
  items: jsonb("items").$type<OrderItem[]>().notNull().default([]),
  status: varchar("status", { length: 40 }).notNull().default("confirmed"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  source: varchar("source", { length: 80 }).notNull().default("footer"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Order = typeof orders.$inferSelect;
