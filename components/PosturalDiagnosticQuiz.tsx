"use client";

import React, { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import BookingWizard from "./BookingWizard";
import BenefitIcon from "./BenefitIcon";

interface QuestionOption {
  id: string;
  label: string;
  desc: string;
  icon: string;
  iconBg?: string;
  iconBorder?: string;
  iconColor?: string;
  borderHover?: string;
  glow?: string;
}

const ZONES: QuestionOption[] = [
  {
    id: "lumbar",
    label: "Zona Lumbar & Ciático",
    desc: "Molestias al estar sentado, pinzamiento, hernia o sobrecarga lumbopélvica.",
    icon: "columna",
    iconBg: "bg-rose-500/15",
    iconBorder: "border-rose-500/30",
    iconColor: "text-rose-400",
    borderHover: "hover:border-rose-500/50",
    glow: "shadow-rose-500/10",
  },
  {
    id: "cervical",
    label: "Cuello, Cervical & Hombros",
    desc: "Tensión por pantallas, contracturas trapeciales o bruxismo.",
    icon: "cervical",
    iconBg: "bg-amber-500/15",
    iconBorder: "border-amber-500/30",
    iconColor: "text-amber-400",
    borderHover: "hover:border-amber-500/50",
    glow: "shadow-amber-500/10",
  },
  {
    id: "deporte",
    label: "Rendimiento Deportivo & Fuerza",
    desc: "Crossfit, running, ciclismo: ganar rango articular y acelerar recuperación.",
    icon: "deporte",
    iconBg: "bg-yellow-500/15",
    iconBorder: "border-yellow-500/30",
    iconColor: "text-yellow-400",
    borderHover: "hover:border-yellow-500/50",
    glow: "shadow-yellow-500/10",
  },
  {
    id: "integral",
    label: "Descompresión Integral & Postura",
    desc: "Sensación de compresión corporal, estrés acumulado y acortamiento general.",
    icon: "integral",
    iconBg: "bg-emerald-500/15",
    iconBorder: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    borderHover: "hover:border-emerald-500/50",
    glow: "shadow-emerald-500/10",
  },
];

const FREQUENCIES: QuestionOption[] = [
  {
    id: "leve",
    label: "Ocasional / Leve",
    desc: "Aparece después de jornadas largas o entrenamientos exigentes.",
    icon: "severityLeve",
  },
  {
    id: "frecuente",
    label: "Frecuente / Semanal",
    desc: "Se siente casi todos los días al despertar o trabajar en la oficina.",
    icon: "severityFrecuente",
  },
  {
    id: "cronico",
    label: "Constante / Crónico",
    desc: "Convivo con dolor recurrente hace más de 3 meses.",
    icon: "severityCronico",
  },
];

export function PosturalDiagnosticQuiz() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedFreq, setSelectedFreq] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleReset = () => {
    setSelectedZone(null);
    setSelectedFreq(null);
    setShowResult(false);
  };

  const getRecommendation = () => {
    if (selectedZone === "deporte") {
      return {
        plan: "Pack 8 Sesiones",
        planPrice: "$240.000 ($30.000/sesión)",
        badge: "Enfoque Deportivo & Alto Rendimiento",
        title: "Protocolo de Movilidad, Fuerza & Recuperación Activa",
        summary:
          "Diseñado para deportistas y personas activas que buscan aumentar su rango articular, liberar fascias sobrecargadas por el entrenamiento y potenciar la transferencia de fuerza sin impacto.",
        benefits: [
          "Expansión del rango de movimiento y flexibilidad activa",
          "Aceleración de la recuperación muscular pos-esfuerzo",
          "Prevención de lesiones y optimización biomecánica",
        ],
      };
    }

    return {
      plan: "1 Sesión Individual",
      planPrice: "$35.000 · 60 minutos guiados",
      badge: "Sesión 1 a 1 Personalizada",
      title:
        selectedZone === "lumbar"
          ? "Protocolo de Descompresión Lumbo-Pélvica"
          : selectedZone === "cervical"
            ? "Protocolo de Liberación Cervico-Dorsal"
            : selectedZone === "deporte"
              ? "Protocolo de Movilidad & Recuperación Miofascial"
              : "Protocolo de Descompresión & Alineación Integral",
      summary:
        "Tu sesión incluye una evaluación inicial exhaustiva de postura y rango articular, calibración personalizada de arneses y 60 minutos guiados por Juan en el aparato PRAVILO.",
      benefits: [
        "Evaluación inicial de postura y tensión",
        "Descompresión vertebral guiada 1 a 1",
        "Sensación inmediata de liviandad y elongación",
      ],
    };
  };

  const rec = getRecommendation();

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <RevealOnScroll className="text-center space-y-3">
        <span className="eyebrow mx-auto w-fit">Autodiagnóstico Biomecánico</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground font-condensed uppercase">
          ¿Qué necesita tu cuerpo hoy?
        </h2>
        <p className="mx-auto max-w-xl text-base text-muted">
          Seleccioná tu objetivo o molestia para descubrir cómo el método Pravilo puede ayudarte en tu sesión guiada.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={100}>
        <div className="mt-10 rounded-3xl border border-border bg-surface-raised/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Glow ambient de marca (carmesí) */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/15 rounded-full blur-[100px] pointer-events-none" />

        {!showResult ? (
          <div className="space-y-8 relative z-10">
            {/* Step 1: Zona */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent-text font-condensed text-xs font-black flex items-center justify-center border border-accent/40">
                  1
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-condensed uppercase tracking-wider text-foreground">
                  ¿Dónde sentís mayor molestia o querés enfocar tu trabajo?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {ZONES.map((zone) => {
                  const isSelected = selectedZone === zone.id;
                  return (
                    <button
                      type="button"
                      key={zone.id}
                      onClick={() => {
                        setSelectedZone(zone.id);
                        if (zone.id === "deporte") {
                          setSelectedFreq(null);
                        }
                      }}
                      className={`p-5 rounded-2xl border text-left transition-all group ${
                        isSelected
                          ? `${zone.iconBg || "bg-accent/15"} ${zone.iconBorder || "border-accent"} shadow-lg ${zone.glow || "shadow-accent/10"}`
                          : `bg-surface border-border ${zone.borderHover || "hover:border-border-highlight"} hover:bg-surface-raised`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${zone.iconBg || "bg-accent/10"} border ${zone.iconBorder || "border-accent/20"} ${zone.iconColor || "text-accent-text"} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                          <BenefitIcon name={zone.icon} className="w-5 h-5" />
                        </div>
                        <h4 className="font-condensed font-bold text-base uppercase tracking-wide text-foreground">
                          {zone.label}
                        </h4>
                      </div>
                      <p className="text-xs text-muted mt-2 leading-relaxed">{zone.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Frecuencia (solo si no es deporte) */}
            {selectedZone && selectedZone !== "deporte" && (
              <div className="space-y-4 pt-6 border-t border-border/80 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-accent/20 text-accent-text font-condensed text-xs font-black flex items-center justify-center border border-accent/40">
                    2
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-condensed uppercase tracking-wider text-foreground">
                    ¿Con qué intensidad o frecuencia se manifiesta?
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {FREQUENCIES.map((freq) => {
                    const isSelected = selectedFreq === freq.id;
                    return (
                      <button
                        type="button"
                        key={freq.id}
                        onClick={() => setSelectedFreq(freq.id)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? "bg-accent/15 border-accent shadow-lg shadow-accent/10"
                            : "bg-surface border-border hover:border-border-highlight hover:bg-surface-raised"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <BenefitIcon name={freq.icon} className="w-4 h-4 shrink-0" />
                          <h4 className="font-condensed font-bold text-sm uppercase tracking-wide text-foreground">
                            {freq.label}
                          </h4>
                        </div>
                        <p className="text-xs text-muted mt-1.5 leading-relaxed">{freq.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Button to calculate */}
            {selectedZone && (selectedZone === "deporte" || selectedFreq) && (
              <div className="flex justify-center pt-4 animate-in fade-in zoom-in-95 duration-200">
                <button
                  type="button"
                  onClick={() => setShowResult(true)}
                  className="btn-shiny px-8 py-3.5 rounded-full bg-accent text-accent-foreground font-condensed font-black text-sm uppercase tracking-wider shadow-lg shadow-accent/25 hover:opacity-95 active:scale-95 transition-all"
                >
                  Ver Mi Recomendación Personalizada →
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Result View */
          <div className="space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
              <div>
                <span className="px-3.5 py-1 rounded-full text-xs font-condensed font-black uppercase tracking-wider bg-accent/20 text-accent-text border border-accent/40">
                  {rec.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-condensed uppercase tracking-tight text-foreground mt-3">
                  {rec.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-condensed uppercase tracking-wider text-muted hover:text-foreground underline self-start sm:self-auto"
              >
                ← Repetir autodiagnóstico
              </button>
            </div>

            <p className="text-sm sm:text-base text-muted leading-relaxed max-w-2xl">{rec.summary}</p>

            {/* Plan card inside quiz result */}
            <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-condensed uppercase tracking-wider text-muted block">Plan Recomendado:</span>
                <h4 className="text-2xl font-black font-condensed text-accent-text">{rec.plan}</h4>
                <p className="text-xs font-condensed font-bold text-foreground/80">{rec.planPrice}</p>
              </div>

              <BookingWizard
                buttonText={`Reservar ${rec.plan} →`}
                className="btn-shiny w-full sm:w-auto px-8 py-3.5 rounded-full bg-accent text-accent-foreground font-condensed font-black text-sm uppercase tracking-wider shadow-lg shadow-accent/25 hover:opacity-95 active:scale-95 transition-all text-center"
              />
            </div>

            {/* Benefits Checklist */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-condensed uppercase tracking-wider text-muted font-bold">
                Beneficios clave para tu caso:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-foreground">
                {rec.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-surface border border-border">
                    <BenefitIcon name="checkCircle" className="w-3.5 h-3.5 text-accent-text shrink-0" />
                    <span className="font-condensed font-medium text-xs text-foreground/90">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </RevealOnScroll>
  </section>
);
}
