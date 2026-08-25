"use client";

import React, { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import BookingWizard from "./BookingWizard";

interface QuestionOption {
  id: string;
  label: string;
  desc: string;
  icon: string;
}

const ZONES: QuestionOption[] = [
  {
    id: "lumbar",
    label: "Zona Lumbar & Ciático",
    desc: "Molestias al estar sentado, pinzamiento, hernia o sobrecarga lumbopélvica.",
    icon: "🦴",
  },
  {
    id: "cervical",
    label: "Cuello, Cervical & Hombros",
    desc: "Tensión por pantallas, contracturas trapeciales o bruxismo.",
    icon: "🧘‍♂️",
  },
  {
    id: "deporte",
    label: "Rendimiento Deportivo & Fuerza",
    desc: "Crossfit, running, ciclismo: ganar rango articular y acelerar recuperación.",
    icon: "⚡",
  },
  {
    id: "integral",
    label: "Descompresión Integral & Postura",
    desc: "Sensación de compresión corporal, estrés acumulado y acortamiento general.",
    icon: "🌟",
  },
];

const FREQUENCIES: QuestionOption[] = [
  {
    id: "leve",
    label: "Ocasional / Leve",
    desc: "Aparece después de jornadas largas o entrenamientos exigentes.",
    icon: "🟢",
  },
  {
    id: "frecuente",
    label: "Frecuente / Semanal",
    desc: "Se siente casi todos los días al despertar o trabajar en la oficina.",
    icon: "🟡",
  },
  {
    id: "cronico",
    label: "Constante / Crónico",
    desc: "Convivo con dolor recurrente hace más de 3 meses.",
    icon: "🔴",
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
    if (selectedFreq === "cronico") {
      return {
        plan: "Pack 12 Sesiones",
        planPrice: "$300.000 ($25.000/sesión)",
        badge: "Tratamiento Integral Recomendado",
        title: "Protocolo de Descompresión Fascial Progresiva",
        summary:
          "Para dolores constantes o de larga data, la estructura miofascial necesita tiempo para reorganizarse y descomprimir los discos intervertebrales sin rebotes. El Pack 12 permite trabajar gradualmente la tracción simétrica.",
        benefits: [
          "Descompresión vertebral en 4 direcciones",
          "Reeducación propioceptiva y postural profunda",
          "Máximo ahorro por sesión y seguimiento continuo",
        ],
      };
    }

    if (selectedFreq === "frecuente" || selectedZone === "lumbar" || selectedZone === "cervical") {
      return {
        plan: "Pack 8 Sesiones",
        planPrice: "$240.000 ($30.000/sesión)",
        badge: "Plan Óptimo Más Elegido",
        title: "Plan de Alivio y Restauración de Movilidad",
        summary:
          "Ideal para liberar tensiones acumuladas y generar espacio articular duradero. 8 sesiones permiten superar la fase de adaptación inicial y consolidar la descompresión muscular.",
        benefits: [
          "Liberación de fascias en cadena posterior",
          "Alivio duradero de lumbalgias y cervicalgias",
          "Acompañamiento 1 a 1 en cada sesión",
        ],
      };
    }

    return {
      plan: "1 Sesión Individual",
      planPrice: "$35.000 (60 min)",
      badge: "Iniciación Sugerida",
      title: "Primera Experiencia en Máquina Pravilo",
      summary:
        "La mejor forma de conocer la sensación única de gravedad cero y tracción controlada. Incluye evaluación biomecánica inicial guiada por Juan.",
      benefits: [
        "Evaluación inicial de postura y tensión",
        "Experiencia guiada personalizada de 60 minutos",
        "Sensación inmediata de liviandad y elongación",
      ],
    };
  };

  const rec = getRecommendation();

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <RevealOnScroll className="text-center space-y-3">
        <span className="eyebrow mx-auto w-fit">Autodiagnóstico Biomecánico</span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-serif">
          ¿Qué necesita tu cuerpo hoy?
        </h2>
        <p className="mx-auto max-w-xl text-sm sm:text-base text-white/60">
          Respondé 2 preguntas rápidas para descubrir cómo el método Pravilo puede ayudarte y cuál es el plan recomendado para tu caso.
        </p>
      </RevealOnScroll>

      <div className="mt-10 rounded-3xl border border-white/[0.08] bg-[#121316]/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        {!showResult ? (
          <div className="space-y-8 relative z-10">
            {/* Step 1: Zona */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold flex items-center justify-center border border-amber-500/30">
                  1
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  ¿Dónde sentís mayor molestia o querés enfocar tu trabajo?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ZONES.map((zone) => {
                  const isSelected = selectedZone === zone.id;
                  return (
                    <button
                      type="button"
                      key={zone.id}
                      onClick={() => setSelectedZone(zone.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/5"
                          : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{zone.icon}</span>
                        <h4 className="font-semibold text-sm text-white">{zone.label}</h4>
                      </div>
                      <p className="text-xs text-white/50 mt-1.5 leading-relaxed">{zone.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Frecuencia (shows once zone is selected) */}
            {selectedZone && (
              <div className="space-y-3 pt-4 border-t border-white/[0.06] animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold flex items-center justify-center border border-amber-500/30">
                    2
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    ¿Con qué intensidad o frecuencia se manifiesta?
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {FREQUENCIES.map((freq) => {
                    const isSelected = selectedFreq === freq.id;
                    return (
                      <button
                        type="button"
                        key={freq.id}
                        onClick={() => setSelectedFreq(freq.id)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? "bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/5"
                            : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{freq.icon}</span>
                          <h4 className="font-semibold text-xs text-white">{freq.label}</h4>
                        </div>
                        <p className="text-[11px] text-white/50 mt-1">{freq.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Button to calculate */}
            {selectedZone && selectedFreq && (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={() => setShowResult(true)}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
                >
                  Ver Mi Recomendación Personalizada →
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Result View */
          <div className="space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {rec.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-2 font-serif">
                  {rec.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-white/40 hover:text-white underline font-mono self-start sm:self-auto"
              >
                ← Repetir test
              </button>
            </div>

            <p className="text-sm text-white/70 leading-relaxed max-w-2xl">{rec.summary}</p>

            {/* Plan card inside quiz result */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-white/50 block">Plan Recomendado:</span>
                <h4 className="text-lg font-bold text-amber-400 font-mono">{rec.plan}</h4>
                <p className="text-xs font-mono text-white/80">{rec.planPrice}</p>
              </div>

              <BookingWizard
                buttonText={`Reservar ${rec.plan} →`}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-center"
              />
            </div>

            {/* Benefits Checklist */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono uppercase text-white/50">Beneficios clave para tu caso:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-white/80">
                {rec.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
