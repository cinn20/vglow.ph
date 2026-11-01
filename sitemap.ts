import type { MetadataRoute } from "next";
import { seedProducts } from "@/db/seed-data";

const baseUrl = "https://vglow.ph";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/shop", "/about", "/help", "/checkout"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const productRoutes = seedProducts.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...productRoutes];
}
