import "server-only";
import Stripe from "stripe";
import { unstable_cache } from "next/cache";
import { CAMPAIGN, LEGACY_DESCRIPTION, type CampaignData, type Donor } from "@/lib/campaign-config";

export const CAMPAIGN_TAG = "campaign";
const MAX_LISTED = 300;

// Lit tous les paiements réussis de la campagne directement dans Stripe (pagination complète).
async function fetchFromStripe(): Promise<CampaignData> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY manquante");
  const stripe = new Stripe(key);
  const since = Math.floor(new Date(CAMPAIGN.start).getTime() / 1000);

  let total = 0;
  let donors = 0;
  const recent: Donor[] = [];

  for await (const pi of stripe.paymentIntents.list({ created: { gte: since }, limit: 100, expand: ["data.latest_charge"] })) {
    if (pi.status !== "succeeded" || pi.currency !== "eur") continue;
    const ours = pi.metadata?.campaign ? pi.metadata.campaign === CAMPAIGN.id : pi.description === LEGACY_DESCRIPTION;
    if (!ours) continue;
    const charge = typeof pi.latest_charge === "object" && pi.latest_charge ? pi.latest_charge : null;
    const net = pi.amount_received - (charge?.amount_refunded ?? 0);
    if (net <= 0) continue;

    total += net;
    donors += 1;
    if (recent.length < MAX_LISTED) {
      const anonymous = pi.metadata?.anonymous === "1";
      const name = (pi.metadata?.display_name || "").trim();
      recent.push({
        // Uniquement le nom choisi par le donateur : jamais l'email ni le nom de facturation
        name: anonymous || !name ? null : name.slice(0, 40),
        amount: CAMPAIGN.showAmounts ? net : null,
        message: (pi.metadata?.message || "").trim().slice(0, 140) || null,
        at: pi.created,
      });
    }
  }

  return { total: total + CAMPAIGN.offStripe, donors, recent, updatedAt: Math.floor(Date.now() / 1000) };
}

const cached = unstable_cache(fetchFromStripe, ["campaign-v1"], { revalidate: 60, tags: [CAMPAIGN_TAG] });

// Dernier chiffre connu (par instance serveur), renvoyé si Stripe ne répond pas
let lastGood: CampaignData | null = null;

export async function getCampaign(): Promise<CampaignData | null> {
  try {
    lastGood = await cached();
  } catch (e) {
    console.error("campaign: Stripe indisponible", e);
  }
  return lastGood;
}
