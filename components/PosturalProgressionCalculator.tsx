"use client";

import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import BookingWizard from "./BookingWizard";

interface ConditionOption {
  id: string;
  label: string;
  icon: string;
  initialGain: string;
  fullGain: string;
  timeline: {
    week1: string;
    week3: string;
    week6: string;
  };
}

const CONDITIONS: ConditionOption[] = [
  {
    id: "lumbar",
    label: "Dolor Lumbar o Ciático",
    icon: "⚡",
    initialGain: "Descompresión inmediata de discos L4-L5 y S1",
    fullGain: "Eliminación de la compresión nerviosa y retorno a la actividad sin dolor",
    timeline: {
      week1: "Apertura del espacio intervertebral y descompresión de la raíz nerviosa.",
      week3: "Rehidratación de discos y desactivación de contracturas reflejas.",
      week6: "Consolidación de la curva lumbar natural y estabilización sin dolor.",
    },
  },
  {
    id: "postura",
    label: "Hombros Adelantados & Cuello Rígido",
    icon: "🧘",
    initialGain: "Apertura de caja torácica y descenso escapular",
    fullGain: "Alineación vertical del eje de la cabeza y expansión diafragmática",
    timeline: {
      week1: "Elongación del pectoral menor y liberación del trapecio superior.",
      week3: "Activación de la musculatura dorsal profunda y eje vertebral erguido.",
      week6: "Memoria postural natural sin necesidad de forzar la posición.",
    },
  },
  {
    id: "cadera",
    label: "Rigidez de Cadera & Falta de Movilidad",
    icon: "🦵",
    initialGain: "+15° a +20° de rango articular en rotación de cadera",
    fullGain: "Libertad total de movimiento en flexión, extensión y rotaciones",
    timeline: {
      week1: "Descompresión coxofemoral y elongación del psoas ilíaco.",
      week3: "Aumento progresivo de la flexibilidad fascial de isquiotibiales.",
      week6: "Amplitud articular completa y movilidad fluida en todas las direcciones.",
    },
  },
  {
    id: "deporte",
    label: "Rendimiento & Recuperación Deportiva",
    icon: "🔥",
    initialGain: "Descarga de impacto articular y reseteo del SNC",
    fullGain: "Mayor transferencia de potencia y menor tasa de sobrecargas",
    timeline: {
      week1: "Eliminación del tono residual acumulado tras entrenamientos intensos.",
      week3: "Amplitud de palancas biomecánicas y mayor economía de movimiento.",
      week6: "Rendimiento atlético óptimo y prevención activa de lesiones.",
    },
  },
];

export default function PosturalProgressionCalculator() {
  const [selectedCondition, setSelectedCondition] = useState<string>("lumbar");
  const [frequency, setFrequency] = useState<number>(2);

  const condition = CONDITIONS.find((c) => c.id === selectedCondition) || CONDITIONS[0];

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-28">
      <RevealOnScroll className="text-center mb-12">
        <span className="eyebrow mx-auto w-fit">Simulador de Evolución</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
          ¿Cómo evoluciona tu cuerpo con el método?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted text-base">
          Seleccioná tu punto de partida y la frecuencia semanal para ver la proyección biomecánica estimada.
        </p>
      </RevealOnScroll>

      <RevealOnScroll className="rounded-3xl border border-border-highlight bg-surface-raised/90 p-7 shadow-2xl backdrop-blur-xl sm:p-10">
        {/* Selector de condición */}
        <div>
          <label className="block font-condensed text-xs font-bold uppercase tracking-wider text-muted mb-3">
            1. Seleccioná tu punto de partida:
          </label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CONDITIONS.map((c) => {
              const isSelected = selectedCondition === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCondition(c.id)}
                  className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-accent bg-accent/15 shadow-[0_0_25px_-8px_rgba(160,26,26,0.5)] scale-[1.02]"
                      : "border-border bg-background/80 hover:border-border-highlight hover:bg-surface-raised"
                  }`}
                >
                  <span className="text-2xl mb-2">{c.icon}</span>
                  <span className="font-condensed text-base font-bold text-foreground">
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selector de frecuencia */}
        <div className="mt-8 border-t border-border/80 pt-6">
          <label className="block font-condensed text-xs font-bold uppercase tracking-wider text-muted mb-3">
            2. Frecuencia recomendada semanal:
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { freq: 1, label: "1 Sesión por semana", sub: "Mantenimiento y descarga" },
              { freq: 2, label: "2 Sesiones por semana", sub: "Transformación postural óptima" },
              { freq: 3, label: "3 Sesiones por semana", sub: "Intensivo y alto rendimiento" },
            ].map((f) => (
              <button
                key={f.freq}
                type="button"
                onClick={() => setFrequency(f.freq)}
                className={`flex-1 min-w-[200px] rounded-2xl border p-4 text-left transition-all ${
                  frequency === f.freq
                    ? "border-accent bg-accent/10 shadow-[0_0_20px_-8px_rgba(160,26,26,0.4)]"
                    : "border-border bg-background/80 hover:border-border-highlight"
                }`}
              >
                <p className="font-condensed text-base font-bold text-foreground">{f.label}</p>
                <p className="text-xs text-muted mt-0.5">{f.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Línea de tiempo de resultados */}
        <div className="mt-10 rounded-2xl border border-border bg-background/90 p-6 sm:p-8">
          <h3 className="font-condensed text-xl font-black text-foreground">
            Proyección Biomecánica Estimada
          </h3>

          <div className="mt-6 grid gap-6 md:grid-cols-3 relative">
            <div className="space-y-2">
              <span className="inline-block rounded-full bg-accent/20 border border-accent/40 px-3 py-0.5 font-condensed text-xs font-bold uppercase tracking-wider text-accent-text">
                Semana 1 {frequency >= 2 ? `(${frequency} sesiones)` : "(1 sesión)"}
              </span>
              <h4 className="font-condensed text-base font-bold text-foreground">Descompresión Inmediata</h4>
              <p className="text-xs text-muted leading-relaxed">{condition.timeline.week1}</p>
            </div>

            <div className="space-y-2">
              <span className="inline-block rounded-full bg-accent/20 border border-accent/40 px-3 py-0.5 font-condensed text-xs font-bold uppercase tracking-wider text-accent-text">
                Semana 3 {frequency >= 2 ? `(${frequency * 3} sesiones)` : "(3 sesiones)"}
              </span>
              <h4 className="font-condensed text-base font-bold text-foreground">Reeducación Fascial</h4>
              <p className="text-xs text-muted leading-relaxed">{condition.timeline.week3}</p>
            </div>

            <div className="space-y-2">
              <span className="inline-block rounded-full bg-accent/20 border border-accent/40 px-3 py-0.5 font-condensed text-xs font-bold uppercase tracking-wider text-accent-text">
                Semana 6 {frequency >= 2 ? `(${frequency * 6} sesiones)` : "(6 sesiones)"}
              </span>
              <h4 className="font-condensed text-base font-bold text-foreground">Consolidación Postural</h4>
              <p className="text-xs text-muted leading-relaxed">{condition.timeline.week6}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-6 sm:flex-row">
            <div>
              <span className="text-xs text-muted">Plan sugerido para este objetivo:</span>
              <p className="font-condensed text-lg font-bold text-foreground">
                {frequency === 1
                  ? "1 Sesión Individual con Evaluación Inicial"
                  : frequency === 2
                    ? "Pack Mensual de 8 Sesiones (2x/semana)"
                    : "Pack Mensual de 12 Sesiones (3x/semana)"}
              </p>
            </div>

            <BookingWizard
              buttonText="Reservar mi primera sesión →"
              className="btn-shiny rounded-full bg-accent px-8 py-3.5 font-condensed text-base font-bold uppercase tracking-wider text-accent-foreground shadow-md transition-all hover:scale-105"
            />
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
