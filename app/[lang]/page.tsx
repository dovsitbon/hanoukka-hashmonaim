import { BANK, PAYPAL_URL, PHOTOS, dict, isLocale, locales, type Locale } from "@/lib/i18n";
import { Gallery } from "@/components/Gallery";
import { CopyButton } from "@/components/CopyButton";
import { Hanukkiah } from "@/components/Hanukkiah";

// Diaporama du haut : la hanoukia en premier, puis les allumages (point focal de chaque photo)
const SLIDES = [
  { src: "/photos/p11.jpg", pos: "62% 62%" },
  { src: "/photos/p12.jpg", pos: "55% 68%" },
  { src: "/photos/p13.jpg", pos: "50% 65%" },
  { src: "/photos/p22.jpg", pos: "55% 62%" },
  { src: "/photos/p3.jpg", pos: "50% 35%" },
];

const LANG_NAMES: Record<Locale, string> = { fr: "FR", en: "EN", he: "עב" };

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang: l } = await params;
  const lang: Locale = isLocale(l) ? l : "he";
  const t = dict[lang];
  const photos = PHOTOS.map((n, i) => ({ src: `/photos/p${n}.jpg`, alt: t.photoAlt(i + 1) }));

  const rows = [
    { label: t.rows.beneficiary, shown: BANK.beneficiary, copy: BANK.beneficiary },
    { label: t.rows.iban, shown: BANK.iban, copy: BANK.iban.replace(/\s/g, "") },
    { label: t.rows.bic, shown: BANK.bic, copy: BANK.bic },
  ];

  return (
    <>
      <section className="hero relative isolate overflow-hidden bg-black text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          {SLIDES.map((s, k) => (
            <img
              key={s.src}
              src={s.src}
              alt=""
              fetchPriority={k === 0 ? "high" : "low"}
              decoding="async"
              className="slide absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: s.pos, animationDelay: `${k * 6 - 1.5}s` }}
            />
          ))}
          <div className="hero-scrim absolute inset-0" />
        </div>

        <header className="relative z-10">
          <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-5 py-4 text-[15px]">
            <b className="flex items-center gap-2 font-semibold">
              <Hanukkiah className="h-[22px] w-auto text-[#f2c46d]" />
              <span>{t.brand}</span>
            </b>
            <div className="flex items-center gap-4">
              <nav aria-label={t.langLabel} className="flex gap-1 text-[14px]">
                {locales.map((x) => (
                  <a
                    key={x}
                    href={`/${x}`}
                    hrefLang={x}
                    lang={x}
                    aria-current={x === lang ? "page" : undefined}
                    className={`rounded-[3px] px-1.5 py-0.5 ${x === lang ? "bg-white text-night" : "text-white/80 hover:text-white"}`}
                  >
                    {LANG_NAMES[x]}
                  </a>
                ))}
              </nav>
              <a href="#don" className="hidden rounded-[4px] bg-white px-4 py-2 font-semibold text-night hover:bg-[#f6f4ef] sm:inline-block">
                {t.donate}
              </a>
            </div>
          </div>
        </header>

        <div className="relative mx-auto max-w-[1100px] px-5 pb-16 pt-10 sm:pt-16">
          <div className="max-w-[640px]">
            <h1 className="hero-title font-serif font-bold leading-[1.1] [text-wrap:balance]">{t.title}</h1>
            <p className="mt-4 text-[16px] text-white/85">{t.by}</p>
            <p className="mt-1 text-[16px] font-semibold text-[#f2c46d]">{t.goal}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#don" className="rounded-[4px] bg-white px-6 py-3 font-bold text-night hover:bg-[#f6f4ef]">
                {t.donate}
              </a>
              <a href="#photos" className="rounded-[4px] border border-white/60 px-6 py-3 font-semibold text-white hover:bg-white/10">
                {t.seePhotos}
              </a>
            </div>
          </div>
        </div>
      </section>

      <main>
        <div className="mx-auto max-w-[680px] px-5 pt-14">
          <div className="letter">
            {t.letter.p.map((p) => (
              <p key={p} className="mb-[18px]">
                {p}
              </p>
            ))}
            <p className="mb-2">{t.letter.listIntro}</p>
            <ul className="mb-[18px] list-disc ps-[22px] marker:text-[#c8952f]">
              {t.letter.list.map((li) => (
                <li key={li} className="mb-1.5">
                  {li}
                </li>
              ))}
            </ul>
            {t.letter.after.map((p) => (
              <p key={p} className="mb-[18px]">
                {p}
              </p>
            ))}
            <p className="mt-8 font-serif text-[1.15rem] italic text-night">
              {t.letter.sign[0]}
              <br />
              {t.letter.sign[1]}
            </p>
          </div>
        </div>

        <section className="mt-16 bg-night text-white">
          <div className="mx-auto max-w-[1000px] px-5 py-14 sm:py-16">
            <h2 className="font-serif text-[1.9rem] font-bold leading-[1.2]">{t.lastYear.title}</h2>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/15 pt-8 sm:grid-cols-4">
              {t.lastYear.stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <bdi className="block font-serif text-[2.4rem] font-bold leading-none text-[#f2c46d] sm:text-[2.8rem]">{s.n}</bdi>
                    <span className="mt-2 block text-[15px] leading-snug text-white/80">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 grid items-center gap-6 border-t border-white/15 pt-10 sm:grid-cols-[1.1fr_1fr]">
              <img
                src="/photos/p12.jpg"
                alt={t.lastYear.hebron}
                width={960}
                height={1280}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-[4px] object-cover object-[50%_62%]"
              />
              <div>
                <p className="font-serif text-[1.35rem] leading-snug">{t.lastYear.hebron}</p>
                <p className="mt-5 text-white/85">{t.lastYear.thisYear}</p>
                <a href="#don" className="mt-6 inline-block rounded-[4px] bg-white px-6 py-3 font-bold text-night hover:bg-[#f6f4ef]">
                  {t.donate}
                </a>
              </div>
            </div>
          </div>
        </section>

        <div id="photos" className="mx-auto max-w-[1000px] scroll-mt-4 px-5">
          <h2 className="mb-5 mt-16 font-serif text-[1.9rem] font-bold leading-[1.2] text-night">{t.galleryTitle}</h2>
        </div>

        <Gallery photos={photos} labels={{ close: t.close, prev: t.prev, next: t.next }} />

        <div className="mx-auto mt-1.5 grid max-w-[1000px] gap-1.5 px-5 sm:grid-cols-[2fr_1fr]">
          <video
            src="/videos/v1.mp4"
            controls
            playsInline
            preload="metadata"
            aria-label={t.videoLabel(1)}
            className="aspect-[848/464] w-full rounded-[3px] bg-black sm:aspect-auto sm:h-full sm:max-h-[420px] sm:object-cover"
          />
          <video
            src="/videos/v2.mp4"
            controls
            playsInline
            preload="metadata"
            aria-label={t.videoLabel(2)}
            className="mx-auto aspect-[464/848] w-full max-w-[360px] rounded-[3px] bg-black sm:h-full sm:max-h-[420px] sm:max-w-none sm:object-cover"
          />
        </div>

        <section id="don" className="mt-14 scroll-mt-4 border-t border-sand-line bg-sand pb-12 pt-5">
          <div className="mx-auto max-w-[760px] px-5">
            <h2 className="mb-4 mt-8 font-serif text-[1.6rem] font-bold leading-[1.2] text-night">{t.donateTitle}</h2>

            <div className="mb-4 flex flex-col items-stretch gap-6 rounded-[6px] border border-neutral-300 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="mb-1.5 text-[1.15rem] font-bold text-night">{t.paypalTitle}</h3>
                <p className="text-[16px] text-neutral-600">{t.paypalNote}</p>
                <a
                  href={PAYPAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 block rounded-[4px] bg-paypal px-[22px] py-3 text-center font-bold text-white hover:bg-[#005ea6] sm:inline-block"
                >
                  {t.paypalBtn}
                </a>
              </div>
              <img
                src="/photos/paypal-qr.jpg"
                alt={t.qrAlt}
                width={130}
                height={130}
                loading="lazy"
                className="hidden w-[130px] shrink-0 sm:block"
              />
            </div>

            <div className="mb-4 rounded-[6px] border border-neutral-300 bg-white p-6">
              <h3 className="mb-1.5 text-[1.15rem] font-bold text-night">{t.transferTitle}</h3>
              <p className="text-[16px] text-neutral-600">
                {t.referenceLabel} <b className="font-semibold text-neutral-800">{t.quote[0]}<bdi>{BANK.reference}</bdi>{t.quote[1]}</b>
              </p>
              <table className="mt-2.5 w-full border-collapse text-[16px]">
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.label} className="border-b border-neutral-200">
                      <td className="w-[96px] py-2.5 pe-2 align-middle text-neutral-500 sm:w-[110px]">{r.label}</td>
                      <td className="py-2.5 align-middle font-mono text-[14px] sm:text-[15px]">
                        <bdi dir="ltr">{r.shown}</bdi>
                      </td>
                      <td className="w-[84px] py-2.5 text-end align-middle">
                        <CopyButton value={r.copy} copy={t.copy} copied={t.copied} />
                      </td>
                    </tr>
                  ))}
                  <tr className="border-b border-neutral-200">
                    <td className="py-2.5 pe-2 align-middle text-neutral-500">{t.rows.bank}</td>
                    <td colSpan={2} className="py-2.5 align-middle">
                      <bdi dir="ltr">{BANK.bank}</bdi>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-3 text-[14px] text-neutral-500">{t.abroad}</p>
            </div>

            <p className="mt-3 text-[14px] text-neutral-500">{t.legal}</p>
          </div>
        </section>
      </main>

      <footer className="px-5 pb-[90px] pt-8 text-center text-[14px] text-neutral-500 sm:pb-8">
        {t.footer} · <span lang="he">חג אורים שמח</span>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-neutral-300 bg-white px-4 py-2.5 sm:hidden">
        <a href="#don" className="block rounded-[4px] bg-night p-[13px] text-center font-bold text-white">
          {t.donate}
        </a>
      </div>
    </>
  );
}
