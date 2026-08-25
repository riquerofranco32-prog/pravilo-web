"use client";

import React from "react";
import { Booking, StudentClinicalProfile } from "@/lib/bookings";

interface ClinicalProfilePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentPhone: string;
  profile: StudentClinicalProfile;
  bookings: Booking[];
}

export function ClinicalProfilePrintModal({
  isOpen,
  onClose,
  studentName,
  studentPhone,
  profile,
  bookings,
}: ClinicalProfilePrintModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalSessions = bookings.length;
  const initialPain = profile.painLevelInitial ?? 5;
  const currentPain = profile.painLevelCurrent ?? 3;
  const painDelta = initialPain - currentPain;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md print:p-0 print:bg-white print:static">
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#121316] border border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-2xl text-white print:text-black print:bg-white print:border-none print:shadow-none print:w-full print:max-w-none print:p-6">
        {/* Header Actions (hidden on print) */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider text-amber-400">
              Vista de Impresión / Historia Biomecánica
            </span>
          </div>
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
        <div className="mt-6 space-y-6 print:m-0 print:space-y-4">
          {/* Header Branding */}
          <div className="flex items-center justify-between border-b pb-4 border-white/[0.1] print:border-neutral-300">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white print:text-black">
                PRAVILO <span className="text-amber-400 print:text-amber-600">ARG</span>
              </h1>
              <p className="text-xs text-white/60 print:text-neutral-600">
                Ficha Técnica Biomecánica & Seguimiento Fascial • Plottier, Neuquén
              </p>
            </div>
            <div className="text-right text-xs text-white/50 print:text-neutral-500 font-mono">
              <p>Fecha de emisión: {new Date().toLocaleDateString("es-AR")}</p>
              <p>Registro ID: {studentPhone || "S/N"}</p>
            </div>
          </div>

          {/* Student Info Box */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] print:bg-neutral-50 print:border-neutral-200 text-xs">
            <div>
              <span className="text-white/40 print:text-neutral-500 block font-mono text-[10px] uppercase">
                Nombre del Alumno
              </span>
              <span className="font-semibold text-white print:text-black text-sm">{studentName}</span>
            </div>
            <div>
              <span className="text-white/40 print:text-neutral-500 block font-mono text-[10px] uppercase">
                Teléfono / Contacto
              </span>
              <span className="font-mono text-white print:text-black">{studentPhone || "No registrado"}</span>
            </div>
            <div>
              <span className="text-white/40 print:text-neutral-500 block font-mono text-[10px] uppercase">
                Total Sesiones
              </span>
              <span className="font-mono text-white print:text-black font-semibold">{totalSessions} sesiones</span>
            </div>
          </div>

          {/* Clinical Profile Details */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-amber-400 print:text-amber-700 font-bold">
              1. Motivo de Consulta & Diagnóstico Inicial
            </h2>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] print:bg-neutral-50 print:border-neutral-200 text-xs space-y-2">
              <p className="text-white/90 print:text-black">
                {profile.conditionReason || "No se ha especificado un motivo específico de consulta."}
              </p>
              {profile.medicalNotes && (
                <div className="pt-2 border-t border-white/[0.04] print:border-neutral-200">
                  <span className="text-[10px] font-mono text-white/50 print:text-neutral-600 uppercase block">
                    Observaciones Médicas / Contraindicaciones:
                  </span>
                  <p className="text-white/70 print:text-neutral-800 italic">{profile.medicalNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Pain Scale (EVA) Comparison */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-amber-400 print:text-amber-700 font-bold">
              2. Evolución del Dolor (Escala EVA 0 a 10)
            </h2>
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] print:bg-neutral-50 print:border-neutral-200 text-center text-xs">
              <div className="p-2 rounded-lg bg-black/20 print:bg-white border print:border-neutral-200">
                <span className="text-white/50 print:text-neutral-600 block text-[10px]">Dolor Inicial</span>
                <span className="text-lg font-bold text-rose-400 print:text-rose-700 font-mono">{initialPain}/10</span>
              </div>
              <div className="p-2 rounded-lg bg-black/20 print:bg-white border print:border-neutral-200">
                <span className="text-white/50 print:text-neutral-600 block text-[10px]">Dolor Actual</span>
                <span className="text-lg font-bold text-emerald-400 print:text-emerald-700 font-mono">{currentPain}/10</span>
              </div>
              <div className="p-2 rounded-lg bg-black/20 print:bg-white border print:border-neutral-200">
                <span className="text-white/50 print:text-neutral-600 block text-[10px]">Alivio / Reducción</span>
                <span className="text-lg font-bold text-amber-400 print:text-amber-700 font-mono">
                  {painDelta > 0 ? `-${painDelta} pts (${Math.round((painDelta / initialPain) * 100)}%)` : "Estable"}
                </span>
              </div>
            </div>
          </div>

          {/* Session Evolution Logs */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-amber-400 print:text-amber-700 font-bold">
              3. Bitácora de Sesiones & Progresión Biomecánica
            </h2>
            {profile.evolutionLogs && profile.evolutionLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.1] print:border-neutral-300 text-white/50 print:text-neutral-600 font-mono text-[10px] uppercase">
                      <th className="py-2 px-2">Sesión / Fecha</th>
                      <th className="py-2 px-2">Dolor Antes → Después</th>
                      <th className="py-2 px-2">Nivel de Tensión</th>
                      <th className="py-2 px-2">Observaciones de la Sesión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] print:divide-neutral-200">
                    {profile.evolutionLogs.map((log, idx) => (
                      <tr key={idx} className="text-white/80 print:text-black">
                        <td className="py-2.5 px-2 font-mono whitespace-nowrap">
                          #{log.sessionNumber || idx + 1} • {log.date}
                        </td>
                        <td className="py-2.5 px-2 font-mono">
                          <span className="text-rose-400 print:text-rose-700 font-semibold">{log.painBefore}/10</span>
                          <span className="mx-1 text-white/40">→</span>
                          <span className="text-emerald-400 print:text-emerald-700 font-semibold">{log.painAfter}/10</span>
                        </td>
                        <td className="py-2.5 px-2">
                          <span className="px-1.5 py-0.5 rounded bg-white/[0.06] print:bg-neutral-200 text-[10px]">
                            {log.tensionLevel || "Moderada"}
                          </span>
                        </td>
                        <td className="py-2.5 px-2">{log.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : profile.sessionLogs && profile.sessionLogs.length > 0 ? (
              <div className="space-y-2">
                {profile.sessionLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] print:bg-neutral-50 print:border-neutral-200 text-xs flex justify-between gap-4"
                  >
                    <div>
                      <span className="font-mono text-amber-400 print:text-amber-700 font-semibold">{log.date}:</span>{" "}
                      <span className="text-white/80 print:text-black">{log.note}</span>
                    </div>
                    {log.tensionLevel && (
                      <span className="text-[10px] text-white/50 print:text-neutral-500 font-mono shrink-0">
                        {log.tensionLevel}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/40 print:text-neutral-500 italic">
                Aún no se han registrado bitácoras de evolución clínica para este alumno.
              </p>
            )}
          </div>

          {/* Footer Signature */}
          <div className="pt-8 border-t border-white/[0.1] print:border-neutral-300 flex justify-between items-end text-xs text-white/40 print:text-neutral-500">
            <div>
              <p className="font-mono">PRAVILO ARG • Estudio Biomecánico</p>
              <p className="text-[10px]">Documento confidencial para seguimiento biomecánico</p>
            </div>
            <div className="text-right border-t border-neutral-400 pt-2 w-48 text-center text-[11px] text-black hidden print:block">
              Firma del Instructor / Especialista
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
