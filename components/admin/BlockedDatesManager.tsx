"use client";

import React, { useState } from "react";
import { ScheduleConfig } from "@/lib/availability";

interface BlockedDatesManagerProps {
  config: ScheduleConfig;
  onUpdateConfig: (newConfig: ScheduleConfig) => void;
}

const HOLIDAY_PRESETS = [
  { label: "Feriado Nacional", reason: "Feriado Nacional" },
  { label: "Vacaciones / Descanso", reason: "Vacaciones de Estudio" },
  { label: "Mantenimiento / Capacitación", reason: "Mantenimiento y Calibración" },
  { label: "Cierre Excepcional", reason: "Cierre Excepcional" },
];

export function BlockedDatesManager({
  config,
  onUpdateConfig,
}: BlockedDatesManagerProps) {
  const [newDate, setNewDate] = useState("");
  const [reason, setReason] = useState("Feriado Nacional");

  const blockedList = config.blockedDates || [];
  const reasonsMap = config.blockedDateReasons || {};

  const handleAddBlockedDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;

    if (blockedList.includes(newDate)) {
      alert("Esta fecha ya se encuentra bloqueada.");
      return;
    }

    const updatedBlocked = [...blockedList, newDate].sort();
    const updatedReasons = {
      ...reasonsMap,
      [newDate]: reason || "Feriado / Cerrado",
    };

    onUpdateConfig({
      ...config,
      blockedDates: updatedBlocked,
      blockedDateReasons: updatedReasons,
    });

    setNewDate("");
  };

  const handleRemoveBlockedDate = (dateToRemove: string) => {
    const updatedBlocked = blockedList.filter((d) => d !== dateToRemove);
    const updatedReasons = { ...reasonsMap };
    delete updatedReasons[dateToRemove];

    onUpdateConfig({
      ...config,
      blockedDates: updatedBlocked,
      blockedDateReasons: updatedReasons,
    });
  };

  return (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Bloqueo de Feriados y Días No Laborables
          </h3>
          <p className="text-xs text-white/50">
            Los días bloqueados no mostrarán horarios disponibles en la landing ni permitirán reservas.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-rose-500/10 text-rose-300 border border-rose-500/20">
          {blockedList.length} días bloqueados
        </span>
      </div>

      {/* Form to add blocked date */}
      <form
        onSubmit={handleAddBlockedDate}
        className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
      >
        <div className="sm:col-span-4">
          <label className="block text-[11px] font-mono text-white/60 mb-1">Fecha a Bloquear *</label>
          <input
            type="date"
            required
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white font-mono focus:border-rose-500 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-5">
          <label className="block text-[11px] font-mono text-white/60 mb-1">Motivo / Descripción</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej. Feriado Carnaval, Capacitación..."
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-white/30 focus:border-rose-500 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-3">
          <button
            type="submit"
            className="w-full py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow"
          >
            + Bloquear Día
          </button>
        </div>
      </form>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-mono text-white/40">Motivos rápidos:</span>
        {HOLIDAY_PRESETS.map((p) => (
          <button
            type="button"
            key={p.label}
            onClick={() => setReason(p.reason)}
            className="px-2 py-0.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[11px] text-white/60 hover:text-white transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* List of blocked dates */}
      {blockedList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2 border-t border-white/[0.04]">
          {blockedList.map((d) => (
            <div
              key={d}
              className="p-3 rounded-xl bg-rose-500/[0.05] border border-rose-500/20 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <span className="font-mono text-xs font-bold text-white block">{d}</span>
                <span className="text-[11px] text-rose-300/80 truncate block">
                  {reasonsMap[d] || "Cerrado / Feriado"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveBlockedDate(d)}
                className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/20 text-xs transition-colors shrink-0"
                title="Desbloquear fecha"
              >
                ✕ Desbloquear
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-white/40 italic text-center py-2">
          No hay fechas bloqueadas actualmente. La disponibilidad sigue la grilla semanal habitual.
        </p>
      )}
    </div>
  );
}
