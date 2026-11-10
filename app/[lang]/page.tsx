import { BANK, PAYPAL_URL, PHOTOS, dict, isLocale, locales, type Locale } from "@/lib/i18n";
import { Gallery } from "@/components/Gallery";
import { CopyButton } from "@/components/CopyButton";

const LANG_NAMES: Record<Locale, string> = { fr: "FR", en: "EN", he: "עב" };

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang: l } = await params;
  const lang: Locale = isLocale(l) ? l : "fr";
  const t = dict[lang];
  const photos = PHOTOS.map((n, i) => ({ src: `/photos/p${n}.jpg`, alt: t.photoAlt(i + 1) }));

  const rows = [
    { label: t.rows.beneficiary, shown: BANK.beneficiary, copy: BANK.beneficiary },
    { label: t.rows.iban, shown: BANK.iban, copy: BANK.iban.replace(/\s/g, "") },
    { label: t.rows.bic, shown: BANK.bic, copy: BANK.bic },
  ];

  return (
    <>
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-[1000px] items-center justify-between gap-3 px-5 py-3 text-[15px]">
          <b className="font-semibold text-night">{t.brand}</b>
          <div className="flex items-center gap-4">
            <nav aria-label={t.langLabel} className="flex gap-1 text-[14px]">
              {locales.map((x) => (
                <a
                  key={x}
                  href={`/${x}`}
                  hrefLang={x}
                  lang={x}
                  aria-current={x === lang ? "page" : undefined}
                  className={`rounded-[3px] px-1.5 py-0.5 ${x === lang ? "bg-night text-white" : "text-neutral-600 hover:text-night"}`}
                >
                  {LANG_NAMES[x]}
                </a>
              ))}
            </nav>
            <a href="#don" className="hidden rounded-[4px] bg-night px-4 py-2 font-semibold text-white sm:inline-block">
              {t.donate}
            </a>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto mt-6 max-w-[1000px] px-5">
          <img
            src="/photos/p6.jpg"
            alt={t.coverAlt}
            width={960}
            height={1280}
            fetchPriority="high"
            className="h-[300px] w-full rounded-[6px] object-cover object-[50%_45%] sm:h-[440px]"
          />
        </div>

        <div className="mx-auto max-w-[760px] px-5 pt-8">
          <h1 className="title-size mb-2.5 font-serif font-bold leading-[1.2] text-night">{t.title}</h1>
          <p className="text-[15px] text-neutral-600">{t.by}</p>
          <p className="mb-7 mt-1 text-[15px] font-semibold text-night">{t.goal}</p>

          <div>
            {t.letter.p.map((p) => (
              <p key={p} className="mb-[18px]">
                {p}
              </p>
            ))}
            <p className="mb-2">{t.letter.listIntro}</p>
            <ul className="mb-[18px] list-disc ps-[22px]">
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
            <p className="font-serif italic">
              {t.letter.sign[0]}
              <br />
              {t.letter.sign[1]}
            </p>
          </div>

          <h2 className="mb-4 mt-12 font-serif text-[1.6rem] font-bold leading-[1.2] text-night">{t.galleryTitle}</h2>
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
