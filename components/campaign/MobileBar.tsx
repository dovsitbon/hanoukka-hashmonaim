"use client";

import { useEffect, useState } from "react";
import { CAMPAIGN } from "@/lib/campaign-config";
import type { Locale } from "@/lib/i18n";
import { eur, useCampaign } from "./CampaignProvider";

const INTL: Record<Locale, string> = { fr: "fr-FR", en: "en-IE", he: "he-IL" };

// Mini-barre fixée en bas sur mobile : apparaît une fois le haut de page dépassé
export function MobileBar({ donate, raised }: { donate: string; raised: string }) {
  const { data, lang } = useCampaign();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pct = data ? Math.min(100, (data.total / CAMPAIGN.goal) * 100) : 0;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-10 border-t border-neutral-300 bg-white px-4 py-2.5 transition-transform duration-300 motion-reduce:transition-none sm:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        {data && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] text-neutral-700">
              <bdi className="font-bold text-night">{eur(data.total, lang)}</bdi> {raised} ·{" "}
              <bdi className="font-semibold">
                {new Intl.NumberFormat(INTL[lang], { style: "percent", maximumFractionDigits: 0 }).format(Math.floor(pct) / 100)}
              </bdi>
            </p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sand-line" aria-hidden="true">
              <div className="h-full rounded-full bg-night" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
        <a href="#don" className={`rounded-[4px] bg-night px-5 py-3 text-center font-bold text-white ${data ? "shrink-0" : "flex-1"}`}>
          {donate}
        </a>
      </div>
    </div>
  );
}
