"use client";
import { useCallback, useEffect, useState } from "react";

type Photo = { src: string; alt: string };

export function Gallery({ photos, labels }: { photos: Photo[]; labels: { close: string; prev: string; next: string } }) {
  const [i, setI] = useState<number | null>(null);
  const n = photos.length;
  const go = useCallback((d: number) => setI((k) => (k === null ? k : (k + d + n) % n)), [n]);

  useEffect(() => {
    if (i === null) return;
    const rtl = document.documentElement.dir === "rtl";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setI(null);
      if (e.key === "ArrowRight") go(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [i, go]);

  return (
    <>
      <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-1.5 px-5 sm:grid-cols-3">
        {photos.map((p, k) => (
          <button key={p.src} type="button" onClick={() => setI(k)} className="block cursor-zoom-in overflow-hidden rounded-[3px]">
            <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
          </button>
        ))}
      </div>

      {i !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photos[i].alt}
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/90"
          onClick={(e) => e.target === e.currentTarget && setI(null)}
        >
          <img src={photos[i].src} alt={photos[i].alt} className="max-h-[88vh] max-w-[94vw] object-contain" />
          <button
            type="button"
            aria-label={labels.close}
            onClick={() => setI(null)}
            className="absolute end-1.5 top-1.5 cursor-pointer px-4 py-2 text-[34px] leading-none text-white"
          >
            ×
          </button>
          <button
            type="button"
            aria-label={labels.prev}
            onClick={() => go(-1)}
            className="absolute start-1 top-1/2 -translate-y-1/2 cursor-pointer px-4 py-6 text-[40px] leading-none text-white rtl:-scale-x-100"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label={labels.next}
            onClick={() => go(1)}
            className="absolute end-1 top-1/2 -translate-y-1/2 cursor-pointer px-4 py-6 text-[40px] leading-none text-white rtl:-scale-x-100"
          >
            ›
          </button>
          <p dir="ltr" className="absolute bottom-3 text-[14px] text-white/80">
            {i + 1} / {n}
          </p>
        </div>
      )}
    </>
  );
}
