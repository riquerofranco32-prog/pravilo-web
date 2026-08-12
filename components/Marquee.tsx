import type { ReactNode } from "react";

export default function Marquee({
  items,
  itemClassName = "text-xs font-medium tracking-wide text-muted",
}: {
  items: ReactNode[];
  itemClassName?: string;
}) {
  // se duplica la lista para que el loop de -50% sea continuo, sin salto
  const track = [...items, ...items];

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="marquee-track gap-3 py-2">
        {track.map((item, i) => (
          <span
            key={i}
            className={`flex shrink-0 items-center gap-3 whitespace-nowrap uppercase ${itemClassName}`}
          >
            {item}
            <span aria-hidden className="opacity-60">
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
