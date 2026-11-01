"use client";

import { useState } from "react";

export function NewsletterForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "site" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("success");
      setMessage(data.message ?? "You're on the list. Watch your inbox.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  const dark = variant === "dark";

  return (
    <div>
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email address"
          aria-label="Email address"
          required
          className={
            dark
              ? "w-full flex-1 border border-ivory/25 bg-transparent px-4 py-3 text-sm text-ivory placeholder:text-ivory/45 focus:border-gold-soft focus:outline-none"
              : "input-luxe flex-1"
          }
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`btn ${dark ? "btn-gold" : "btn-primary"} shrink-0 px-7`}
        >
          {status === "loading" ? "Joining…" : status === "success" ? "Joined ✦" : "Join the glow"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-2 text-xs ${
            status === "error"
              ? "text-wine"
              : dark
                ? "text-gold-soft"
                : "text-gold"
          }`}
          role="status"
        >
          {message}
        </p>
      )}
      {!message && (
        <p className={`mt-2 text-[11px] ${dark ? "text-ivory/45" : "text-mocha"}`}>
          Early access to drops, 10% off your first order. No noise — we promise.
        </p>
      )}
    </div>
  );
}
