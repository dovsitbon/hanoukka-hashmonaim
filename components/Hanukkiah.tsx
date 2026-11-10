// Hanoukia au trait : 8 branches + le chamach au centre, flammes pleines.
export function Hanukkiah({ className = "" }: { className?: string }) {
  const xs = [4, 9, 14, 19, 29, 34, 39, 44];
  return (
    <svg viewBox="0 0 48 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className={className}>
      {[1, 2, 3, 4].map((k) => (
        <path key={k} d={`M${24 - 5 * k} 13 v2 a${5 * k} ${3 + 2.6 * k} 0 0 0 ${10 * k} 0 v-2`} />
      ))}
      <path d="M24 10 V35 M17 37 H31" />
      {xs.map((x) => (
        <path key={x} d={`M${x} 9.5 c-1.4 -1.6 -0.6 -3.4 0 -5 c0.6 1.6 1.4 3.4 0 5z`} fill="currentColor" stroke="none" />
      ))}
      <path d="M24 6.5 c-1.4 -1.6 -0.6 -3.4 0 -5 c0.6 1.6 1.4 3.4 0 5z" fill="currentColor" stroke="none" />
    </svg>
  );
}
