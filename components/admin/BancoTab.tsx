"use client";

import React, { useState } from "react";
import { BankConfig } from "@/lib/bookings";
import { CardIcon } from "./Icons";

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
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-condensed font-bold uppercase tracking-wider text-center">
          {saveStatus}
        </div>
      )}

      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border space-y-6">
        <div>
          <h3 className="text-lg font-black font-condensed uppercase tracking-tight text-foreground flex items-center gap-2">
            <CardIcon className="w-5 h-5 text-accent-text" /> Datos Bancarios &
            Cobranzas
          </h3>
          <p className="text-xs text-muted mt-1 font-sans">
            Estos datos se utilizan automáticamente al generar comprobantes de
            pago, solicitudes de seña y links de cobro por WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-condensed uppercase tracking-wider text-muted mb-1.5 font-bold">
              Alias de Cobro (CBU / CVU) *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={localBank.alias}
                onChange={(e) =>
                  setLocalBank({ ...localBank, alias: e.target.value })
                }
                placeholder="Ej. PRAVILO.ARG"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-sm text-foreground font-mono uppercase focus:border-accent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleCopy(localBank.alias, "alias")}
                className="px-4 py-2.5 rounded-xl bg-surface-raised hover:bg-surface border border-border text-xs font-condensed font-bold uppercase text-foreground shrink-0 transition-colors"
              >
                {copied === "alias" ? "✓ Copiado" : "Copiar"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-condensed uppercase tracking-wider text-muted mb-1.5 font-bold">
              CBU / CVU (22 dígitos)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={localBank.cbu}
                onChange={(e) =>
                  setLocalBank({ ...localBank, cbu: e.target.value })
                }
                placeholder="0000003100010000000000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-sm text-foreground font-mono focus:border-accent focus:outline-none"
              />
              {localBank.cbu && (
                <button
                  type="button"
                  onClick={() => handleCopy(localBank.cbu, "cbu")}
                  className="px-4 py-2.5 rounded-xl bg-surface-raised hover:bg-surface border border-border text-xs font-condensed font-bold uppercase text-foreground shrink-0 transition-colors"
                >
                  {copied === "cbu" ? "✓ Copiado" : "Copiar"}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-condensed uppercase tracking-wider text-muted mb-1.5 font-bold">
                Titular de la Cuenta
              </label>
              <input
                type="text"
                value={localBank.titular || localBank.accountHolder || ""}
                onChange={(e) =>
                  setLocalBank({
                    ...localBank,
                    titular: e.target.value,
                    accountHolder: e.target.value,
                  })
                }
                placeholder="Juan I. Garrafa"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-sm text-foreground focus:border-accent focus:outline-none font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-condensed uppercase tracking-wider text-muted mb-1.5 font-bold">
                Entidad Bancaria / Billetera
              </label>
              <input
                type="text"
                value={localBank.banco || localBank.bankName || ""}
                onChange={(e) =>
                  setLocalBank({
                    ...localBank,
                    banco: e.target.value,
                    bankName: e.target.value,
                  })
                }
                placeholder="Mercado Pago / Banco Galicia"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-sm text-foreground focus:border-accent focus:outline-none font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-condensed uppercase tracking-wider text-muted mb-1.5 font-bold">
              CUIT / CUIL
            </label>
            <input
              type="text"
              value={localBank.cuit || ""}
              onChange={(e) =>
                setLocalBank({ ...localBank, cuit: e.target.value })
              }
              placeholder="20-xxxxxxxx-x"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-sm text-foreground font-mono focus:border-accent focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              type="submit"
              className="btn-shiny px-6 py-3 rounded-xl bg-accent text-accent-foreground font-condensed font-bold uppercase tracking-wider text-sm shadow-lg shadow-accent/25 hover:opacity-95 active:scale-95 transition-all"
            >
              Guardar Datos de Cobranza
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
