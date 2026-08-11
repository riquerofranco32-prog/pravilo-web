import type { ReactNode } from "react";

export default function Marquee({ items }: { items: ReactNode[] }) {
  // se duplica la lista para que el loop de -50% sea continuo, sin salto
  const track = [...items, ...items];

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="marquee-track gap-10 py-2">
        {track.map((item, i) => (
          <span
            key={i}
            className="shrink-0 text-xs font-medium uppercase tracking-wide whitespace-nowrap text-muted"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
