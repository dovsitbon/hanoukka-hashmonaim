import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Source_Serif_4, Source_Sans_3, Frank_Ruhl_Libre, Assistant } from "next/font/google";
import "../globals.css";
import { SITE_URL, dict, isLocale, locales } from "@/lib/i18n";

const serif = Source_Serif_4({ subsets: ["latin"], weight: ["400", "600", "700"], style: ["normal", "italic"], variable: "--font-source-serif", display: "swap" });
const sans = Source_Sans_3({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-source-sans", display: "swap" });
const frank = Frank_Ruhl_Libre({ subsets: ["hebrew"], weight: ["500", "700"], variable: "--font-frank", display: "swap", preload: false });
const assistant = Assistant({ subsets: ["hebrew"], weight: ["400", "600", "700"], variable: "--font-assistant", display: "swap", preload: false });

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
export const dynamicParams = false;

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = dict[lang];
  return {
    metadataBase: new URL(SITE_URL),
    title: t.htmlTitle,
    description: t.description,
    alternates: { canonical: `/${lang}`, languages: { fr: "/fr", en: "/en", he: "/he", "x-default": "/he" } },
    openGraph: {
      type: "website",
      url: `/${lang}`,
      siteName: t.brand,
      title: t.ogTitle,
      description: t.ogDescription,
      locale: { fr: "fr_FR", en: "en_US", he: "he_IL" }[lang],
      images: [{ url: `/api/og?lang=${lang}`, width: 600, height: 315, alt: t.ogTitle }],
    },
    twitter: { card: "summary_large_image", title: t.ogTitle, description: t.ogDescription, images: [`/api/og?lang=${lang}`] },
    // Traduction automatique des navigateurs bloquée : seules les langues du site sont proposées
    other: { google: "notranslate" },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html
      lang={lang}
      dir={lang === "he" ? "rtl" : "ltr"}
      translate="no"
      className={`${serif.variable} ${sans.variable} ${frank.variable} ${assistant.variable}`}
    >
      <body className="notranslate font-sans text-[17px] leading-[1.65] antialiased">{children}</body>
    </html>
  );
}
