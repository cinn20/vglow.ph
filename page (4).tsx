import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your authentic Luxxe White order — secure checkout with GCash, card, or COD, shipped from Makati.",
};

export default function CheckoutPage() {
  return (
    <div className="bg-ivory">
      <CheckoutClient />
    </div>
  );
}
