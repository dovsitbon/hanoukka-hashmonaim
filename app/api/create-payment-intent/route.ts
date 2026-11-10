import Stripe from "stripe";

export const runtime = "nodejs";

// Montants en centimes : minimum 5 €, plafond 50 000 € (garde-fou contre une faute de frappe)
const MIN = 500;
const MAX = 5_000_000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return Response.json({ error: "config" }, { status: 500 });

  let body: { amount?: unknown; email?: unknown; lang?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const amount = Number(body.amount);
  if (!Number.isInteger(amount) || amount < MIN || amount > MAX) {
    return Response.json({ error: "amount" }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!EMAIL.test(email)) return Response.json({ error: "email" }, { status: 400 });
  const lang = typeof body.lang === "string" ? body.lang.slice(0, 2) : "";

  try {
    const stripe = new Stripe(key);
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      description: "Don Hanoukka – soldats au front",
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
      metadata: { lang },
    });
    return Response.json({ clientSecret: intent.client_secret });
  } catch (e) {
    console.error("create-payment-intent", e);
    return Response.json({ error: "stripe" }, { status: 502 });
  }
}
