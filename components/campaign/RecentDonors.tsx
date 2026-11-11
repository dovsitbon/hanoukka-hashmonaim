"use client";

import { useState } from "react";
import type { CampaignTexts, Locale } from "@/lib/i18n";
import { eur, num, useCampaign } from "./CampaignProvider";

const INTL: Record<Locale, string> = { fr: "fr-FR", en: "en-IE", he: "he-IL" };

function ago(at: number, now: number, lang: Locale) {
  const rtf = new Intl.RelativeTimeFormat(INTL[lang], { numeric: "auto" });
  const s = Math.max(0, now - at);
  if (s < 60) return rtf.format(0, "second");
  if (s < 3600) return rtf.format(-Math.floor(s / 60), "minute");
  if (s < 86400) return rtf.format(-Math.floor(s / 3600), "hour");
  return rtf.format(-Math.floor(s / 86400), "day");
}

export function RecentDonors({ t }: { t: CampaignTexts }) {
  const { data, now, lang } = useCampaign();
  const [all, setAll] = useState(false);
  if (!data) return null;

  const list = all ? data.recent : data.recent.slice(0, 10);
  const head =
    data.donors === 0 ? t.first : data.donors === 1 ? t.thanksOne : t.thanks.replace("{n}", num(data.donors, lang));

  return (
    <div>
      <h3 className="text-[1.15rem] font-bold text-night">{t.recentTitle}</h3>
      <p className="mt-1 text-[15px] text-neutral-600">{head}</p>
      {list.length > 0 && (
        <ul className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200">
          {list.map((d, i) => (
            <li key={`${d.at}-${i}`} className="py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold text-neutral-900">
                  <bdi>{d.name ?? t.anonymous}</bdi>
                  {d.amount != null && (
                    <>
                      {" · "}
                      <bdi className="text-night">{eur(d.amount, lang)}</bdi>
                    </>
                  )}
                </span>
                <span className="shrink-0 text-[13px] text-neutral-500">{ago(d.at, now || data.updatedAt, lang)}</span>
              </div>
              {d.message && (
                <p className="mt-1 text-[15px] italic text-neutral-600">
                  <bdi>{d.message}</bdi>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
      {data.recent.length > 10 && (
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          aria-expanded={all}
          className="mt-3 text-[15px] font-semibold text-night underline underline-offset-4 hover:text-[#1d2d52]"
        >
          {all ? t.seeLess : t.seeAll}
        </button>
      )}
    </div>
  );
}
