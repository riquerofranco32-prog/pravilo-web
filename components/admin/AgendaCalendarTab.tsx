"use client";

import React, { useState, useMemo } from "react";
import { ScheduleConfig, getAvailableSlots } from "@/lib/availability";
import { Booking } from "@/lib/bookings";

interface AgendaCalendarTabProps {
  bookings: Booking[];
  config: ScheduleConfig;
  onOpenManualBookingForDate: (date: string, slot?: string) => void;
  onSelectBooking: (id: string) => void;
}

export function AgendaCalendarTab({
  bookings,
  config,
  onOpenManualBookingForDate,
  onSelectBooking,
}: AgendaCalendarTabProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(
    new Date().toISOString().split("T")[0],
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
  }).format(currentDate);

  // First day of month & total days
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Bookings mapped by date string (YYYY-MM-DD)
  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    bookings.forEach((b) => {
      if (!b.date) return;
      const list = map.get(b.date) || [];
      list.push(b);
      map.set(b.date, list);
    });
    return map;
  }, [bookings]);

  // Selected date details
  const selectedDateObj = new Date(`${selectedDateStr}T12:00:00`);
  const selectedDayBookings = (bookingsByDate.get(selectedDateStr) || []).sort(
    (a, b) => a.time.localeCompare(b.time),
  );
  const isSelectedDateBlocked = (config.blockedDates || []).includes(selectedDateStr);
  const blockedReason = config.blockedDateReasons?.[selectedDateStr];
  const configuredSlots = getAvailableSlots(selectedDateObj, config);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split("T")[0]);
  };

  return (
    <div className="space-y-6">
      {/* Calendar Top Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        <div className="flex items-center gap-3">
          <h3 className="text-base sm:text-lg font-bold capitalize text-white font-serif tracking-wide">
            {monthName}
          </h3>
          <button
            onClick={handleToday}
            className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-white/70 hover:text-white transition-colors"
          >
            Hoy
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white transition-colors"
            title="Mes anterior"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white transition-colors"
            title="Mes siguiente"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid & Day Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Grid (8 cols) */}
        <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] text-white/40 uppercase">
            <span>Dom</span>
            <span>Lun</span>
            <span>Mar</span>
            <span>Mié</span>
            <span>Jue</span>
            <span>Vie</span>
            <span>Sáb</span>
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Empty slots for month padding */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-16 sm:h-20 rounded-xl bg-transparent opacity-10" />
            ))}

            {/* Month Day Cells */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const isSelected = selectedDateStr === dateStr;
              const dayBookings = bookingsByDate.get(dateStr) || [];
              const isBlocked = (config.blockedDates || []).includes(dateStr);
              const isToday = new Date().toISOString().split("T")[0] === dateStr;

              return (
                <button
                  type="button"
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                    isSelected
                      ? "bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/10"
                      : isBlocked
                        ? "bg-rose-500/[0.05] border-rose-500/20 text-rose-300/80 hover:border-rose-500/40"
                        : "bg-white/[0.01] border-white/[0.04] text-white/70 hover:border-white/[0.15] hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isToday
                          ? "w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center"
                          : ""
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayBookings.length > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 font-semibold">
                        {dayBookings.length}
                      </span>
                    )}
                  </div>

                  {isBlocked ? (
                    <span className="text-[9px] font-mono text-rose-400 truncate">
                      Cerrado
                    </span>
                  ) : dayBookings.length > 0 ? (
                    <div className="flex gap-1 overflow-hidden">
                      {dayBookings.slice(0, 3).map((b, i) => (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            b.status === "confirmado"
                              ? "bg-emerald-400"
                              : b.status === "realizado"
                                ? "bg-sky-400"
                                : "bg-amber-400"
                          }`}
                        />
                      ))}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Day Timeline & Details (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Header of selected day */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <h4 className="text-sm font-semibold text-white font-mono">
                  {selectedDateStr}
                </h4>
                <p className="text-xs text-white/50">
                  {isSelectedDateBlocked ? (
                    <span className="text-rose-400">⛔ {blockedReason || "Día Bloqueado / Feriado"}</span>
                  ) : (
                    `${selectedDayBookings.length} turno(s) agendado(s)`
                  )}
                </p>
              </div>

              {!isSelectedDateBlocked && (
                <button
                  onClick={() => onOpenManualBookingForDate(selectedDateStr)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all"
                >
                  + Turno
                </button>
              )}
            </div>

            {/* Slots timeline */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {configuredSlots.length === 0 && !isSelectedDateBlocked && (
                <p className="text-xs text-white/40 italic py-4 text-center">
                  Este día no tiene horarios configurados en la grilla semanal.
                </p>
              )}

              {configuredSlots.map((slot) => {
                const bookingInSlot = selectedDayBookings.find((b) => b.time === slot);

                return (
                  <div
                    key={slot}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      bookingInSlot
                        ? "bg-amber-500/[0.08] border-amber-500/30 shadow"
                        : "bg-white/[0.01] border-white/[0.04] text-white/40 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-400">{slot} hs</span>
                      {bookingInSlot ? (
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-emerald-500/20 text-emerald-300 font-semibold">
                          {bookingInSlot.status}
                        </span>
                      ) : (
                        <button
                          onClick={() => onOpenManualBookingForDate(selectedDateStr, slot)}
                          className="text-[10px] text-white/40 hover:text-amber-300 font-mono"
                        >
                          + Agendar aquí
                        </button>
                      )}
                    </div>

                    {bookingInSlot && (
                      <div className="mt-2 space-y-1">
                        <p className="font-semibold text-white">{bookingInSlot.customerName}</p>
                        <p className="text-white/60 text-[11px]">{bookingInSlot.planTitle}</p>
                        {bookingInSlot.customerPhone && (
                          <p className="text-white/40 font-mono text-[10px]">{bookingInSlot.customerPhone}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
