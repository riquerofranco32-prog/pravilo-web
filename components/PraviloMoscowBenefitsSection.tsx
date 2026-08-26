"use client";

import React, { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import BookingWizard from "./BookingWizard";

interface BenefitCardData {
  id: string;
  number: string;
  title: string;
  tag: string;
  shortDesc: string;
  fullDesc: string;
  scienceNote: string;
  iconSvg: React.ReactNode;
}

const BENEFICIOS_ARG: BenefitCardData[] = [
  {
    id: "descompresion",
    number: "01",
    title: "Descompresión Vertebral y Alivio Profundo",
    tag: "Columna & Lumbares",
    shortDesc:
      "Apertura milimétrica entre vértebras que libera de inmediato la presión en discos, nervios y zona lumbar.",
    fullDesc:
      "La vida cotidiana, las horas sentado frente a la pantalla o los entrenamientos de impacto comprimen progresivamente la columna. En PRAVILO, la suspensión simétrica en 4 puntos reparte la carga de manera perfecta, creando espacio entre vértebras y permitiendo que los discos respiren y se rehidraten sin impacto articular.",
    scienceNote: "Restaura el espacio intervertebral y descomprime raíces nerviosas (como el ciático) de forma suave y controlada.",
    iconSvg: (
      <svg className="w-8 h-8 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
  },
  {
    id: "fascia",
    number: "02",
    title: "Expansión Fascial y Rango Articular",
    tag: "Movilidad 360°",
    shortDesc:
      "Desbloqueo de caderas, hombros y caja torácica que ningún estiramiento convencional en el piso logra alcanzar.",
    fullDesc:
      "La fascia es el tejido conectivo que envuelve cada músculo del cuerpo. Cuando se acorta o rigidiza por mala postura, limita todo tu movimiento. La tracción tridimensional estira estas cadenas en toda su longitud, disolviendo adherencias profundas y devolviéndote una elasticidad real.",
    scienceNote: "Libera la tensión miofascial profunda y aumenta el rango de movimiento articular en hombros, cadera y cuello.",
    iconSvg: (
      <svg className="w-8 h-8 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
  },
  {
    id: "circulacion",
    number: "03",
    title: "Circulación y Oxigenación Total",
    tag: "Flujo Sanguíneo",
    shortDesc:
      "Al soltar los espasmos musculares que comprimen los vasos, la sangre fluye libremente oxigenando cada tejido.",
    fullDesc:
      "Un músculo contracturado de forma permanente actúa como un torniquete sobre las arterias y venas que lo atraviesan. Al relajar esas zonas críticas durante la tracción, se reactiva el retorno venoso hacia el corazón, facilitando la nutrición celular y una recuperación acelerada de la musculatura.",
    scienceNote: "Optimiza la perfusión sanguínea periférica, alivia la pesadez en extremidades y nutre tejidos profundos.",
    iconSvg: (
      <svg className="w-8 h-8 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: "nervioso",
    number: "04",
    title: "Desactivación del Estrés y Calma Mental",
    tag: "Sistema Nervioso",
    shortDesc:
      "El cuerpo pasa del estado de alerta y tensión constante a un modo de relajación y restauración profunda.",
    fullDesc:
      "La mente y el cuerpo están en diálogo continuo: las preocupaciones se transforman en corazas físicas. Al flotar en el dispositivo bajo una guía segura, el sistema nervioso central apaga la respuesta de 'lucha o huida' y activa el tono parasimpático, generando una sensación inmediata de ligereza y paz.",
    scienceNote: "Estimulación del nervio vago y reducción natural de los picos de cortisol y tensión muscular refleja.",
    iconSvg: (
      <svg className="w-8 h-8 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: "drenaje",
    number: "05",
    title: "Drenaje Natural y Alivio Inflamatorio",
    tag: "Sistema Linfático",
    shortDesc:
      "Movilización profunda de líquidos y toxinas estancadas mediante la tracción suave del propio cuerpo.",
    fullDesc:
      "El sistema linfático no cuenta con un corazón propio para bombear; depende exclusivamente del movimiento y la alternancia de presiones en los tejidos. La apertura articular en PRAVILO actúa como una bomba hidráulica natural que descongestiona articulaciones cargadas y acelera la eliminación de desechos metabólicos.",
    scienceNote: "Promueve el drenaje linfático intersticial y colabora en desinflamar zonas articulares sobrecargadas.",
    iconSvg: (
      <svg className="w-8 h-8 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    id: "energia",
    number: "06",
    title: "Recuperación de Energía y Menor Fatiga",
    tag: "Vitalidad Diaria",
    shortDesc:
      "Dejar de gastar energía sosteniendo contracturas involuntarias se traduce en vitalidad instantánea al caminar.",
    fullDesc:
      "Sostener contracturas crónicas en el cuello o la espalda es como manejar un auto con el freno de mano puesto: agota tu energía y te deja fatigado antes de tiempo. Al desbloquear esa rigidez, el cuerpo ahorra ese gasto silencioso y recuperás un impulso fresco para tu día a día.",
    scienceNote: "Disminuye el gasto energético parasitario de las contracturas crónicas y mejora la oxigenación general.",
    iconSvg: (
      <svg className="w-8 h-8 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "postura",
    number: "07",
    title: "Reeducación y Simetría Postural",
    tag: "Alineación Corporal",
    shortDesc:
      "Corrección de malos hábitos y vicios de postura adquiridos por trabajo sedentario o celular.",
    fullDesc:
      "Al suspenderte de forma simétrica, el cuerpo evidencia de inmediato qué lado está compensando de más. El sistema nervioso reprograma la alineación de hombros, columna y pelvis, ayudándote a pararte más erguido, con menos esfuerzo y mayor presencia.",
    scienceNote: "Reprogramación propioceptiva del esquema corporal y fortalecimiento de la musculatura postural profunda.",
    iconSvg: (
      <svg className="w-8 h-8 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: "resiliencia",
    number: "08",
    title: "Autocontrol, Respiración y Presencia",
    tag: "Mente & Enfoque",
    shortDesc:
      "Aprendés a respirar con calma ante desafíos físicos, ganando serenidad para momentos de alta presión.",
    fullDesc:
      "En el aparato, la clave para relajarse no es hacer fuerza, sino exhalar y confiar en la estructura. Esta capacidad de mantener la respiración profunda y la mente serena frente a una sensación desconocida se traslada de inmediato a cómo manejás el estrés en tu vida cotidiana.",
    scienceNote: "Mejora la variabilidad de la frecuencia cardíaca (VFC) y la respuesta adaptativa al estrés mental y laboral.",
    iconSvg: (
      <svg className="w-8 h-8 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function PraviloMoscowBenefitsSection() {
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitCardData | null>(null);

  return (
    <section id="beneficios" className="px-6 py-20 md:py-28 bg-surface relative overflow-hidden border-t border-border">
      {/* Glow background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10 space-y-12">
        {/* Header */}
        <RevealOnScroll className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-raised border border-border text-accent-text text-xs font-condensed font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Impacto Integral Comprobado
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-condensed uppercase tracking-tight text-foreground">
            ¿Qué experimentás al entrenar en <span className="text-accent-text">PRAVILO</span>?
          </h2>

          <p className="text-sm sm:text-base text-muted leading-relaxed font-sans">
            Más que una sesión de estiramiento: una transformación biomecánica, postural y neurológica pensada para tu cuerpo.
          </p>

          <div className="pt-2 inline-flex items-center gap-2 text-xs font-condensed font-bold uppercase tracking-wider text-accent-text bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full animate-bounce">
            <span>👇</span>
            <span>Tocá cada tarjeta para conocer los efectos en tu cuerpo</span>
          </div>
        </RevealOnScroll>

        {/* 8 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {BENEFICIOS_ARG.map((b, i) => {
            const isSelected = selectedBenefit?.id === b.id;

            return (
              <RevealOnScroll
                key={b.id}
                style={{ transitionDelay: `${(i % 4) * 80}ms` }}
              >
                <div
                  onClick={() => setSelectedBenefit(b)}
                  className={`group cursor-pointer h-full rounded-2xl border p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                    isSelected
                      ? "bg-surface-raised border-accent shadow-xl shadow-accent/20 ring-1 ring-accent scale-[1.02]"
                      : "bg-surface-raised/50 border-border hover:border-accent/60 hover:bg-surface-raised hover:scale-[1.01]"
                  }`}
                >
                  {/* Subtle top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-4">
                    {/* Icon & Number */}
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-xl bg-surface border border-border group-hover:border-accent/40 group-hover:bg-accent/10 transition-all">
                        {b.iconSvg}
                      </div>
                      <span className="font-condensed text-xs font-bold text-muted/60 group-hover:text-accent-text font-mono">
                        {b.number}
                      </span>
                    </div>

                    {/* Tag & Title */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-condensed font-bold uppercase tracking-wider text-accent-text block">
                        {b.tag}
                      </span>
                      <h3 className="font-condensed text-lg sm:text-xl font-bold uppercase text-foreground group-hover:text-accent-text transition-colors leading-tight">
                        {b.title}
                      </h3>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-muted font-sans leading-relaxed line-clamp-3">
                      {b.shortDesc}
                    </p>
                  </div>

                  {/* Click to expand hint */}
                  <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs font-condensed font-bold uppercase tracking-wider text-accent-text group-hover:translate-x-0.5 transition-transform">
                    <span>Ver detalle</span>
                    <span>→</span>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <RevealOnScroll className="p-8 rounded-3xl bg-surface-raised border border-border flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-xl">
          <div className="space-y-1 max-w-xl">
            <h4 className="font-condensed text-xl font-black uppercase text-foreground">
              Comprobá el alivio en tu propia estructura
            </h4>
            <p className="text-xs sm:text-sm text-muted font-sans">
              Evaluación personalizada y sesión guiada de 60 minutos en Plottier, Neuquén.
            </p>
          </div>

          <BookingWizard
            buttonText="Reservar Turno de Evaluación"
            className="btn-shiny px-8 py-3.5 rounded-2xl bg-accent text-accent-foreground font-condensed font-black uppercase tracking-wider text-sm shadow-xl shadow-accent/25 hover:scale-105 active:scale-95 transition-all shrink-0"
          />
        </RevealOnScroll>
      </div>

      {/* Modal Interactivo de Detalle Biomecánico */}
      {selectedBenefit && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedBenefit(null)}
        >
          <div
            className="relative w-full max-w-lg bg-surface border border-accent/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-foreground space-y-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedBenefit(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-surface-raised border border-border text-muted hover:text-foreground transition-colors"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-accent/15 border border-accent/30 text-accent-text shrink-0">
                {selectedBenefit.iconSvg}
              </div>
              <div>
                <span className="text-[11px] font-condensed font-bold uppercase tracking-wider text-accent-text">
                  {selectedBenefit.number} • {selectedBenefit.tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-condensed uppercase tracking-tight text-foreground">
                  {selectedBenefit.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs sm:text-sm text-foreground/90 font-sans leading-relaxed">
              <div className="p-4 rounded-xl bg-surface-raised border border-border">
                <p>{selectedBenefit.fullDesc}</p>
              </div>

              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 space-y-1">
                <span className="text-[10px] font-condensed font-bold uppercase tracking-wider text-accent-text block">
                  🔬 Enfoque Biomecánico:
                </span>
                <p className="text-xs text-muted font-sans italic">
                  {selectedBenefit.scienceNote}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
              <button
                onClick={() => setSelectedBenefit(null)}
                className="text-xs font-condensed font-bold uppercase text-muted hover:text-foreground"
              >
                Cerrar
              </button>

              <BookingWizard
                buttonText="Probar en mi Sesión"
                className="btn-shiny px-6 py-2.5 rounded-xl bg-accent text-accent-foreground font-condensed font-bold uppercase tracking-wider text-xs shadow-lg shadow-accent/25 hover:opacity-95 transition-all"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
