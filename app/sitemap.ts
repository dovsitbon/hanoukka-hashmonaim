import type { MetadataRoute } from "next";
import { SITE_URL, locales } from "@/lib/i18n";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { fr: `${SITE_URL}/fr`, en: `${SITE_URL}/en`, he: `${SITE_URL}/he` };
  return locales.map((l) => ({ url: `${SITE_URL}/${l}`, alternates: { languages } }));
}
