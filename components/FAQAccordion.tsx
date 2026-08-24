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
      "Solo necesitás ropa deportiva cómoda (remera y calza o jogging). La práctica se realiza descalzo o con medias en un entorno cálido y acondicionado.",
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
    <div className="mx-auto max-w-3xl space-y-3">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.question}
            className={`rounded-2xl border transition-all duration-300 ${
              isOpen
                ? "border-accent/40 bg-surface shadow-[0_4px_20px_-8px_var(--accent)]"
                : "border-border bg-surface/60 hover:border-border/90 hover:bg-surface"
            }`}
          >
            <button
              type="button"
              onClick={() => handleToggle(index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between p-5 text-left transition-colors sm:p-6"
            >
              <span className="font-condensed text-lg font-bold text-foreground sm:text-xl">
                {faq.question}
              </span>
              <span
                className={`ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-sm font-bold text-muted transition-transform duration-300 ${
                  isOpen
                    ? "rotate-180 border-accent bg-accent text-accent-foreground"
                    : "bg-background"
                }`}
              >
                ↓
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-border/50 px-5 pt-3 pb-5 text-sm leading-relaxed text-muted sm:px-6 sm:pb-6">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
