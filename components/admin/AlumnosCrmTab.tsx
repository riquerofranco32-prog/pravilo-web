"use client";

import React, { useState, useMemo } from "react";
import {
  Booking,
  StudentClinicalProfile,
  buildReactivationWhatsAppMessage,
  exportStudentsToCSV,
} from "@/lib/bookings";
import { ClinicalProfilePrintModal } from "./ClinicalProfilePrintModal";
import { PainEvolutionChart } from "./PainEvolutionChart";
import { ConsentSignatureModal } from "./ConsentSignatureModal";
import { PenIcon } from "./Icons";

interface AlumnosCrmTabProps {
  bookings: Booking[];
  clinicalProfiles: Record<string, StudentClinicalProfile>;
  onSaveClinicalProfile: (
    phone: string,
    profile: StudentClinicalProfile,
  ) => void;
  selectedStudentPhone: string | null;
  onSelectStudentPhone: (phone: string | null) => void;
  onScheduleBookingForStudent?: (name: string, phone: string) => void;
}

export function AlumnosCrmTab({
  bookings,
  clinicalProfiles,
  onSaveClinicalProfile,
  selectedStudentPhone,
  onSelectStudentPhone,
  onScheduleBookingForStudent,
}: AlumnosCrmTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showNewStudentModal, setShowNewStudentModal] = useState(false);

  // New Student Form State
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");
  const [newStudentCondition, setNewStudentCondition] = useState("");

  // New evolution log state inside active profile
  const [newLogDate, setNewLogDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [newLogPainBefore, setNewLogPainBefore] = useState<number>(6);
  const [newLogPainAfter, setNewLogPainAfter] = useState<number>(3);
  const [newLogTension, setNewLogTension] = useState<
    "Leve" | "Moderada" | "Alta" | "Muy Alta"
  >("Moderada");
  const [newLogNotes, setNewLogNotes] = useState("");

  // Group bookings & profiles by student (normalized phone or name)
  const students = useMemo(() => {
    const map = new Map<
      string,
      {
        phone: string;
        name: string;
        bookings: Booking[];
        lastDate: string;
        totalSpent: number;
        hasActivePack: boolean;
      }
    >();

    // 1. From bookings
    bookings.forEach((b) => {
      const key = (b.customerPhone || b.customerName).trim().toLowerCase();
      if (!key) return;

      const existing = map.get(key) || {
        phone: b.customerPhone || "",
        name: b.customerName,
        bookings: [],
        lastDate: b.date,
        totalSpent: 0,
        hasActivePack: false,
      };

      existing.bookings.push(b);
      if (b.date > existing.lastDate) {
        existing.lastDate = b.date;
      }

      const digits = (b.planPrice || "").replace(/\D/g, "");
      existing.totalSpent += digits ? parseInt(digits, 10) : 0;

      if (
        (b.totalSessions || 1) > 1 &&
        (b.sessionsCompleted || 0) < (b.totalSessions || 1) &&
        b.status !== "cancelado"
      ) {
        existing.hasActivePack = true;
      }

      map.set(key, existing);
    });

    // 2. From clinical profiles that may not have bookings yet
    Object.entries(clinicalProfiles).forEach(([phone, profile]) => {
      const key = phone.trim().toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          phone,
          name:
            profile.studentName ||
            (profile.conditionReason ? `Alumno (${phone})` : phone),
          bookings: [],
          lastDate: new Date().toISOString().split("T")[0],
          totalSpent: 0,
          hasActivePack: false,
        });
      } else if (
        profile.studentName &&
        (!map.get(key)!.name || map.get(key)!.name === phone)
      ) {
        map.get(key)!.name = profile.studentName;
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      b.lastDate.localeCompare(a.lastDate),
    );
  }, [bookings, clinicalProfiles]);

  // Filter students
  const filteredStudents = students.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const profile = s.phone ? clinicalProfiles[s.phone] : null;
    return (
      s.name.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      (profile?.conditionReason || "").toLowerCase().includes(q) ||
      (profile?.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  });

  // Current selected student
  const currentStudent = selectedStudentPhone
    ? students.find((s) => s.phone === selectedStudentPhone)
    : null;

  const currentProfile: StudentClinicalProfile = (selectedStudentPhone &&
    clinicalProfiles[selectedStudentPhone]) || {
    conditionReason: "",
    painLevelInitial: 5,
    painLevelCurrent: 3,
    medicalNotes: "",
    tags: [],
    evolutionLogs: [],
    sessionLogs: [],
  };

  const handleUpdateProfileField = (
    field: keyof StudentClinicalProfile,
    value: any,
  ) => {
    if (!selectedStudentPhone) return;
    const updated = {
      ...currentProfile,
      [field]: value,
    };
    onSaveClinicalProfile(selectedStudentPhone, updated);
  };

  const handleAddEvolutionLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentPhone || !newLogNotes.trim()) return;

    const newLog = {
      date: newLogDate,
      sessionNumber: (currentProfile.evolutionLogs?.length || 0) + 1,
      painBefore: newLogPainBefore,
      painAfter: newLogPainAfter,
      tensionLevel: newLogTension,
      notes: newLogNotes.trim(),
    };

    const updatedLogs = [newLog, ...(currentProfile.evolutionLogs || [])];
    const updatedProfile = {
      ...currentProfile,
      painLevelCurrent: newLogPainAfter,
      evolutionLogs: updatedLogs,
    };

    onSaveClinicalProfile(selectedStudentPhone, updatedProfile);
    setNewLogNotes("");
  };

  const handleCreateNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentPhone.trim()) return;

    const newProfile: StudentClinicalProfile = {
      studentName: newStudentName.trim(),
      conditionReason: newStudentCondition.trim(),
      painLevelInitial: 6,
      painLevelCurrent: 6,
      medicalNotes: "",
      tags: ["Nuevo Alumno"],
      evolutionLogs: [],
      sessionLogs: [],
    };

    onSaveClinicalProfile(newStudentPhone.trim(), newProfile);
    onSelectStudentPhone(newStudentPhone.trim());
    setShowNewStudentModal(false);
    setNewStudentName("");
    setNewStudentPhone("");
    setNewStudentCondition("");
  };

  return (
    <div className="space-y-6">
      {/* Top CRM Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-sm">
          <span className="text-[11px] font-condensed font-bold uppercase tracking-wider text-muted block">
            Total Alumnos Registrados
          </span>
          <span className="text-2xl font-black font-condensed text-foreground mt-1 block">
            {students.length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-sm">
          <span className="text-[11px] font-condensed font-bold uppercase tracking-wider text-purple-400 block">
            Packs Activos
          </span>
          <span className="text-2xl font-black font-condensed text-purple-300 mt-1 block">
            {students.filter((s) => s.hasActivePack).length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-sm">
          <span className="text-[11px] font-condensed font-bold uppercase tracking-wider text-emerald-400 block">
            Fichas Clínicas
          </span>
          <span className="text-2xl font-black font-condensed text-emerald-300 mt-1 block">
            {Object.keys(clinicalProfiles).length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-sm">
          <span className="text-[11px] font-condensed font-bold uppercase tracking-wider text-accent-text block">
            Para Reactivación
          </span>
          <span className="text-2xl font-black font-condensed text-foreground mt-1 block">
            {
              students.filter((s) => !s.hasActivePack && s.bookings.length > 0)
                .length
            }
          </span>
        </div>
      </div>

      {/* Main CRM Layout: List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-3.5 rounded-2xl bg-surface border border-border flex-1 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por alumno, teléfono o patología..."
                className="w-full bg-transparent text-xs text-foreground placeholder-muted/50 focus:outline-none font-sans"
              />
            </div>
            <button
              onClick={() => {
                const mapped = students.map((s) => ({
                  name: s.name,
                  phone: s.phone,
                  lastDate: s.lastDate,
                  plan: s.bookings[0]?.planTitle || "Sin plan",
                  totalSessions: s.bookings[0]?.totalSessions || 1,
                  sessionsCompleted: s.bookings[0]?.sessionsCompleted || 0,
                  profile: clinicalProfiles[s.phone],
                }));
                exportStudentsToCSV(mapped);
              }}
              className="px-3 py-3.5 rounded-2xl bg-surface-raised hover:bg-surface border border-border text-xs font-condensed font-bold uppercase text-emerald-400 flex items-center gap-1 shadow-sm transition-all"
              title="Exportar base de alumnos y fichas a CSV / Excel"
            >
              <svg
                className="w-4 h-4 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="hidden sm:inline">Excel</span>
            </button>
            <button
              onClick={() => setShowNewStudentModal(true)}
              className="btn-shiny px-3.5 py-3.5 rounded-2xl bg-accent text-accent-foreground text-xs font-condensed font-bold uppercase tracking-wider shadow shrink-0"
              title="Crear nueva ficha clínica o alumno"
            >
              + Nuevo
            </button>
          </div>

          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {filteredStudents.length === 0 ? (
              <p className="text-xs text-muted text-center py-8">
                No se encontraron alumnos.
              </p>
            ) : (
              filteredStudents.map((s) => {
                const profile = s.phone ? clinicalProfiles[s.phone] : null;
                const isSelected = selectedStudentPhone === s.phone;

                return (
                  <div
                    key={s.phone || s.name}
                    onClick={() => s.phone && onSelectStudentPhone(s.phone)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-surface-raised border-accent/60 shadow-lg shadow-accent/10"
                        : "bg-surface border-border hover:border-border-highlight hover:bg-surface-raised"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-condensed font-bold uppercase tracking-wide text-foreground flex items-center gap-1.5">
                          {s.name}
                          {s.hasActivePack && (
                            <span
                              className="w-2 h-2 rounded-full bg-accent"
                              title="Pack Activo"
                            />
                          )}
                        </h4>
                        <p className="text-xs text-muted font-mono">
                          {s.phone || "Sin teléfono"}
                        </p>
                      </div>
                      <span className="text-[11px] font-condensed uppercase text-muted">
                        {s.bookings.length} sesion
                        {s.bookings.length !== 1 ? "es" : ""}
                      </span>
                    </div>

                    {profile?.conditionReason && (
                      <p className="mt-2 text-xs text-accent-text truncate font-sans">
                        🩺 {profile.conditionReason}
                      </p>
                    )}

                    {profile?.painLevelCurrent !== undefined && (
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
                        <span className="font-condensed uppercase tracking-wider">
                          Dolor actual:
                        </span>
                        <span className="font-condensed font-bold text-accent-text text-xs">
                          {profile.painLevelCurrent}/10
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Student CRM Detail (7 cols) */}
        <div className="lg:col-span-7">
          {currentStudent ? (
            <div className="p-6 rounded-2xl bg-surface border border-border space-y-6 shadow-sm">
              {/* Detail Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                <div>
                  <h3 className="text-xl font-black font-condensed uppercase text-foreground flex items-center gap-2">
                    {currentStudent.name}
                    {currentStudent.hasActivePack && (
                      <span className="text-[10px] uppercase font-condensed font-bold px-2 py-0.5 rounded bg-accent/20 text-accent-text border border-accent/40">
                        Pack Activo
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-muted font-mono">
                    WhatsApp: {currentStudent.phone} • Última sesión:{" "}
                    {currentStudent.lastDate}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {onScheduleBookingForStudent && (
                    <button
                      onClick={() =>
                        onScheduleBookingForStudent(
                          currentStudent.name,
                          currentStudent.phone,
                        )
                      }
                      className="btn-shiny px-3.5 py-1.5 rounded-xl bg-accent text-accent-foreground text-xs font-condensed font-bold uppercase tracking-wider shadow"
                    >
                      + Agendar Turno
                    </button>
                  )}

                  <button
                    onClick={() => setShowConsentModal(true)}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-condensed font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                      currentProfile.hasSignedConsent
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                        : "bg-surface-raised hover:bg-surface border-border text-foreground hover:border-accent"
                    }`}
                  >
                    <PenIcon className="w-4 h-4" />{" "}
                    {currentProfile.hasSignedConsent
                      ? "Consentimiento Firmado ✓"
                      : "Firmar Consentimiento"}
                  </button>

                  <button
                    onClick={() => setShowPrintModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-surface-raised hover:bg-surface border border-border text-xs font-condensed font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 transition-all"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-accent-text"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    Ficha PDF
                  </button>

                  {currentStudent.phone && (
                    <a
                      href={buildReactivationWhatsAppMessage(
                        currentStudent.name,
                        currentStudent.phone,
                        currentStudent.lastDate,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-condensed font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                    >
                      Reactivar WA
                    </a>
                  )}
                </div>
              </div>

              {/* Motivo de consulta & Diagnóstico */}
              <div className="space-y-2">
                <label className="block text-xs font-condensed uppercase tracking-wider text-accent-text font-bold">
                  Motivo de Consulta / Condición Biomecánica
                </label>
                <input
                  type="text"
                  value={currentProfile.conditionReason || ""}
                  onChange={(e) =>
                    handleUpdateProfileField("conditionReason", e.target.value)
                  }
                  placeholder="Ej. Lumbalgia L5-S1, Hernia discal, Rigidez de cadera..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-xs sm:text-sm text-foreground placeholder-muted/40 focus:border-accent focus:outline-none font-sans"
                />
              </div>

              {/* Escala EVA Dolor (Inicial vs Actual) */}
              <div className="p-4 rounded-xl bg-surface-raised border border-border space-y-4">
                <h4 className="text-xs font-condensed font-bold uppercase tracking-wider text-foreground">
                  Escala de Dolor (EVA 0 a 10)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-condensed">
                      <span className="text-muted">
                        Dolor Inicial (Primera Sesión):
                      </span>
                      <span className="font-bold text-accent-text">
                        {currentProfile.painLevelInitial ?? 5}/10
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={currentProfile.painLevelInitial ?? 5}
                      onChange={(e) =>
                        handleUpdateProfileField(
                          "painLevelInitial",
                          Number(e.target.value),
                        )
                      }
                      className="w-full accent-accent"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-condensed">
                      <span className="text-muted">Dolor Actual:</span>
                      <span className="font-bold text-emerald-400">
                        {currentProfile.painLevelCurrent ?? 3}/10
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={currentProfile.painLevelCurrent ?? 3}
                      onChange={(e) =>
                        handleUpdateProfileField(
                          "painLevelCurrent",
                          Number(e.target.value),
                        )
                      }
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Gráfico de Evolución de Dolor */}
              {currentProfile.evolutionLogs &&
                currentProfile.evolutionLogs.length > 0 && (
                  <div className="p-4 rounded-xl bg-surface-raised border border-border space-y-2">
                    <h4 className="text-xs font-condensed font-bold uppercase tracking-wider text-accent-text">
                      Curva de Evolución del Dolor por Sesión
                    </h4>
                    <PainEvolutionChart
                      evolutionLogs={currentProfile.evolutionLogs}
                      initialPain={currentProfile.painLevelInitial ?? 5}
                      currentPain={currentProfile.painLevelCurrent ?? 3}
                    />
                  </div>
                )}

              {/* Antecedentes Médicos / Cuadro Clínico */}
              <div className="space-y-2">
                <label className="block text-xs font-condensed uppercase tracking-wider text-muted font-bold">
                  Antecedentes Médicos, Cirugías y Precauciones
                </label>
                <textarea
                  rows={3}
                  value={currentProfile.medicalNotes || ""}
                  onChange={(e) =>
                    handleUpdateProfileField("medicalNotes", e.target.value)
                  }
                  placeholder="Ej. Resonancia magnética muestra protusión en L4-L5, sin cirugías previas, no tolera hiperextensión brusca..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-xs text-foreground placeholder-muted/40 focus:border-accent focus:outline-none font-sans"
                />
              </div>

              {/* Registrar Nueva Bitácora de Sesión */}
              <form
                onSubmit={handleAddEvolutionLog}
                className="p-4 rounded-xl bg-surface-raised border border-border space-y-3"
              >
                <h4 className="text-xs font-condensed font-bold uppercase tracking-wider text-foreground">
                  + Registrar Bitácora de Sesión
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-condensed uppercase text-muted mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={newLogDate}
                      onChange={(e) => setNewLogDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-foreground font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-condensed uppercase text-muted mb-1">
                      Dolor Pre ({newLogPainBefore})
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={newLogPainBefore}
                      onChange={(e) =>
                        setNewLogPainBefore(Number(e.target.value))
                      }
                      className="w-full accent-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-condensed uppercase text-muted mb-1">
                      Dolor Post ({newLogPainAfter})
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={newLogPainAfter}
                      onChange={(e) =>
                        setNewLogPainAfter(Number(e.target.value))
                      }
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-condensed uppercase text-muted mb-1">
                      Tensión Fascial
                    </label>
                    <select
                      value={newLogTension}
                      onChange={(e) => setNewLogTension(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-foreground font-condensed uppercase"
                    >
                      <option value="Leve">Leve</option>
                      <option value="Moderada">Moderada</option>
                      <option value="Alta">Alta</option>
                      <option value="Muy Alta">Muy Alta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-condensed uppercase text-muted mb-1">
                    Observaciones / Ejercicios Realizados
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newLogNotes}
                    onChange={(e) => setNewLogNotes(e.target.value)}
                    placeholder="Ej. Buena descompresión lumbar en posición horizontal, reporta alivio de 4 puntos en EVA..."
                    className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-foreground placeholder-muted/40 focus:border-accent focus:outline-none font-sans"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn-shiny px-4 py-2 rounded-xl bg-accent text-accent-foreground font-condensed font-bold uppercase tracking-wider text-xs shadow"
                  >
                    Guardar Bitácora en Ficha
                  </button>
                </div>
              </form>

              {/* Historial de Bitácoras Clínicas */}
              <div className="space-y-3">
                <h4 className="text-xs font-condensed font-bold uppercase tracking-wider text-muted">
                  Historial de Bitácoras Clínicas (
                  {currentProfile.evolutionLogs?.length || 0})
                </h4>

                {currentProfile.evolutionLogs &&
                currentProfile.evolutionLogs.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {currentProfile.evolutionLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-surface-raised border border-border text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-condensed font-bold text-accent-text">
                            Sesión #{log.sessionNumber || idx + 1} • {log.date}
                          </span>
                          <span className="font-mono text-[11px] text-muted">
                            Dolor:{" "}
                            <span className="text-rose-400 font-bold">
                              {log.painBefore}
                            </span>{" "}
                            →{" "}
                            <span className="text-emerald-400 font-bold">
                              {log.painAfter}
                            </span>{" "}
                            (EVA)
                          </span>
                        </div>
                        <p className="text-foreground/90 font-sans">
                          {log.notes}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted italic font-sans">
                    Sin bitácoras de sesión aún. Completá el formulario arriba
                    para agregar la primera.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 p-8 rounded-2xl bg-surface border border-dashed border-border text-muted">
              <svg
                className="w-10 h-10 mx-auto mb-2 text-muted/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <p className="text-sm font-condensed font-bold uppercase text-foreground">
                Seleccioná un alumno de la lista
              </p>
              <p className="text-xs mt-1 font-sans">
                Podrás registrar su evolución de dolor EVA, bitácoras y ficha
                PDF.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Student Modal */}
      {showNewStudentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-surface border border-border rounded-3xl p-6 shadow-2xl text-foreground animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-lg font-black font-condensed uppercase text-foreground">
                + Crear Ficha de Alumno
              </h3>
              <button
                onClick={() => setShowNewStudentModal(false)}
                className="p-1 text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewStudent} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-condensed uppercase tracking-wider text-muted mb-1 font-bold">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Ej. Lucas Fernández"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-condensed uppercase tracking-wider text-muted mb-1 font-bold">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  placeholder="Ej. 2994567890"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-sm text-foreground font-mono focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-condensed uppercase tracking-wider text-muted mb-1 font-bold">
                  Motivo de Consulta / Patología
                </label>
                <input
                  type="text"
                  value={newStudentCondition}
                  onChange={(e) => setNewStudentCondition(e.target.value)}
                  placeholder="Ej. Hernia Discal, Lumbalgia"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewStudentModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-condensed font-bold uppercase text-muted hover:text-foreground"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-shiny px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-condensed font-bold uppercase text-xs shadow"
                >
                  Crear Alumno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print PDF Modal */}
      {currentStudent && (
        <ClinicalProfilePrintModal
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          studentName={currentStudent.name}
          studentPhone={currentStudent.phone}
          profile={currentProfile}
          bookings={currentStudent.bookings}
        />
      )}

      {/* Consent & Digital Signature Modal */}
      {currentStudent && (
        <ConsentSignatureModal
          isOpen={showConsentModal}
          onClose={() => setShowConsentModal(false)}
          studentName={currentStudent.name}
          studentPhone={currentStudent.phone}
          existingSignature={currentProfile.signatureBase64}
          onSaveConsent={(signatureBase64, signatureDate) => {
            const updated = {
              ...currentProfile,
              signatureBase64,
              signatureDate,
              hasSignedConsent: true,
            };
            onSaveClinicalProfile(currentStudent.phone, updated);
          }}
        />
      )}
    </div>
  );
}
