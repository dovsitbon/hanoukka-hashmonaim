"use client";
import { useState } from "react";

export function CopyButton({ value, copy, copied }: { value: string; copy: string; copied: string }) {
  const [ok, setOk] = useState(false);
  async function onClick() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setOk(true);
    setTimeout(() => setOk(false), 1500);
  }
  return (
    <button
      type="button"
      onClick={onClick}
      data-copy={value}
      aria-live="polite"
      className={`cursor-pointer rounded-[4px] border bg-white px-2.5 py-1 text-[14px] ${
        ok ? "border-green-700 text-green-700" : "border-neutral-400 text-neutral-700 hover:border-night"
      }`}
    >
      {ok ? copied : copy}
    </button>
  );
}
