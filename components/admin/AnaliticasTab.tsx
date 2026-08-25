"use client";

import React, { useState, useMemo } from "react";
import { Booking, parsePriceToNumber } from "@/lib/bookings";
import { FinancialReportPrintModal } from "./FinancialReportPrintModal";

interface AnaliticasTabProps {
  bookings: Booking[];
}

export function AnaliticasTab({ bookings }: AnaliticasTabProps) {
  const [period, setPeriod] = useState<"todo" | "este_mes" | "mes_pasado">("todo");
  const [showReportModal, setShowReportModal] = useState(false);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const currentMonthPrefix = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
  const prevMonthPrefix = `${prevYear}-${String(prevMonth).padStart(2, "0")}`;

  const periodLabel =
    period === "este_mes"
      ? `Este Mes (${currentMonthPrefix})`
      : period === "mes_pasado"
        ? `Mes Pasado (${prevMonthPrefix})`
        : "Histórico Total";

  // Filter bookings by period
  const periodBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (!b.date) return false;
      if (period === "este_mes") return b.date.startsWith(currentMonthPrefix);
      if (period === "mes_pasado") return b.date.startsWith(prevMonthPrefix);
      return true;
    });
  }, [bookings, period, currentMonthPrefix, prevMonthPrefix]);

  // Financial calculations
  const stats = useMemo(() => {
    let totalGross = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let totalDeposits = 0;
    let completedSessions = 0;
    let confirmedCount = 0;
    let cancelledCount = 0;
    const planCounts: Record<string, number> = {};

    periodBookings.forEach((b) => {
      const priceNum = b.totalAmount || parsePriceToNumber(b.planPrice);
      totalGross += priceNum;

      const paid =
        b.amountPaid !== undefined
          ? b.amountPaid
          : b.paymentStatus?.startsWith("pagado")
            ? priceNum
            : 0;

      totalCollected += paid;
      totalPending += Math.max(0, priceNum - paid);

      if (b.paymentStatus === "seña") {
        totalDeposits += paid;
      }

      if (b.status === "realizado") completedSessions++;
      if (b.status === "confirmado") confirmedCount++;
      if (b.status === "cancelado") cancelledCount++;

      const pTitle = b.planTitle || "Individual";
      planCounts[pTitle] = (planCounts[pTitle] || 0) + 1;
    });

    const activeCount = periodBookings.length - cancelledCount;
    const attendanceRate =
      activeCount > 0 ? Math.round((completedSessions / activeCount) * 100) : 100;

    return {
      totalGross,
      totalCollected,
      totalPending,
      totalDeposits,
      completedSessions,
      confirmedCount,
      cancelledCount,
      attendanceRate,
      planCounts,
      totalBookings: periodBookings.length,
    };
  }, [periodBookings]);

  return (
    <div className="space-y-6">
      {/* Period Selector Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface border border-border">
        <div>
          <h3 className="text-xl font-black font-condensed uppercase tracking-tight text-foreground">
            Dashboard Financiero & Rendimiento
          </h3>
          <p className="text-xs text-muted font-sans">Métricas de facturación, cobranzas y retención de alumnos</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowReportModal(true)}
            className="btn-shiny px-4 py-2 rounded-xl bg-accent text-accent-foreground font-condensed font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-accent/20"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Emitir Reporte PDF</span>
          </button>

          <div className="flex items-center gap-1 bg-surface-raised p-1 rounded-xl border border-border">
            {[
              { id: "todo", label: "Histórico Total" },
              { id: "este_mes", label: "Este Mes" },
              { id: "mes_pasado", label: "Mes Pasado" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id as typeof period)}
                className={`px-3 py-1.5 rounded-lg text-xs font-condensed font-bold uppercase tracking-wider transition-all ${
                  period === p.id
                    ? "bg-accent text-accent-foreground shadow"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recaudado Total */}
        <div className="p-5 rounded-2xl bg-surface-raised border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-condensed font-bold uppercase tracking-wider text-emerald-400">
              Total Cobrado
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs">💵</span>
          </div>
          <p className="text-3xl font-black font-mono text-emerald-300">
            ${stats.totalCollected.toLocaleString("es-AR")}
          </p>
          <p className="text-[11px] text-muted font-sans">
            {stats.totalGross > 0
              ? `${Math.round((stats.totalCollected / stats.totalGross) * 100)}% del total facturado`
              : "Sin ingresos en el período"}
          </p>
        </div>

        {/* Saldos a Cobrar */}
        <div className="p-5 rounded-2xl bg-surface-raised border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-condensed font-bold uppercase tracking-wider text-accent-text">
              Saldos a Cobrar
            </span>
            <span className="p-1.5 rounded-lg bg-accent/20 text-accent-text text-xs">⏳</span>
          </div>
          <p className="text-3xl font-black font-mono text-accent-text">
            ${stats.totalPending.toLocaleString("es-AR")}
          </p>
          <p className="text-[11px] text-muted font-sans">
            Pendiente de cobro en estudio
          </p>
        </div>

        {/* Total Facturado */}
        <div className="p-5 rounded-2xl bg-surface-raised border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-condensed font-bold uppercase tracking-wider text-foreground/80">
              Volumen Bruto
            </span>
            <span className="p-1.5 rounded-lg bg-surface text-foreground text-xs">📊</span>
          </div>
          <p className="text-3xl font-black font-mono text-foreground">
            ${stats.totalGross.toLocaleString("es-AR")}
          </p>
          <p className="text-[11px] text-muted font-sans">
            {stats.totalBookings} turnos agendados
          </p>
        </div>

        {/* Tasa de Asistencia */}
        <div className="p-5 rounded-2xl bg-surface-raised border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-condensed font-bold uppercase tracking-wider text-sky-400">
              Tasa de Asistencia
            </span>
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 text-xs">🎯</span>
          </div>
          <p className="text-3xl font-black font-mono text-sky-300">
            {stats.attendanceRate}%
          </p>
          <p className="text-[11px] text-muted font-sans">
            {stats.completedSessions} sesiones realizadas
          </p>
        </div>
      </div>

      {/* Distribution by Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
          <h4 className="text-base font-black font-condensed uppercase tracking-wide text-foreground">
            Distribución de Planes & Packs
          </h4>

          <div className="space-y-3">
            {Object.entries(stats.planCounts).map(([planName, count]) => {
              const pct = stats.totalBookings > 0 ? Math.round((count / stats.totalBookings) * 100) : 0;
              return (
                <div key={planName} className="space-y-1">
                  <div className="flex justify-between text-xs font-condensed">
                    <span className="text-foreground uppercase tracking-wide">{planName}</span>
                    <span className="font-mono text-accent-text font-bold">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-raised overflow-hidden flex">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Turnos Status Summary */}
        <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
          <h4 className="text-base font-black font-condensed uppercase tracking-wide text-foreground">
            Estado de los Turnos
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-surface-raised border border-border">
              <span className="text-[11px] text-emerald-400 block font-condensed uppercase tracking-wider font-bold">Realizados</span>
              <span className="text-2xl font-bold font-mono text-foreground mt-1 block">
                {stats.completedSessions}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-raised border border-border">
              <span className="text-[11px] text-accent-text block font-condensed uppercase tracking-wider font-bold">Confirmados</span>
              <span className="text-2xl font-bold font-mono text-foreground mt-1 block">
                {stats.confirmedCount}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-raised border border-border">
              <span className="text-[11px] text-rose-400 block font-condensed uppercase tracking-wider font-bold">Cancelados</span>
              <span className="text-2xl font-bold font-mono text-foreground mt-1 block">
                {stats.cancelledCount}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-raised border border-border">
              <span className="text-[11px] text-muted block font-condensed uppercase tracking-wider font-bold">Volumen Total Bruto</span>
              <span className="text-base font-bold font-mono text-foreground mt-1 block">
                ${stats.totalGross.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Report Print Modal */}
      <FinancialReportPrintModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        bookings={periodBookings}
        periodLabel={periodLabel}
      />
    </div>
  );
}
