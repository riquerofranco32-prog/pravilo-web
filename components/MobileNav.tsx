"use client";

import { useState } from "react";
import BookingWizard from "./BookingWizard";

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
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border-highlight bg-surface-raised text-foreground shadow-sm transition-all hover:border-accent hover:text-accent-text lg:hidden"
      >
        <span className="text-base leading-none">{open ? "✕" : "☰"}</span>
      </button>

      {open && (
        <div className="fixed inset-0 top-[65px] z-50 flex flex-col bg-background/95 p-6 backdrop-blur-2xl lg:hidden animate-fadeIn">
          <nav className="flex flex-col gap-2">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl border border-transparent px-4 py-3.5 font-condensed text-lg font-bold text-foreground transition-all hover:border-border hover:bg-surface-raised hover:text-accent-text"
              >
                <span>{item.label}</span>
                <span className="text-muted text-sm">→</span>
              </a>
            ))}
          </nav>

          <div className="mt-8 border-t border-border/80 pt-6">
            <BookingWizard
              buttonText="Reservar Turno Ahora →"
              className="btn-shiny w-full rounded-full bg-accent py-4 font-condensed text-base font-bold uppercase tracking-wider text-accent-foreground shadow-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}

