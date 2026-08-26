"use client";

import React, { useState } from "react";
import BookingWizard from "./BookingWizard";

interface ComparisonItem {
  feature: string;
  pravilo: {
    title: string;
    description: string;
    score: string;
  };
  traditional: {
    title: string;
    description: string;
    score: string;
  };
}

const COMPARISON_DATA: ComparisonItem[] = [
  {
    feature: "Tipo de Tracción & Descompresión",
    pravilo: {
      title: "Tracción Axial 3D en 4 Puntos",
      description:
        "Suspensión simétrica de brazos y piernas que elonga la columna vertebral en 360°, liberando presión hidrostática de cada disco intervertebral.",
      score: "Óptimo (100% Descompresión)",
    },
    traditional: {
      title: "Presión o Ajustes Unilaterales",
      description:
        "Maniobras pasivas o compresiones manuales sobre puntos localizados sin desgravitación ni elongación del eje corporal completo.",
      score: "Limitado a zona tratada",
    },
  },
  {
    feature: "Profundidad del Tejido (Fascia vs. Músculo)",
    pravilo: {
      title: "Liberación Miofascial Profunda",
      description:
        "Actúa sobre las cadenas miofasciales densas y tendones que sostienen la estructura ósea, modificando la memoria corporal.",
      score: "Profundo & Estructural",
    },
    traditional: {
      title: "Relajación Muscular Superficial",
      description:
        "Alivia el tono de los músculos superficiales sin alterar la tensión profunda de los ligamentos ni la alineación articular.",
      score: "Superficial / Cutáneo",
    },
  },
  {
    feature: "Duración del Alivio del Dolor",
    pravilo: {
      title: "Sostenido por Semanas",
      description:
        "Al rehidratar el tejido intervertebral y descomprimir las raíces nerviosas (L4, L5, C6), el alivio se mantiene de forma acumulativa.",
      score: "Semanas a Meses",
    },
    traditional: {
      title: "Alivio Transitorio",
      description:
        "La sensación de relax suele disiparse en 24 a 48 horas una vez que el cuerpo retoma las posturas cotidianas de compresión.",
      score: "24 a 72 Horas",
    },
  },
  {
    feature: "Activación Neuromuscular & Postura",
    pravilo: {
      title: "Reeducación Postural Activa",
      description:
        "El alumno participa activamente mediante respiración guiada, reconectando la propiocepción y enderezando la curvatura natural.",
      score: "Activo & Correctivo",
    },
    traditional: {
      title: "Tratamiento Pasivo",
      description:
        "El paciente permanece inmóvil sobre una camilla sin activación refleja ni reorganización neuromuscular.",
      score: "100% Pasivo",
    },
  },
  {
    feature: "Eficiencia de Tiempo e Inversión",
    pravilo: {
      title: "Alta Densidad Terapéutica",
      description:
        "1 sesión de 60 min de Pravilo equivale en descompresión articular a 6-8 sesiones de tracción o masoterapia convencional.",
      score: "Máximo Retorno",
    },
    traditional: {
      title: "Requiere Alta Frecuencia",
      description:
        "Demanda asistir 2 a 3 veces por semana de forma indefinida para mitigar el retorno de los síntomas.",
      score: "Costo Recurrente Alto",
    },
  },
];

export function PraviloComparisonSection() {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-raised border border-border text-accent-text text-xs font-condensed font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Ciencia & Biomecánica
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-condensed uppercase tracking-tight text-foreground">
            ¿Por qué <span className="text-accent-text">PRAVILO</span> supera a los métodos convencionales?
          </h2>

          <p className="text-sm sm:text-base text-muted leading-relaxed font-sans">
            Comparamos los principios mecánicos de la tracción tridimensional en suspensión frente a las terapias manuales y masajes pasivos tradicionales.
          </p>
        </div>

        {/* Interactive Comparison Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-surface border border-border shadow-2xl space-y-8">
          {/* Mobile Selector Pills */}
          <div className="flex sm:hidden overflow-x-auto pb-2 gap-2">
            {COMPARISON_DATA.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-condensed font-bold uppercase whitespace-nowrap transition-all ${
                  activeTab === idx
                    ? "bg-accent text-accent-foreground shadow"
                    : "bg-surface-raised text-muted border border-border"
                }`}
              >
                {item.feature}
              </button>
            ))}
          </div>

          {/* Side-by-Side Comparison Desktop Grid */}
          <div className="space-y-4">
            {COMPARISON_DATA.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-5 sm:p-6 rounded-2xl bg-surface-raised border border-border/80 hover:border-accent/30 transition-all items-center"
              >
                {/* Feature Label (3 cols) */}
                <div className="lg:col-span-3 space-y-1">
                  <span className="text-[10px] font-condensed uppercase tracking-wider text-muted block">
                    Criterio #{idx + 1}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold font-condensed uppercase text-foreground">
                    {item.feature}
                  </h4>
                </div>

                {/* PRAVILO Column (5 cols) */}
                <div className="lg:col-span-5 p-4 rounded-xl bg-surface border border-accent/40 relative overflow-hidden space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-condensed font-black uppercase tracking-wider text-accent-text flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      PRAVILO ARG (Tracción 3D)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-accent/20 text-accent-text text-[10px] font-condensed font-bold uppercase">
                      {item.pravilo.score}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold font-condensed text-foreground">{item.pravilo.title}</h5>
                  <p className="text-xs text-muted font-sans leading-relaxed">{item.pravilo.description}</p>
                </div>

                {/* Traditional Column (4 cols) */}
                <div className="lg:col-span-4 p-4 rounded-xl bg-surface/40 border border-border space-y-2 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-condensed font-bold uppercase tracking-wider text-muted">
                      Terapias Convencionales
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface border border-border text-muted text-[10px] font-condensed uppercase">
                      {item.traditional.score}
                    </span>
                  </div>
                  <h5 className="text-sm font-semibold text-foreground/80 font-condensed">{item.traditional.title}</h5>
                  <p className="text-xs text-muted font-sans leading-relaxed">{item.traditional.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Summary & CTA */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent-text shrink-0">
                <span className="text-xl">⚖️</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-base font-bold font-condensed uppercase text-foreground">
                  Comprobá la diferencia en tu propia columna
                </h4>
                <p className="text-xs text-muted font-sans">
                  Sesiones individuales de 60 minutos con evaluación postural y descompresión progresiva en Plottier.
                </p>
              </div>
            </div>

            <BookingWizard
              buttonText="Experimentar el Método"
              className="btn-shiny px-8 py-3.5 rounded-2xl bg-accent text-accent-foreground font-condensed font-black uppercase tracking-wider text-sm shadow-xl shadow-accent/25 hover:scale-105 active:scale-95 transition-all shrink-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
