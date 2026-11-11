import { getCampaign } from "@/lib/campaign";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Chiffres publics de la jauge : total, nombre de donateurs, derniers dons (noms affichés seulement)
export async function GET() {
  const data = await getCampaign();
  if (!data) return Response.json({ error: "unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  return Response.json(data, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } });
}
