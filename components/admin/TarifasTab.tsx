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
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono text-center">
          {saveStatus}
        </div>
      )}

      <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>🏷️</span> Tarifas y Planes en Tiempo Real
          </h3>
          <p className="text-xs text-white/50 mt-1">
            Los precios configurados aquí se actualizan inmediatamente en la landing page, el wizard de reservas, y los cálculos de señas y comprobantes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Plan Individual */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase">1 Sesión Individual</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-white/[0.06] text-white/60">60 min</span>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/60 mb-1">Precio Visible *</label>
                <input
                  type="text"
                  required
                  value={localPrices.individual}
                  onChange={(e) => setLocalPrices({ ...localPrices, individual: e.target.value })}
                  placeholder="$35.000"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-amber-400 font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/60 mb-1">Subtítulo / Aclaración</label>
                <input
                  type="text"
                  value={localPrices.individualDesc || ""}
                  onChange={(e) => setLocalPrices({ ...localPrices, individualDesc: e.target.value })}
                  placeholder="Precio de lanzamiento · 60 min."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white/80 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-white/[0.04] text-[11px] text-white/40 font-mono">
                Valor unitario: ${indNum.toLocaleString("es-AR")}
              </div>
            </div>

            {/* Pack 8 */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/[0.05] to-white/[0.02] border border-amber-500/30 space-y-4 relative shadow-lg shadow-amber-500/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-300 uppercase">Pack 8 Sesiones</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-bold">
                  {p8Discount > 0 ? `-${p8Discount}% OFF` : "Recomendado"}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/60 mb-1">Precio Visible *</label>
                <input
                  type="text"
                  required
                  value={localPrices.pack8}
                  onChange={(e) => setLocalPrices({ ...localPrices, pack8: e.target.value })}
                  placeholder="$240.000"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-amber-400 font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/60 mb-1">Subtítulo / Aclaración</label>
                <input
                  type="text"
                  value={localPrices.pack8Desc || ""}
                  onChange={(e) => setLocalPrices({ ...localPrices, pack8Desc: e.target.value })}
                  placeholder="$30.000 por sesión · Vigencia: 2 meses."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white/80 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-white/[0.04] text-[11px] text-amber-200/70 font-mono">
                Equivale a ${p8PerSession.toLocaleString("es-AR")} por sesión
              </div>
            </div>

            {/* Pack 12 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase">Pack 12 Sesiones</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                  {p12Discount > 0 ? `-${p12Discount}% OFF` : "Máximo Ahorro"}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/60 mb-1">Precio Visible *</label>
                <input
                  type="text"
                  required
                  value={localPrices.pack12}
                  onChange={(e) => setLocalPrices({ ...localPrices, pack12: e.target.value })}
                  placeholder="$300.000"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-amber-400 font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/60 mb-1">Subtítulo / Aclaración</label>
                <input
                  type="text"
                  value={localPrices.pack12Desc || ""}
                  onChange={(e) => setLocalPrices({ ...localPrices, pack12Desc: e.target.value })}
                  placeholder="$25.000 por sesión · Vigencia: 3 meses."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white/80 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-white/[0.04] text-[11px] text-emerald-300/70 font-mono">
                Equivale a ${p12PerSession.toLocaleString("es-AR")} por sesión
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              Guardar y Publicar Tarifas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
