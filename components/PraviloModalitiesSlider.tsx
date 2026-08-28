"use client";

import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import BookingWizard from "./BookingWizard";
import BenefitIcon from "./BenefitIcon";

export function PraviloModalitiesSlider() {
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
    <section className="relative mx-auto max-w-6xl px-6 py-16 md:py-24 overflow-hidden border-t border-border">
      {/* Header & Contexto */}
      <RevealOnScroll className="text-center mb-12">
        <span className="eyebrow mx-auto w-fit">
          DOS ORIENTACIONES · UN MISMO MÉTODO
        </span>
        <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
          PRAVILO se adapta a vos
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted leading-relaxed">
          Ya sea que busques entrenar, mejorar tu rendimiento o desarrollar tus
          capacidades físicas, o que quieras sentirte mejor, ganar movilidad,
          flexibilidad y bienestar, la práctica se adapta a tus necesidades y
          objetivos.
        </p>
      </RevealOnScroll>

      {/* Controles rápidos de selección (Botones para móviles y clicks rápidos) */}
      <RevealOnScroll className="mb-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => setSliderPosition(85)}
          className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-condensed font-bold uppercase tracking-wider transition-all duration-300 ${
            sliderPosition > 50
              ? "bg-accent text-accent-foreground shadow-[0_0_20px_rgba(160,26,26,0.4)] scale-105"
              : "border border-border bg-surface text-muted hover:border-accent/50 hover:text-foreground"
          }`}
        >
          <BenefitIcon name="deporte" className="w-3.5 h-3.5 shrink-0" />
          <span>PRAVILO DEPORTIVO</span>
        </button>
        <button
          type="button"
          onClick={() => setSliderPosition(15)}
          className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-condensed font-bold uppercase tracking-wider transition-all duration-300 ${
            sliderPosition < 50
              ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105"
              : "border border-border bg-surface text-muted hover:border-emerald-500/50 hover:text-foreground"
          }`}
        >
          <BenefitIcon name="terapia" className="w-3.5 h-3.5 shrink-0" />
          <span>PRAVILO TERAPÉUTICO</span>
        </button>
      </RevealOnScroll>

      {/* Interactive Visual Comparison Box */}
      <RevealOnScroll>
        <div className="rounded-3xl border border-border-highlight bg-surface-raised/80 p-4 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div
            className="relative min-h-[460px] sm:min-h-[420px] md:min-h-[380px] w-full select-none overflow-hidden rounded-2xl border border-border bg-background shadow-inner cursor-ew-resize"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* LADO DERECHO: PRAVILO TERAPÉUTICO */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-emerald-950/40 via-surface to-background text-right">
              <div className="flex justify-end">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-4 py-1.5 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-condensed text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-300">
                    PRAVILO TERAPÉUTICO
                  </span>
                </div>
              </div>

              <div className="my-auto space-y-4 max-w-lg ml-auto pt-4">
                <p className="font-condensed text-base sm:text-lg font-bold text-emerald-400 uppercase tracking-wide">
                  Bienestar · Movilidad · Relajación
                </p>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                  Una experiencia orientada al bienestar y al cuidado integral
                  del cuerpo. Se priorizan la movilidad, flexibilidad, postura,
                  relajación y conexión con el propio cuerpo, adaptando la
                  práctica a las necesidades y objetivos de cada persona.
                </p>
                <div className="flex flex-wrap justify-end gap-2 pt-2">
                  <span className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-200">
                    Descompresión articular
                  </span>
                  <span className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-200">
                    Alivio de sobrecargas
                  </span>
                  <span className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-200">
                    Conexión mente-cuerpo
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-emerald-500/20">
                <span className="font-condensed text-xs font-bold uppercase tracking-widest text-emerald-400/80">
                  Cuerpo · Mente · Espíritu
                </span>
              </div>
            </div>

            {/* LADO IZQUIERDO: PRAVILO DEPORTIVO (Clipped by slider position) */}
            <div
              className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-accent/30 via-surface to-background text-left border-r border-accent"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              }}
            >
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 border border-accent/40 px-4 py-1.5 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <span className="font-condensed text-xs sm:text-sm font-bold uppercase tracking-wider text-accent-text">
                    PRAVILO DEPORTIVO
                  </span>
                </div>
              </div>

              <div className="my-auto space-y-4 max-w-lg mr-auto pt-4">
                <p className="font-condensed text-base sm:text-lg font-bold text-accent-text uppercase tracking-wide">
                  Entrenamiento · Rendimiento · Desarrollo físico
                </p>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                  Una experiencia orientada al entrenamiento y al desarrollo de
                  las capacidades físicas. Se puede trabajar fuerza, resistencia,
                  movilidad, flexibilidad, control corporal y rendimiento,
                  adaptando la práctica al nivel y a los objetivos de cada persona.
                </p>
                <div className="flex flex-wrap justify-start gap-2 pt-2">
                  <span className="rounded-xl border border-accent/30 bg-accent/20 px-3 py-1 text-xs text-accent-foreground">
                    Trabajo isométrico
                  </span>
                  <span className="rounded-xl border border-accent/30 bg-accent/20 px-3 py-1 text-xs text-accent-foreground">
                    Fuerza y control excéntrico
                  </span>
                  <span className="rounded-xl border border-accent/30 bg-accent/20 px-3 py-1 text-xs text-accent-foreground">
                    Movilidad activa
                  </span>
                </div>
              </div>

              <div className="flex justify-start pt-3 border-t border-accent/20">
                <span className="font-condensed text-xs font-bold uppercase tracking-widest text-accent-text/80">
                  Cuerpo · Mente · Espíritu
                </span>
              </div>
            </div>

            {/* Slider Divider Bar & Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-white to-emerald-400 shadow-[0_0_20px_rgba(255,255,255,0.6)] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-surface-raised text-white shadow-2xl transition-transform hover:scale-110">
                <BenefitIcon name="dragHorizontal" className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-muted flex items-center justify-center gap-1.5">
            <BenefitIcon name="dragHorizontal" className="w-4 h-4 text-muted inline-block" />
            <span>Deslizá la línea horizontalmente para descubrir ambas orientaciones</span>
          </p>

          {/* Bloque de Cierre y Filosofía */}
          <RevealOnScroll delay={100}>
            <div className="mt-8 rounded-2xl border border-border bg-background/90 p-6 sm:p-8 text-center space-y-4">
              <h3 className="font-condensed text-xl sm:text-2xl font-black text-foreground">
                PRAVILO trabaja de manera integral cuerpo, mente y espíritu.
              </h3>
              <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted leading-relaxed">
                No necesitás ser deportista ni tener experiencia previa para
                practicar PRAVILO. <br className="hidden sm:inline" />
                <strong className="text-foreground font-semibold">
                  Vos elegís hacia dónde llevar la experiencia.
                </strong>
              </p>

              <div className="pt-3 flex justify-center">
                <BookingWizard
                  buttonText="Reservar mi sesión inicial personalizada →"
                  className="btn-shiny rounded-full bg-accent px-8 py-3.5 font-condensed text-base font-bold uppercase tracking-wider text-accent-foreground shadow-lg hover:scale-105 transition-all"
                />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </RevealOnScroll>
    </section>
  );
}
