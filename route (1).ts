import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const source = typeof body?.source === "string" ? body.source.slice(0, 80) : "site";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    await db.insert(subscribers).values({ email, source }).onConflictDoNothing();

    return Response.json({
      ok: true,
      message: "You're on the list — your 10% code is on its way. ✦",
    });
  } catch {
    return Response.json(
      { error: "We couldn't save your email just now. Please try again." },
      { status: 500 },
    );
  }
}
