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
    <div className="p-6 rounded-2xl bg-surface border border-border space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black font-condensed uppercase tracking-tight text-foreground flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Bloqueo de Feriados y Días No Laborables
          </h3>
          <p className="text-xs text-muted font-sans">
            Los días bloqueados no mostrarán horarios disponibles en la landing ni permitirán reservas.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-condensed font-bold uppercase bg-rose-500/15 text-rose-300 border border-rose-500/30">
          {blockedList.length} bloqueados
        </span>
      </div>

      {/* Add Block Form */}
      <form onSubmit={handleAddBlockedDate} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-condensed uppercase tracking-wider text-muted mb-1 font-bold">Fecha a Bloquear *</label>
            <input
              type="date"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-raised border border-border text-xs text-foreground font-mono focus:border-accent focus:outline-none"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-[11px] font-condensed uppercase tracking-wider text-muted mb-1 font-bold">Motivo del Cierre</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej. Feriado de Carnaval, Capacitación..."
              className="w-full px-3 py-2 rounded-xl bg-surface-raised border border-border text-xs text-foreground placeholder-muted/50 focus:border-accent focus:outline-none font-sans"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              className="btn-shiny w-full py-2.5 rounded-xl bg-accent text-accent-foreground font-condensed font-bold uppercase tracking-wider text-xs shadow-lg shadow-accent/25 hover:opacity-95 transition-all"
            >
              + Bloquear Día
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-condensed uppercase tracking-wider text-muted">Presets de Motivo:</span>
          {HOLIDAY_PRESETS.map((p) => (
            <button
              type="button"
              key={p.label}
              onClick={() => setReason(p.reason)}
              className="px-2.5 py-0.5 rounded-lg bg-surface-raised hover:bg-surface border border-border text-[10px] font-condensed uppercase text-muted hover:text-foreground transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </form>

      {/* Blocked List Table / Tags */}
      <div className="space-y-2 pt-2 border-t border-border">
        <h4 className="text-xs font-condensed font-bold uppercase tracking-wider text-muted">
          Días Bloqueados Registrados ({blockedList.length})
        </h4>

        {blockedList.length === 0 ? (
          <p className="text-xs text-muted italic">
            No hay feriados ni días bloqueados actualmente.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {blockedList.map((dateStr) => {
              const r = reasonsMap[dateStr] || "Feriado";
              return (
                <div
                  key={dateStr}
                  className="p-3 rounded-xl bg-surface-raised border border-border flex items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-foreground block">{dateStr}</span>
                    <span className="text-[11px] text-muted truncate max-w-[180px] block font-sans">
                      {r}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlockedDate(dateStr)}
                    className="text-muted hover:text-rose-400 p-1 transition-colors"
                    title="Desbloquear este día"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
