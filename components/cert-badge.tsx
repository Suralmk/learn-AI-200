import { cn } from "@/lib/utils";

const LEVEL_STARS = { Fundamentals: 0, Associate: 2, Expert: 3 } as const;

/**
 * AI-200 Learn's own badge for an exam code (a hexagon with code and level).
 * Deliberately not a copy of Microsoft's certification badge design.
 */
export function CertBadge({
  code,
  level,
  className,
}: {
  code: string;
  level: keyof typeof LEVEL_STARS;
  className?: string;
}) {
  const stars = LEVEL_STARS[level];
  const id = `cb-${code.toLowerCase()}`;
  return (
    <svg viewBox="0 0 120 132" className={cn("h-auto w-24", className)} role="img" aria-label={`${code} ${level} badge`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={level === "Fundamentals" ? "#5fa8e8" : "#0177d1"} />
          <stop offset="1" stopColor={level === "Fundamentals" ? "#0177d1" : "#0f3f6b"} />
        </linearGradient>
      </defs>
      <path d="M60 4 112 34v64L60 128 8 98V34Z" fill={`url(#${id})`} />
      <path d="M60 14 103 39v54L60 118 17 93V39Z" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.5" />
      <text x="60" y="64" textAnchor="middle" fill="#fff" fontSize="21" fontWeight="600" fontFamily="var(--font-plex-sans), sans-serif">
        {code}
      </text>
      <text x="60" y="84" textAnchor="middle" fill="#fff" fillOpacity=".85" fontSize="9.5" letterSpacing=".5" fontFamily="var(--font-plex-sans), sans-serif">
        {level}
      </text>
      {Array.from({ length: stars }, (_, i) => (
        <path
          key={i}
          transform={`translate(${60 - (stars - 1) * 8 + i * 16 - 5} 92)`}
          d="M5 0l1.5 3.3 3.5.4-2.6 2.4.7 3.5L5 7.9 1.9 9.6l.7-3.5L0 3.7l3.5-.4Z"
          fill="#fff"
        />
      ))}
    </svg>
  );
}
