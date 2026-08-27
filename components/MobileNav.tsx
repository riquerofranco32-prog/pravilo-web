"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import BookingWizard from "./BookingWizard";
import { LOCATION_SHORT, whatsappLink } from "@/lib/constants";

interface MobileNavProps {
  items: { href: string; label: string }[];
}

export default function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bloquear scroll de la página cuando el menú móvil está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Botón Hamburguesa en el Header */}
      <button
        type="button"
        aria-label={open ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border-highlight bg-surface-raised text-foreground shadow-sm transition-all hover:border-accent hover:text-accent-text lg:hidden active:scale-95"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {/* Menú Móvil Pantalla Completa con Fondo Sólido y Portal */}
      {open &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex flex-col bg-[#09090b] text-foreground h-[100dvh] w-full overflow-hidden animate-in fade-in duration-200">
            {/* Aura ambiental roja en el tope */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 inset-x-0 h-72 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(160,26,26,0.35),transparent_70%)]"
            />

            {/* Top Bar con Logo y Botón de Cerrar */}
            <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#09090b]/90 backdrop-blur-md">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2"
              >
                <Image
                  src="/images/logo-transparent.png"
                  alt="PRAVILO ARG"
                  width={240}
                  height={50}
                  priority
                  className="h-7 w-auto"
                />
              </Link>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.1] text-foreground transition-all active:scale-95"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* Lista de Navegación Scrolleable */}
            <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <nav className="grid grid-cols-1 gap-2">
                {items.map((item, idx) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 py-3.5 transition-all hover:border-accent/50 hover:bg-accent/10 active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="font-mono text-[11px] font-bold text-accent-text/70 group-hover:text-accent-text">
                        0{idx + 1}
                      </span>
                      <span className="font-condensed text-lg font-bold tracking-wide text-foreground group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-muted/60 text-sm transition-transform group-hover:translate-x-1 group-hover:text-accent-text">
                      →
                    </span>
                  </a>
                ))}
              </nav>

              {/* Bloque de Acciones y Contacto */}
              <div className="space-y-3 pt-2 border-t border-white/[0.08]">
                {/* Botón Principal de Reserva */}
                <div onClick={() => setOpen(false)}>
                  <BookingWizard
                    buttonText="Reservar Turno Individual →"
                    className="btn-shiny w-full rounded-2xl bg-accent py-4 font-condensed text-base font-black uppercase tracking-wider text-accent-foreground shadow-xl shadow-accent/30 text-center flex items-center justify-center gap-2"
                  />
                </div>

                {/* Botón Directo a WhatsApp */}
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-condensed font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>

              {/* Footer Informativo */}
              <div className="pt-2 pb-6 text-center space-y-1 text-xs text-muted">
                <p className="font-condensed font-semibold uppercase tracking-wider text-foreground/80">
                  📍 {LOCATION_SHORT} · Neuquén
                </p>
                <p className="text-[11px] text-muted/60">
                  1° Centro Oficial de PRAVILO en Argentina · Sesiones 1 a 1
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
