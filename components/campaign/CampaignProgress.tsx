"use client";

import { useEffect, useRef, useState } from "react";
import { CAMPAIGN } from "@/lib/campaign-config";
import type { CampaignTexts, Locale } from "@/lib/i18n";
import { eur, num, useCampaign } from "./CampaignProvider";
import { Confetti } from "./Confetti";

const INTL: Record<Locale, string> = { fr: "fr-FR", en: "en-IE", he: "he-IL" };
const pctFmt = (p: number, lang: Locale) => new Intl.NumberFormat(INTL[lang], { style: "percent", maximumFractionDigits: 0 }).format(p / 100);
const fill = (s: string, k: string, v: string) => s.replace(`{${k}}`, v);

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Compteur qui monte en douceur (1 s) jusqu'à la valeur réelle
function useCountUp(target: number) {
  const [value, setValue] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (reducedMotion()) {
      from.current = target;
      setValue(target);
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / 1000);
      const v = a + (target - a) * (1 - Math.pow(1 - k, 3));
      setValue(v);
      if (k < 1) raf = requestAnimationFrame(step);
      else from.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return value;
}

export function daysLeft(now: number) {
  const ms = new Date(CAMPAIGN.end).getTime() - now * 1000;
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export function CampaignProgress({
  t,
  variant,
  tone,
  fallback,
}: {
  t: CampaignTexts;
  variant: "full" | "compact";
  tone: "dark" | "light";
  fallback: string;
}) {
  const { data, now, lang } = useCampaign();
  const total = data?.total ?? 0;
  const goal = CAMPAIGN.goal;
  const pct = goal ? (total / goal) * 100 : 0;
  const shown = useCountUp(total);
  const shownPct = goal ? Math.min(100, (shown / goal) * 100) : 0;
  const reached = total >= goal;
  const dark = tone === "dark";
  const full = variant === "full";

  if (!data) {
    // Stripe jamais joint (premier chargement) : on garde le texte d'objectif d'origine
    return <p className={`text-[16px] font-semibold ${dark ? "text-[#f2c46d]" : "text-night"}`}>{fallback}</p>;
  }

  const days = daysLeft(now);
  const muted = dark ? "text-white/75" : "text-neutral-600";
  const strong = dark ? "text-white" : "text-night";
  const pctText = pctFmt(Math.floor(pct), lang);

  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <bdi
          className={`font-serif font-bold leading-none tabular-nums ${strong} ${full ? "text-[2.6rem] sm:text-[3.2rem]" : "text-[1.9rem]"}`}
        >
          {eur(shown, lang)}
        </bdi>
        <span className={`${full ? "text-[17px]" : "text-[15px]"} ${dark ? "text-white/85" : "text-neutral-700"}`}>{t.raised}</span>
      </p>
      <p className={`mt-1.5 ${full ? "text-[16px]" : "text-[15px]"} ${muted}`}>
        {reached ? (
          <span className={`font-semibold ${dark ? "text-[#f2c46d]" : "text-[#8a6417]"}`}>
            {t.reached} <bdi>{pctText}</bdi>
            {CAMPAIGN.bonusGoal && CAMPAIGN.bonusGoal > total ? <> · {fill(t.bonus, "amount", eur(CAMPAIGN.bonusGoal, lang))}</> : null}
          </span>
        ) : (
          <bdi>{fill(t.of, "goal", eur(goal, lang))}</bdi>
        )}
      </p>

      <div className={`flex items-center gap-3 ${full ? "mt-4" : "mt-3"}`}>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={Math.round(goal / 100)}
          aria-valuenow={Math.round(total / 100)}
          aria-valuetext={fill(t.aria, "pct", String(Math.floor(pct)))}
          className={`relative flex-1 overflow-hidden rounded-full ${full ? "h-3.5 sm:h-3" : "h-3"} ${dark ? "bg-white/20" : "bg-sand-line"}`}
        >
          <div className={`h-full rounded-full ${dark ? "bg-[#f2c46d]" : "bg-night"}`} style={{ width: `${shownPct}%` }} />
          {CAMPAIGN.milestones.map((m) => (
            <span
              key={m.amount}
              aria-hidden="true"
              className={`absolute inset-y-0 w-[2px] ${dark ? "bg-white/60" : "bg-white"}`}
              style={{ insetInlineStart: `${Math.min(100, (m.amount / goal) * 100)}%` }}
            />
          ))}
        </div>
        <bdi className={`shrink-0 text-[15px] font-semibold tabular-nums ${strong}`}>{pctText}</bdi>
      </div>

      {CAMPAIGN.milestones.length > 0 && (
        <ul className={`mt-3 space-y-1 text-[14px] ${muted}`}>
          {CAMPAIGN.milestones.map((m) => {
            const ok = total >= m.amount;
            return (
              <li key={m.amount} className={`flex items-center gap-2 ${ok ? strong : ""}`}>
                <span
                  aria-hidden="true"
                  className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                    ok ? (dark ? "bg-[#f2c46d] text-night" : "bg-night text-white") : dark ? "border border-white/40" : "border border-neutral-400"
                  }`}
                >
                  {ok ? "✓" : ""}
                </span>
                <bdi className="font-semibold">{eur(m.amount, lang)}</bdi> = {m.text[lang]}
              </li>
            );
          })}
        </ul>
      )}

      {full ? (
        <div className={`mt-5 grid grid-cols-3 gap-3 border-t pt-4 ${dark ? "border-white/15" : "border-neutral-200"}`}>
          <Stat value={reached ? "0" : eur(goal - total, lang)} label={t.left} dark={dark} labelFirst={lang === "he"} />
          <Stat value={num(data.donors, lang)} label={data.donors === 1 ? t.donors[0] : t.donors[1]} dark={dark} />
          <Stat value={num(days, lang)} label={days === 1 ? t.days[0] : t.days[1]} dark={dark} />
        </div>
      ) : (
        <p className={`mt-2.5 text-[14px] ${muted}`}>
          {!reached && (
            <>
              {lang === "he" ? (
                <>
                  {t.left} <bdi className="font-semibold">{eur(goal - total, lang)}</bdi>
                </>
              ) : (
                <>
                  <bdi className="font-semibold">{eur(goal - total, lang)}</bdi> {t.left}
                </>
              )}{" "}
              ·{" "}
            </>
          )}
          <bdi className="font-semibold">{num(data.donors, lang)}</bdi> {data.donors === 1 ? t.donors[0] : t.donors[1]} ·{" "}
          <bdi className="font-semibold">{num(days, lang)}</bdi> {days === 1 ? t.days[0] : t.days[1]}
        </p>
      )}

      {full && <Confetti total={total} />}
    </div>
  );
}

function Stat({ value, label, dark, labelFirst }: { value: string; label: string; dark: boolean; labelFirst?: boolean }) {
  const v = (
    <p className={`font-serif text-[1.3rem] font-bold leading-tight tabular-nums sm:text-[1.5rem] ${dark ? "text-white" : "text-night"}`}>
      <bdi>{value}</bdi>
    </p>
  );
  const l = <p className={`text-[13px] leading-snug sm:text-[14px] ${dark ? "text-white/70" : "text-neutral-600"}`}>{label}</p>;
  // « חסרים עוד » se lit avant le montant ; ailleurs le chiffre vient d'abord
  return <div className="flex flex-col">{labelFirst ? <>{l}{v}</> : <>{v}{l}</>}</div>;
}
