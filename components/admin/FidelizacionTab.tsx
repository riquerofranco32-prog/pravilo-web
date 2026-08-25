"use client";

import React, { useState, useMemo } from "react";
import { Booking, buildGoogleReviewWhatsAppMessage } from "@/lib/bookings";

interface FidelizacionTabProps {
  bookings: Booking[];
}

export function FidelizacionTab({ bookings }: FidelizacionTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const googleMapsReviewUrl = "https://maps.app.goo.gl/uL3Uqg6G1vYmQoVn6";

  // Group unique students who completed at least 1 session
  const completedStudents = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        phone: string;
        completedCount: number;
        lastDate: string;
        plan: string;
      }
    >();

    bookings.forEach((b) => {
      if (b.status !== "realizado" || !b.customerPhone) return;
      const key = b.customerPhone.trim();
      const existing = map.get(key) || {
        name: b.customerName,
        phone: b.customerPhone,
        completedCount: 0,
        lastDate: b.date,
        plan: b.planTitle,
      };

      existing.completedCount += 1;
      if (b.date > existing.lastDate) {
        existing.lastDate = b.date;
        existing.plan = b.planTitle;
      }
      map.set(key, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.lastDate.localeCompare(a.lastDate));
  }, [bookings]);

  const filteredStudents = completedStudents.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.phone.includes(q);
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(googleMapsReviewUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Google Review Booster */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/[0.12] via-emerald-500/[0.08] to-white/[0.02] border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-lg">⭐⭐⭐⭐⭐</span>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                Módulo de Reseñas de Google Maps
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
              Multiplicá la reputación y confianza de PRAVILO ARG
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Solicitá reseñas de 5 estrellas a tus alumnos tras completar sus sesiones o packs. Los testimonios verificados aumentan las reservas orgánicas en Neuquén y Plottier.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href={googleMapsReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-lg hover:bg-white/90 transition-all"
            >
              <span>Ver Perfil de Google Maps ↗</span>
            </a>
            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.1] text-xs font-mono text-white flex items-center justify-center gap-2 transition-all"
            >
              {copiedLink ? "✓ Link Copiado" : "📋 Copiar Link de Reseña"}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
          <span className="text-xs font-mono uppercase text-white/50">Alumnos con Sesiones Realizadas</span>
          <p className="text-2xl font-bold font-mono text-white">{completedStudents.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
          <span className="text-xs font-mono uppercase text-emerald-400">Total Sesiones Completadas</span>
          <p className="text-2xl font-bold font-mono text-emerald-300">
            {completedStudents.reduce((acc, s) => acc + s.completedCount, 0)}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
          <span className="text-xs font-mono uppercase text-amber-400">Objetivo de Reseñas</span>
          <p className="text-2xl font-bold font-mono text-amber-300">5.0 ★ Top Neuquén</p>
        </div>
      </div>

      {/* Student List for Review Request */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-white">Alumnos Listos para Solicitar Reseña</h4>
            <p className="text-xs text-white/50">Enviá una solicitud cordial por WhatsApp con link directo a tu perfil de Google</p>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar alumno o teléfono..."
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-white/30 focus:border-amber-500 focus:outline-none w-full sm:w-64"
          />
        </div>

        <div className="space-y-2.5 pt-2">
          {filteredStudents.length === 0 ? (
            <p className="text-xs text-white/40 italic text-center py-8">
              Aún no hay alumnos con sesiones marcadas como &ldquo;realizadas&rdquo;.
            </p>
          ) : (
            filteredStudents.map((s) => {
              const waUrl = buildGoogleReviewWhatsAppMessage(s.name, s.phone);

              return (
                <div
                  key={s.phone}
                  className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{s.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 font-bold">
                        {s.completedCount} sesión{s.completedCount !== 1 ? "es" : ""}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 font-mono">
                      {s.phone} • Última sesión: {s.lastDate} ({s.plan})
                    </p>
                  </div>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-semibold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                    </svg>
                    Pedir Reseña por WhatsApp
                  </a>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
