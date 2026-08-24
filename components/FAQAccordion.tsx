"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "¿Qué es exactamente PRAVILO y cómo se siente la sesión?",
    answer:
      "PRAVILO es un método milenario de entrenamiento y descompresión originario de la tradición eslava. Mediante un sistema específico de poleas y tracción suave en cuatro puntos (manos y pies), el cuerpo se eleva y elonga sin impacto. La sensación durante la sesión es de alivio inmediato, apertura en el pecho y caderas, y una profunda descompresión en toda la columna vertebral.",
  },
  {
    question: "¿Es seguro si tengo dolor lumbar, ciático o hernias de disco?",
    answer:
      "Sí, es uno de los mayores beneficios del método. Al generar tracción axial controlada, se crea espacio entre las vértebras, aliviando la compresión de los discos y nervios. Las sesiones son 1 a 1 y guiadas en todo momento por Juan, profesor de educación física y primer instructor oficial de Pravilo en Argentina, graduando la tensión milimétricamente.",
  },
  {
    question: "¿Qué indumentaria necesito para asistir?",
    answer:
      "Solo necesitás ropa deportiva cómoda (remera y calza o jogging). La práctica se realiza descalzo o con medias en un entorno cálido, cuidado y acondicionado.",
  },
  {
    question: "¿Cuánto dura cada sesión y cuándo se notan los resultados?",
    answer:
      "Cada sesión dura 60 minutos completos e incluye movilidad preparatoria, trabajo en suspensión Pravilo y descarga articular. La sensación de liviandad, mayor rango de movimiento y menor dolor se nota desde la primera sesión. Para cambios posturales duraderos y reeducación fascial, recomendamos los packs mensuales de 8 o 12 sesiones.",
  },
  {
    question: "¿Dónde queda el estudio y cómo coordino mi turno?",
    answer:
      "El centro está ubicado en Plottier, Neuquén, a pocos minutos de Neuquén Capital y Cipolletti. Podés elegir tu plan, día y horario disponible directamente tocando el botón 'Reservar turno' en esta web, y coordinarás al instante por WhatsApp.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-3.5">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.question}
            className={`rounded-2xl border transition-all duration-300 ${
              isOpen
                ? "border-accent/50 bg-surface-raised shadow-[0_8px_30px_-10px_rgba(160,26,26,0.35)]"
                : "border-border bg-surface/80 hover:border-border-highlight hover:bg-surface-raised"
            }`}
          >
            <button
              type="button"
              onClick={() => handleToggle(index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between p-5 text-left transition-colors sm:p-6"
            >
              <div className="flex items-center gap-3.5 pr-2">
                <span
                  className={`font-condensed text-sm font-bold transition-colors ${
                    isOpen ? "text-accent-text" : "text-muted/60"
                  }`}
                >
                  0{index + 1}
                </span>
                <span className="font-condensed text-lg font-bold text-foreground sm:text-xl">
                  {faq.question}
                </span>
              </div>
              <span
                className={`ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  isOpen
                    ? "rotate-180 border-accent bg-accent text-accent-foreground shadow-[0_0_15px_-3px_var(--accent)]"
                    : "border-border bg-background text-muted"
                }`}
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4 fill-current"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-border/60 px-5 pt-3 pb-5 text-sm leading-relaxed text-muted sm:px-6 sm:pb-6">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

