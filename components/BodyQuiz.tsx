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
      desc: "Descompresión axial suave para liberar presión intervertebral y raíz nerviosa.",
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
      desc: "Ganancia de rango articular y elongación sin impacto para atletas.",
      icon: "🔥",
    },
  ];

  const activities = [
    {
      id: "sedentario",
      label: "Paso muchas horas sentado/a",
      desc: "Trabajo de oficina, manejo prolongado o poca actividad física.",
    },
    {
      id: "moderado",
      label: "Hago actividad física moderada",
      desc: "Gimnasio, caminata o deportes recreativos 1 a 2 veces por semana.",
    },
    {
      id: "activo",
      label: "Entreno con regularidad",
      desc: "Running, crossfit, artes marciales o entrenamiento atlético intenso.",
    },
  ];

  const experiences = [
    {
      id: "primera_vez",
      label: "Es mi primera vez con el método PRAVILO",
      desc: "Quiero conocer la sensación de suspensión y probar una sesión guiada.",
    },
    {
      id: "kine_yoga",
      label: "Hago kinesiología, yoga o pilates",
      desc: "Busco complementar con descompresión axial en 4 puntos.",
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
        title: "Pack Mensual de 8 Sesiones (2x por semana)",
        desc: "El formato más recomendado para transformar tu patrón postural, reeducar la memoria fascial y mantener la columna vertebral liberada de compresión.",
        planPrice: "$240.000",
        badge: "Máximo Resultado Postural",
        features: [
          "Seguimiento biomecánico continuo",
          "Reeducación fascial progresiva",
          "Prioridad de horarios en agenda",
        ],
      };
    }
    return {
      title: "1 Sesión Individual con Evaluación Inicial",
      desc: "La experiencia ideal para tu primer contacto con PRAVILO. Incluye lectura postural, preparación fascial y suspensión axial de 4 puntos en el estudio.",
      planPrice: "$35.000",
      badge: "Recomendado para tu punto de partida",
      features: [
        "Evaluación y diagnóstico inicial",
        "Sesión 1 a 1 guiada por Juan",
        "Sensación de ligereza inmediata",
      ],
    };
  };

  const rec = getRecommendation();

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-surface/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-border/80 pb-4">
        <div>
          <span className="font-condensed text-xs font-bold uppercase tracking-wider text-accent-text">
            Test Biomecánico · Paso {step} de 4
          </span>
          <h3 className="mt-1 font-condensed text-2xl font-extrabold text-foreground">
            {step === 1 && "¿Cuál es tu principal objetivo corporal?"}
            {step === 2 && "¿Cómo es tu rutina física actual?"}
            {step === 3 && "¿Cuál es tu punto de partida?"}
            {step === 4 && "Tu Plan Sugerido en PRAVILO"}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? "w-7 bg-gradient-to-r from-accent to-accent-glow shadow-[0_0_10px_var(--accent)]"
                  : s < step
                    ? "w-2.5 bg-accent/70"
                    : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-3">
          <p className="text-xs text-muted mb-3">
            Seleccioná la necesidad principal que sentís en tu cuerpo:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {goals.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => handleSelectGoal(g.label)}
                className="group flex flex-col rounded-2xl border border-border bg-surface-raised/70 p-4 text-left transition-all duration-200 hover:border-accent hover:bg-accent/10 hover:shadow-[0_8px_25px_-10px_rgba(160,26,26,0.3)] hover:scale-[1.02]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-xl shadow-inner group-hover:border-accent/40">
                  {g.icon}
                </div>
                <span className="mt-3 font-semibold text-foreground text-sm group-hover:text-accent-text transition-colors">
                  {g.label}
                </span>
                <span className="mt-1 text-xs text-muted leading-relaxed">
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
          <p className="text-xs text-muted mb-3">
            ¿Cómo describirías tu nivel de movimiento y actividad diaria?
          </p>
          <div className="space-y-3">
            {activities.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => handleSelectActivity(a.label)}
                className="group flex w-full items-center justify-between rounded-2xl border border-border bg-surface-raised/70 p-4 text-left transition-all duration-200 hover:border-accent hover:bg-accent/10 hover:shadow-[0_8px_25px_-10px_rgba(160,26,26,0.3)]"
              >
                <div>
                  <span className="font-semibold text-foreground text-sm group-hover:text-accent-text transition-colors">
                    {a.label}
                  </span>
                  <p className="mt-0.5 text-xs text-muted leading-relaxed">{a.desc}</p>
                </div>
                <span className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background font-bold text-accent-text shadow-sm group-hover:border-accent group-hover:bg-accent group-hover:text-white transition-all">
                  →
                </span>
              </button>
            ))}
          </div>
          <div className="mt-5 pt-2 border-t border-border/40">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-muted transition-colors hover:text-foreground"
            >
              ← Volver al paso anterior
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-3">
          <p className="text-xs text-muted mb-3">
            ¿Cuál es tu experiencia o familiaridad con el trabajo corporal?
          </p>
          <div className="space-y-3">
            {experiences.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => handleSelectExperience(e.id)}
                className="group flex w-full items-center justify-between rounded-2xl border border-border bg-surface-raised/70 p-4 text-left transition-all duration-200 hover:border-accent hover:bg-accent/10 hover:shadow-[0_8px_25px_-10px_rgba(160,26,26,0.3)]"
              >
                <div>
                  <span className="font-semibold text-foreground text-sm group-hover:text-accent-text transition-colors">
                    {e.label}
                  </span>
                  <p className="mt-0.5 text-xs text-muted leading-relaxed">{e.desc}</p>
                </div>
                <span className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background font-bold text-accent-text shadow-sm group-hover:border-accent group-hover:bg-accent group-hover:text-white transition-all">
                  →
                </span>
              </button>
            ))}
          </div>
          <div className="mt-5 pt-2 border-t border-border/40">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs text-muted transition-colors hover:text-foreground"
            >
              ← Volver al paso anterior
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RESULT */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-accent/50 bg-gradient-to-b from-accent/15 to-transparent p-6 shadow-xl relative overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-accent/20 blur-2xl"
            />
            <span className="inline-block rounded-full bg-accent px-3.5 py-1 font-condensed text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm">
              {rec.badge}
            </span>
            <h4 className="mt-3 font-condensed text-2xl font-black text-foreground sm:text-3xl">
              {rec.title}
            </h4>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              {rec.desc}
            </p>

            <ul className="mt-4 space-y-2 border-t border-accent/20 pt-4 text-xs text-foreground/90">
              {rec.features.map((feat) => (
                <li key={feat} className="flex items-center gap-2">
                  <span className="text-accent-text font-bold">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-baseline justify-between border-t border-accent/20 pt-4">
              <span className="text-xs text-muted">Inversión recomendada:</span>
              <span className="font-condensed text-3xl font-black text-accent-text">
                {rec.planPrice}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-1">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-muted hover:text-foreground order-2 sm:order-1 transition-colors"
            >
              ↺ Reiniciar test
            </button>

            <BookingWizard
              buttonText="Reservar este Plan Ahora →"
              className="btn-shiny order-1 sm:order-2 rounded-full bg-accent px-8 py-3.5 font-condensed text-base font-bold text-accent-foreground shadow-[0_4px_25px_-5px_var(--accent)] transition-all hover:scale-105"
            />
          </div>
        </div>
      )}
    </div>
  );
}

