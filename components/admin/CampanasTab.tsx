"use client";

import React, { useState, useMemo } from "react";
import { Booking } from "@/lib/bookings";

interface CampanasTabProps {
  bookings: Booking[];
}

type CampaignSegment = "inactivos" | "renovacion" | "nuevos" | "todos";

interface MessageTemplate {
  id: string;
  title: string;
  content: string;
}

const TEMPLATES: MessageTemplate[] = [
  {
    id: "reactivacion",
    title: "🔥 Reactivación de Alumno Inactivo",
    content:
      "¡Hola {nombre}! 👋 Te escribo desde PRAVILO ARG. Notamos que hace unas semanas no realizás tu sesión de descompresión fascial. Queríamos saber cómo viene respondiendo tu espalda y contarte que abrimos nuevos horarios para esta semana. ¿Te gustaría reservar tu sesión? 🧘‍♂️",
  },
  {
    id: "renovacion",
    title: "⭐ Renovación de Pack con Beneficio",
    content:
      "¡Hola {nombre}! 🚀 Felicitaciones por completar tu plan en PRAVILO ARG. Para consolidar la corrección postural y mantener la descompresión de tu columna, tenemos disponible el Pack de 8 sesiones con beneficio exclusivo. ¿Querés que te reservemos tus días fijos?",
  },
  {
    id: "seguimiento",
    title: "🩺 Chequeo de Estado Post-Sesión",
    content:
      "¡Hola {nombre}! ¿Cómo amaneció tu cuerpo y tu movilidad luego de la sesión en PRAVILO ARG? Recordá hidratarte bien para favorecer la rehidratación de los discos intervertebrales. Cualquier molestia nos podés consultar por acá.",
  },
  {
    id: "promo_mes",
    title: "🎁 Invitá a un Amigo / Gift Card",
    content:
      "¡Hola {nombre}! En PRAVILO ARG lanzamos el programa de Gift Cards y vouchers para regalar una experiencia única de descompresión física a quien más quieras. Si te interesa regalar una sesión individual con dedicatoria personalizada, avísanos.",
  },
];

export function CampanasTab({ bookings }: CampanasTabProps) {
  const [selectedSegment, setSelectedSegment] = useState<CampaignSegment>("inactivos");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("reactivacion");
  const [customText, setCustomText] = useState<string>(TEMPLATES[0].content);
  const [searchQuery, setSearchQuery] = useState("");
  const [sentPhones, setSentPhones] = useState<Set<string>>(new Set());

  // Group unique students
  const uniqueStudents = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        phone: string;
        lastDate: string;
        plan: string;
        totalSessions: number;
        sessionsCompleted: number;
        completedSessionsCount: number;
      }
    >();

    bookings.forEach((b) => {
      if (!b.customerPhone) return;
      const phone = b.customerPhone.trim();
      const existing = map.get(phone) || {
        name: b.customerName,
        phone,
        lastDate: b.date,
        plan: b.planTitle,
        totalSessions: b.totalSessions || 1,
        sessionsCompleted: b.sessionsCompleted || 0,
        completedSessionsCount: 0,
      };

      if (b.status === "realizado") {
        existing.completedSessionsCount += 1;
      }
      if (b.date > existing.lastDate) {
        existing.lastDate = b.date;
        existing.plan = b.planTitle;
        existing.totalSessions = b.totalSessions || 1;
        existing.sessionsCompleted = b.sessionsCompleted || 0;
      }

      map.set(phone, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.lastDate.localeCompare(a.lastDate));
  }, [bookings]);

  const today = new Date();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];

  // Filter students based on segment
  const segmentedStudents = useMemo(() => {
    return uniqueStudents.filter((s) => {
      if (selectedSegment === "inactivos") {
        return s.lastDate < thirtyDaysAgo;
      }
      if (selectedSegment === "renovacion") {
        return s.totalSessions > 1 && s.sessionsCompleted >= s.totalSessions;
      }
      if (selectedSegment === "nuevos") {
        return s.completedSessionsCount <= 1;
      }
      return true;
    });
  }, [uniqueStudents, selectedSegment, thirtyDaysAgo]);

  const filteredStudents = segmentedStudents.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.phone.includes(q);
  });

  const handleSelectTemplate = (tpl: MessageTemplate) => {
    setSelectedTemplateId(tpl.id);
    setCustomText(tpl.content);
  };

  const buildWhatsAppLink = (studentName: string, studentPhone: string, lastDate: string, plan: string) => {
    let text = customText
      .replace(/{nombre}/g, studentName.split(" ")[0])
      .replace(/{fecha}/g, lastDate)
      .replace(/{plan}/g, plan);

    const cleanPhone = studentPhone.replace(/\D/g, "");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const handleMarkSent = (phone: string) => {
    setSentPhones((prev) => new Set(prev).add(phone));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-accent/40 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-condensed font-bold uppercase tracking-wider text-accent-text">
                Módulo de Marketing & Broadcast
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-condensed uppercase tracking-tight text-foreground">
              Campañas de Reactivación & Fidelización WhatsApp
            </h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans">
              Contactá de forma personalizada a tus alumnos inactivos, ofrecé renovaciones de packs o enviá mensajes de seguimiento sin riesgo de bloqueos.
            </p>
          </div>

          <div className="flex gap-2 bg-surface-raised p-2 rounded-2xl border border-border">
            <div className="text-center px-4 py-2">
              <span className="text-[10px] font-condensed uppercase tracking-wider text-muted block">Total Base</span>
              <span className="text-2xl font-black font-condensed text-foreground">{uniqueStudents.length}</span>
            </div>
            <div className="text-center px-4 py-2 border-l border-border">
              <span className="text-[10px] font-condensed uppercase tracking-wider text-accent-text block">Inactivos +30d</span>
              <span className="text-2xl font-black font-condensed text-accent-text">
                {uniqueStudents.filter((s) => s.lastDate < thirtyDaysAgo).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Template Config (5 cols) & Audience (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Template Editor (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface border border-border space-y-5">
          <div>
            <h4 className="text-base font-black font-condensed uppercase text-foreground">
              1. Seleccionar Plantilla de Mensaje
            </h4>
            <p className="text-xs text-muted font-sans mt-0.5">
              Elegí un mensaje predeterminado o redactá tu propio texto con variables dinámicas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className={`p-3 rounded-xl border text-left text-xs font-condensed font-bold uppercase tracking-wider transition-all ${
                  selectedTemplateId === tpl.id
                    ? "bg-surface-raised border-accent text-accent-text shadow-md shadow-accent/15"
                    : "bg-surface-raised/40 border-border text-muted hover:text-foreground hover:border-border-highlight"
                }`}
              >
                {tpl.title}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-condensed font-bold uppercase tracking-wider text-accent-text">
                Texto del Mensaje
              </label>
              <div className="flex gap-1 text-[10px] font-mono text-muted">
                <span className="bg-surface-raised px-1.5 py-0.5 rounded border border-border">{`{nombre}`}</span>
                <span className="bg-surface-raised px-1.5 py-0.5 rounded border border-border">{`{fecha}`}</span>
                <span className="bg-surface-raised px-1.5 py-0.5 rounded border border-border">{`{plan}`}</span>
              </div>
            </div>
            <textarea
              rows={6}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-surface-raised border border-border text-xs text-foreground placeholder-muted/40 focus:border-accent focus:outline-none font-sans leading-relaxed"
            />
          </div>

          {/* Preview Box */}
          <div className="p-4 rounded-xl bg-surface-raised border border-dashed border-border space-y-1.5">
            <span className="text-[10px] font-condensed uppercase tracking-wider text-muted block">
              Vista Previa (Ejemplo: Lucas):
            </span>
            <p className="text-xs text-foreground/90 italic font-sans">
              &ldquo;
              {customText
                .replace(/{nombre}/g, "Lucas")
                .replace(/{fecha}/g, today.toLocaleDateString("es-AR"))
                .replace(/{plan}/g, "Pack 8 Sesiones")}
              &rdquo;
            </p>
          </div>
        </div>

        {/* Right Column: Audience Segment & Dispatch List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Segment Selector & Search */}
          <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5 bg-surface-raised p-1 rounded-xl border border-border">
                {[
                  { id: "inactivos", label: "Inactivos (+30d)" },
                  { id: "renovacion", label: "Packs por Renovar" },
                  { id: "nuevos", label: "Nuevos (1 Sesión)" },
                  { id: "todos", label: "Todos" },
                ].map((seg) => (
                  <button
                    key={seg.id}
                    onClick={() => setSelectedSegment(seg.id as CampaignSegment)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-condensed font-bold uppercase tracking-wider transition-all ${
                      selectedSegment === seg.id
                        ? "bg-accent text-accent-foreground shadow"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {seg.label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar alumno..."
                className="px-3 py-1.5 rounded-xl bg-surface-raised border border-border text-xs text-foreground placeholder-muted/50 focus:border-accent focus:outline-none w-full sm:w-48 font-sans"
              />
            </div>
          </div>

          {/* Student List with 1-Click WhatsApp Button */}
          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredStudents.length === 0 ? (
              <p className="text-xs text-muted italic text-center py-12">
                No hay alumnos en el segmento seleccionado.
              </p>
            ) : (
              filteredStudents.map((s) => {
                const isSent = sentPhones.has(s.phone);
                const waUrl = buildWhatsAppLink(s.name, s.phone, s.lastDate, s.plan);

                return (
                  <div
                    key={s.phone}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSent
                        ? "bg-surface-raised/40 border-border opacity-70"
                        : "bg-surface border-border hover:border-accent/40"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-condensed font-bold uppercase text-foreground">{s.name}</h5>
                        {isSent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-condensed font-bold uppercase bg-emerald-500/20 text-emerald-300">
                            ✓ Enviado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted font-mono">{s.phone}</p>
                      <p className="text-[11px] text-muted font-sans">
                        Última sesión: <span className="text-foreground font-mono">{s.lastDate}</span> • {s.plan}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleMarkSent(s.phone)}
                        className="btn-shiny px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-condensed font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                        </svg>
                        <span>Enviar WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
