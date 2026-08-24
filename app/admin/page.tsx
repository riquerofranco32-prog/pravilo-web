"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_SCHEDULE_CONFIG,
  LOCAL_STORAGE_SCHEDULE_KEY,
  ScheduleConfig,
} from "@/lib/availability";
import {
  Booking,
  PaymentStatus,
  buildGoogleCalendarUrl,
  buildQuickWhatsAppMessage,
  exportBookingsToCSV,
  formatDateTimeExact,
  formatRelativeTime,
  parsePriceToNumber,
} from "@/lib/bookings";

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
  const [activeTab, setActiveTab] = useState<
    "clientes" | "alumnos" | "agenda" | "analiticas" | "horarios"
  >("clientes");

  // Config State
  const [config, setConfig] = useState<ScheduleConfig>(DEFAULT_SCHEDULE_CONFIG);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [newSlotTime, setNewSlotTime] = useState<{ [dayIndex: number]: string }>(
    {},
  );
  const [newBlockedDate, setNewBlockedDate] = useState("");

  // Price Edit State
  const [planPrices, setPlanPrices] = useState({
    individual: "$35.000",
    pack8: "$240.000",
    pack12: "$300.000",
  });

  // Bookings State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterDateMode, setFilterDateMode] = useState<
    "todos" | "hoy" | "manana" | "semana"
  >("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [agendaMonth, setAgendaMonth] = useState<Date>(new Date());

  // Editing Note State
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState("");

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

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

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

    const savedPrices = localStorage.getItem("pravilo_plan_prices");
    if (savedPrices) {
      try {
        setPlanPrices(JSON.parse(savedPrices));
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

  const handleUpdatePaymentStatus = async (
    id: string,
    paymentStatus: PaymentStatus,
  ) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, paymentStatus }),
      });
      const data = await res.json();
      if (data?.ok && data.bookings) {
        setBookings(data.bookings);
      }
    } catch {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, paymentStatus } : b)),
      );
    }
  };

  const handleSaveInternalNote = async (id: string) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, internalNotes: tempNoteText }),
      });
      const data = await res.json();
      if (data?.ok && data.bookings) {
        setBookings(data.bookings);
      }
    } catch {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, internalNotes: tempNoteText } : b,
        ),
      );
    }
    setEditingNoteId(null);
  };

  const handleIncrementSession = async (
    id: string,
    current: number = 0,
    total: number = 1,
  ) => {
    const nextVal = Math.min(total, current + 1);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          sessionsCompleted: nextVal,
          status: nextVal === total ? "realizado" : "confirmado",
        }),
      });
      const data = await res.json();
      if (data?.ok && data.bookings) {
        setBookings(data.bookings);
      }
    } catch {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, sessionsCompleted: nextVal } : b,
        ),
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
              ? planPrices.pack8
              : manualPlan.includes("12")
                ? planPrices.pack12
                : planPrices.individual,
          date: manualDate,
          time: manualTime,
          customerName: manualName,
          customerPhone: manualPhone,
          customerNotes: manualNotes,
          status: "confirmado",
          paymentStatus: "pendiente",
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
    localStorage.setItem("pravilo_plan_prices", JSON.stringify(planPrices));

    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config, pin: pin || "pravilo2026" }),
      });
      const data = await res.json();
      if (data.ok) {
        setSaveStatus("✓ ¡Configuración y precios guardados con éxito!");
      } else {
        setSaveStatus("✓ Guardado localmente.");
      }
    } catch {
      setSaveStatus("✓ Guardado localmente.");
    }

    setTimeout(() => setSaveStatus(null), 3500);
  };

  // KPIs & Stats
  const stats = useMemo(() => {
    const todayCount = bookings.filter((b) => b.date === todayStr).length;
    const pendingCount = bookings.filter((b) => b.status === "pendiente").length;
    const confirmedCount = bookings.filter(
      (b) => b.status === "confirmado" || b.status === "realizado",
    ).length;

    const projectedRevenue = bookings
      .filter((b) => b.status !== "cancelado")
      .reduce((sum, b) => sum + parsePriceToNumber(b.planPrice), 0);

    const paidRevenue = bookings
      .filter(
        (b) =>
          b.paymentStatus === "pagado_efectivo" ||
          b.paymentStatus === "pagado_transferencia" ||
          b.paymentStatus === "pagado_mp",
      )
      .reduce((sum, b) => sum + parsePriceToNumber(b.planPrice), 0);

    const planCounts: { [key: string]: number } = {};
    bookings.forEach((b) => {
      planCounts[b.planTitle] = (planCounts[b.planTitle] || 0) + 1;
    });
    let topPlan = "1 Sesión Individual";
    let maxCount = 0;
    Object.entries(planCounts).forEach(([plan, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topPlan = plan;
      }
    });

    return {
      todayCount,
      pendingCount,
      confirmedCount,
      projectedRevenue,
      paidRevenue,
      topPlan,
    };
  }, [bookings, todayStr]);

  // Unique Alumnos Directory aggregation
  const alumnosList = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        phone: string;
        totalBookings: number;
        totalSpent: number;
        lastDate: string;
        notes: string;
      }
    >();

    bookings.forEach((b) => {
      const key = (b.customerPhone || b.customerName).toLowerCase().trim();
      const existing = map.get(key);
      const spent = parsePriceToNumber(b.planPrice);
      if (existing) {
        existing.totalBookings += 1;
        existing.totalSpent += spent;
        if (b.date > existing.lastDate) existing.lastDate = b.date;
        if (b.internalNotes) existing.notes = b.internalNotes;
      } else {
        map.set(key, {
          name: b.customerName,
          phone: b.customerPhone || "",
          totalBookings: 1,
          totalSpent: spent,
          lastDate: b.date,
          notes: b.internalNotes || "",
        });
      }
    });

    return Array.from(map.values());
  }, [bookings]);

  // Analytics breakdown
  const analyticsData = useMemo(() => {
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    const hourCounts: { [hour: string]: number } = {};

    bookings.forEach((b) => {
      if (b.date) {
        const [y, m, d] = b.date.split("-").map(Number);
        const dayIdx = new Date(y, m - 1, d).getDay();
        dayCounts[dayIdx] = (dayCounts[dayIdx] || 0) + 1;
      }
      if (b.time) {
        hourCounts[b.time] = (hourCounts[b.time] || 0) + 1;
      }
    });

    return { dayNames, dayCounts, hourCounts };
  }, [bookings]);

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      filterStatus === "todos" ? true : b.status === filterStatus;
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.customerPhone && b.customerPhone.includes(searchQuery)) ||
      b.planTitle.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (filterDateMode === "hoy") {
      matchesDate = b.date === todayStr;
    } else if (filterDateMode === "manana") {
      matchesDate = b.date === tomorrowStr;
    }

    return matchesStatus && matchesSearch && matchesDate;
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
      days.push(
        <div
          key={`empty-${i}`}
          className="h-16 rounded-xl border border-transparent"
        />,
      );
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayBookings = bookings.filter((b) => b.date === dateStr);
      const isSelected = selectedCalendarDate === dateStr;
      const isToday = dateStr === todayStr;

      days.push(
        <button
          key={`cal-${d}`}
          type="button"
          onClick={() => setSelectedCalendarDate(dateStr)}
          className={`flex h-16 flex-col justify-between rounded-2xl border p-2 text-left transition-all ${
            isSelected
              ? "border-accent bg-accent/20 shadow-md ring-1 ring-accent"
              : isToday
                ? "border-accent/40 bg-surface/90"
                : "border-border bg-surface hover:border-accent/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`font-condensed text-xs font-bold ${
                isToday ? "text-accent-text" : "text-foreground"
              }`}
            >
              {d}
            </span>
            {isToday && (
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
            )}
          </div>
          {dayBookings.length > 0 ? (
            <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 font-condensed text-[10px] font-bold text-accent-foreground">
              {dayBookings.length}{" "}
              {dayBookings.length === 1 ? "turno" : "turnos"}
            </span>
          ) : (
            <span className="text-[10px] text-muted/30">-</span>
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
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header Pro */}
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
            <div className="flex items-center gap-2">
              <span className="font-condensed text-lg font-bold">
                PRAVILO ARG · Panel de Control Pro
              </span>
              {stats.todayCount > 0 && (
                <span className="rounded-full bg-accent/20 border border-accent/40 px-2.5 py-0.5 font-condensed text-xs font-bold text-accent-text">
                  {stats.todayCount} hoy
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => exportBookingsToCSV(bookings)}
              title="Descargar base de datos en Excel/CSV"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent-text"
            >
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
                <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.69L6.53 8.72a.75.75 0 0 0-1.06 1.06l4 4a.75.75 0 0 0 1.06 0l4-4a.75.75 0 1 0-1.06-1.06l-2.72 2.72V2.75Z" />
                <path d="M3.5 14.75a.75.75 0 0 0 0 1.5h13a.75.75 0 0 0 0-1.5h-13Z" />
              </svg>
              <span>Exportar Excel</span>
            </button>

            <button
              type="button"
              onClick={() => setShowManualModal(true)}
              className="rounded-full bg-accent px-4 py-1.5 font-condensed text-xs font-bold text-accent-foreground shadow transition-all hover:opacity-90 hover:scale-105"
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
        {/* KPI & Metrics Bar */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm">
            <span className="font-condensed text-xs font-bold uppercase tracking-wider text-muted">
              Turnos para Hoy
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-condensed text-3xl font-black text-accent-text">
                {stats.todayCount}
              </span>
              <span className="text-xs text-muted">sesiones</span>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm">
            <span className="font-condensed text-xs font-bold uppercase tracking-wider text-muted">
              Facturación Proyectada
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-condensed text-2xl font-black text-foreground">
                ${stats.projectedRevenue.toLocaleString("es-AR")}
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm">
            <span className="font-condensed text-xs font-bold uppercase tracking-wider text-muted">
              Por Confirmar
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={`font-condensed text-3xl font-black ${
                  stats.pendingCount > 0 ? "text-amber-400" : "text-emerald-400"
                }`}
              >
                {stats.pendingCount}
              </span>
              <span className="text-xs text-muted">pendientes</span>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm">
            <span className="font-condensed text-xs font-bold uppercase tracking-wider text-muted">
              Cobrado / Pagado
            </span>
            <div className="mt-2 font-condensed text-2xl font-black text-emerald-400">
              ${stats.paidRevenue.toLocaleString("es-AR")}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("clientes")}
            className={`rounded-full px-5 py-2 font-condensed text-sm font-bold transition-all ${
              activeTab === "clientes"
                ? "bg-accent text-accent-foreground shadow-md"
                : "border border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            📋 Registro de Turnos ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("alumnos")}
            className={`rounded-full px-5 py-2 font-condensed text-sm font-bold transition-all ${
              activeTab === "alumnos"
                ? "bg-accent text-accent-foreground shadow-md"
                : "border border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            👥 Directorio de Alumnos ({alumnosList.length})
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
            onClick={() => setActiveTab("analiticas")}
            className={`rounded-full px-5 py-2 font-condensed text-sm font-bold transition-all ${
              activeTab === "analiticas"
                ? "bg-accent text-accent-foreground shadow-md"
                : "border border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            📊 Demanda & Horarios
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
            ⚙️ Días, Horarios & Precios
          </button>
        </div>

        {/* TAB 1: CLIENTES & TURNOS */}
        {activeTab === "clientes" && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-condensed text-3xl font-extrabold">
                  Registro de Turnos con Hora Exacta
                </h1>
                <p className="text-xs text-muted">
                  Visualizá cuándo ingresó cada reserva, sincronizá con Google
                  Calendar y enviá mensajes automáticos.
                </p>
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-xl border border-border bg-surface p-1">
                  <button
                    type="button"
                    onClick={() => setFilterDateMode("todos")}
                    className={`rounded-lg px-2.5 py-1 text-xs font-condensed font-semibold transition-colors ${
                      filterDateMode === "todos"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterDateMode("hoy")}
                    className={`rounded-lg px-2.5 py-1 text-xs font-condensed font-semibold transition-colors ${
                      filterDateMode === "hoy"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    Hoy
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterDateMode("manana")}
                    className={`rounded-lg px-2.5 py-1 text-xs font-condensed font-semibold transition-colors ${
                      filterDateMode === "manana"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    Mañana
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Buscar alumno o tel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
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
                  No hay reservas registradas en este momento.
                </p>
                <p className="mt-1 text-xs text-muted/70">
                  Las reservas que los clientes soliciten en la web aparecerán
                  automáticamente acá.
                </p>
                <button
                  type="button"
                  onClick={() => setShowManualModal(true)}
                  className="mt-5 rounded-full bg-accent px-6 py-2.5 font-condensed text-xs font-bold text-accent-foreground transition-all hover:opacity-90"
                >
                  + Cargar una reserva manualmente
                </button>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredBookings.map((b) => {
                  const exactTime = formatDateTimeExact(b.createdAt);
                  const relTime = formatRelativeTime(b.createdAt);
                  const isMultiSession =
                    b.totalSessions && b.totalSessions > 1;

                  return (
                    <div
                      key={b.id}
                      className="flex flex-col justify-between rounded-3xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-accent/40"
                    >
                      <div>
                        {/* Cabecera */}
                        <div className="flex items-start justify-between">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-condensed font-bold uppercase ${
                              b.status === "confirmado"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : b.status === "realizado"
                                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                                  : b.status === "cancelado"
                                    ? "bg-red-500/15 text-red-400 border border-red-500/30"
                                    : "bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse"
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

                        {b.createdAt && (
                          <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-background/60 px-2.5 py-1 text-[11px] text-muted">
                            <svg
                              viewBox="0 0 20 20"
                              className="h-3.5 w-3.5 shrink-0 fill-current opacity-70"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>
                              Pedido el <strong>{exactTime}</strong>{" "}
                              {relTime && `(${relTime})`}
                            </span>
                          </div>
                        )}

                        <div className="mt-3 space-y-1.5 text-xs text-muted border-t border-border/60 pt-3">
                          <p>
                            📅 <strong>Fecha del turno:</strong> {b.date}
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
                            <p className="italic text-foreground/90 bg-background/40 p-2 rounded-xl">
                              💬 &quot;{b.customerNotes}&quot;
                            </p>
                          )}
                        </div>

                        {/* Estado del Pago */}
                        <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-border/80 bg-background/50 p-2 text-xs">
                          <span className="text-[11px] font-semibold text-muted">
                            Estado Pago:
                          </span>
                          <select
                            value={b.paymentStatus || "pendiente"}
                            onChange={(e) =>
                              handleUpdatePaymentStatus(
                                b.id,
                                e.target.value as PaymentStatus,
                              )
                            }
                            className="rounded-lg border border-border bg-surface px-2 py-1 text-[11px] text-foreground focus:border-accent focus:outline-none"
                          >
                            <option value="pendiente">💳 Pendiente</option>
                            <option value="seña">💳 Seña Recibida</option>
                            <option value="pagado_efectivo">
                              💵 Pagado Efectivo
                            </option>
                            <option value="pagado_transferencia">
                              📱 Pagado Transferencia
                            </option>
                            <option value="pagado_mp">
                              💳 Pagado Mercado Pago
                            </option>
                          </select>
                        </div>

                        {isMultiSession && (
                          <div className="mt-3 rounded-2xl border border-accent/20 bg-accent/5 p-2.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground">
                                Progreso del Pack:
                              </span>
                              <span className="font-condensed font-bold text-accent-text">
                                {b.sessionsCompleted || 0} / {b.totalSessions}{" "}
                                sesiones
                              </span>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleIncrementSession(
                                    b.id,
                                    b.sessionsCompleted || 0,
                                    b.totalSessions || 1,
                                  )
                                }
                                className="w-full rounded-lg bg-accent py-1 font-condensed text-xs font-bold text-accent-foreground hover:opacity-90"
                              >
                                + Marcar 1 Sesión Realizada
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Notas del Instructor */}
                        <div className="mt-3 rounded-2xl border border-border bg-background p-2.5 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-muted text-[11px] uppercase tracking-wider">
                              Notas del Instructor:
                            </span>
                            {editingNoteId !== b.id && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNoteId(b.id);
                                  setTempNoteText(b.internalNotes || "");
                                }}
                                className="text-[11px] text-accent-text hover:underline"
                              >
                                {b.internalNotes ? "Editar" : "+ Agregar nota"}
                              </button>
                            )}
                          </div>

                          {editingNoteId === b.id ? (
                            <div className="mt-1 space-y-1.5">
                              <textarea
                                rows={2}
                                value={tempNoteText}
                                onChange={(e) =>
                                  setTempNoteText(e.target.value)
                                }
                                placeholder="Ej: Hernia L4-L5, progresión suave..."
                                className="w-full rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-foreground focus:border-accent focus:outline-none"
                              />
                              <div className="flex justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingNoteId(null)}
                                  className="rounded px-2 py-0.5 text-[10px] text-muted hover:text-foreground"
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSaveInternalNote(b.id)
                                  }
                                  className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground"
                                >
                                  Guardar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-foreground/80">
                              {b.internalNotes || (
                                <span className="italic text-muted/60">
                                  Sin notas cargadas.
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Botones de acción rápidos */}
                      <div className="mt-4 space-y-2 border-t border-border/60 pt-3">
                        <div className="flex flex-wrap gap-1.5">
                          {b.customerPhone && (
                            <>
                              <a
                                href={buildQuickWhatsAppMessage("confirmar", b)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 font-condensed text-[11px] font-bold text-white transition-opacity hover:opacity-90"
                              >
                                ✓ Confirmar
                              </a>
                              <a
                                href={buildQuickWhatsAppMessage(
                                  "recordatorio",
                                  b,
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 font-condensed text-[11px] font-bold text-emerald-400 transition-colors hover:bg-emerald-500/20"
                              >
                                ⏰ Recordatorio 24h
                              </a>
                              <a
                                href={buildQuickWhatsAppMessage(
                                  "seguimiento_post",
                                  b,
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/10 px-2.5 py-1 font-condensed text-[11px] font-bold text-purple-400 transition-colors hover:bg-purple-500/20"
                              >
                                💬 Post-Sesión
                              </a>
                            </>
                          )}

                          <a
                            href={buildGoogleCalendarUrl(b)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/10 px-2.5 py-1 font-condensed text-[11px] font-bold text-blue-400 transition-colors hover:bg-blue-500/20"
                          >
                            📅 Google Cal →
                          </a>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1">
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
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DIRECTORIO DE ALUMNOS */}
        {activeTab === "alumnos" && (
          <div className="mt-8 space-y-6">
            <div>
              <h1 className="font-condensed text-3xl font-extrabold">
                Directorio de Alumnos & Clientes
              </h1>
              <p className="text-xs text-muted">
                Historial agrupado por persona, total de sesiones tomadas y ficha médica.
              </p>
            </div>

            {alumnosList.length === 0 ? (
              <div className="rounded-3xl border border-border bg-surface p-12 text-center text-muted">
                No hay alumnos registrados todavía.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-3xl border border-border bg-surface">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-background/50 font-condensed text-xs font-bold uppercase text-muted">
                    <tr>
                      <th className="p-4">Alumno</th>
                      <th className="p-4">Teléfono</th>
                      <th className="p-4">Total Turnos</th>
                      <th className="p-4">Inversión Total</th>
                      <th className="p-4">Última Visita</th>
                      <th className="p-4">Notas Físicas</th>
                      <th className="p-4 text-right">Contacto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {alumnosList.map((a, i) => (
                      <tr key={i} className="hover:bg-background/40">
                        <td className="p-4 font-semibold text-foreground">
                          {a.name}
                        </td>
                        <td className="p-4 text-muted">{a.phone || "-"}</td>
                        <td className="p-4 font-condensed font-bold text-accent-text">
                          {a.totalBookings} sesión(es)
                        </td>
                        <td className="p-4 font-bold text-foreground">
                          ${a.totalSpent.toLocaleString("es-AR")}
                        </td>
                        <td className="p-4 text-muted">{a.lastDate}</td>
                        <td className="p-4 text-muted max-w-xs truncate">
                          {a.notes || "-"}
                        </td>
                        <td className="p-4 text-right">
                          {a.phone ? (
                            <a
                              href={`https://wa.me/${a.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full bg-emerald-600 px-3 py-1 font-condensed font-bold text-white hover:opacity-90"
                            >
                              WhatsApp →
                            </a>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CALENDARIO / AGENDA */}
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
                      {b.createdAt && (
                        <p className="text-[10px] text-muted mt-0.5">
                          Pedido el {formatDateTimeExact(b.createdAt)}
                        </p>
                      )}
                      {b.customerPhone && (
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2">
                          <span className="text-xs text-foreground/80">
                            📱 {b.customerPhone}
                          </span>
                          <div className="flex gap-1.5">
                            <a
                              href={buildQuickWhatsAppMessage("confirmar", b)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white"
                            >
                              WhatsApp →
                            </a>
                            <a
                              href={buildGoogleCalendarUrl(b)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full border border-blue-500/40 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400"
                            >
                              📅 Cal
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANALÍTICAS */}
        {activeTab === "analiticas" && (
          <div className="mt-8 space-y-8">
            <div>
              <h1 className="font-condensed text-3xl font-extrabold">
                Demanda por Día y Horario
              </h1>
              <p className="text-xs text-muted">
                Estadísticas de ocupación para saber qué días y franjas horarias son las más pedidas.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-border bg-surface p-6">
                <h3 className="font-condensed text-xl font-bold mb-4">
                  Distribución por Día de la Semana
                </h3>
                <div className="space-y-3">
                  {analyticsData.dayNames.map((name, idx) => {
                    const count = analyticsData.dayCounts[idx] || 0;
                    const max = Math.max(...analyticsData.dayCounts, 1);
                    const pct = Math.round((count / max) * 100);

                    return (
                      <div key={name}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold">{name}</span>
                          <span className="text-muted">{count} turnos</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-background overflow-hidden border border-border/50">
                          <div
                            className="h-full bg-accent transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-surface p-6">
                <h3 className="font-condensed text-xl font-bold mb-4">
                  Horarios más Solicitados
                </h3>
                <div className="space-y-2">
                  {Object.keys(analyticsData.hourCounts).length === 0 ? (
                    <p className="text-xs text-muted italic">Sin datos aún.</p>
                  ) : (
                    Object.entries(analyticsData.hourCounts)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([hour, count]) => (
                        <div
                          key={hour}
                          className="flex items-center justify-between rounded-xl border border-border bg-background p-3 text-xs"
                        >
                          <span className="font-condensed font-bold text-base text-accent-text">
                            {hour} hs
                          </span>
                          <span className="font-semibold text-foreground">
                            {count} turno(s) pedidos
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONFIGURAR HORARIOS & PRECIOS */}
        {activeTab === "horarios" && (
          <div className="mt-8 space-y-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-condensed text-3xl font-black md:text-4xl">
                  Configuración de Días, Horarios & Precios
                </h1>
                <p className="text-sm text-muted">
                  Habilitá los días de la semana, horarios y editá el valor de los planes.
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

            {/* Editor de Precios */}
            <div className="rounded-3xl border border-border bg-surface p-6">
              <h2 className="font-condensed text-xl font-bold">
                Valores de los Planes
              </h2>
              <p className="mt-1 text-xs text-muted">
                Modificá los precios de los planes directamente aquí.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">
                    1 Sesión Individual
                  </label>
                  <input
                    type="text"
                    value={planPrices.individual}
                    onChange={(e) =>
                      setPlanPrices((prev) => ({
                        ...prev,
                        individual: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">
                    8 Sesiones (2x/sem)
                  </label>
                  <input
                    type="text"
                    value={planPrices.pack8}
                    onChange={(e) =>
                      setPlanPrices((prev) => ({
                        ...prev,
                        pack8: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">
                    12 Sesiones (3x/sem)
                  </label>
                  <input
                    type="text"
                    value={planPrices.pack12}
                    onChange={(e) =>
                      setPlanPrices((prev) => ({
                        ...prev,
                        pack12: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
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

            {/* Bloqueo de Fechas */}
            <div className="rounded-3xl border border-border bg-surface p-6">
              <h2 className="font-condensed text-xl font-bold">
                Días Bloqueados / Feriados / Vacaciones
              </h2>
              <p className="mt-1 text-xs text-muted">
                Los días agregados aquí aparecerán inhabilitados en el calendario de reservas.
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

            <form
              onSubmit={handleCreateManualBooking}
              className="mt-5 space-y-4"
            >
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
                    <option value="1 Sesión Individual">
                      1 Sesión ({planPrices.individual})
                    </option>
                    <option value="8 Sesiones (2x/sem)">
                      8 Sesiones ({planPrices.pack8})
                    </option>
                    <option value="12 Sesiones (3x/sem)">
                      12 Sesiones ({planPrices.pack12})
                    </option>
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
