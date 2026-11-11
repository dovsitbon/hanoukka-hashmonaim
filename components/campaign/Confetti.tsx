"use client";

import { useEffect, useState } from "react";
import { CAMPAIGN } from "@/lib/campaign-config";

const KEY = `hh-celebrated-${CAMPAIGN.id}`;
const COLORS = ["#f2c46d", "#ffffff", "#c8952f", "#9fb4d9"];

// Quelques confettis, une seule fois par visiteur et par palier (ou objectif) atteint
export function Confetti({ total }: { total: number }) {
  const [pieces, setPieces] = useState<{ x: number; d: number; r: number; c: string; s: number }[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const marks = [...CAMPAIGN.milestones.map((m) => m.amount), CAMPAIGN.goal].filter((m) => total >= m);
    if (!marks.length) return;
    const top = Math.max(...marks);
    const done = Number(localStorage.getItem(KEY) || 0);
    if (top <= done) return;
    localStorage.setItem(KEY, String(top));
    setPieces(
      Array.from({ length: 36 }, (_, i) => ({
        x: Math.random() * 100,
        d: Math.random() * 0.6,
        r: Math.random() * 360,
        c: COLORS[i % COLORS.length],
        s: 6 + Math.random() * 5,
      })),
    );
    const id = window.setTimeout(() => setPieces([]), 3200);
    return () => window.clearTimeout(id);
  }, [total]);

  if (!pieces.length) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti absolute top-[-12px] block rounded-[1px]"
          style={{ left: `${p.x}%`, width: p.s, height: p.s * 0.45, background: p.c, animationDelay: `${p.d}s`, transform: `rotate(${p.r}deg)` }}
        />
      ))}
    </div>
  );
}
