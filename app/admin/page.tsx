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

const SCHEDULE_PRESETS = [
  {
    name: "Estándar Completo (Mañana y Tarde)",
    slots: [
      "09:00",
      "10:30",
      "12:00",
      "16:00",
      "17:30",
      "19:00",
      "20:30",
    ],
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
    slots: [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
    ],
  },
];

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "clientes" | "alumnos" | "agenda" | "analiticas" | "horarios"
  >("clientes");

  // Live time in Neuquén, Argentina
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeStr = new Intl.DateTimeFormat("es-AR", {
          timeZone: "America/Argentina/Buenos_Aires",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);
        setCurrentTime(timeStr);
      } catch {
        const now = new Date();
        setCurrentTime(
          `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
        );
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
  const [filterPayment, setFilterPayment] = useState<string>("todos");
  const [filterDateMode, setFilterDateMode] = useState<
    "todos" | "hoy" | "manana" | "semana" | "pendientes"
  >("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [agendaMonth, setAgendaMonth] = useState<Date>(new Date());

  // Editing Note State
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState("");

  // WhatsApp template selector state per booking card
  const [activeWaMenuId, setActiveWaMenuId] = useState<string | null>(null);

  // Student Detail Modal (CRM)
  const [selectedStudentPhone, setSelectedStudentPhone] = useState<
    string | null
  >(null);

  // Manual booking modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualPlan, setManualPlan] = useState("1 Sesión Individual");
  const [manualDate, setManualDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [manualTime, setManualTime] = useState("16:00");
  const [manualPayment, setManualPayment] = useState<PaymentStatus>("pendiente");
  const [manualNotes, setManualNotes] = useState("");

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowManualModal(false);
        setSelectedStudentPhone(null);
        setActiveWaMenuId(null);
      }
      // Press "/" to focus search when not in an input
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        const searchInput = document.getElementById(
          "admin-search-input",
        ) as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

    const totalSessions = manualPlan.includes("8")
      ? 8
      : manualPlan.includes("12")
        ? 12
        : 1;

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planTitle: manualPlan,
          planPrice: manualPlan.includes("8")
            ? planPrices.pack8
            : manualPlan.includes("12")
              ? planPrices.pack12
              : planPrices.individual,
          date: manualDate,
          time: manualTime,
          customerName: manualName,
          customerPhone: manualPhone,
          customerNotes: manualNotes,
          totalSessions,
          sessionsCompleted: 0,
          status: "confirmado",
          paymentStatus: manualPayment,
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
    setManualPayment("pendiente");
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

  const handleApplyPresetToAllWeek = (presetSlots: string[]) => {
    setConfig((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.dayIndex >= 1 && d.dayIndex <= 5
          ? { ...d, enabled: true, slots: [...presetSlots].sort() }
          : d,
      ),
    }));
    setSaveStatus("✓ Horario aplicado de Lunes a Viernes.");
    setTimeout(() => setSaveStatus(null), 3000);
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
    setSaveStatus("✓ Horarios de Lunes copiados a Martes-Viernes.");
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

  // Open manual modal pre-filled for a specific date and time from calendar
  const handleAssignEmptySlot = (date: string, time: string) => {
    setManualDate(date);
    setManualTime(time);
    setShowManualModal(true);
  };

  // KPIs & Stats
  const stats = useMemo(() => {
    const todayBookings = bookings.filter((b) => b.date === todayStr);
    const todayCount = todayBookings.length;
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

    const pendingPaymentCount = bookings.filter(
      (b) => b.status !== "cancelado" && (!b.paymentStatus || b.paymentStatus === "pendiente"),
    ).length;

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

    const revenuePct =
      projectedRevenue > 0
        ? Math.min(100, Math.round((paidRevenue / projectedRevenue) * 100))
        : 0;

    return {
      todayCount,
      pendingCount,
      confirmedCount,
      projectedRevenue,
      paidRevenue,
      pendingPaymentCount,
      topPlan,
      revenuePct,
    };
  }, [bookings, todayStr]);

  // Unique Alumnos Directory aggregation (CRM)
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
        activePacks: number;
        history: Booking[];
      }
    >();

    bookings.forEach((b) => {
      const key = (b.customerPhone || b.customerName).toLowerCase().trim();
      const existing = map.get(key);
      const spent = parsePriceToNumber(b.planPrice);
      const isPack = b.totalSessions && b.totalSessions > 1;

      if (existing) {
        existing.totalBookings += 1;
        existing.totalSpent += spent;
        if (b.date > existing.lastDate) existing.lastDate = b.date;
        if (b.internalNotes) existing.notes = b.internalNotes;
        if (
          isPack &&
          (b.sessionsCompleted || 0) < (b.totalSessions || 1) &&
          b.status !== "cancelado"
        ) {
          existing.activePacks += 1;
        }
        existing.history.push(b);
      } else {
        map.set(key, {
          name: b.customerName,
          phone: b.customerPhone || "",
          totalBookings: 1,
          totalSpent: spent,
          lastDate: b.date,
          notes: b.internalNotes || "",
          activePacks:
            isPack &&
            (b.sessionsCompleted || 0) < (b.totalSessions || 1) &&
            b.status !== "cancelado"
              ? 1
              : 0,
          history: [b],
        });
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => b.totalSpent - a.totalSpent || b.totalBookings - a.totalBookings,
    );
  }, [bookings]);

  // Student selected for detailed modal view
  const currentSelectedStudent = useMemo(() => {
    if (!selectedStudentPhone) return null;
    return (
      alumnosList.find(
        (a) =>
          a.phone === selectedStudentPhone ||
          a.name.toLowerCase() === selectedStudentPhone.toLowerCase(),
      ) || null
    );
  }, [alumnosList, selectedStudentPhone]);

  // Analytics breakdown
  const analyticsData = useMemo(() => {
    const dayNames = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    const hourCounts: { [hour: string]: number } = {};
    const paymentBreakdown: { [k in PaymentStatus | "sin_definir"]: number } = {
      pendiente: 0,
      seña: 0,
      pagado_efectivo: 0,
      pagado_transferencia: 0,
      pagado_mp: 0,
      sin_definir: 0,
    };

    bookings.forEach((b) => {
      if (b.date) {
        const [y, m, d] = b.date.split("-").map(Number);
        const dayIdx = new Date(y, m - 1, d).getDay();
        dayCounts[dayIdx] = (dayCounts[dayIdx] || 0) + 1;
      }
      if (b.time) {
        hourCounts[b.time] = (hourCounts[b.time] || 0) + 1;
      }
      const pStatus = b.paymentStatus || "sin_definir";
      paymentBreakdown[pStatus] =
        (paymentBreakdown[pStatus] || 0) + parsePriceToNumber(b.planPrice);
    });

    return { dayNames, dayCounts, hourCounts, paymentBreakdown };
  }, [bookings]);

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      filterStatus === "todos" ? true : b.status === filterStatus;

    const matchesPayment =
      filterPayment === "todos"
        ? true
        : filterPayment === "pendiente"
          ? !b.paymentStatus || b.paymentStatus === "pendiente"
          : b.paymentStatus === filterPayment;

    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.customerPhone && b.customerPhone.includes(searchQuery)) ||
      (b.customerNotes &&
        b.customerNotes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.internalNotes &&
        b.internalNotes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.planTitle.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (filterDateMode === "hoy") {
      matchesDate = b.date === todayStr;
    } else if (filterDateMode === "manana") {
      matchesDate = b.date === tomorrowStr;
    } else if (filterDateMode === "pendientes") {
      matchesDate = b.status === "pendiente";
    }

    return matchesStatus && matchesPayment && matchesSearch && matchesDate;
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
          className="h-16 rounded-xl border border-transparent opacity-20"
        />,
      );
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayBookings = bookings.filter(
        (b) => b.date === dateStr && b.status !== "cancelado",
      );
      const isSelected = selectedCalendarDate === dateStr;
      const isToday = dateStr === todayStr;
      const isBlocked = config.blockedDates.includes(dateStr);

      days.push(
        <button
          key={`cal-${d}`}
          type="button"
          onClick={() => setSelectedCalendarDate(dateStr)}
          className={`group relative flex h-16 flex-col justify-between rounded-2xl border p-2 text-left transition-all duration-200 ${
            isSelected
              ? "border-accent bg-accent/20 shadow-lg shadow-accent/15 ring-2 ring-accent ring-offset-2 ring-offset-background"
              : isToday
                ? "border-accent/40 bg-surface/90 hover:border-accent"
                : isBlocked
                  ? "border-red-950/40 bg-red-950/20 opacity-70"
                  : "border-border bg-surface hover:border-border-highlight hover:bg-surface-raised"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`font-condensed text-xs font-bold ${
                isToday
                  ? "text-accent-text font-black"
                  : isBlocked
                    ? "text-red-400"
                    : "text-foreground"
              }`}
            >
              {d}
            </span>
            {isToday && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
            )}
            {isBlocked && (
              <span className="text-[9px] font-condensed font-bold uppercase text-red-400">
                Bloq
              </span>
            )}
          </div>
          {dayBookings.length > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/90 px-2 py-0.5 font-condensed text-[10px] font-bold text-accent-foreground shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              {dayBookings.length} {dayBookings.length === 1 ? "turno" : "turnos"}
            </span>
          ) : (
            <span className="text-[10px] text-muted/30 group-hover:text-muted/60 transition-colors">
              Libre
            </span>
          )}
        </button>,
      );
    }

    return days;
  };

  // Get slots for selected calendar date
  const selectedDateConfigSlots = useMemo(() => {
    if (!selectedCalendarDate) return [];
    const [y, m, d] = selectedCalendarDate.split("-").map(Number);
    const dayOfWeek = new Date(y, m - 1, d).getDay();
    const dayConfig = config.days.find((day) => day.dayIndex === dayOfWeek);
    return dayConfig && dayConfig.enabled ? dayConfig.slots : [];
  }, [selectedCalendarDate, config]);

  const selectedDateBookings = bookings.filter(
    (b) => b.date === selectedCalendarDate,
  );

  // Month navigation labels
  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat("es-AR", {
      month: "long",
      year: "numeric",
    }).format(agendaMonth);
  }, [agendaMonth]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 grain">
        <div className="relative w-full max-w-md rounded-3xl border border-border bg-surface/95 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center">
            <span className="eyebrow mx-auto justify-center">
              Panel Administrativo
            </span>
            <h1 className="mt-3 font-condensed text-3xl font-extrabold tracking-tight text-foreground">
              PRAVILO ARGENTINA
            </h1>
            <p className="mt-1.5 text-xs text-muted">
              Ingresá tu clave de seguridad para gestionar turnos, alumnos y disponibilidad.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <div>
              <label
                htmlFor="pin"
                className="block text-xs font-semibold text-muted mb-1.5"
              >
                PIN de instructor / acceso
              </label>
              <div className="relative">
                <input
                  id="pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  autoFocus
                />
              </div>
              {pinError && (
                <p className="mt-2 text-xs font-medium text-red-400 flex items-center gap-1">
                  <span>⚠️</span> {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-shiny w-full rounded-full bg-accent py-3 font-condensed text-sm font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:opacity-95"
            >
              Ingresar al Dashboard Pro →
            </button>
          </form>

          <div className="mt-6 border-t border-border/60 pt-4 text-center">
            <Link
              href="/"
              className="text-xs text-muted transition-colors hover:text-foreground inline-flex items-center gap-1"
            >
              ← Volver al sitio web principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 grain selection:bg-accent/40 selection:text-white">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
            >
              <span className="text-accent-text">←</span> Web
            </Link>
            <span className="text-border">|</span>
            <div className="flex items-center gap-2.5">
              <span className="font-condensed text-base sm:text-lg font-black tracking-tight text-gradient-accent">
                PRAVILO ARG
              </span>
              <span className="rounded-md bg-accent/15 border border-accent/30 px-2 py-0.5 font-condensed text-[11px] font-bold text-accent-text uppercase tracking-wider">
                Admin Pro
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Clock Plottier */}
            <div className="hidden md:flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-condensed font-bold text-foreground">
                {currentTime || "15:00 hs"}
              </span>
              <span className="text-[10px] text-muted/70">Plottier, ARG</span>
            </div>

            <button
              type="button"
              onClick={() => exportBookingsToCSV(bookings)}
              title="Descargar base de datos completa en Excel/CSV"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-accent hover:text-accent-text"
            >
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
                <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.69L6.53 8.72a.75.75 0 0 0-1.06 1.06l4 4a.75.75 0 0 0 1.06 0l4-4a.75.75 0 1 0-1.06-1.06l-2.72 2.72V2.75Z" />
                <path d="M3.5 14.75a.75.75 0 0 0 0 1.5h13a.75.75 0 0 0 0-1.5h-13Z" />
              </svg>
              <span className="hidden sm:inline">Exportar Excel</span>
            </button>

            <button
              type="button"
              onClick={() => setShowManualModal(true)}
              className="btn-shiny inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 font-condensed text-xs font-bold text-accent-foreground shadow-md shadow-accent/25 transition-all hover:opacity-90"
            >
              <span>+</span>
              <span>Cargar Turno</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:border-accent hover:text-foreground transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Floating Status Toast */}
      {saveStatus && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-accent/40 bg-surface-raised px-5 py-3 text-sm font-semibold text-accent-text shadow-2xl backdrop-blur animate-bounce flex items-center gap-2">
          <span>✨</span>
          <span>{saveStatus}</span>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        {/* KPI & Metrics Bar */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm relative overflow-hidden group hover:border-accent/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-condensed text-xs font-bold uppercase tracking-wider text-muted">
                Turnos Hoy
              </span>
              <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-condensed text-3xl sm:text-4xl font-black text-accent-text">
                {stats.todayCount}
              </span>
              <span className="text-xs text-muted">sesiones</span>
            </div>
            <p className="mt-1 text-[11px] text-muted/70">
              {stats.confirmedCount} confirmadas en total
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm hover:border-accent/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-condensed text-xs font-bold uppercase tracking-wider text-muted">
                Facturación Cobrada
              </span>
              <span className="text-xs font-condensed font-bold text-emerald-400">
                {stats.revenuePct}%
              </span>
            </div>
            <div className="mt-2 font-condensed text-2xl sm:text-3xl font-black text-emerald-400">
              ${stats.paidRevenue.toLocaleString("es-AR")}
            </div>
            <div className="mt-2 h-1.5 w-full bg-background rounded-full overflow-hidden border border-border/50">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${stats.revenuePct}%` }}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm hover:border-accent/40 transition-all">
            <span className="font-condensed text-xs font-bold uppercase tracking-wider text-muted">
              Por Confirmar
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={`font-condensed text-3xl sm:text-4xl font-black ${
                  stats.pendingCount > 0 ? "text-amber-400" : "text-emerald-400"
                }`}
              >
                {stats.pendingCount}
              </span>
              <span className="text-xs text-muted">solicitudes</span>
            </div>
            <p className="mt-1 text-[11px] text-muted/70">
              {stats.pendingPaymentCount} con pago pendiente
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm hover:border-accent/40 transition-all">
            <span className="font-condensed text-xs font-bold uppercase tracking-wider text-muted">
              Alumnos Registrados
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-condensed text-3xl sm:text-4xl font-black text-foreground">
                {alumnosList.length}
              </span>
              <span className="text-xs text-muted">en base CRM</span>
            </div>
            <p className="mt-1 text-[11px] text-muted/70 truncate">
              Top: <strong>{stats.topPlan}</strong>
            </p>
          </div>
        </div>

        {/* Navigation Tabs Switcher */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-border pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("clientes")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-condensed text-xs sm:text-sm font-bold transition-all ${
              activeTab === "clientes"
                ? "bg-accent text-accent-foreground shadow-md shadow-accent/25"
                : "border border-border bg-surface text-muted hover:text-foreground hover:border-border-highlight"
            }`}
          >
            <span>📋 Turnos & Operaciones</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${
                activeTab === "clientes"
                  ? "bg-white/20 text-white"
                  : "bg-background text-muted"
              }`}
            >
              {bookings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("alumnos")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-condensed text-xs sm:text-sm font-bold transition-all ${
              activeTab === "alumnos"
                ? "bg-accent text-accent-foreground shadow-md shadow-accent/25"
                : "border border-border bg-surface text-muted hover:text-foreground hover:border-border-highlight"
            }`}
          >
            <span>👥 Directorio CRM</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${
                activeTab === "alumnos"
                  ? "bg-white/20 text-white"
                  : "bg-background text-muted"
              }`}
            >
              {alumnosList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("agenda")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-condensed text-xs sm:text-sm font-bold transition-all ${
              activeTab === "agenda"
                ? "bg-accent text-accent-foreground shadow-md shadow-accent/25"
                : "border border-border bg-surface text-muted hover:text-foreground hover:border-border-highlight"
            }`}
          >
            <span>📅 Agenda Visual & Calendario</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analiticas")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-condensed text-xs sm:text-sm font-bold transition-all ${
              activeTab === "analiticas"
                ? "bg-accent text-accent-foreground shadow-md shadow-accent/25"
                : "border border-border bg-surface text-muted hover:text-foreground hover:border-border-highlight"
            }`}
          >
            <span>📊 Métricas & Demanda</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("horarios")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-condensed text-xs sm:text-sm font-bold transition-all ${
              activeTab === "horarios"
                ? "bg-accent text-accent-foreground shadow-md shadow-accent/25"
                : "border border-border bg-surface text-muted hover:text-foreground hover:border-border-highlight"
            }`}
          >
            <span>⚙️ Horarios & Precios</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: GESTIÓN DE TURNOS & OPERACIONES */}
        {/* ============================================================ */}
        {activeTab === "clientes" && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="font-condensed text-2xl sm:text-3xl font-extrabold text-foreground">
                  Gestión Operativa de Turnos
                </h1>
                <p className="text-xs text-muted">
                  Control en tiempo real, seguimiento de packs, plantillas de WhatsApp y sincronización con Google Calendar.
                </p>
              </div>

              {/* Filtros rápidos y buscador */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Date chips */}
                <div className="flex rounded-xl border border-border bg-surface p-1">
                  <button
                    type="button"
                    onClick={() => setFilterDateMode("todos")}
                    className={`rounded-lg px-3 py-1 text-xs font-condensed font-bold transition-colors ${
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
                    className={`rounded-lg px-3 py-1 text-xs font-condensed font-bold transition-colors ${
                      filterDateMode === "hoy"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    Hoy ({stats.todayCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterDateMode("manana")}
                    className={`rounded-lg px-3 py-1 text-xs font-condensed font-bold transition-colors ${
                      filterDateMode === "manana"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    Mañana
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterDateMode("pendientes")}
                    className={`rounded-lg px-3 py-1 text-xs font-condensed font-bold transition-colors ${
                      filterDateMode === "pendientes"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    Pendientes ({stats.pendingCount})
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <input
                    id="admin-search-input"
                    type="text"
                    placeholder="Buscar alumno, tel o notas... (/)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 sm:w-60 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-foreground"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Status Dropdown */}
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

                {/* Payment Dropdown */}
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
                >
                  <option value="todos">Todos los pagos</option>
                  <option value="pendiente">💳 Pendiente de Pago</option>
                  <option value="seña">💳 Seña Recibida</option>
                  <option value="pagado_transferencia">📱 Transferencia</option>
                  <option value="pagado_efectivo">💵 Efectivo</option>
                  <option value="pagado_mp">💳 Mercado Pago</option>
                </select>
              </div>
            </div>

            {/* Bookings Grid */}
            {filteredBookings.length === 0 ? (
              <div className="rounded-3xl border border-border bg-surface p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-xl text-accent-text">
                  📋
                </div>
                <p className="mt-3 font-condensed text-lg font-bold text-foreground">
                  No se encontraron reservas con los filtros seleccionados.
                </p>
                <p className="mt-1 text-xs text-muted">
                  Podés cambiar los filtros o cargar un nuevo turno manualmente.
                </p>
                <button
                  type="button"
                  onClick={() => setShowManualModal(true)}
                  className="btn-shiny mt-5 rounded-full bg-accent px-6 py-2.5 font-condensed text-xs font-bold text-accent-foreground transition-all hover:opacity-90"
                >
                  + Cargar Turno Manual
                </button>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredBookings.map((b) => {
                  const exactTime = formatDateTimeExact(b.createdAt);
                  const relTime = formatRelativeTime(b.createdAt);
                  const isMultiSession =
                    b.totalSessions && b.totalSessions > 1;
                  const total = b.totalSessions || 1;
                  const completed = b.sessionsCompleted || 0;
                  const isWaOpen = activeWaMenuId === b.id;

                  return (
                    <div
                      key={b.id}
                      className="group relative flex flex-col justify-between rounded-3xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
                    >
                      <div>
                        {/* Header card */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-condensed font-bold uppercase tracking-wider ${
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
                            {b.date === todayStr && (
                              <span className="rounded-md bg-accent/20 px-1.5 py-0.5 font-condensed text-[10px] font-bold text-accent-text">
                                HOY
                              </span>
                            )}
                          </div>
                          <span className="font-condensed text-sm font-black text-accent-text">
                            {b.planPrice}
                          </span>
                        </div>

                        {/* Customer Info */}
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedStudentPhone(
                                b.customerPhone || b.customerName,
                              )
                            }
                            className="text-left font-condensed text-xl font-black text-foreground hover:text-accent-text transition-colors flex items-center gap-1.5"
                          >
                            <span>{b.customerName}</span>
                            <span className="text-xs text-muted font-normal">
                              ↗
                            </span>
                          </button>
                          <p className="text-xs font-semibold text-accent-text">
                            {b.planTitle}
                          </p>
                        </div>

                        {/* Timestamp */}
                        {b.createdAt && (
                          <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-background/60 px-2.5 py-1 text-[11px] text-muted">
                            <span>🕒</span>
                            <span>
                              Pedido el <strong>{exactTime}</strong>{" "}
                              {relTime && `(${relTime})`}
                            </span>
                          </div>
                        )}

                        {/* Turno Details */}
                        <div className="mt-3 space-y-1.5 text-xs text-muted border-t border-border/60 pt-3">
                          <div className="flex items-center justify-between">
                            <span>
                              📅 <strong>Fecha:</strong> {b.date}
                            </span>
                            <span>
                              ⏰ <strong>{b.time} hs</strong>
                            </span>
                          </div>
                          {b.customerPhone && (
                            <p className="flex items-center gap-1">
                              <span>📱</span>
                              <a
                                href={`tel:${b.customerPhone.replace(/\D/g, "")}`}
                                className="hover:text-foreground underline underline-offset-2"
                              >
                                {b.customerPhone}
                              </a>
                            </p>
                          )}
                          {b.customerNotes && (
                            <div className="rounded-xl bg-background/50 p-2.5 text-xs italic text-foreground/90 border border-border/40">
                              &ldquo;{b.customerNotes}&rdquo;
                            </div>
                          )}
                        </div>

                        {/* Payment Selector */}
                        <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-border/80 bg-background/60 p-2 text-xs">
                          <span className="text-[11px] font-semibold text-muted">
                            Pago:
                          </span>
                          <select
                            value={b.paymentStatus || "pendiente"}
                            onChange={(e) =>
                              handleUpdatePaymentStatus(
                                b.id,
                                e.target.value as PaymentStatus,
                              )
                            }
                            className="rounded-lg border border-border bg-surface px-2 py-1 text-[11px] font-medium text-foreground focus:border-accent focus:outline-none"
                          >
                            <option value="pendiente">💳 Pendiente</option>
                            <option value="seña">💳 Seña Recibida</option>
                            <option value="pagado_transferencia">
                              📱 Transferencia
                            </option>
                            <option value="pagado_efectivo">
                              💵 Efectivo
                            </option>
                            <option value="pagado_mp">
                              💳 Mercado Pago
                            </option>
                          </select>
                        </div>

                        {/* Multi-Session Progress Stepper */}
                        {isMultiSession && (
                          <div className="mt-3 rounded-2xl border border-accent/25 bg-accent/5 p-3 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground">
                                Progreso del Pack:
                              </span>
                              <span className="font-condensed font-bold text-accent-text">
                                {completed} / {total} sesiones
                              </span>
                            </div>

                            {/* Dots visual indicator */}
                            <div className="mt-2 flex items-center gap-1">
                              {Array.from({ length: total }).map((_, idx) => (
                                <div
                                  key={idx}
                                  className={`h-2 flex-1 rounded-full transition-all ${
                                    idx < completed
                                      ? "bg-accent shadow-sm shadow-accent/50"
                                      : "bg-background border border-border"
                                  }`}
                                />
                              ))}
                            </div>

                            {completed < total && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleIncrementSession(b.id, completed, total)
                                }
                                className="btn-shiny mt-2.5 w-full rounded-xl bg-accent py-1.5 font-condensed text-xs font-bold text-accent-foreground hover:opacity-90 transition-opacity"
                              >
                                + Marcar Sesión {completed + 1} Realizada
                              </button>
                            )}
                          </div>
                        )}

                        {/* Instructor Notes */}
                        <div className="mt-3 rounded-2xl border border-border bg-background/70 p-2.5 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-muted text-[10px] uppercase tracking-wider">
                              Notas del Instructor:
                            </span>
                            {editingNoteId !== b.id && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNoteId(b.id);
                                  setTempNoteText(b.internalNotes || "");
                                }}
                                className="text-[10px] text-accent-text hover:underline"
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
                                onChange={(e) => setTempNoteText(e.target.value)}
                                placeholder="Ej: Hernia L4-L5, progresión suave..."
                                className="w-full rounded-xl border border-border bg-surface px-2.5 py-1 text-xs text-foreground focus:border-accent focus:outline-none"
                                autoFocus
                              />
                              <div className="flex justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingNoteId(null)}
                                  className="rounded-lg px-2 py-0.5 text-[10px] text-muted hover:text-foreground"
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveInternalNote(b.id)}
                                  className="rounded-lg bg-accent px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground"
                                >
                                  Guardar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-foreground/80">
                              {b.internalNotes || (
                                <span className="italic text-muted/50">
                                  Sin notas clínicas o técnicas.
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Action Bar */}
                      <div className="mt-4 border-t border-border/60 pt-3 space-y-2">
                        {/* WhatsApp Smart Menu Toggle */}
                        {b.customerPhone && (
                          <div className="relative">
                            <div className="flex items-center gap-1.5">
                              <a
                                href={buildQuickWhatsAppMessage("confirmar", b)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 font-condensed text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-sm"
                              >
                                <span>💬</span>
                                <span>Confirmar WhatsApp</span>
                              </a>

                              <button
                                type="button"
                                onClick={() =>
                                  setActiveWaMenuId(isWaOpen ? null : b.id)
                                }
                                title="Más plantillas de WhatsApp"
                                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/20"
                              >
                                ▾
                              </button>

                              <a
                                href={buildGoogleCalendarUrl(b)}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Agendar en Google Calendar"
                                className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-2.5 py-1.5 text-xs font-bold text-blue-400 hover:bg-blue-500/20"
                              >
                                📅
                              </a>
                            </div>

                            {/* Dropdown with all templates */}
                            {isWaOpen && (
                              <div className="absolute bottom-full left-0 right-0 mb-2 z-20 rounded-2xl border border-border bg-surface-raised p-2 shadow-2xl space-y-1">
                                <div className="px-2 py-1 text-[10px] font-condensed font-bold uppercase tracking-wider text-muted border-b border-border/50">
                                  Plantillas Rápidas de WhatsApp
                                </div>
                                <a
                                  href={buildQuickWhatsAppMessage(
                                    "recordatorio",
                                    b,
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setActiveWaMenuId(null)}
                                  className="block rounded-lg px-2 py-1.5 text-xs text-foreground hover:bg-background transition-colors"
                                >
                                  ⏰ Recordatorio 24h
                                </a>
                                <a
                                  href={buildQuickWhatsAppMessage("pago", b)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setActiveWaMenuId(null)}
                                  className="block rounded-lg px-2 py-1.5 text-xs text-foreground hover:bg-background transition-colors"
                                >
                                  💰 Pedir Datos / Comprobante
                                </a>
                                <a
                                  href={buildQuickWhatsAppMessage(
                                    "ubicacion",
                                    b,
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setActiveWaMenuId(null)}
                                  className="block rounded-lg px-2 py-1.5 text-xs text-foreground hover:bg-background transition-colors"
                                >
                                  📍 Enviar Ubicación & Mapa
                                </a>
                                <a
                                  href={buildQuickWhatsAppMessage(
                                    "seguimiento_post",
                                    b,
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setActiveWaMenuId(null)}
                                  className="block rounded-lg px-2 py-1.5 text-xs text-foreground hover:bg-background transition-colors"
                                >
                                  🌟 Seguimiento Post-Sesión
                                </a>
                                <a
                                  href={buildQuickWhatsAppMessage(
                                    "reagendar",
                                    b,
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setActiveWaMenuId(null)}
                                  className="block rounded-lg px-2 py-1.5 text-xs text-foreground hover:bg-background transition-colors"
                                >
                                  🔄 Coordinar Reagendamiento
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Status selector & Delete */}
                        <div className="flex items-center justify-between gap-2">
                          <select
                            value={b.status}
                            onChange={(e) =>
                              handleUpdateBookingStatus(
                                b.id,
                                e.target.value as Booking["status"],
                              )
                            }
                            className="rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground focus:border-accent focus:outline-none"
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
                            title="Eliminar este registro"
                            className="flex h-6 w-6 items-center justify-center rounded-lg text-muted hover:bg-red-500/20 hover:text-red-400 transition-colors"
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

        {/* ============================================================ */}
        {/* TAB 2: DIRECTORIO DE ALUMNOS (CRM LITE) */}
        {/* ============================================================ */}
        {activeTab === "alumnos" && (
          <div className="mt-6 space-y-6">
            <div>
              <h1 className="font-condensed text-2xl sm:text-3xl font-extrabold text-foreground">
                Directorio CRM de Alumnos
              </h1>
              <p className="text-xs text-muted">
                Historial completo agrupado por persona, fichas técnicas, inversión acumulada y contacto directo.
              </p>
            </div>

            {alumnosList.length === 0 ? (
              <div className="rounded-3xl border border-border bg-surface p-12 text-center text-muted">
                No hay alumnos registrados todavía en el sistema.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-3xl border border-border bg-surface shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-background/60 font-condensed text-xs font-bold uppercase text-muted">
                    <tr>
                      <th className="p-4">Alumno</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4">Teléfono</th>
                      <th className="p-4">Total Turnos</th>
                      <th className="p-4">Inversión LTV</th>
                      <th className="p-4">Última Sesión</th>
                      <th className="p-4">Ficha / Notas</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {alumnosList.map((a, i) => {
                      const isVip = a.totalBookings >= 5 || a.totalSpent >= 200000;
                      const hasActivePack = a.activePacks > 0;

                      return (
                        <tr
                          key={i}
                          className="hover:bg-background/40 transition-colors"
                        >
                          <td className="p-4">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedStudentPhone(a.phone || a.name)
                              }
                              className="font-bold text-foreground hover:text-accent-text transition-colors flex items-center gap-1.5"
                            >
                              <span>{a.name}</span>
                              <span className="text-muted text-[10px]">↗</span>
                            </button>
                          </td>
                          <td className="p-4">
                            {hasActivePack ? (
                              <span className="rounded-full bg-accent/20 border border-accent/40 px-2 py-0.5 font-condensed text-[10px] font-bold text-accent-text">
                                Pack Activo
                              </span>
                            ) : isVip ? (
                              <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 font-condensed text-[10px] font-bold text-amber-400">
                                Alumno Frecuente
                              </span>
                            ) : (
                              <span className="rounded-full bg-surface-raised border border-border px-2 py-0.5 font-condensed text-[10px] font-bold text-muted">
                                Regular
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-muted font-mono">
                            {a.phone || "-"}
                          </td>
                          <td className="p-4 font-condensed font-bold text-accent-text">
                            {a.totalBookings} sesión(es)
                          </td>
                          <td className="p-4 font-bold text-foreground">
                            ${a.totalSpent.toLocaleString("es-AR")}
                          </td>
                          <td className="p-4 text-muted">{a.lastDate}</td>
                          <td className="p-4 text-muted max-w-xs truncate">
                            {a.notes || <span className="opacity-40">-</span>}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedStudentPhone(a.phone || a.name)
                                }
                                className="rounded-full border border-border bg-background px-2.5 py-1 font-condensed text-[11px] font-semibold text-foreground hover:border-accent"
                              >
                                Ver Ficha
                              </button>
                              {a.phone && (
                                <a
                                  href={`https://wa.me/${a.phone.replace(/\D/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-full bg-emerald-600 px-3 py-1 font-condensed text-[11px] font-bold text-white hover:opacity-90 shadow-sm"
                                >
                                  WhatsApp →
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: AGENDA VISUAL & CALENDARIO */}
        {/* ============================================================ */}
        {activeTab === "agenda" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1.2fr]">
            {/* Monthly Calendar View */}
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="font-condensed text-2xl font-bold capitalize">
                    {monthLabel}
                  </h1>
                  <p className="text-xs text-muted">
                    Seleccioná un día para gestionar la línea de tiempo.
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
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background text-sm text-foreground hover:border-accent"
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
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background text-sm text-foreground hover:border-accent"
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

              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                  <span>Día con turnos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-900" />
                  <span>Día bloqueado / Feriado</span>
                </div>
              </div>
            </div>

            {/* Daily Timeline View */}
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <h2 className="font-condensed text-xl font-bold">
                    Línea de Tiempo: {selectedCalendarDate}
                  </h2>
                  <p className="text-xs text-muted">
                    {selectedDateBookings.length} turno(s) agendados para este día.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setManualDate(selectedCalendarDate);
                    setShowManualModal(true);
                  }}
                  className="rounded-full bg-accent px-3.5 py-1.5 font-condensed text-xs font-bold text-accent-foreground hover:opacity-90"
                >
                  + Cargar Turno
                </button>
              </div>

              {/* Slot Timeline List */}
              <div className="mt-5 space-y-3">
                {selectedDateConfigSlots.length === 0 &&
                selectedDateBookings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted">
                    <p>Este día no tiene horarios configurados en el panel.</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("horarios")}
                      className="mt-2 text-accent-text hover:underline"
                    >
                      Ir a Configurar Horarios →
                    </button>
                  </div>
                ) : (
                  // Show all configured slots + any extra bookings
                  Array.from(
                    new Set([
                      ...selectedDateConfigSlots,
                      ...selectedDateBookings.map((b) => b.time),
                    ]),
                  )
                    .sort()
                    .map((slotTime) => {
                      const bookingAtSlot = selectedDateBookings.find(
                        (b) => b.time === slotTime,
                      );

                      if (bookingAtSlot) {
                        return (
                          <div
                            key={slotTime}
                            className="rounded-2xl border border-border bg-background p-4 shadow-sm transition-all hover:border-accent/40"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-condensed text-lg font-black text-accent-text">
                                  {slotTime} hs
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-condensed font-bold uppercase ${
                                    bookingAtSlot.status === "confirmado"
                                      ? "bg-emerald-500/20 text-emerald-400"
                                      : "bg-amber-500/20 text-amber-400"
                                  }`}
                                >
                                  {bookingAtSlot.status}
                                </span>
                              </div>
                              <span className="text-xs font-bold text-muted">
                                {bookingAtSlot.planPrice}
                              </span>
                            </div>

                            <div className="mt-2">
                              <h4 className="font-condensed text-base font-bold text-foreground">
                                {bookingAtSlot.customerName}
                              </h4>
                              <p className="text-xs text-muted">
                                {bookingAtSlot.planTitle}
                              </p>
                            </div>

                            {bookingAtSlot.customerPhone && (
                              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2 text-xs">
                                <span className="text-muted font-mono">
                                  📱 {bookingAtSlot.customerPhone}
                                </span>
                                <div className="flex gap-1.5">
                                  <a
                                    href={buildQuickWhatsAppMessage(
                                      "confirmar",
                                      bookingAtSlot,
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full bg-emerald-600 px-3 py-1 font-condensed font-bold text-white hover:opacity-90"
                                  >
                                    WhatsApp →
                                  </a>
                                  <a
                                    href={buildGoogleCalendarUrl(bookingAtSlot)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full border border-blue-500/40 bg-blue-500/10 px-2.5 py-1 font-condensed font-bold text-blue-400 hover:bg-blue-500/20"
                                  >
                                    📅 Cal
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }

                      // Empty Slot (Available for 1-click booking)
                      return (
                        <div
                          key={slotTime}
                          className="flex items-center justify-between rounded-2xl border border-dashed border-border/70 bg-surface/50 p-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-condensed text-base font-bold text-muted">
                              {slotTime} hs
                            </span>
                            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-condensed text-[10px] font-bold text-emerald-400">
                              Disponible
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleAssignEmptySlot(
                                selectedCalendarDate,
                                slotTime,
                              )
                            }
                            className="rounded-xl border border-border bg-background px-3 py-1 font-condensed text-xs font-bold text-foreground hover:border-accent hover:text-accent-text transition-colors"
                          >
                            + Asignar Alumno
                          </button>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: MÉTRICAS & DEMANDA */}
        {/* ============================================================ */}
        {activeTab === "analiticas" && (
          <div className="mt-6 space-y-6">
            <div>
              <h1 className="font-condensed text-2xl sm:text-3xl font-extrabold text-foreground">
                Métricas, Demanda & Métodos de Pago
              </h1>
              <p className="text-xs text-muted">
                Estadísticas de ocupación para optimizar días de atención y franjas horarias con mayor afluencia.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Distribution by day of week */}
              <div className="rounded-3xl border border-border bg-surface p-6">
                <h3 className="font-condensed text-xl font-bold mb-4">
                  Distribución de Turnos por Día de la Semana
                </h3>
                <div className="space-y-3">
                  {analyticsData.dayNames.map((name, idx) => {
                    const count = analyticsData.dayCounts[idx] || 0;
                    const max = Math.max(...analyticsData.dayCounts, 1);
                    const pct = Math.round((count / max) * 100);

                    return (
                      <div key={name}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-foreground">
                            {name}
                          </span>
                          <span className="text-muted">{count} turno(s)</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-background overflow-hidden border border-border/50">
                          <div
                            className="h-full bg-gradient-to-r from-accent to-accent-glow transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Peak Hours Breakdown */}
              <div className="rounded-3xl border border-border bg-surface p-6">
                <h3 className="font-condensed text-xl font-bold mb-4">
                  Horarios Más Solicitados
                </h3>
                <div className="space-y-2.5">
                  {Object.keys(analyticsData.hourCounts).length === 0 ? (
                    <p className="text-xs text-muted italic">
                      Aún no hay suficientes datos registrados.
                    </p>
                  ) : (
                    Object.entries(analyticsData.hourCounts)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([hour, count]) => (
                        <div
                          key={hour}
                          className="flex items-center justify-between rounded-2xl border border-border bg-background p-3 text-xs"
                        >
                          <span className="font-condensed font-bold text-base text-accent-text">
                            {hour} hs
                          </span>
                          <span className="font-semibold text-foreground">
                            {count} turno(s) reservados
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Payment Methods Breakdown */}
              <div className="rounded-3xl border border-border bg-surface p-6 md:col-span-2">
                <h3 className="font-condensed text-xl font-bold mb-4">
                  Ingresos por Medio de Pago
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <span className="text-xs text-muted">Transferencia</span>
                    <div className="mt-1 font-condensed text-xl font-bold text-emerald-400">
                      $
                      {analyticsData.paymentBreakdown.pagado_transferencia.toLocaleString(
                        "es-AR",
                      )}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <span className="text-xs text-muted">Efectivo</span>
                    <div className="mt-1 font-condensed text-xl font-bold text-emerald-400">
                      $
                      {analyticsData.paymentBreakdown.pagado_efectivo.toLocaleString(
                        "es-AR",
                      )}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <span className="text-xs text-muted">Mercado Pago</span>
                    <div className="mt-1 font-condensed text-xl font-bold text-blue-400">
                      $
                      {analyticsData.paymentBreakdown.pagado_mp.toLocaleString(
                        "es-AR",
                      )}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <span className="text-xs text-muted">Pendiente de Cobro</span>
                    <div className="mt-1 font-condensed text-xl font-bold text-amber-400">
                      $
                      {analyticsData.paymentBreakdown.pendiente.toLocaleString(
                        "es-AR",
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: CONFIGURACIÓN DE HORARIOS & PRECIOS */}
        {/* ============================================================ */}
        {activeTab === "horarios" && (
          <div className="mt-6 space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-condensed text-2xl sm:text-3xl font-extrabold">
                  Configuración de Horarios & Tarifas
                </h1>
                <p className="text-xs text-muted">
                  Ajustá los días habilitados, turnos automáticos en la web y valores de los planes.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopyMondayToWeek}
                  className="rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent-text"
                >
                  Copiar Lunes a Lun-Vie
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="btn-shiny rounded-xl bg-accent px-5 py-2 font-condensed text-xs font-bold text-accent-foreground shadow-md shadow-accent/20 hover:opacity-90"
                >
                  💾 Guardar Cambios
                </button>
              </div>
            </div>

            {/* Presets Rápidos para toda la semana */}
            <div className="rounded-3xl border border-border bg-surface p-5">
              <span className="font-condensed text-xs font-bold uppercase tracking-wider text-muted">
                Plantillas Rápidas para Lunes a Viernes
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {SCHEDULE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPresetToAllWeek(preset.slots)}
                    className="rounded-xl border border-border bg-background px-3.5 py-1.5 text-xs text-foreground hover:border-accent hover:text-accent-text transition-colors"
                  >
                    ⚡ {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor de Precios */}
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="font-condensed text-xl font-bold">
                Tarifas de Planes (Se actualizan en la Landing Page)
              </h2>
              <p className="text-xs text-muted mb-4">
                Modificá el precio para que los clientes vean el valor actualizado en la web.
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-background p-4">
                  <label className="block text-xs font-semibold text-muted">
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
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2 font-condensed text-lg font-bold text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="rounded-2xl border border-border bg-background p-4">
                  <label className="block text-xs font-semibold text-muted">
                    Pack 8 Sesiones
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
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2 font-condensed text-lg font-bold text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="rounded-2xl border border-border bg-background p-4">
                  <label className="block text-xs font-semibold text-muted">
                    Pack 12 Sesiones
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
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2 font-condensed text-lg font-bold text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Días y Horarios Semanales */}
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm space-y-6">
              <h2 className="font-condensed text-xl font-bold">
                Configuración de Días & Franjas Horarias
              </h2>

              <div className="space-y-4">
                {config.days.map((d) => (
                  <div
                    key={d.dayIndex}
                    className={`rounded-2xl border p-4 transition-all ${
                      d.enabled
                        ? "border-border bg-background"
                        : "border-border/40 bg-background/30 opacity-60"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={d.enabled}
                          onChange={() => handleToggleDay(d.dayIndex)}
                          id={`day-${d.dayIndex}`}
                          className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                        />
                        <label
                          htmlFor={`day-${d.dayIndex}`}
                          className="font-condensed text-base font-bold text-foreground cursor-pointer"
                        >
                          {d.dayName}
                        </label>
                        {!d.enabled && (
                          <span className="text-xs text-muted italic">
                            (Día no laborable / Cerrado)
                          </span>
                        )}
                      </div>

                      {d.enabled && (
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={newSlotTime[d.dayIndex] || ""}
                            onChange={(e) =>
                              setNewSlotTime((prev) => ({
                                ...prev,
                                [d.dayIndex]: e.target.value,
                              }))
                            }
                            className="rounded-xl border border-border bg-surface px-2.5 py-1 text-xs text-foreground focus:border-accent focus:outline-none"
                          >
                            <option value="">Agregar horario...</option>
                            {PRESET_TIMES.map((t) => (
                              <option key={t} value={t}>
                                {t} hs
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleAddSlot(d.dayIndex)}
                            className="rounded-xl bg-accent px-3 py-1 font-condensed text-xs font-bold text-accent-foreground hover:opacity-90"
                          >
                            + Agregar
                          </button>
                        </div>
                      )}
                    </div>

                    {d.enabled && (
                      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border/50 pt-3">
                        {d.slots.length === 0 ? (
                          <span className="text-xs text-muted italic">
                            Sin horarios configurados.
                          </span>
                        ) : (
                          d.slots.map((s) => (
                            <span
                              key={s}
                              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-condensed text-xs font-bold text-foreground"
                            >
                              <span>{s} hs</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSlot(d.dayIndex, s)}
                                className="text-muted hover:text-red-400"
                              >
                                &times;
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Días Bloqueados / Feriados */}
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="font-condensed text-xl font-bold">
                Días Bloqueados (Feriados, Vacaciones o Eventos)
              </h2>
              <p className="text-xs text-muted mb-4">
                Las fechas bloqueadas no permitirán reservas en la web.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  value={newBlockedDate}
                  onChange={(e) => setNewBlockedDate(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddBlockedDate}
                  className="rounded-xl bg-red-600 px-4 py-1.5 font-condensed text-xs font-bold text-white hover:opacity-90"
                >
                  + Bloquear Fecha
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {config.blockedDates.length === 0 ? (
                  <span className="text-xs text-muted italic">
                    No hay fechas bloqueadas actualmente.
                  </span>
                ) : (
                  config.blockedDates.map((date) => (
                    <span
                      key={date}
                      className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400"
                    >
                      <span>🔒 {date}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBlockedDate(date)}
                        className="hover:text-white"
                      >
                        &times;
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Sticky Save Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveConfig}
                className="btn-shiny rounded-full bg-accent px-8 py-3 font-condensed text-sm font-bold text-accent-foreground shadow-lg shadow-accent/25 hover:opacity-90"
              >
                💾 Guardar Todos los Cambios
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* MODAL: CARGAR TURNO MANUAL */}
      {/* ============================================================ */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="font-condensed text-xl font-bold">
                  + Cargar Turno Manual
                </h3>
                <p className="text-xs text-muted">
                  Agendá una sesión recibida por WhatsApp o presencial.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="text-muted hover:text-foreground text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateManualBooking} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">
                  Nombre del Alumno *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Marcos Rodríguez"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">
                  Teléfono / WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="Ej: +54 9 299 1234567"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
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
                    <option value="Pack 8 Sesiones">
                      Pack 8 ({planPrices.pack8})
                    </option>
                    <option value="Pack 12 Sesiones">
                      Pack 12 ({planPrices.pack12})
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">
                    Estado de Pago
                  </label>
                  <select
                    value={manualPayment}
                    onChange={(e) =>
                      setManualPayment(e.target.value as PaymentStatus)
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                  >
                    <option value="pendiente">💳 Pendiente</option>
                    <option value="seña">💳 Seña Recibida</option>
                    <option value="pagado_transferencia">
                      📱 Transferencia
                    </option>
                    <option value="pagado_efectivo">💵 Efectivo</option>
                    <option value="pagado_mp">💳 Mercado Pago</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
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
                  Notas / Observaciones
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Primera sesión, dolor lumbar..."
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted hover:text-foreground"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-shiny rounded-full bg-accent px-6 py-2 font-condensed text-xs font-bold text-accent-foreground shadow hover:opacity-90"
                >
                  Guardar Turno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: FICHA DE ALUMNO (CRM LITE) */}
      {/* ============================================================ */}
      {currentSelectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl border border-border bg-surface p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-border/60 pb-3">
              <div>
                <span className="font-condensed text-xs font-bold uppercase tracking-wider text-accent-text">
                  Ficha de Alumno CRM
                </span>
                <h3 className="font-condensed text-2xl font-black text-foreground">
                  {currentSelectedStudent.name}
                </h3>
                {currentSelectedStudent.phone && (
                  <p className="text-xs text-muted font-mono mt-0.5">
                    📱 {currentSelectedStudent.phone}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentPhone(null)}
                className="text-muted hover:text-foreground text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border bg-background p-3 text-center">
                <span className="text-[10px] uppercase tracking-wider text-muted font-bold">
                  Total Turnos
                </span>
                <div className="font-condensed text-xl font-black text-accent-text mt-1">
                  {currentSelectedStudent.totalBookings}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background p-3 text-center">
                <span className="text-[10px] uppercase tracking-wider text-muted font-bold">
                  Inversión LTV
                </span>
                <div className="font-condensed text-xl font-black text-foreground mt-1">
                  ${currentSelectedStudent.totalSpent.toLocaleString("es-AR")}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background p-3 text-center">
                <span className="text-[10px] uppercase tracking-wider text-muted font-bold">
                  Última Visita
                </span>
                <div className="font-condensed text-xs font-bold text-muted mt-2">
                  {currentSelectedStudent.lastDate}
                </div>
              </div>
            </div>

            {/* Clinical & Physical Notes */}
            <div className="rounded-2xl border border-border bg-background p-4 space-y-2">
              <span className="font-condensed text-xs font-bold uppercase tracking-wider text-muted">
                Observaciones & Ficha Médica
              </span>
              <p className="text-xs text-foreground/90 leading-relaxed">
                {currentSelectedStudent.notes || (
                  <span className="italic text-muted">
                    No hay notas registradas para este alumno. Podés agregar notas en cada turno desde el registro.
                  </span>
                )}
              </p>
            </div>

            {/* Booking History */}
            <div>
              <h4 className="font-condensed text-sm font-bold uppercase tracking-wider text-muted mb-2">
                Historial de Sesiones
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {currentSelectedStudent.history.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-background p-2.5 text-xs"
                  >
                    <div>
                      <span className="font-bold text-foreground">
                        {h.date} a las {h.time} hs
                      </span>
                      <p className="text-[11px] text-muted">
                        {h.planTitle} ({h.planPrice})
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-condensed font-bold uppercase ${
                        h.status === "confirmado"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : h.status === "realizado"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <button
                type="button"
                onClick={() => {
                  setManualName(currentSelectedStudent.name);
                  setManualPhone(currentSelectedStudent.phone);
                  setSelectedStudentPhone(null);
                  setShowManualModal(true);
                }}
                className="rounded-full border border-border bg-background px-4 py-1.5 font-condensed text-xs font-bold text-foreground hover:border-accent"
              >
                + Asignar Nuevo Turno
              </button>

              {currentSelectedStudent.phone && (
                <a
                  href={`https://wa.me/${currentSelectedStudent.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-emerald-600 px-4 py-1.5 font-condensed text-xs font-bold text-white hover:opacity-90 shadow-sm"
                >
                  Abrir WhatsApp →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
