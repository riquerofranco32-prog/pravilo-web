"use client";

import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import BookingWizard from "./BookingWizard";

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const pos = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-16 md:py-20 overflow-hidden">
      <RevealOnScroll className="text-center mb-12">
        <span className="eyebrow mx-auto w-fit">Transformación Postural</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
          El Cambio en tu Eje Corporal
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted text-base">
          Deslizá el control para comparar el patrón postural antes vs. después
          de descomprimir tu cuerpo en PRAVILO.
        </p>
      </RevealOnScroll>

      <RevealOnScroll>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center rounded-3xl border border-border-highlight bg-surface-raised/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          {/* Interactive Visual Comparison Box */}
          <div
            className="relative aspect-4/3 sm:aspect-16/10 w-full select-none overflow-hidden rounded-2xl border border-border bg-background shadow-inner cursor-ew-resize"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* LADO DERECHO: DESPUÉS DE PRAVILO */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-br from-emerald-950/30 via-surface to-background">
              <div className="flex justify-end">
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-1 font-condensed text-xs font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md">
                  Después de PRAVILO
                </span>
              </div>
              <div className="space-y-2 text-right">
                <p className="font-condensed text-lg sm:text-xl font-bold text-foreground">
                  Eje Postural Descomprimido
                </p>
                <ul className="text-xs text-emerald-400/90 space-y-1 font-medium">
                  <li>✓ Columna elongada y discos hidratados</li>
                  <li>✓ Hombros abiertos y caja torácica expandida</li>
                  <li>✓ Caderas simétricas y sin tensión lumbar</li>
                  <li>✓ Sensación de ligereza y altura recuperada</li>
                </ul>
              </div>
            </div>

            {/* LADO IZQUIERDO: ANTES DE PRAVILO (Clipped) */}
            <div
              className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-br from-amber-950/40 via-surface to-background border-r border-accent"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              }}
            >
              <div className="flex justify-start">
                <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3.5 py-1 font-condensed text-xs font-bold uppercase tracking-wider text-amber-400 backdrop-blur-md">
                  Antes de la Sesión
                </span>
              </div>
              <div className="space-y-2 text-left">
                <p className="font-condensed text-lg sm:text-xl font-bold text-foreground">
                  Compresión & Rigidez Acumulada
                </p>
                <ul className="text-xs text-amber-400/90 space-y-1 font-medium">
                  <li>✗ Discos lumbares comprimidos por gravedad</li>
                  <li>✗ Hombros volcados hacia adelante y cifosis</li>
                  <li>✗ Acortamiento de psoas e isquiotibiales</li>
                  <li>✗ Fatiga postural, contracturas y dolor ciático</li>
                </ul>
              </div>
            </div>

            {/* Slider Divider Bar & Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-accent-glow to-accent shadow-[0_0_15px_var(--accent)] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-surface-raised text-white shadow-xl">
                <span className="text-xs font-bold">↔</span>
              </div>
            </div>
          </div>

          {/* Explicación & CTA */}
          <div className="space-y-5">
            <span className="eyebrow">Alineación en 3 Dimensiones</span>
            <h3 className="font-condensed text-2xl sm:text-3xl font-black text-foreground">
              Sentí la diferencia desde la primera sesión
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              La tracción axial en suspensión 1 a 1 de PRAVILO revierte en 60
              minutos las semanas de sobrecarga gravitacional, reseteando la
              memoria postural y aliviando la compresión sobre raíces nerviosas
              y articulaciones.
            </p>

            <div className="rounded-2xl border border-border bg-background p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>Sesión 100% individual y personalizada con Juan</span>
              </div>
              <p className="text-muted leading-relaxed">
                Cada persona recibe un ajuste de tensión a medida según su
                estado físico y nivel de flexibilidad.
              </p>
            </div>

            <div className="pt-2">
              <BookingWizard
                buttonText="Reservar mi sesión con evaluación inicial →"
                className="btn-shiny w-full rounded-full bg-accent py-3.5 font-condensed text-base font-bold uppercase tracking-wider text-accent-foreground shadow-md transition-all hover:scale-105"
              />
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
