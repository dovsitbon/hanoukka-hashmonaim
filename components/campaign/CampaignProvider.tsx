"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { CampaignData } from "@/lib/campaign-config";
import type { Locale } from "@/lib/i18n";

type Ctx = { data: CampaignData | null; now: number; lang: Locale; refreshSoon: () => void };

const CampaignContext = createContext<Ctx>({ data: null, now: 0, lang: "he", refreshSoon: () => {} });
export const useCampaign = () => useContext(CampaignContext);

const INTL: Record<Locale, string> = { fr: "fr-FR", en: "en-IE", he: "he-IL" };

// Montant en euros entiers, au format de la langue (fr « 12 450 € », en « €12,450 », he « ‏12,450 € »)
export function eur(cents: number, lang: Locale) {
  return new Intl.NumberFormat(INTL[lang], { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Math.round(cents / 100));
}
export function num(n: number, lang: Locale) {
  return new Intl.NumberFormat(INTL[lang]).format(n);
}

export function CampaignProvider({ initial, lang, children }: { initial: CampaignData | null; lang: Locale; children: ReactNode }) {
  const [data, setData] = useState<CampaignData | null>(initial);
  // « Maintenant » : figé sur l'heure des données au premier rendu (pas d'écart d'hydratation), puis l'heure réelle
  const [now, setNow] = useState(initial?.updatedAt ?? 0);
  const timers = useRef<number[]>([]);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/campaign", { cache: "no-store" });
      if (!r.ok) return; // Stripe indisponible : on garde le dernier chiffre affiché
      setData((await r.json()) as CampaignData);
    } catch {
      /* réseau coupé : on garde le dernier chiffre */
    }
  }, []);

  useEffect(() => {
    setNow(Math.floor(Date.now() / 1000));
    void load();
    const id = window.setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
      if (document.visibilityState === "visible") void load();
    }, 60_000);
    const pending = timers.current;
    return () => {
      window.clearInterval(id);
      pending.forEach((x) => window.clearTimeout(x));
    };
  }, [load]);

  // Après un don : Stripe prévient le webhook en quelques secondes, on relit deux fois
  const refreshSoon = useCallback(() => {
    timers.current.push(window.setTimeout(load, 4000), window.setTimeout(load, 15000));
  }, [load]);

  const value = useMemo(() => ({ data, now, lang, refreshSoon }), [data, now, lang, refreshSoon]);
  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
}
