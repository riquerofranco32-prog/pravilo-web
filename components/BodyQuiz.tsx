"use client";

import { useState } from "react";
import BookingWizard from "./BookingWizard";

interface QuizAnswer {
  goal: string;
  activity: string;
  experience: string;
}

export default function BodyQuiz() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [answers, setAnswers] = useState<QuizAnswer>({
    goal: "",
    activity: "",
    experience: "",
  });

  const goals = [
    {
      id: "dolor",
      label: "Aliviar dolor de espalda o ciático",
      desc: "Descompresión axial suave para liberar presión intervertebral.",
      icon: "⚡",
    },
    {
      id: "postura",
      label: "Mejorar postura y movilidad corporal",
      desc: "Alineación de hombros, columna y apertura profunda de cadera.",
      icon: "🧘",
    },
    {
      id: "estres",
      label: "Descompresión profunda y anti-estrés",
      desc: "Liberación de tensiones miofasciales acumuladas en el cuerpo.",
      icon: "🌿",
    },
    {
      id: "deporte",
      label: "Rendimiento y recuperación deportiva",
      desc: "Ganancia de rango articular y elongación sin impacto.",
      icon: "🔥",
    },
  ];

  const activities = [
    {
      id: "sedentario",
      label: "Paso muchas horas sentado/a",
      desc: "Trabajo de oficina, manejo prolongado o poca actividad.",
    },
    {
      id: "moderado",
      label: "Hago actividad física moderada",
      desc: "Gimnasio, caminata o deportes recreativos 1-2 veces por semana.",
    },
    {
      id: "activo",
      label: "Entreno con regularidad",
      desc: "Running, crossfit, artes marciales o entrenamiento intenso.",
    },
  ];

  const experiences = [
    {
      id: "primera_vez",
      label: "Es mi primera vez con el método",
      desc: "Quiero conocer la sensación y probar una sesión guiada.",
    },
    {
      id: "kine_yoga",
      label: "Hago kinesiología, yoga o pilates",
      desc: "Busco complementar con descompresión de 4 puntos.",
    },
    {
      id: "compromiso",
      label: "Busco un cambio postural duradero",
      desc: "Me interesa un plan de seguimiento continuo de 2 a 3 veces por semana.",
    },
  ];

  const handleSelectGoal = (goal: string) => {
    setAnswers((prev) => ({ ...prev, goal }));
    setStep(2);
  };

  const handleSelectActivity = (activity: string) => {
    setAnswers((prev) => ({ ...prev, activity }));
    setStep(3);
  };

  const handleSelectExperience = (experience: string) => {
    setAnswers((prev) => ({ ...prev, experience }));
    setStep(4);
  };

  const handleReset = () => {
    setAnswers({ goal: "", activity: "", experience: "" });
    setStep(1);
  };

  // Determine recommendation
  const getRecommendation = () => {
    if (answers.experience === "compromiso") {
      return {
        title: "Pack Mensual de 8 Sesiones (2x/semana)",
        desc: "Ideal para generar una transformación postural duradera, reeducar la memoria fascial y mantener tu columna completamente libre de compresión.",
        planPrice: "$240.000",
        badge: "Máximo Resultado",
      };
    }
    return {
      title: "1 Sesión Individual con Evaluación Inicial",
      desc: "La mejor opción para experimentar por primera vez la suspensión en el aparato PRAVILO, descomprimir vértebras y sentir la ligereza inmediata en tu cuerpo.",
      planPrice: "$35.000",
      badge: "Recomendado para vos",
    };
  };

  const rec = getRecommendation();

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-surface p-6 shadow-2xl sm:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-4">
        <div>
          <span className="font-condensed text-xs font-bold uppercase tracking-wider text-accent-text">
            Test Interactivo · Paso {step} de 4
          </span>
          <h3 className="font-condensed text-2xl font-extrabold text-foreground">
            {step === 1 && "¿Cuál es tu principal objetivo?"}
            {step === 2 && "¿Cómo es tu rutina física actual?"}
            {step === 3 && "¿Tenés experiencia previa?"}
            {step === 4 && "Diagnóstico & Experiencia Sugerida"}
          </h3>
        </div>

        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step
                  ? "w-6 bg-accent"
                  : s < step
                    ? "w-2 bg-accent/60"
                    : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-3">
          <p className="text-xs text-muted mb-2">
            Seleccioná lo que más querés trabajar en tu cuerpo:
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {goals.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => handleSelectGoal(g.label)}
                className="flex flex-col rounded-2xl border border-border bg-background p-4 text-left transition-all hover:border-accent hover:bg-accent/5 hover:scale-[1.02]"
              >
                <span className="text-2xl mb-2">{g.icon}</span>
                <span className="font-semibold text-foreground text-sm">
                  {g.label}
                </span>
                <span className="mt-1 text-xs text-muted leading-snug">
                  {g.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-3">
          <p className="text-xs text-muted mb-2">
            ¿Cómo describirías tu nivel de movimiento diario?
          </p>
          <div className="space-y-2.5">
            {activities.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => handleSelectActivity(a.label)}
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-background p-4 text-left transition-all hover:border-accent hover:bg-accent/5"
              >
                <div>
                  <span className="font-semibold text-foreground text-sm">
                    {a.label}
                  </span>
                  <p className="mt-0.5 text-xs text-muted">{a.desc}</p>
                </div>
                <span className="text-accent-text font-bold text-lg">→</span>
              </button>
            ))}
          </div>
          <div className="mt-4 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-muted hover:text-foreground"
            >
              ← Volver al paso anterior
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-3">
          <p className="text-xs text-muted mb-2">
            ¿Cuál es tu punto de partida?
          </p>
          <div className="space-y-2.5">
            {experiences.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => handleSelectExperience(e.id)}
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-background p-4 text-left transition-all hover:border-accent hover:bg-accent/5"
              >
                <div>
                  <span className="font-semibold text-foreground text-sm">
                    {e.label}
                  </span>
                  <p className="mt-0.5 text-xs text-muted">{e.desc}</p>
                </div>
                <span className="text-accent-text font-bold text-lg">→</span>
              </button>
            ))}
          </div>
          <div className="mt-4 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs text-muted hover:text-foreground"
            >
              ← Volver al paso anterior
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RESULT */}
      {step === 4 && (
        <div className="space-y-5 animate-fadeIn">
          <div className="rounded-2xl border border-accent/40 bg-accent/10 p-5 shadow-inner">
            <span className="inline-block rounded-full bg-accent px-3 py-0.5 font-condensed text-xs font-bold uppercase tracking-wider text-accent-foreground">
              {rec.badge}
            </span>
            <h4 className="mt-3 font-condensed text-2xl font-extrabold text-foreground">
              {rec.title}
            </h4>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              {rec.desc}
            </p>
            <div className="mt-4 flex items-baseline gap-2 border-t border-accent/20 pt-3">
              <span className="text-xs text-muted">Valor de la experiencia:</span>
              <span className="font-condensed text-2xl font-black text-accent-text">
                {rec.planPrice}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-muted hover:text-foreground order-2 sm:order-1"
            >
              ↺ Reiniciar test
            </button>

            <BookingWizard
              buttonText="Reservar este Plan Ahora →"
              className="order-1 sm:order-2 rounded-full bg-accent px-8 py-3.5 font-condensed text-base font-bold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:opacity-90 hover:scale-105"
            />
          </div>
        </div>
      )}
    </div>
  );
}
