"use client";

import React, { useState } from "react";
import { ScheduleConfig } from "@/lib/availability";
import { BlockedDatesManager } from "./BlockedDatesManager";

interface HorariosTabProps {
  config: ScheduleConfig;
  onSaveConfig: (newConfig: ScheduleConfig) => void;
  saveStatus: string | null;
}

const PRESET_TIMES = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00",
  "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
];

const SCHEDULE_PRESETS = [
  {
    name: "Estándar Completo (Mañana y Tarde)",
    slots: ["09:00", "10:30", "12:00", "16:00", "17:30", "19:00", "20:30"],
  },
  {
    name: "Solo Tardes",
    slots: ["15:00", "16:30", "18:00", "19:30", "20:30"],
  },
  {
    name: "Solo Mañanas",
    slots: ["08:30", "10:00", "11:30", "13:00"],
  },
  {
    name: "Intensivo (Cada 1 hora)",
    slots: ["09:00", "10:00", "11:00", "12:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
  },
];

export function HorariosTab({
  config,
  onSaveConfig,
  saveStatus,
}: HorariosTabProps) {
  const [localConfig, setLocalConfig] = useState<ScheduleConfig>(config);
  const [newSlotTime, setNewSlotTime] = useState<{ [dayIndex: number]: string }>({});

  const handleToggleDay = (dayIndex: number) => {
    const updatedDays = localConfig.days.map((d) =>
      d.dayIndex === dayIndex ? { ...d, enabled: !d.enabled } : d,
    );
    const newConf = { ...localConfig, days: updatedDays };
    setLocalConfig(newConf);
    onSaveConfig(newConf);
  };

  const handleAddSlot = (dayIndex: number) => {
    const slotToAdd = newSlotTime[dayIndex] || "09:00";
    const updatedDays = localConfig.days.map((d) => {
      if (d.dayIndex !== dayIndex) return d;
      if (d.slots.includes(slotToAdd)) return d;
      const sortedSlots = [...d.slots, slotToAdd].sort();
      return { ...d, slots: sortedSlots };
    });

    const newConf = { ...localConfig, days: updatedDays };
    setLocalConfig(newConf);
    onSaveConfig(newConf);
  };

  const handleRemoveSlot = (dayIndex: number, slotToRemove: string) => {
    const updatedDays = localConfig.days.map((d) => {
      if (d.dayIndex !== dayIndex) return d;
      return { ...d, slots: d.slots.filter((s) => s !== slotToRemove) };
    });

    const newConf = { ...localConfig, days: updatedDays };
    setLocalConfig(newConf);
    onSaveConfig(newConf);
  };

  const handleApplyPresetToAllWeekdays = (slots: string[]) => {
    const updatedDays = localConfig.days.map((d) => {
      // 1 to 5 (Lunes a Viernes)
      if (d.dayIndex >= 1 && d.dayIndex <= 5) {
        return { ...d, enabled: true, slots: [...slots] };
      }
      return d;
    });
    const newConf = { ...localConfig, days: updatedDays };
    setLocalConfig(newConf);
    onSaveConfig(newConf);
  };

  return (
    <div className="space-y-8">
      {/* Save Status Banner */}
      {saveStatus && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-condensed font-bold uppercase tracking-wider text-center">
          {saveStatus}
        </div>
      )}

      {/* Global Presets */}
      <div className="p-5 rounded-2xl bg-surface border border-border space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black font-condensed uppercase tracking-tight text-foreground">
              Plantillas Rápidas para Lunes a Viernes
            </h3>
            <p className="text-xs text-muted font-sans">Aplicá una configuración estándar a todos los días de semana con 1 clic</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {SCHEDULE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleApplyPresetToAllWeekdays(preset.slots)}
              className="px-3.5 py-1.5 rounded-xl bg-surface-raised hover:bg-surface border border-border hover:border-accent text-xs font-condensed font-bold uppercase tracking-wide text-foreground transition-all"
            >
              ⚡ {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Day by Day Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-black font-condensed uppercase tracking-tight text-foreground">
          Configuración Semanal de Disponibilidad
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localConfig.days.map((day) => {
            const currentSelectedSlot = newSlotTime[day.dayIndex] || "16:00";

            return (
              <div
                key={day.dayIndex}
                className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  day.enabled
                    ? "bg-surface border-border"
                    : "bg-surface/50 border-border/50 opacity-60"
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        day.enabled ? "bg-emerald-400" : "bg-surface-raised"
                      }`}
                    />
                    <h4 className="text-base font-black font-condensed uppercase text-foreground">{day.dayName}</h4>
                    <span className="text-xs text-muted font-condensed">
                      ({day.slots.length} turnos)
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleDay(day.dayIndex)}
                    className={`px-3 py-1 rounded-lg text-xs font-condensed font-bold uppercase tracking-wider transition-all ${
                      day.enabled
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-surface-raised text-muted border border-border"
                    }`}
                  >
                    {day.enabled ? "Abierto" : "Cerrado"}
                  </button>
                </div>

                {/* Slots List */}
                {day.enabled && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div className="flex flex-wrap gap-1.5">
                      {day.slots.map((slot) => (
                        <span
                          key={slot}
                          className="px-2.5 py-1 rounded-lg bg-accent/15 border border-accent/30 text-accent-text text-xs font-condensed font-bold flex items-center gap-1.5 group"
                        >
                          {slot} hs
                          <button
                            onClick={() => handleRemoveSlot(day.dayIndex, slot)}
                            className="text-accent-text/60 hover:text-rose-400 text-xs font-sans"
                            title="Eliminar horario"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {day.slots.length === 0 && (
                        <span className="text-xs text-muted italic font-sans">Sin horarios agregados</span>
                      )}
                    </div>

                    {/* Add Slot Control */}
                    <div className="flex items-center gap-2 pt-1">
                      <select
                        value={currentSelectedSlot}
                        onChange={(e) =>
                          setNewSlotTime((prev) => ({
                            ...prev,
                            [day.dayIndex]: e.target.value,
                          }))
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-surface-raised border border-border text-xs text-foreground font-mono focus:outline-none"
                      >
                        {PRESET_TIMES.map((t) => (
                          <option key={t} value={t}>
                            {t} hs
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAddSlot(day.dayIndex)}
                        className="px-3.5 py-1.5 rounded-lg bg-surface-raised hover:bg-surface border border-border text-xs font-condensed font-bold uppercase text-foreground transition-colors"
                      >
                        + Agregar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Blocked Dates Section */}
      <BlockedDatesManager config={localConfig} onUpdateConfig={onSaveConfig} />
    </div>
  );
}
