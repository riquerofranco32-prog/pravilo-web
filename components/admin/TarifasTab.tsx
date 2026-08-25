"use client";

import React, { useState } from "react";

export interface PlanPricingConfig {
  individual: string;
  pack8: string;
  pack12: string;
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
    pack8: planPrices.pack8 || "$240.000",
    pack12: planPrices.pack12 || "$300.000",
    individualDesc: planPrices.individualDesc || "Precio de lanzamiento · 60 min.",
    pack8Desc: planPrices.pack8Desc || "$30.000 por sesión · Vigencia: 2 meses.",
    pack12Desc: planPrices.pack12Desc || "$25.000 por sesión · Vigencia: 3 meses.",
  });

  const parseNum = (str: string) => {
    const digits = str.replace(/\D/g, "");
    return digits ? parseInt(digits, 10) : 0;
  };

  const indNum = parseNum(localPrices.individual);
  const p8Num = parseNum(localPrices.pack8);
  const p12Num = parseNum(localPrices.pack12);

  const p8PerSession = p8Num > 0 ? Math.round(p8Num / 8) : 0;
  const p12PerSession = p12Num > 0 ? Math.round(p12Num / 12) : 0;

  const p8Discount = indNum > 0 && p8PerSession > 0 ? Math.round(((indNum - p8PerSession) / indNum) * 100) : 0;
  const p12Discount = indNum > 0 && p12PerSession > 0 ? Math.round(((indNum - p12PerSession) / indNum) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePrices(localPrices);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {saveStatus && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-condensed font-bold uppercase tracking-wider text-center">
          {saveStatus}
        </div>
      )}

      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border space-y-6">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-foreground font-condensed uppercase flex items-center gap-2">
            <span>🏷️</span> Tarifas y Planes en Tiempo Real
          </h3>
          <p className="text-xs text-muted mt-1 font-sans">
            Los precios configurados aquí se actualizan inmediatamente en la landing page, el wizard de reservas, y los cálculos de señas y comprobantes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Plan Individual */}
            <div className="p-5 rounded-2xl bg-surface-raised border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-condensed font-black text-foreground uppercase tracking-wider">1 Sesión Individual</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-condensed font-bold uppercase bg-surface text-muted border border-border">60 min</span>
              </div>

              <div>
                <label className="block text-[11px] font-condensed uppercase tracking-wider text-muted mb-1">Precio Visible *</label>
                <input
                  type="text"
                  required
                  value={localPrices.individual}
                  onChange={(e) => setLocalPrices({ ...localPrices, individual: e.target.value })}
                  placeholder="$35.000"
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-base text-accent-text font-condensed font-black focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-condensed uppercase tracking-wider text-muted mb-1">Subtítulo / Aclaración</label>
                <input
                  type="text"
                  value={localPrices.individualDesc || ""}
                  onChange={(e) => setLocalPrices({ ...localPrices, individualDesc: e.target.value })}
                  placeholder="Precio de lanzamiento · 60 min."
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-foreground placeholder-muted/50 focus:border-accent focus:outline-none font-sans"
                />
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border text-xs space-y-1">
                <span className="text-[10px] font-condensed uppercase tracking-wider text-muted block">Valor Unitario:</span>
                <span className="font-condensed font-black text-accent-text text-sm">${indNum.toLocaleString("es-AR")}</span>
                <span className="text-[10px] text-muted block">Precio de referencia por sesión</span>
              </div>
            </div>

            {/* Pack 8 Sesiones */}
            <div className="p-5 rounded-2xl bg-surface-raised border border-accent/40 space-y-4 relative">
              <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[10px] font-condensed font-black uppercase tracking-wider bg-accent text-accent-foreground">
                Plan Destacado
              </span>

              <div className="flex items-center justify-between">
                <span className="text-xs font-condensed font-black text-foreground uppercase tracking-wider">Pack 8 Sesiones</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-condensed font-bold uppercase bg-surface text-muted border border-border">2 Meses</span>
              </div>

              <div>
                <label className="block text-[11px] font-condensed uppercase tracking-wider text-muted mb-1">Precio Total Visible *</label>
                <input
                  type="text"
                  required
                  value={localPrices.pack8}
                  onChange={(e) => setLocalPrices({ ...localPrices, pack8: e.target.value })}
                  placeholder="$240.000"
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-base text-accent-text font-condensed font-black focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-condensed uppercase tracking-wider text-muted mb-1">Subtítulo / Aclaración</label>
                <input
                  type="text"
                  value={localPrices.pack8Desc || ""}
                  onChange={(e) => setLocalPrices({ ...localPrices, pack8Desc: e.target.value })}
                  placeholder="$30.000 por sesión · Vigencia: 2 meses."
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-foreground placeholder-muted/50 focus:border-accent focus:outline-none font-sans"
                />
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border text-xs space-y-1">
                <span className="text-[10px] font-condensed uppercase tracking-wider text-muted block">Por Sesión & Ahorro:</span>
                <div className="flex items-center justify-between">
                  <span className="font-condensed font-black text-accent-text text-sm">${p8PerSession.toLocaleString("es-AR")}</span>
                  {p8Discount > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-condensed font-bold bg-emerald-500/20 text-emerald-300">
                      -{p8Discount}% OFF
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-muted block">Ahorro: ${(indNum * 8 - p8Num).toLocaleString("es-AR")}</span>
              </div>
            </div>

            {/* Pack 12 Sesiones */}
            <div className="p-5 rounded-2xl bg-surface-raised border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-condensed font-black text-foreground uppercase tracking-wider">Pack 12 Sesiones</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-condensed font-bold uppercase bg-surface text-muted border border-border">3 Meses</span>
              </div>

              <div>
                <label className="block text-[11px] font-condensed uppercase tracking-wider text-muted mb-1">Precio Total Visible *</label>
                <input
                  type="text"
                  required
                  value={localPrices.pack12}
                  onChange={(e) => setLocalPrices({ ...localPrices, pack12: e.target.value })}
                  placeholder="$300.000"
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-base text-accent-text font-condensed font-black focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-condensed uppercase tracking-wider text-muted mb-1">Subtítulo / Aclaración</label>
                <input
                  type="text"
                  value={localPrices.pack12Desc || ""}
                  onChange={(e) => setLocalPrices({ ...localPrices, pack12Desc: e.target.value })}
                  placeholder="$25.000 por sesión · Vigencia: 3 meses."
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-foreground placeholder-muted/50 focus:border-accent focus:outline-none font-sans"
                />
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border text-xs space-y-1">
                <span className="text-[10px] font-condensed uppercase tracking-wider text-muted block">Por Sesión & Ahorro:</span>
                <div className="flex items-center justify-between">
                  <span className="font-condensed font-black text-accent-text text-sm">${p12PerSession.toLocaleString("es-AR")}</span>
                  {p12Discount > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-condensed font-bold bg-emerald-500/20 text-emerald-300">
                      -{p12Discount}% OFF
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-muted block">Ahorro: ${(indNum * 12 - p12Num).toLocaleString("es-AR")}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="submit"
              className="btn-shiny px-6 py-3 rounded-xl bg-accent text-accent-foreground font-condensed font-bold uppercase tracking-wider text-sm shadow-lg shadow-accent/25 hover:opacity-95 active:scale-95 transition-all"
            >
              Guardar y Publicar Tarifas en Vivo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
