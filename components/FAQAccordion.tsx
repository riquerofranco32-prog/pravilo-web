"use client";

import { useState } from "react";
import RevealOnScroll from "@/components/RevealOnScroll";

interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "dolor" | "sesion" | "pagos";
}

const CATEGORIES = [
  { id: "todos", label: "Todas las preguntas" },
  { id: "general", label: "El Método PRAVILO" },
  { id: "sesion", label: "Tu Sesión" },
  { id: "pagos", label: "Precios & Formas de Pago" },
];

const FAQS: FAQItem[] = [
  {
    category: "general",
    question: "¿Qué es exactamente PRAVILO y cómo se siente la sesión?",
    answer:
      "PRAVILO es un método ancestral de entrenamiento y descompresión originario de la tradición eslava. Mediante un sistema específico de poleas y tracción suave en cuatro puntos (manos y pies), el cuerpo se eleva y elonga sin impacto. La sensación durante la sesión es de alivio inmediato, apertura en el pecho y caderas, y una profunda descompresión en toda la columna vertebral.",
  },
  {
    category: "sesion",
    question: "¿Qué indumentaria y preparación necesito para asistir?",
    answer:
      "Solo necesitás ropa deportiva cómoda y una botella de agua para hidratarte. La práctica se realiza descalzo o con medias en un estudio privado, cálido y acondicionado exclusivamente para vos.",
  },
  {
    category: "general",
    question: "¿Hay límite de edad o contraindicaciones para practicarlo?",
    answer:
      "No hay límite de edad estricto. Practican desde jóvenes deportistas hasta adultos mayores. En la primera sesión se realiza una evaluación biomecánica previa para conocer cualquier antecedente médico y adaptar la intensidad al 100%.",
  },
  {
    category: "pagos",
    question: "¿Qué formas de pago aceptan y cómo reservo mi turno?",
    answer:
      "Aceptamos transferencia bancaria, Mercado Pago (tarjetas de crédito/débito) y efectivo en el estudio. Podés iniciar tu reserva seleccionando el día y horario directamente en esta web y coordinar al instante con Juan por WhatsApp.",
  },
  {
    category: "general",
    question: "¿Dónde queda el estudio en Plottier?",
    answer:
      "El centro está ubicado en Plottier, Neuquén, en una zona de fácil acceso y estacionamiento cómodo, a solo 15 minutos de Neuquén Capital y Cipolletti.",
  },
];

export default function FAQAccordion() {
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs =
    activeCategory === "todos"
      ? FAQS
      : FAQS.filter((f) => f.category === activeCategory);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Category Pills */}
      <RevealOnScroll className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenIndex(0);
              }}
              className={`rounded-full px-4 py-1.5 font-condensed text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                isSelected
                  ? "bg-accent text-accent-foreground shadow-md shadow-accent/30 scale-105"
                  : "border border-border bg-surface-raised/80 text-muted hover:border-border-highlight hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </RevealOnScroll>

      {/* Accordion Items */}
      <div className="space-y-3.5 pt-2">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <RevealOnScroll key={faq.question} delay={(index % 3) * 60}>
              <div
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
                    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-border/60 px-5 pt-3 pb-5 text-sm leading-relaxed text-muted sm:px-6 sm:pb-6 animate-fadeIn">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </div>
  );
}
