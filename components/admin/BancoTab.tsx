"use client";

import React, { useState } from "react";
import { BankConfig } from "@/lib/bookings";

interface BancoTabProps {
  bankConfig: BankConfig;
  onSaveBankConfig: (newConfig: BankConfig) => void;
  saveStatus: string | null;
}

export function BancoTab({
  bankConfig,
  onSaveBankConfig,
  saveStatus,
}: BancoTabProps) {
  const [localBank, setLocalBank] = useState<BankConfig>(bankConfig);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBankConfig(localBank);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {saveStatus && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono text-center">
          {saveStatus}
        </div>
      )}

      <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>💳</span> Datos Bancarios & Cobranzas
          </h3>
          <p className="text-xs text-white/50 mt-1">
            Estos datos se utilizan automáticamente al generar comprobantes de pago, solicitudes de seña y links de cobro por WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1.5">
              Alias de Cobro (CBU / CVU) *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={localBank.alias}
                onChange={(e) => setLocalBank({ ...localBank, alias: e.target.value })}
                placeholder="Ej. PRAVILO.ARG"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono uppercase focus:border-amber-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleCopy(localBank.alias, "alias")}
                className="px-3.5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono text-white/80 shrink-0 transition-colors"
              >
                {copied === "alias" ? "✓ Copiado" : "Copiar"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1.5">
              CBU / CVU (22 dígitos)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={localBank.cbu}
                onChange={(e) => setLocalBank({ ...localBank, cbu: e.target.value })}
                placeholder="0000003100010000000000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
              />
              {localBank.cbu && (
                <button
                  type="button"
                  onClick={() => handleCopy(localBank.cbu, "cbu")}
                  className="px-3.5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono text-white/80 shrink-0 transition-colors"
                >
                  {copied === "cbu" ? "✓ Copiado" : "Copiar"}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1.5">
                Titular de la Cuenta
              </label>
              <input
                type="text"
                value={localBank.titular}
                onChange={(e) => setLocalBank({ ...localBank, titular: e.target.value })}
                placeholder="Nombre del Titular"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1.5">
                Banco / Entidad
              </label>
              <input
                type="text"
                value={localBank.banco}
                onChange={(e) => setLocalBank({ ...localBank, banco: e.target.value })}
                placeholder="Ej. Mercado Pago / Banco Galicia"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              Guardar Datos Bancarios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
