"use client";

import React from "react";
import { Booking, parsePriceToNumber } from "@/lib/bookings";

interface FinancialReportPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  periodLabel: string;
}

export function FinancialReportPrintModal({
  isOpen,
  onClose,
  bookings,
  periodLabel,
}: FinancialReportPrintModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Calculations
  let totalGross = 0;
  let totalCollected = 0;
  let totalPending = 0;
  let totalCash = 0;
  let totalTransfer = 0;
  let totalMP = 0;

  bookings.forEach((b) => {
    const total = b.totalAmount || parsePriceToNumber(b.planPrice);
    totalGross += total;

    const paid =
      b.amountPaid !== undefined
        ? b.amountPaid
        : b.paymentStatus?.startsWith("pagado")
          ? total
          : 0;

    totalCollected += paid;
    totalPending += Math.max(0, total - paid);

    if (b.paymentMethod === "efectivo" || b.paymentStatus === "pagado_efectivo") {
      totalCash += paid;
    } else if (b.paymentMethod === "mercadopago" || b.paymentStatus === "pagado_mp") {
      totalMP += paid;
    } else {
      totalTransfer += paid;
    }
  });

  const completedCount = bookings.filter((b) => b.status === "realizado").length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-[#121316] border border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-2xl text-white print:text-black print:bg-white print:border-none print:shadow-none print:w-full print:max-w-none print:p-6 space-y-6">
        {/* Header Actions (hidden on print) */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] print:hidden">
          <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-bold">
            Reporte Financiero Ejecutivo & Contable
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs flex items-center gap-1.5 shadow transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir / Guardar en PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="space-y-6 print:space-y-4">
          {/* Header Branding */}
          <div className="flex items-center justify-between border-b pb-4 border-white/[0.1] print:border-neutral-300">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white print:text-black">
                PRAVILO <span className="text-amber-400 print:text-amber-600">ARG</span>
              </h1>
              <p className="text-xs text-white/60 print:text-neutral-600">
                Informe de Facturación & Cobranzas • Plottier, Neuquén
              </p>
            </div>
            <div className="text-right text-xs text-white/50 print:text-neutral-500 font-mono">
              <p className="font-bold text-white print:text-black">Período: {periodLabel}</p>
              <p>Fecha de emisión: {new Date().toLocaleDateString("es-AR")}</p>
            </div>
          </div>

          {/* Financial Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] print:bg-neutral-50 print:border-neutral-200 text-xs">
            <div>
              <span className="text-white/40 print:text-neutral-500 block font-mono text-[10px] uppercase">
                Total Facturado Bruto
              </span>
              <span className="font-mono font-bold text-white print:text-black text-sm">
                ${totalGross.toLocaleString("es-AR")}
              </span>
            </div>
            <div>
              <span className="text-emerald-400 print:text-emerald-700 block font-mono text-[10px] uppercase font-bold">
                Total Cobrado
              </span>
              <span className="font-mono font-bold text-emerald-400 print:text-emerald-700 text-sm">
                ${totalCollected.toLocaleString("es-AR")}
              </span>
            </div>
            <div>
              <span className="text-amber-400 print:text-amber-700 block font-mono text-[10px] uppercase font-bold">
                Saldos a Cobrar
              </span>
              <span className="font-mono font-bold text-amber-400 print:text-amber-700 text-sm">
                ${totalPending.toLocaleString("es-AR")}
              </span>
            </div>
            <div>
              <span className="text-white/40 print:text-neutral-500 block font-mono text-[10px] uppercase">
                Turnos / Sesiones
              </span>
              <span className="font-mono text-white print:text-black font-semibold">
                {bookings.length} ({completedCount} realizadas)
              </span>
            </div>
          </div>

          {/* Methods Breakdown */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 print:text-amber-700 font-bold">
              Desglose por Medio de Cobro
            </h3>
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] print:bg-neutral-50 print:border-neutral-200 text-center text-xs">
              <div>
                <span className="text-white/50 print:text-neutral-600 block text-[10px]">Transferencias Bancarias</span>
                <span className="text-sm font-bold font-mono text-white print:text-black">${totalTransfer.toLocaleString("es-AR")}</span>
              </div>
              <div>
                <span className="text-white/50 print:text-neutral-600 block text-[10px]">Efectivo en Estudio</span>
                <span className="text-sm font-bold font-mono text-white print:text-black">${totalCash.toLocaleString("es-AR")}</span>
              </div>
              <div>
                <span className="text-white/50 print:text-neutral-600 block text-[10px]">Mercado Pago</span>
                <span className="text-sm font-bold font-mono text-white print:text-black">${totalMP.toLocaleString("es-AR")}</span>
              </div>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 print:text-amber-700 font-bold">
              Detalle de Registros del Período ({bookings.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.1] print:border-neutral-300 text-white/50 print:text-neutral-600 font-mono text-[10px] uppercase">
                    <th className="py-2 px-2">Fecha / Hora</th>
                    <th className="py-2 px-2">Alumno</th>
                    <th className="py-2 px-2">Plan</th>
                    <th className="py-2 px-2">Total</th>
                    <th className="py-2 px-2">Cobrado</th>
                    <th className="py-2 px-2">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] print:divide-neutral-200">
                  {bookings.map((b) => {
                    const priceNum = b.totalAmount || parsePriceToNumber(b.planPrice);
                    const paid =
                      b.amountPaid !== undefined
                        ? b.amountPaid
                        : b.paymentStatus?.startsWith("pagado")
                          ? priceNum
                          : 0;

                    return (
                      <tr key={b.id} className="text-white/80 print:text-black text-[11px]">
                        <td className="py-2 px-2 font-mono whitespace-nowrap">
                          {b.date} {b.time} hs
                        </td>
                        <td className="py-2 px-2 font-semibold">{b.customerName}</td>
                        <td className="py-2 px-2">{b.planTitle}</td>
                        <td className="py-2 px-2 font-mono">${priceNum.toLocaleString("es-AR")}</td>
                        <td className="py-2 px-2 font-mono font-bold text-emerald-400 print:text-emerald-700">
                          ${paid.toLocaleString("es-AR")}
                        </td>
                        <td className="py-2 px-2 font-mono uppercase text-[10px]">{b.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-8 border-t border-white/[0.1] print:border-neutral-300 flex justify-between items-end text-xs text-white/40 print:text-neutral-500">
            <div>
              <p className="font-mono">PRAVILO ARG • Estudio Biomecánico</p>
              <p className="text-[10px]">Reporte de gestión operativa interna</p>
            </div>
            <div className="text-right border-t border-neutral-400 pt-2 w-48 text-center text-[11px] text-black hidden print:block">
              Firma y Aprobación
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
