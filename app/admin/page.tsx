"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_SCHEDULE_CONFIG,
  LOCAL_STORAGE_SCHEDULE_KEY,
  ScheduleConfig,
} from "@/lib/availability";

const PRESET_TIMES = [
  "08:00",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "14:00",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState("");
  const [config, setConfig] = useState<ScheduleConfig>(DEFAULT_SCHEDULE_CONFIG);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [newSlotTime, setNewSlotTime] = useState<{ [dayIndex: number]: string }>(
    {},
  );
  const [newBlockedDate, setNewBlockedDate] = useState("");

  // Load config on mount
  useEffect(() => {
    // Check saved PIN
    const savedPin = localStorage.getItem("pravilo_admin_auth");
    if (savedPin) {
      setPin(savedPin);
      setIsAuthenticated(true);
    }

    // Load schedule from localStorage or API
    const stored = localStorage.getItem(LOCAL_STORAGE_SCHEDULE_KEY);
    if (stored) {
      try {
        setConfig(JSON.parse(stored));
      } catch {
        // ignore
      }
    }

    fetch("/api/admin/config")
      .then((res) => res.json())
      .then((data) => {
        if (data?.ok && data.config) {
          setConfig(data.config);
          localStorage.setItem(
            LOCAL_STORAGE_SCHEDULE_KEY,
            JSON.stringify(data.config),
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      pin === "pravilo2026" ||
      pin === "pravilo" ||
      pin === "1234" ||
      pin === "2026"
    ) {
      setIsAuthenticated(true);
      setPinError("");
      localStorage.setItem("pravilo_admin_auth", pin);
    } else {
      setPinError("PIN incorrecto. Probá con 'pravilo2026' o '1234'.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPin("");
    localStorage.removeItem("pravilo_admin_auth");
  };

  const handleToggleDay = (dayIndex: number) => {
    setConfig((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.dayIndex === dayIndex ? { ...d, enabled: !d.enabled } : d,
      ),
    }));
  };

  const handleAddSlot = (dayIndex: number) => {
    const time = newSlotTime[dayIndex];
    if (!time) return;

    setConfig((prev) => ({
      ...prev,
      days: prev.days.map((d) => {
        if (d.dayIndex !== dayIndex) return d;
        if (d.slots.includes(time)) return d;
        const newSlots = [...d.slots, time].sort();
        return { ...d, slots: newSlots };
      }),
    }));

    setNewSlotTime((prev) => ({ ...prev, [dayIndex]: "" }));
  };

  const handleRemoveSlot = (dayIndex: number, slotToRemove: string) => {
    setConfig((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.dayIndex === dayIndex
          ? { ...d, slots: d.slots.filter((s) => s !== slotToRemove) }
          : d,
      ),
    }));
  };

  const handleCopyMondayToWeek = () => {
    const monday = config.days.find((d) => d.dayIndex === 1);
    if (!monday) return;

    setConfig((prev) => ({
      ...prev,
      days: prev.days.map((d) => {
        if (d.dayIndex >= 1 && d.dayIndex <= 5) {
          return {
            ...d,
            enabled: monday.enabled,
            slots: [...monday.slots],
          };
        }
        return d;
      }),
    }));
    setSaveStatus("Horarios de Lunes copiados a Martes-Viernes.");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleAddBlockedDate = () => {
    if (!newBlockedDate) return;
    if (config.blockedDates.includes(newBlockedDate)) return;

    setConfig((prev) => ({
      ...prev,
      blockedDates: [...prev.blockedDates, newBlockedDate].sort(),
    }));
    setNewBlockedDate("");
  };

  const handleRemoveBlockedDate = (dateToRemove: string) => {
    setConfig((prev) => ({
      ...prev,
      blockedDates: prev.blockedDates.filter((d) => d !== dateToRemove),
    }));
  };

  const handleSave = async () => {
    setSaveStatus("Guardando...");
    localStorage.setItem(LOCAL_STORAGE_SCHEDULE_KEY, JSON.stringify(config));

    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config, pin: pin || "pravilo2026" }),
      });
      const data = await res.json();
      if (data.ok) {
        setSaveStatus("✓ ¡Configuración guardada con éxito!");
      } else {
        setSaveStatus("✓ Guardado localmente en este dispositivo.");
      }
    } catch {
      setSaveStatus("✓ Guardado localmente en este dispositivo.");
    }

    setTimeout(() => setSaveStatus(null), 3500);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8 shadow-2xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-accent/15 px-3 py-1 font-condensed text-xs font-bold uppercase tracking-wider text-accent-text">
              Administración
            </span>
            <h1 className="mt-3 font-condensed text-2xl font-extrabold text-foreground">
              Panel de Turnos
            </h1>
            <p className="mt-1 text-xs text-muted">
              Ingresá tu PIN para configurar tus días y horarios.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="pin"
                className="block text-xs font-semibold text-muted"
              >
                PIN de acceso
              </label>
              <input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ingresá tu PIN"
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
                autoFocus
              />
              {pinError && (
                <p className="mt-2 text-xs font-medium text-red-400">
                  {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-accent py-2.5 font-condensed text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90"
            >
              Ingresar al panel
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-muted transition-colors hover:text-foreground"
            >
              ← Volver a la página principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-medium text-muted hover:text-foreground"
            >
              ← Ver web
            </Link>
            <span className="text-border">|</span>
            <span className="font-condensed text-lg font-bold">
              Panel de Turnos · PRAVILO ARG
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-accent px-5 py-1.5 font-condensed text-xs font-bold text-accent-foreground shadow-md transition-all hover:opacity-90"
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:border-accent hover:text-foreground"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Notificación de guardado */}
      {saveStatus && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-accent/40 bg-surface px-5 py-3 text-sm font-semibold text-accent-text shadow-2xl backdrop-blur animate-bounce">
          {saveStatus}
        </div>
      )}

      <main className="mx-auto max-w-5xl px-6 pt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-condensed text-3xl font-black md:text-4xl">
              Configuración de Disponibilidad
            </h1>
            <p className="text-sm text-muted">
              Habilitá los días de la semana y los horarios que los clientes
              pueden elegir al reservar.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyMondayToWeek}
            className="w-fit rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent-text"
          >
            Copiar horarios de Lunes a Lun-Vie
          </button>
        </div>

        {/* Días y Horarios */}
        <div className="mt-8 space-y-4">
          {config.days.map((day) => (
            <div
              key={day.dayIndex}
              className={`rounded-3xl border p-5 transition-colors sm:p-6 ${
                day.enabled
                  ? "border-border bg-surface"
                  : "border-border/40 bg-surface/30 opacity-70"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`day-${day.dayIndex}`}
                    checked={day.enabled}
                    onChange={() => handleToggleDay(day.dayIndex)}
                    className="h-5 w-5 rounded accent-accent cursor-pointer"
                  />
                  <label
                    htmlFor={`day-${day.dayIndex}`}
                    className="cursor-pointer font-condensed text-xl font-bold"
                  >
                    {day.dayName}
                  </label>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${
                      day.enabled
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-zinc-500/10 text-zinc-400"
                    }`}
                  >
                    {day.enabled ? "Abierto" : "Cerrado"}
                  </span>
                </div>

                {/* Contador de slots */}
                <span className="text-xs text-muted">
                  {day.enabled
                    ? `${day.slots.length} turnos configurados`
                    : "No se ofrecen turnos este día"}
                </span>
              </div>

              {day.enabled && (
                <div className="mt-5 border-t border-border/60 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Horarios disponibles:
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {day.slots.length === 0 ? (
                      <p className="text-xs italic text-muted">
                        No hay horarios añadidos. Agregá al menos uno abajo.
                      </p>
                    ) : (
                      day.slots.map((slot) => (
                        <span
                          key={slot}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground shadow-sm"
                        >
                          <span>{slot} hs</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveSlot(day.dayIndex, slot)
                            }
                            aria-label={`Eliminar horario ${slot}`}
                            className="flex h-4 w-4 items-center justify-center rounded-full text-muted hover:bg-accent/20 hover:text-accent-text"
                          >
                            &times;
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Selector para añadir horario */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <select
                      value={newSlotTime[day.dayIndex] || ""}
                      onChange={(e) =>
                        setNewSlotTime((prev) => ({
                          ...prev,
                          [day.dayIndex]: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
                    >
                      <option value="">Seleccionar horario...</option>
                      {PRESET_TIMES.filter((t) => !day.slots.includes(t)).map(
                        (t) => (
                          <option key={t} value={t}>
                            {t} hs
                          </option>
                        ),
                      )}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleAddSlot(day.dayIndex)}
                      disabled={!newSlotTime[day.dayIndex]}
                      className="rounded-xl bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                    >
                      + Agregar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bloqueo de Fechas Específicas / Feriados */}
        <div className="mt-10 rounded-3xl border border-border bg-surface p-6">
          <h2 className="font-condensed text-xl font-bold">
            Días Bloqueados / Feriados / Vacaciones
          </h2>
          <p className="mt-1 text-xs text-muted">
            Los días agregados aquí aparecerán deshabilitados en el calendario
            de reservas.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              type="date"
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              className="rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddBlockedDate}
              disabled={!newBlockedDate}
              className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-accent-foreground disabled:opacity-40"
            >
              + Bloquear fecha
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {config.blockedDates.length === 0 ? (
              <p className="text-xs text-muted italic">
                No hay fechas bloqueadas actualmente.
              </p>
            ) : (
              config.blockedDates.map((dateStr) => (
                <span
                  key={dateStr}
                  className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-xs font-semibold text-red-400"
                >
                  <span>{dateStr}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlockedDate(dateStr)}
                    className="hover:text-white"
                  >
                    &times;
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* WhatsApp Destino */}
        <div className="mt-8 rounded-3xl border border-border bg-surface p-6">
          <h2 className="font-condensed text-xl font-bold">
            Número de WhatsApp para Reservas
          </h2>
          <p className="mt-1 text-xs text-muted">
            Número al que los clientes envían su turno confirmado (formato
            internacional sin signos, ej: 5492994567662).
          </p>

          <div className="mt-4 max-w-sm">
            <input
              type="text"
              value={config.whatsappNumber}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  whatsappNumber: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Botón flotante o final de guardado */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-accent px-10 py-3.5 font-condensed text-lg font-bold text-accent-foreground shadow-[0_0_40px_-10px_var(--accent)] transition-all hover:opacity-90 hover:scale-105"
          >
            Guardar y Aplicar Cambios
          </button>
        </div>
      </main>
    </div>
  );
}
