"use client";

import { useState } from "react";
import { CAMPAIGN } from "@/lib/campaign-config";
import type { CampaignTexts } from "@/lib/i18n";
import { SITE_URL } from "@/lib/i18n";
import { eur, useCampaign } from "./CampaignProvider";

const btn = "inline-flex h-11 items-center justify-center gap-2 rounded-[6px] border px-4 text-[15px] font-semibold";

export function ShareButtons({ t }: { t: CampaignTexts }) {
  const { data, lang } = useCampaign();
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/${lang}`;
  const text = t.shareText.replace("{raised}", eur(data?.total ?? 0, lang)).replace("{goal}", eur(CAMPAIGN.goal, lang));

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div>
      <p className="mb-2.5 font-semibold text-neutral-800">{t.share}</p>
      <div className="flex flex-wrap gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn} border-[#1f9d55] bg-[#1f9d55] text-white hover:bg-[#188a49]`}
        >
          WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn} border-[#1877f2] bg-white text-[#1877f2] hover:bg-[#f0f5ff]`}
        >
          Facebook
        </a>
        <button type="button" onClick={copy} className={`${btn} border-neutral-400 bg-white text-neutral-800 hover:bg-neutral-50`}>
          <span aria-live="polite">{copied ? t.copied : t.copy}</span>
        </button>
      </div>
    </div>
  );
}
