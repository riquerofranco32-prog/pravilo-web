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
      { rootMargin: "-40% 0px -50% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Navegación de secciones"
      className="fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
    >
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          aria-label={item.label}
          className="group relative flex items-center justify-end"
        >
          <span className="pointer-events-none absolute right-5 rounded-md bg-surface px-2 py-1 text-xs whitespace-nowrap text-muted opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            {item.label}
          </span>
          <span
            className={`h-2 w-2 rounded-full transition-all ${
              active === item.href
                ? "scale-125 bg-accent"
                : "bg-border group-hover:bg-accent/60"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}
