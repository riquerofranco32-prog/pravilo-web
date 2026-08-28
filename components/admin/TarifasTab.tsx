"use client";

import React, { useState } from "react";
import { TagIcon } from "./Icons";

export interface PlanPricingConfig {
  individual: string;
  pack8?: string;
  pack12?: string;
  individualDesc?: string;
  pack8Desc?: string;
  pack12Desc?: string;
  [key: string]: string | undefined;
}

interface TarifasTabProps {
  planPrices: PlanPricingConfig;
  onSavePrices: (newPrices: PlanPricingConfig) => void;
  saveStatus: string | null;
}

export function TarifasTab({
  planPrices,
  onSavePrices,
  saveStatus,
}: TarifasTabProps) {
  const [localPrices, setLocalPrices] = useState<PlanPricingConfig>({
    individual: planPrices.individual || "$35.000",
    individualDesc:
      planPrices.individualDesc ||
      "Sesión 1 a 1 guiada · Duración completa: 60 min.",
    pack8: planPrices.pack8 || "$240.000",
    pack12: planPrices.pack12 || "$300.000",
    pack8Desc:
      planPrices.pack8Desc || "$30.000 por sesión · Vigencia: 2 meses.",
    pack12Desc:
      planPrices.pack12Desc || "$25.000 por sesión · Vigencia: 3 meses.",
  });

  const parseNum = (str: string) => {
    const digits = str.replace(/\D/g, "");
    return digits ? parseInt(digits, 10) : 0;
  };

  const indNum = parseNum(localPrices.individual);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePrices(localPrices);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {saveStatus && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-condensed font-bold uppercase tracking-wider text-center">
          {saveStatus}
        </div>
      )}

      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border space-y-6">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-foreground font-condensed uppercase flex items-center gap-2">
            <TagIcon className="w-5 h-5 text-accent-text" /> Tarifa Oficial de
            la Sesión
          </h3>
          <p className="text-xs text-muted mt-1 font-sans">
            El precio configurado aquí se actualiza en tiempo real en la landing
            page, el asistente de reservas y los cálculos de comprobantes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Individual Activo */}
          <div className="p-6 rounded-2xl bg-surface-raised border border-accent/50 space-y-5 shadow-lg shadow-accent/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-condensed font-black text-foreground uppercase tracking-wider">
                  1 Sesión Individual (Plan Activo)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-condensed font-black uppercase bg-accent text-accent-foreground">
                  Público en Web
                </span>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-condensed font-bold uppercase bg-surface text-muted border border-border">
                60 min
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-condensed font-bold uppercase tracking-wider text-muted mb-1.5">
                  Precio Visible en la Web *
                </label>
                <input
                  type="text"
                  required
                  value={localPrices.individual}
                  onChange={(e) =>
                    setLocalPrices({
                      ...localPrices,
                      individual: e.target.value,
                    })
                  }
                  placeholder="$35.000"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-xl text-accent-text font-condensed font-black focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-condensed font-bold uppercase tracking-wider text-muted mb-1.5">
                  Subtítulo / Aclaración
                </label>
                <input
                  type="text"
                  value={localPrices.individualDesc || ""}
                  onChange={(e) =>
                    setLocalPrices({
                      ...localPrices,
                      individualDesc: e.target.value,
                    })
                  }
                  placeholder="Sesión 1 a 1 guiada · 60 min."
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-xs text-foreground placeholder-muted/50 focus:border-accent focus:outline-none font-sans"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border text-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-condensed uppercase tracking-wider text-muted block">
                  Valor oficial por sesión:
                </span>
                <span className="text-muted text-[11px]">
                  Utilizado para reservas online y enlaces de pago
                </span>
              </div>
              <span className="font-condensed font-black text-accent-text text-xl">
                ${indNum.toLocaleString("es-AR")}
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="submit"
              className="btn-shiny px-6 py-3 rounded-xl bg-accent text-accent-foreground font-condensed font-bold uppercase tracking-wider text-sm shadow-lg shadow-accent/25 hover:opacity-95 active:scale-95 transition-all"
            >
              Guardar y Publicar Tarifa en Vivo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
