"use client";

import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import BenefitIcon from "./BenefitIcon";

export default function BiomechanicalComparison() {
  const [activeTab, setActiveTab] = useState<"traccion" | "compresion">(
    "traccion",
  );

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-12">
      <RevealOnScroll className="rounded-3xl border border-border-highlight bg-gradient-to-b from-surface-raised via-surface to-background p-7 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">Biomecánica Comparativa</span>
            <h3 className="mt-3 font-condensed text-2xl font-black tracking-tight text-foreground sm:text-4xl">
              ¿Qué ocurre en tu estructura corporal?
            </h3>
            <p className="mt-2 max-w-xl text-xs sm:text-sm text-muted leading-relaxed">
              Descubrí la diferencia mecánica entre la compresión gravitacional
              diaria y la descompresión axial en el aparato PRAVILO.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex rounded-full border border-border bg-background p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("traccion")}
              className={`rounded-full px-5 py-2 font-condensed text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === "traccion"
                  ? "bg-accent text-accent-foreground shadow-md shadow-accent/30"
                  : "text-muted hover:text-foreground"
              }`}
            >
              En Tracción PRAVILO
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("compresion")}
              className={`rounded-full px-5 py-2 font-condensed text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === "compresion"
                  ? "bg-zinc-800 text-zinc-100 shadow-md"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Compresión Diaria
            </button>
          </div>
        </div>

        {/* Dynamic Card Display */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Card 1: Columna y Discos */}
          <div
            className={`rounded-2xl border p-6 transition-all duration-300 ${
              activeTab === "traccion"
                ? "border-accent/40 bg-accent/5 shadow-[0_4px_25px_-10px_rgba(160,26,26,0.3)]"
                : "border-border bg-surface-raised/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border shadow-sm">
                <BenefitIcon
                  name={activeTab === "traccion" ? "recuperacion" : "warning"}
                />
              </span>
              <div>
                <h4 className="font-condensed text-lg font-bold text-foreground">
                  {activeTab === "traccion"
                    ? "Columna & Discos Intervertebrales"
                    : "Presión Axial & Discos Comprimidos"}
                </h4>
                <span className="text-[11px] font-semibold text-muted">
                  {activeTab === "traccion"
                    ? "Efecto de Descompresión"
                    : "Efecto de la Gravedad Constante"}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-muted">
              {activeTab === "traccion"
                ? "Al suspender el cuerpo en 4 puntos, la fuerza de tracción abre el espacio entre vértebras, reduciendo la presión sobre los nervios y permitiendo la rehidratación de los discos lumbares y cervicales."
                : "Estar sentados o parados durante horas genera una carga gravitacional continua. Los discos intervertebrales pierden altura e hidratación, comprimiendo las raíces nerviosas y generando dolor lumbar o ciático."}
            </p>

            <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3 text-xs font-condensed font-bold">
              <span
                className={
                  activeTab === "traccion"
                    ? "text-emerald-400"
                    : "text-amber-400"
                }
              >
                {activeTab === "traccion"
                  ? "✓ Ganancia de espacio y oxigenación"
                  : "✗ Sobrecarga y desgaste articular"}
              </span>
            </div>
          </div>

          {/* Card 2: Tejido Fascial y Postura */}
          <div
            className={`rounded-2xl border p-6 transition-all duration-300 ${
              activeTab === "traccion"
                ? "border-accent/40 bg-accent/5 shadow-[0_4px_25px_-10px_rgba(160,26,26,0.3)]"
                : "border-border bg-surface-raised/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border shadow-sm">
                <BenefitIcon
                  name={activeTab === "traccion" ? "movilidad" : "tension"}
                />
              </span>
              <div>
                <h4 className="font-condensed text-lg font-bold text-foreground">
                  {activeTab === "traccion"
                    ? "Red Miofascial & Simetría Corporal"
                    : "Acortamiento & Contracturas Crónicas"}
                </h4>
                <span className="text-[11px] font-semibold text-muted">
                  {activeTab === "traccion"
                    ? "Alineación en 3 Dimensiones"
                    : "Restricción de Movimiento"}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-muted">
              {activeTab === "traccion"
                ? "La fascia se elonga tridimensionalmente de manera uniforme desde los extremos hacia el centro, reseteando la memoria postural, equilibrando asimetrías y devolviendo la movilidad fluida al cuerpo."
                : "Las posturas repetitivas rigidizan la fascia profunda. El cuerpo compensa curvando los hombros hacia adelante, acortando los flexores de cadera y limitando el rango articular natural."}
            </p>

            <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3 text-xs font-condensed font-bold">
              <span
                className={
                  activeTab === "traccion"
                    ? "text-emerald-400"
                    : "text-amber-400"
                }
              >
                {activeTab === "traccion"
                  ? "✓ Reeducación postural duradera"
                  : "✗ Patrones compensatorios rígidos"}
              </span>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
