"use client";

import React, { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import SpotlightCard from "./SpotlightCard";
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

const BENEFICIOS_MOSCOW: BenefitCardData[] = [
  {
    id: "tension",
    number: "01",
    title: "Liberación de Tensión & Descompresión",
    tag: "Columna & Articulaciones",
    shortDesc:
      "A través de una tracción suave en suspensión, los músculos y fascias acortadas regresan a su longitud anatómica original.",
    fullDesc:
      "La vida sedentaria o los entrenamientos de alto impacto provocan contracciones musculares involuntarias crónicas. En PRAVILO, la tracción simétrica en 4 puntos genera un espacio milimétrico entre cada vértebra, aliviando la compresión de discos y nervios de manera progresiva y sin impacto articular.",
    scienceNote: "Restaura la hidratación discal y elimina contracturas profundas de difícil acceso para masajes convencionales.",
    iconSvg: (
      <svg className="w-8 h-8 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
  },
  {
    id: "circulacion",
    number: "02",
    title: "Optimización de la Circulación Sanguínea",
    tag: "Sistema Cardiovascular",
    shortDesc:
      "Al soltar la presión muscular que comprime venas y arterias, se restablece el flujo sanguíneo y la oxigenación general.",
    fullDesc:
      "Un músculo crónicamente espasmado actúa como un estrangulador sobre los vasos sanguíneos y capilares circundantes, dificultando el retorno venoso hacia el corazón. Al descomprimir las cadenas miofasciales, la sangre fluye libremente, transportando oxígeno y nutrientes a todos los tejidos y órganos.",
    scienceNote: "Mejora el retorno venoso, oxigena el cerebro y reduce la fatiga cardíaca periférica.",
    iconSvg: (
      <svg className="w-8 h-8 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: "hormonal",
    number: "03",
    title: "Regulación & Balance Hormonal",
    tag: "Sistema Endocrino",
    shortDesc:
      "A través de un estrés biomecánico positivo (eustrés), el sistema hormonal se calibra y aprende a transicionar al reposo.",
    fullDesc:
      "El estímulo de tracción controlada genera una respuesta endocrina adaptativa. El cuerpo aprende a gestionar la liberación de adrenalina y endorfinas durante la fase activa, para luego entrar en un estado de calma profunda donde bajan drásticamente los niveles de cortisol (la hormona del estrés crónico).",
    scienceNote: "Promueve la secreción de endorfinas y equilibra la curva circadiana de energía y descanso.",
    iconSvg: (
      <svg className="w-8 h-8 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "nervioso",
    number: "04",
    title: "Reinicio del Sistema Nervioso",
    tag: "Reset Neuro-Somático",
    shortDesc:
      "Se libera el estrés emocional y somático acumulado en el cuerpo, dando paso a una claridad mental inmediata.",
    fullDesc:
      "El cuerpo retiene tensiones y traumas posturales en forma de patrones neuromusculares defensivos. Al experimentar la suspensión total en un ambiente seguro y guiado, el sistema nervioso simpático ('lucha o huida') se apaga, dando lugar al tono parasimpático de regeneración celular y descanso profundo.",
    scienceNote: "Estimulación del nervio vago y reprogramación propioceptiva del esquema corporal.",
    iconSvg: (
      <svg className="w-8 h-8 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: "linfatico",
    number: "05",
    title: "Drenaje Linfático & Desinflamación",
    tag: "Regeneración Fascial",
    shortDesc:
      "La tracción multidireccional reactiva el flujo linfático, eliminando toxinas y descongestionando articulaciones.",
    fullDesc:
      "A diferencia de la sangre, el sistema linfático no tiene una bomba propia; depende del movimiento y de la compresión/descompresión muscular para circular. La elongación fascial 3D en Pravilo exprime y rehidrata las cápsulas articulares, facilitando el vaciado de líquidos estancados y sustancias proinflamatorias.",
    scienceNote: "Disminuye la inflamación articular crónica y acelera la recuperación post-entrenamiento.",
    iconSvg: (
      <svg className="w-8 h-8 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    id: "energia",
    number: "06",
    title: "Impulso de Energía & Vitalidad",
    tag: "Rendimiento Cotidiano",
    shortDesc:
      "Al desactivar el gasto constante de energía que requiere sostener contracturas, experimentás una ligereza inmediata.",
    fullDesc:
      "Mantener músculos tensos las 24 horas del día consume en segundo plano una inmensa cantidad de glucosa, oxígeno y energía vital. Al liberarte de esa coraza invisible, el cuerpo recupera de golpe toda esa energía disponible para tu concentración, trabajo y disfrute diario.",
    scienceNote: "Mayor disponibilidad de oxígeno celular y sensación de liviandad corporal al caminar.",
    iconSvg: (
      <svg className="w-8 h-8 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    id: "voluntad",
    number: "07",
    title: "Fortalecimiento de la Voluntad & Confianza",
    tag: "Conexión Mente-Cuerpo",
    shortDesc:
      "Cuando a través del cuerpo comprobás que podés superar lo que creías imposible, lo trasladás a tu vida diaria.",
    fullDesc:
      "En el dispositivo PRAVILO, el alumno aprende a respirar con calma frente a una carga de tracción inusual, superando el reflejo inicial de miedo o duda. Esta vivencia física directa reprograma tu autopercepción de resistencia y capacidad de logro en cualquier área de tu vida.",
    scienceNote: "Desarrollo de resiliencia somática y superación de barreras autoimpuestas.",
    iconSvg: (
      <svg className="w-8 h-8 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: "resiliencia",
    number: "08",
    title: "Mayor Tolerancia al Estrés Cotidiano",
    tag: "Autocontrol & Calma",
    shortDesc:
      "El estrés biomecánico guiado te entrena para elegir qué sentir y cómo respirar en situaciones de alta presión.",
    fullDesc:
      "Durante la sesión, el alumno aprende a no tensionarse reactivamente ante el estímulo, sino a relajar la musculatura mediante la exhalación consciente. Esta habilidad se automatiza en el cerebro, permitiéndote afrontar el estrés laboral y emocional con serenidad y claridad mental.",
    scienceNote: "Mejora la variabilidad de la frecuencia cardíaca (VFC) y la autorregulación emocional.",
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
            Metodología Rusa Original
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-condensed uppercase tracking-tight text-foreground">
            ¿Por qué entrenar regularmente en el dispositivo <span className="text-accent-text">PRAVILO</span>?
          </h2>

          <p className="text-sm sm:text-base text-muted leading-relaxed font-sans">
            La práctica periódica no solo alivia molestias musculares: genera una transformación biomecánica, hormonal y neurológica en todo tu organismo.
          </p>

          <div className="pt-2 inline-flex items-center gap-2 text-xs font-condensed font-bold uppercase tracking-wider text-accent-text bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full animate-bounce">
            <span>👇</span>
            <span>¡Hacé clic en cada tarjeta para conocer el impacto en tu cuerpo!</span>
          </div>
        </RevealOnScroll>

        {/* 8 Cards Grid (Moscow style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {BENEFICIOS_MOSCOW.map((b, i) => {
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
                    <span>Saber más</span>
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
              Sentí el alivio en tu propia estructura
            </h4>
            <p className="text-xs sm:text-sm text-muted font-sans">
              Evaluación personalizada y sesión de 60 min en el estudio de Plottier, Neuquén.
            </p>
          </div>

          <BookingWizard
            buttonText="Reservar Sesión de Evaluación"
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
                  🔬 Fundamento Biomecánico & Científico:
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
