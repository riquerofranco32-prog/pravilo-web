"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_SCHEDULE_CONFIG,
  LOCAL_STORAGE_SCHEDULE_KEY,
  ScheduleConfig,
} from "@/lib/availability";
import { Booking } from "@/lib/bookings";

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
  const [activeTab, setActiveTab] = useState<"clientes" | "agenda" | "horarios">(
    "clientes",
  );

  // Config State
  const [config, setConfig] = useState<ScheduleConfig>(DEFAULT_SCHEDULE_CONFIG);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [newSlotTime, setNewSlotTime] = useState<{ [dayIndex: number]: string }>(
    {},
  );
  const [newBlockedDate, setNewBlockedDate] = useState("");

  // Bookings State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [agendaMonth, setAgendaMonth] = useState<Date>(new Date());

  // Manual booking modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualPlan, setManualPlan] = useState("1 Sesión Individual");
  const [manualDate, setManualDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [manualTime, setManualTime] = useState("16:00");
  const [manualNotes, setManualNotes] = useState("");

  // Load config & bookings on mount
  useEffect(() => {
    const savedPin = localStorage.getItem("pravilo_admin_auth");
    if (savedPin) {
      setPin(savedPin);
      setIsAuthenticated(true);
    }

    // Schedule Config
    const storedConfig = localStorage.getItem(LOCAL_STORAGE_SCHEDULE_KEY);
    if (storedConfig) {
      try {
        setConfig(JSON.parse(storedConfig));
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

    // Bookings
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    fetch("/api/admin/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.ok && data.bookings) {
          setBookings(data.bookings);
        }
      })
      .catch(() => {});
  };

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

  const handleUpdateBookingStatus = async (
    id: string,
    newStatus: Booking["status"],
  ) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data?.ok && data.bookings) {
        setBookings(data.bookings);
      }
    } catch {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
      );
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("¿Eliminar este registro de turno?")) return;
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data?.ok && data.bookings) {
        setBookings(data.bookings);
      }
    } catch {
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualDate || !manualTime) return;

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planTitle: manualPlan,
          planPrice:
            manualPlan.includes("8")
              ? "$240.000"
              : manualPlan.includes("12")
                ? "$300.000"
                : "$35.000",
          date: manualDate,
          time: manualTime,
          customerName: manualName,
          customerPhone: manualPhone,
          customerNotes: manualNotes,
          status: "confirmado",
        }),
      });
      const data = await res.json();
      if (data?.ok && data.bookings) {
        setBookings(data.bookings);
      }
    } catch {
      // fallback
    }

    setShowManualModal(false);
    setManualName("");
    setManualPhone("");
    setManualNotes("");
  };

  // Schedule Config handlers
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

  const handleSaveConfig = async () => {
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
        setSaveStatus("✓ Guardado localmente.");
      }
    } catch {
      setSaveStatus("✓ Guardado localmente.");
    }

    setTimeout(() => setSaveStatus(null), 3500);
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      filterStatus === "todos" ? true : b.status === filterStatus;
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.customerPhone && b.customerPhone.includes(searchQuery)) ||
      b.planTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calendar rendering in Agenda tab
  const renderAgendaCalendar = () => {
    const year = agendaMonth.getFullYear();
    const month = agendaMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const startingOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < startingOffset; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 rounded-xl border border-transparent" />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayBookings = bookings.filter((b) => b.date === dateStr);
      const isSelected = selectedCalendarDate === dateStr;

      days.push(
        <button
          key={`cal-${d}`}
          type="button"
          onClick={() => setSelectedCalendarDate(dateStr)}
          className={`flex h-16 flex-col justify-between rounded-2xl border p-2 text-left transition-all ${
            isSelected
              ? "border-accent bg-accent/15 shadow-md"
              : "border-border bg-surface hover:border-accent/50"
          }`}
        >
          <span className="font-condensed text-xs font-bold text-foreground">
            {d}
          </span>
          {dayBookings.length > 0 ? (
            <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 font-condensed text-[10px] font-bold text-accent-foreground">
              {dayBookings.length} {dayBookings.length === 1 ? "turno" : "turnos"}
            </span>
          ) : (
            <span className="text-[10px] text-muted/40">-</span>
          )}
        </button>,
      );
    }

    return days;
  };

  const selectedDateBookings = bookings.filter(
    (b) => b.date === selectedCalendarDate,
  );

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8 shadow-2xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-accent/15 px-3 py-1 font-condensed text-xs font-bold uppercase tracking-wider text-accent-text">
              Administración
            </span>
            <h1 className="mt-3 font-condensed text-2xl font-extrabold text-foreground">
              Panel de Turnos & Clientes
            </h1>
            <p className="mt-1 text-xs text-muted">
              Ingresá tu PIN para ver turnos y configurar disponibilidad.
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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-medium text-muted hover:text-foreground"
            >
              ← Ver web
            </Link>
            <span className="text-border">|</span>
            <span className="font-condensed text-lg font-bold">
              PRAVILO ARG · Panel de Control
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowManualModal(true)}
              className="rounded-full bg-accent px-4 py-1.5 font-condensed text-xs font-bold text-accent-foreground shadow transition-all hover:opacity-90"
            >
              + Cargar Turno
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

      {/* Status toast */}
      {saveStatus && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-accent/40 bg-surface px-5 py-3 text-sm font-semibold text-accent-text shadow-2xl backdrop-blur animate-bounce">
          {saveStatus}
        </div>
      )}

      <main className="mx-auto max-w-6xl px-6 pt-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("clientes")}
            className={`rounded-full px-5 py-2 font-condensed text-sm font-bold transition-all ${
              activeTab === "clientes"
                ? "bg-accent text-accent-foreground shadow-md"
                : "border border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            📋 Registro de Clientes & Turnos ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("agenda")}
            className={`rounded-full px-5 py-2 font-condensed text-sm font-bold transition-all ${
              activeTab === "agenda"
                ? "bg-accent text-accent-foreground shadow-md"
                : "border border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            📅 Calendario / Agenda
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("horarios")}
            className={`rounded-full px-5 py-2 font-condensed text-sm font-bold transition-all ${
              activeTab === "horarios"
                ? "bg-accent text-accent-foreground shadow-md"
                : "border border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            ⚙️ Configurar Días & Horarios
          </button>
        </div>

        {/* TAB 1: CLIENTES & TURNOS */}
        {activeTab === "clientes" && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-condensed text-3xl font-extrabold">
                  Registro de Reservas y Clientes
                </h1>
                <p className="text-xs text-muted">
                  Acá quedan guardados todos los turnos solicitados por la web o
                  cargados manualmente.
                </p>
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Buscar por nombre o tel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl border border-border bg-surface px-3.5 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="confirmado">Confirmados</option>
                  <option value="realizado">Realizados</option>
                  <option value="cancelado">Cancelados</option>
                </select>
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="rounded-3xl border border-border bg-surface p-12 text-center">
                <p className="font-condensed text-lg font-bold text-muted">
                  No se encontraron reservas con los filtros aplicados.
                </p>
                <button
                  type="button"
                  onClick={() => setShowManualModal(true)}
                  className="mt-4 rounded-full bg-accent px-5 py-2 font-condensed text-xs font-bold text-accent-foreground"
                >
                  + Cargar una reserva manualmente
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex flex-col justify-between rounded-3xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-accent/40"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-condensed font-bold uppercase ${
                            b.status === "confirmado"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : b.status === "realizado"
                                ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                                : b.status === "cancelado"
                                  ? "bg-red-500/15 text-red-400 border border-red-500/30"
                                  : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {b.status}
                        </span>
                        <span className="font-condensed text-sm font-bold text-accent-text">
                          {b.planPrice}
                        </span>
                      </div>

                      <h2 className="mt-3 font-condensed text-xl font-bold text-foreground">
                        {b.customerName}
                      </h2>
                      <p className="text-xs font-semibold text-accent-text">
                        {b.planTitle}
                      </p>

                      <div className="mt-3 space-y-1 text-xs text-muted border-t border-border/60 pt-3">
                        <p>
                          📅 <strong>Fecha:</strong> {b.date}
                        </p>
                        <p>
                          ⏰ <strong>Horario:</strong> {b.time} hs
                        </p>
                        {b.customerPhone && (
                          <p>
                            📱 <strong>Teléfono:</strong> {b.customerPhone}
                          </p>
                        )}
                        {b.customerNotes && (
                          <p className="italic text-foreground/80">
                            💬 &quot;{b.customerNotes}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
                      {b.customerPhone ? (
                        <a
                          href={`https://wa.me/${b.customerPhone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 font-condensed text-xs font-bold text-white transition-opacity hover:opacity-90"
                        >
                          WhatsApp →
                        </a>
                      ) : (
                        <span />
                      )}

                      <div className="flex items-center gap-1.5">
                        <select
                          value={b.status}
                          onChange={(e) =>
                            handleUpdateBookingStatus(
                              b.id,
                              e.target.value as Booking["status"],
                            )
                          }
                          className="rounded-lg border border-border bg-background px-2 py-1 text-[11px] text-foreground focus:border-accent focus:outline-none"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="realizado">Realizado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDeleteBooking(b.id)}
                          aria-label="Eliminar turno"
                          className="flex h-6 w-6 items-center justify-center rounded text-muted hover:bg-red-500/20 hover:text-red-400"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CALENDARIO / AGENDA */}
        {activeTab === "agenda" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="font-condensed text-2xl font-bold">
                    Agenda Mensual
                  </h1>
                  <p className="text-xs text-muted">
                    Seleccioná un día para ver los turnos programados.
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setAgendaMonth(
                        new Date(
                          agendaMonth.getFullYear(),
                          agendaMonth.getMonth() - 1,
                          1,
                        ),
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-sm text-foreground hover:border-accent"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAgendaMonth(
                        new Date(
                          agendaMonth.getFullYear(),
                          agendaMonth.getMonth() + 1,
                          1,
                        ),
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-sm text-foreground hover:border-accent"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="mb-2 grid grid-cols-7 text-center font-condensed text-xs font-bold text-muted">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {renderAgendaCalendar()}
              </div>
            </div>

            {/* Turnos del día seleccionado */}
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="font-condensed text-xl font-bold">
                Turnos del {selectedCalendarDate}
              </h2>
              <p className="text-xs text-muted">
                {selectedDateBookings.length} turno(s) agendados para este día.
              </p>

              <div className="mt-5 space-y-3">
                {selectedDateBookings.length === 0 ? (
                  <p className="text-xs text-muted italic py-6 text-center">
                    No hay turnos registrados para esta fecha.
                  </p>
                ) : (
                  selectedDateBookings.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-2xl border border-border bg-background p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-condensed text-base font-bold text-accent-text">
                          {b.time} hs
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-condensed font-bold uppercase ${
                            b.status === "confirmado"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                      <h4 className="mt-1 font-condensed text-base font-bold text-foreground">
                        {b.customerName}
                      </h4>
                      <p className="text-xs text-muted">{b.planTitle}</p>
                      {b.customerPhone && (
                        <p className="mt-1 text-xs text-foreground/80">
                          📱 {b.customerPhone}
                        </p>
                      )}
                      {b.customerNotes && (
                        <p className="mt-1 text-xs italic text-muted">
                          💬 {b.customerNotes}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONFIGURAR HORARIOS */}
        {activeTab === "horarios" && (
          <div className="mt-8 space-y-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-condensed text-3xl font-black md:text-4xl">
                  Configuración de Días y Horarios
                </h1>
                <p className="text-sm text-muted">
                  Habilitá los días de la semana y los horarios que los clientes
                  pueden elegir al reservar en la web.
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
            <div className="space-y-4">
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
                          {PRESET_TIMES.filter(
                            (t) => !day.slots.includes(t),
                          ).map((t) => (
                            <option key={t} value={t}>
                              {t} hs
                            </option>
                          ))}
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
            <div className="rounded-3xl border border-border bg-surface p-6">
              <h2 className="font-condensed text-xl font-bold">
                Días Bloqueados / Feriados / Vacaciones
              </h2>
              <p className="mt-1 text-xs text-muted">
                Los días agregados aquí aparecerán inhabilitados en el
                calendario de reservas.
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

            {/* Guardar Cambios */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSaveConfig}
                className="rounded-full bg-accent px-10 py-3.5 font-condensed text-lg font-bold text-accent-foreground shadow-[0_0_40px_-10px_var(--accent)] transition-all hover:opacity-90 hover:scale-105"
              >
                Guardar y Aplicar Cambios
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODAL CARGA MANUAL DE TURNO */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowManualModal(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl">
            <h2 className="font-condensed text-2xl font-bold">
              Cargar Turno Manualmente
            </h2>
            <p className="text-xs text-muted mt-1">
              Para agendar reservas recibidas por llamada o en persona.
            </p>

            <form onSubmit={handleCreateManualBooking} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">
                  Nombre del Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Ej: Marcelo Gómez"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="299..."
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">
                    Plan
                  </label>
                  <select
                    value={manualPlan}
                    onChange={(e) => setManualPlan(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                  >
                    <option value="1 Sesión Individual">1 Sesión Individual</option>
                    <option value="8 Sesiones (2x/sem)">8 Sesiones</option>
                    <option value="12 Sesiones (3x/sem)">12 Sesiones</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">
                    Horario *
                  </label>
                  <select
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                  >
                    {PRESET_TIMES.map((t) => (
                      <option key={t} value={t}>
                        {t} hs
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">
                  Notas / Motivo de consulta
                </label>
                <textarea
                  rows={2}
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="Ej: Dolor lumbar, viene con un amigo..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-accent px-5 py-2 font-condensed text-xs font-bold text-accent-foreground"
                >
                  Guardar Turno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
