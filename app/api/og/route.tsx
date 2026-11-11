import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getCampaign } from "@/lib/campaign";
import { CAMPAIGN } from "@/lib/campaign-config";
import { dict, isLocale, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INTL: Record<Locale, string> = { fr: "fr-FR", en: "en-IE", he: "he-IL" };
const eur = (c: number, l: Locale) =>
  new Intl.NumberFormat(INTL[l], { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Math.round(c / 100)).replace(/[‎‏]/g, "");

// Le moteur d image ne gère pas le sens droite-gauche : on met le texte hébreu dans l ordre visuel
const HEB = /[֐-׿]/;
function visual(text: string, rtl: boolean) {
  if (!rtl) return text;
  return text
    .split(" ")
    .reverse()
    .map((w) => (HEB.test(w) ? [...w].reverse().join("") : w))
    .join(" ");
}

// Image de partage (WhatsApp, Facebook) : la hanoukia + la jauge à jour
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("lang") ?? "he";
  const lang: Locale = isLocale(q) ? q : "he";
  const t = dict[lang];
  const root = process.cwd();
  const [bg, f600, f800, h600, h800, data] = await Promise.all([
    readFile(join(root, "public/og-hanukkiah.jpg")),
    readFile(join(root, "assets/fonts/assistant-latin-600-normal.woff")),
    readFile(join(root, "assets/fonts/assistant-latin-800-normal.woff")),
    readFile(join(root, "assets/fonts/assistant-hebrew-600-normal.woff")),
    readFile(join(root, "assets/fonts/assistant-hebrew-800-normal.woff")),
    getCampaign(),
  ]);

  const total = data?.total ?? 0;
  const pct = Math.min(100, (total / CAMPAIGN.goal) * 100);
  const rtl = lang === "he";
  const dir = rtl ? "row-reverse" : "row";

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", position: "relative", fontFamily: "Assistant", color: "#fff" }}>
        <img
          src={`data:image/jpeg;base64,${bg.toString("base64")}`}
          width={1200}
          height={900}
          style={{ position: "absolute", top: -170, left: 0, width: 1200, height: 900, objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(to top, rgba(8,12,24,0.92) 0%, rgba(8,12,24,0.55) 55%, rgba(8,12,24,0.15) 100%)" }} />
        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            bottom: 56,
            display: "flex",
            flexDirection: "column",
            alignItems: rtl ? "flex-end" : "flex-start",
          }}
        >
          <div style={{ display: "flex", fontSize: 40, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>{visual(t.title, rtl)}</div>
          {data && (
            <div style={{ display: "flex", flexDirection: dir, alignItems: "baseline", gap: 18, marginTop: 14 }}>
              <div style={{ display: "flex", fontSize: 96, fontWeight: 800, lineHeight: 1 }}>{eur(total, lang)}</div>
              <div style={{ display: "flex", fontSize: 40, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                {visual(`${t.campaign.raised} · ${t.campaign.of.replace("{goal}", eur(CAMPAIGN.goal, lang))}`, rtl)}
              </div>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: dir, alignItems: "center", gap: 22, marginTop: 26, width: "100%" }}>
            <div style={{ display: "flex", flexDirection: dir, flex: 1, height: 22, borderRadius: 11, background: "rgba(255,255,255,0.22)", overflow: "hidden" }}>
              <div style={{ display: "flex", width: `${pct}%`, height: "100%", borderRadius: 11, background: "#f2c46d" }} />
            </div>
            {data && <div style={{ display: "flex", fontSize: 40, fontWeight: 800 }}>{`${Math.floor((total / CAMPAIGN.goal) * 100)}%`}</div>}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Assistant", data: f600, weight: 600 },
        { name: "Assistant", data: f800, weight: 800 },
        { name: "Assistant", data: h600, weight: 600 },
        { name: "Assistant", data: h800, weight: 800 },
      ],
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    },
  );
}
