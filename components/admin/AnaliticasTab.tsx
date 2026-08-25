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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        <div>
          <h3 className="text-base font-bold text-white">Dashboard Financiero & Rendimiento</h3>
          <p className="text-xs text-white/50">Métricas de facturación, cobranzas y retención de alumnos</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowReportModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-white/90 hover:text-white flex items-center gap-1.5 transition-all shadow"
          >
            <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Emitir Reporte PDF</span>
          </button>

          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
            {[
              { id: "todo", label: "Histórico Total" },
              { id: "este_mes", label: "Este Mes" },
              { id: "mes_pasado", label: "Mes Pasado" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id as typeof period)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  period === p.id
                    ? "bg-amber-500 text-black font-semibold shadow"
                    : "text-white/60 hover:text-white"
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
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/[0.08] to-white/[0.02] border border-emerald-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">
              Total Cobrado
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">💵</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-white">
            ${stats.totalCollected.toLocaleString("es-AR")}
          </p>
          <p className="text-[11px] text-emerald-300/70 font-mono">
            {stats.totalGross > 0
              ? `${Math.round((stats.totalCollected / stats.totalGross) * 100)}% del total facturado`
              : "Sin ingresos en el período"}
          </p>
        </div>

        {/* Saldos a Cobrar */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/[0.08] to-white/[0.02] border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-amber-400 font-semibold">
              Saldos a Cobrar
            </span>
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">⏳</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-300">
            ${stats.totalPending.toLocaleString("es-AR")}
          </p>
          <p className="text-[11px] text-amber-200/70 font-mono">Pendiente de cobro en estudio</p>
        </div>

        {/* Señas Recibidas */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-purple-400 font-semibold">
              Señas Parciales
            </span>
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">🛡️</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-purple-300">
            ${stats.totalDeposits.toLocaleString("es-AR")}
          </p>
          <p className="text-[11px] text-white/40">Señas para asegurar turnos</p>
        </div>

        {/* Asistencia / Realizados */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-sky-400 font-semibold">
              Tasa de Asistencia
            </span>
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">🎯</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-sky-300">
            {stats.attendanceRate}%
          </p>
          <p className="text-[11px] text-white/40">
            {stats.completedSessions} realizadas de {stats.totalBookings} turnos
          </p>
        </div>
      </div>

      {/* Distribution by Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <span>Distribución de Planes & Packs</span>
          </h4>

          <div className="space-y-3">
            {Object.entries(stats.planCounts).map(([planName, count]) => {
              const pct = stats.totalBookings > 0 ? Math.round((count / stats.totalBookings) * 100) : 0;
              return (
                <div key={planName} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/80">{planName}</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.05] overflow-hidden flex">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Turnos Status Summary */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
          <h4 className="text-sm font-semibold text-white">Estado de los Turnos</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[11px] text-emerald-400 block font-mono">Realizados</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                {stats.completedSessions}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[11px] text-amber-400 block font-mono">Confirmados</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                {stats.confirmedCount}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[11px] text-rose-400 block font-mono">Cancelados</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                {stats.cancelledCount}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[11px] text-purple-400 block font-mono">Volumen Total Bruto</span>
              <span className="text-sm font-bold font-mono text-white mt-1 block">
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
