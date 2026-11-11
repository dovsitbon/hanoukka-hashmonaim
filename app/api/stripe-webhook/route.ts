import Stripe from "stripe";
import { revalidatePath, revalidateTag } from "next/cache";
import { CAMPAIGN_TAG } from "@/lib/campaign";
import { locales } from "@/lib/i18n";

export const runtime = "nodejs";

const HANDLED = new Set(["payment_intent.succeeded", "charge.refunded", "checkout.session.completed"]);
const seen = new Set<string>(); // doublons (Stripe peut renvoyer le même événement)

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) return new Response("config", { status: 500 });

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("signature manquante", { status: 400 });

  let event: Stripe.Event;
  try {
    event = new Stripe(key).webhooks.constructEvent(await req.text(), signature, secret);
  } catch {
    return new Response("signature invalide", { status: 400 });
  }

  if (HANDLED.has(event.type) && !seen.has(event.id)) {
    seen.add(event.id);
    if (seen.size > 1000) seen.clear();
    // Vide le cache : la jauge et les pages sont recalculées à la prochaine visite
    revalidateTag(CAMPAIGN_TAG, { expire: 0 });
    for (const l of locales) revalidatePath(`/${l}`);
  }
  return Response.json({ received: true });
}
