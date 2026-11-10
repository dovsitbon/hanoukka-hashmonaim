import { REVOLUT_URL } from "@/lib/i18n";

// Sur Android, le bouton Apple Pay est masqué et « Payer par carte » devient le bouton principal.
// Le petit script marque <html data-os="android"> pendant le chargement, avant l'affichage des boutons (pas de clignotement).
const DETECT = `if(/Android/i.test(navigator.userAgent))document.documentElement.dataset.os="android"`;

export function ApplePayBlock({ t }: { t: { title: string; card: string; note: string; help: string } }) {
  return (
    <div className="mb-4 rounded-[6px] border border-neutral-300 bg-white p-6">
      <script dangerouslySetInnerHTML={{ __html: DETECT }} />
      <h3 className="mb-1.5 text-[1.15rem] font-bold text-night">{t.title}</h3>
      <p className="text-[16px] text-neutral-600">{t.note}</p>
      <div className="mt-3.5 flex max-w-[340px] flex-col gap-2.5">
        <a
          href={REVOLUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Apple Pay"
          dir="ltr"
          className="ap-apple flex h-12 items-center justify-center gap-[3px] rounded-[6px] bg-black text-white hover:bg-[#222]"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="mb-[3px] h-[21px] w-[21px] fill-current">
            <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
          </svg>
          <span className="text-[21px] font-semibold tracking-[-0.01em]">Pay</span>
        </a>
        <a
          href={REVOLUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ap-card flex h-12 items-center justify-center rounded-[6px] border border-neutral-800 bg-white px-4 font-semibold text-neutral-900 hover:bg-neutral-50"
        >
          {t.card}
        </a>
      </div>
      <p className="mt-3 text-[14px] text-neutral-500">{t.help}</p>
    </div>
  );
}
