"use client";

import React from "react";
import { BankConfig, Booking, buildQuickWhatsAppMessage, buildReceiptWhatsAppMessage } from "@/lib/bookings";

interface SmartAlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  bankConfig: BankConfig;
  onSelectBooking: (id: string) => void;
  onUpdateStatus: (id: string, status: Booking["status"]) => void;
}

export function SmartAlertsDrawer({
  isOpen,
  onClose,
  bookings,
  bankConfig,
  onSelectBooking,
  onUpdateStatus,
}: SmartAlertsDrawerProps) {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split("T")[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // 1. Turnos de hoy que aún están pendientes de confirmación
  const pendingToday = bookings.filter(
    (b) => b.date === todayStr && b.status === "pendiente",
  );

  // 2. Turnos próximos con pago pendiente o solo seña
  const pendingPayments = bookings.filter(
    (b) =>
      b.date >= todayStr &&
      b.status !== "cancelado" &&
      (b.paymentStatus === "pendiente" || b.paymentStatus === "seña"),
  );

  // 3. Alumnos que completaron su pack y pueden renovar
  const packRenewals = bookings.filter(
    (b) =>
      (b.totalSessions || 1) > 1 &&
      (b.sessionsCompleted || 0) >= (b.totalSessions || 1) &&
      b.status !== "cancelado",
  );

  // 4. Turnos realizados ayer u hoy que ameritan mensaje de seguimiento post-sesión
  const followUps = bookings.filter(
    (b) =>
      (b.date === yesterdayStr || b.date === todayStr) &&
      b.status === "realizado" &&
      b.customerPhone,
  );

  const totalAlerts =
    pendingToday.length +
    pendingPayments.length +
    packRenewals.length +
    followUps.length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111215] border-l border-white/[0.08] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  Alertas Inteligentes
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-amber-500/20 text-amber-300 font-bold">
                    {totalAlerts}
                  </span>
                </h3>
                <p className="text-xs text-white/50">Acciones prioritarias recomendadas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {totalAlerts === 0 ? (
              <div className="text-center py-12 text-white/40 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-white/70">¡Todo al día!</p>
                <p className="text-xs max-w-xs mx-auto">No tenés turnos pendientes ni pagos atrasados urgentes por procesar hoy.</p>
              </div>
            ) : null}

            {/* 1. Turnos de hoy sin confirmar */}
            {pendingToday.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 font-mono">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    Turnos de Hoy Sin Confirmar ({pendingToday.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {pendingToday.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl bg-rose-500/[0.07] border border-rose-500/20 hover:border-rose-500/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-white">{b.customerName}</p>
                          <p className="text-xs text-rose-300/80 font-mono">
                            Hoy a las {b.time} hs • {b.planTitle}
                          </p>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                          Pendiente
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        {b.customerPhone && (
                          <a
                            href={buildQuickWhatsAppMessage("confirmar", b, bankConfig)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center py-1.5 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/10"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                            </svg>
                            Confirmar por WhatsApp
                          </a>
                        )}
                        <button
                          onClick={() => onUpdateStatus(b.id, "confirmado")}
                          className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs text-white/80 transition-colors"
                        >
                          Marcar Listo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Cobros o Señas Pendientes */}
            {pendingPayments.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Pagos / Señas Pendientes ({pendingPayments.length})
                </h4>
                <div className="space-y-2">
                  {pendingPayments.slice(0, 5).map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl bg-amber-500/[0.05] border border-amber-500/20 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{b.customerName}</p>
                        <p className="text-xs text-amber-200/70 font-mono">
                          {b.date} • {b.planPrice}
                        </p>
                      </div>
                      {b.customerPhone && (
                        <a
                          href={buildReceiptWhatsAppMessage(b, bankConfig)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium border border-amber-500/30 transition-all shrink-0"
                          title="Enviar datos de pago"
                        >
                          Cobrar WA
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Renovación de Packs */}
            {packRenewals.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Alumnos para Renovación ({packRenewals.length})
                </h4>
                <div className="space-y-2">
                  {packRenewals.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl bg-purple-500/[0.05] border border-purple-500/20 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{b.customerName}</p>
                        <p className="text-xs text-purple-300/70">
                          {b.sessionsCompleted}/{b.totalSessions} sesiones completadas
                        </p>
                      </div>
                      {b.customerPhone && (
                        <a
                          href={buildQuickWhatsAppMessage("renovacion", b, bankConfig)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-medium border border-purple-500/30 transition-all shrink-0"
                        >
                          Ofrecer Pack
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Seguimiento Post-Sesión */}
            {followUps.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  Seguimiento Post-Sesión ({followUps.length})
                </h4>
                <div className="space-y-2">
                  {followUps.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl bg-sky-500/[0.05] border border-sky-500/20 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{b.customerName}</p>
                        <p className="text-xs text-sky-300/70">Sesión realizada ({b.date})</p>
                      </div>
                      <a
                        href={buildQuickWhatsAppMessage("seguimiento_post", b, bankConfig)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-medium border border-sky-500/30 transition-all shrink-0"
                      >
                        ¿Cómo amaneció?
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
