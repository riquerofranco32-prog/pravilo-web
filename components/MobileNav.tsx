"use client";

import { useState } from "react";

export default function MobileNav({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border md:hidden"
      >
        <span className="text-lg leading-none">{open ? "✕" : "☰"}</span>
      </button>
      {open && (
        <nav className="absolute inset-x-0 top-full flex flex-col gap-1 border-t border-border/60 bg-background px-6 py-4 text-sm text-muted md:hidden">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2 transition-colors hover:bg-surface hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </>
  );
}
