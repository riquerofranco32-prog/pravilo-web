"use client";

import { useEffect, useState } from "react";

export default function SectionDots({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const [active, setActive] = useState(items[0]?.href ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActive(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-35% 0px -45% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Navegación de secciones"
      className="fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 flex-col items-end gap-3.5 lg:flex"
    >
      {items.map((item) => {
        const isActive = active === item.href;
        return (
          <a
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className="group relative flex items-center justify-end py-1"
          >
            {/* Tooltip flotante con glassmorphism */}
            <span className="pointer-events-none absolute right-6 rounded-full border border-border-highlight bg-surface-raised/95 px-3 py-1 font-condensed text-xs font-bold uppercase tracking-wider whitespace-nowrap text-foreground opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 group-hover:opacity-100 group-hover:-translate-x-1">
              {item.label}
            </span>

            {/* Pill indicador */}
            <span
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? "h-6 w-2 bg-gradient-to-b from-accent to-accent-glow shadow-[0_0_12px_var(--accent)]"
                  : "h-2 w-2 bg-border group-hover:bg-accent/60 group-hover:scale-125"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}

