"use client";

import React, { useState } from "react";
import { GiftCard, buildGiftCardShareWhatsAppMessage } from "@/lib/bookings";
import { CopyIcon, GiftIcon, TrashIcon } from "./Icons";

interface GiftCardsTabProps {
  giftCards: GiftCard[];
  onSaveGiftCards: (updatedList: GiftCard[]) => void;
  planPrices: Record<string, string | undefined>;
}

export function GiftCardsTab({
  giftCards,
  onSaveGiftCards,
  planPrices,
}: GiftCardsTabProps) {
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [planTitle, setPlanTitle] = useState("1 Sesión Individual");
  const [customMessage, setCustomMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "todos" | "activo" | "canjeado"
  >("todos");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getPriceForPlan = (plan: string) => {
    if (plan.includes("12")) return planPrices.pack12 || "$300.000";
    if (plan.includes("8")) return planPrices.pack8 || "$240.000";
    return planPrices.individual || "$35.000";
  };

  const handleCreateGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !senderName.trim()) return;

    const randomSuffix = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();
    const code = `PRAVILO-${randomSuffix}`;

    const newCard: GiftCard = {
      id: `gc_${Date.now()}`,
      code,
      recipientName: recipientName.trim(),
      recipientPhone: recipientPhone.trim() || undefined,
      senderName: senderName.trim(),
      senderPhone: senderPhone.trim() || undefined,
      planTitle,
      price: getPriceForPlan(planTitle),
      customMessage: customMessage.trim() || undefined,
      createdAt: new Date().toISOString().split("T")[0],
      status: "activo",
    };

    const updated = [newCard, ...giftCards];
    onSaveGiftCards(updated);

    // Reset form
    setRecipientName("");
    setRecipientPhone("");
    setSenderName("");
    setSenderPhone("");
    setCustomMessage("");
  };

  const handleToggleRedeemed = (id: string) => {
    const updated = giftCards.map((gc) => {
      if (gc.id !== id) return gc;
      const isCurrentlyActive = gc.status === "activo";
      return {
        ...gc,
        status: (isCurrentlyActive
          ? "canjeado"
          : "activo") as GiftCard["status"],
        redeemedAt: isCurrentlyActive
          ? new Date().toISOString().split("T")[0]
          : undefined,
      };
    });
    onSaveGiftCards(updated);
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este registro de Gift Card?")) return;
    onSaveGiftCards(giftCards.filter((gc) => gc.id !== id));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredCards = giftCards.filter((gc) => {
    if (filterStatus !== "todos" && gc.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        gc.code.toLowerCase().includes(q) ||
        gc.recipientName.toLowerCase().includes(q) ||
        gc.senderName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Header & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-border space-y-1">
          <span className="text-xs font-condensed font-bold uppercase tracking-wider text-accent-text">
            Total Emitidas
          </span>
          <p className="text-3xl font-black font-condensed text-foreground">
            {giftCards.length}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-surface border border-border space-y-1">
          <span className="text-xs font-condensed font-bold uppercase tracking-wider text-emerald-400">
            Activas / Por Canjear
          </span>
          <p className="text-3xl font-black font-condensed text-emerald-300">
            {giftCards.filter((g) => g.status === "activo").length}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-surface border border-border space-y-1">
          <span className="text-xs font-condensed font-bold uppercase tracking-wider text-muted">
            Canjeadas en Estudio
          </span>
          <p className="text-3xl font-black font-condensed text-foreground/80">
            {giftCards.filter((g) => g.status === "canjeado").length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Form to Issue New Gift Card (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface border border-border space-y-5">
          <div>
            <h3 className="text-lg font-black font-condensed uppercase text-foreground flex items-center gap-2">
              <GiftIcon className="w-5 h-5 text-accent-text" /> Emitir Nueva
              Gift Card
            </h3>
            <p className="text-xs text-muted mt-1 font-sans">
              Generá un código de voucher oficial para enviar por WhatsApp
            </p>
          </div>

          <form onSubmit={handleCreateGiftCard} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-condensed uppercase tracking-wider text-muted mb-1">
                  Para (Beneficiario) *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Ej. Sofía Rossi"
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-raised border border-border text-xs text-foreground placeholder-muted/40 focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-condensed uppercase tracking-wider text-muted mb-1">
                  Teléfono Beneficiario
                </label>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="+54 9 299..."
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-raised border border-border text-xs text-foreground placeholder-muted/40 focus:border-accent focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-condensed uppercase tracking-wider text-muted mb-1">
                  De parte de *
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Ej. Carlos Rossi"
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-raised border border-border text-xs text-foreground placeholder-muted/40 focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-condensed uppercase tracking-wider text-muted mb-1">
                  Teléfono Remitente
                </label>
                <input
                  type="text"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="+54 9 299..."
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-raised border border-border text-xs text-foreground placeholder-muted/40 focus:border-accent focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-condensed uppercase tracking-wider text-muted mb-1">
                Plan / Experiencia a Regalar
              </label>
              <select
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-raised border border-border text-xs font-condensed font-bold uppercase tracking-wide text-foreground focus:border-accent focus:outline-none"
              >
                <option value="1 Sesión Individual">
                  1 Sesión Individual ({getPriceForPlan("1 Sesión")})
                </option>
                <option value="Pack 8 Sesiones">
                  Pack 8 Sesiones ({getPriceForPlan("Pack 8")})
                </option>
                <option value="Pack 12 Sesiones">
                  Pack 12 Sesiones ({getPriceForPlan("Pack 12")})
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-condensed uppercase tracking-wider text-muted mb-1">
                Dedicatoria Especial (Opcional)
              </label>
              <textarea
                rows={2}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="¡Feliz cumpleaños! Que disfrutes esta sesión de descompresión..."
                className="w-full px-3 py-2.5 rounded-xl bg-surface-raised border border-border text-xs text-foreground placeholder-muted/40 focus:border-accent focus:outline-none font-sans"
              />
            </div>

            <button
              type="submit"
              className="btn-shiny w-full py-3 rounded-xl bg-accent text-accent-foreground font-condensed font-bold uppercase tracking-wider text-xs shadow-lg shadow-accent/25 hover:opacity-95 active:scale-95 transition-all"
            >
              Generar y Guardar Gift Card
            </button>
          </form>
        </div>

        {/* Right: List of Issued Gift Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código, beneficiario o remitente..."
              className="px-3 py-2 rounded-xl bg-surface-raised border border-border text-xs text-foreground placeholder-muted/50 flex-1 focus:border-accent focus:outline-none"
            />
            <div className="flex gap-1 bg-surface-raised p-1 rounded-xl border border-border">
              {["todos", "activo", "canjeado"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st as typeof filterStatus)}
                  className={`px-3 py-1 rounded-lg text-xs font-condensed font-bold uppercase tracking-wider transition-all ${
                    filterStatus === st
                      ? "bg-accent text-accent-foreground shadow"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredCards.length === 0 ? (
              <p className="text-xs text-muted italic text-center py-12">
                No se encontraron Gift Cards con los filtros actuales.
              </p>
            ) : (
              filteredCards.map((gc) => {
                const shareUrl = buildGiftCardShareWhatsAppMessage(gc);

                return (
                  <div
                    key={gc.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      gc.status === "activo"
                        ? "bg-surface-raised border-accent/40"
                        : "bg-surface border-border opacity-70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyCode(gc.code)}
                            className="font-mono text-sm font-bold text-accent-text hover:underline flex items-center gap-1"
                          >
                            {gc.code}
                            <span className="text-[10px] text-muted">
                              {copiedCode === gc.code ? (
                                "✓"
                              ) : (
                                <CopyIcon className="w-3 h-3" />
                              )}
                            </span>
                          </button>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-condensed font-bold ${
                              gc.status === "activo"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            }`}
                          >
                            {gc.status}
                          </span>
                        </div>
                        <p className="text-xs text-foreground mt-1">
                          <span className="text-muted">Para:</span>{" "}
                          <span className="font-semibold text-foreground">
                            {gc.recipientName}
                          </span>{" "}
                          <span className="text-muted">de</span>{" "}
                          <span className="font-semibold text-foreground">
                            {gc.senderName}
                          </span>
                        </p>
                      </div>

                      <span className="font-mono text-xs font-bold text-accent-text">
                        {gc.price}
                      </span>
                    </div>

                    {gc.customMessage && (
                      <p className="text-xs text-muted italic bg-surface p-2 rounded-lg border border-border">
                        &ldquo;{gc.customMessage}&rdquo;
                      </p>
                    )}

                    <div className="pt-2 border-t border-border flex items-center justify-between gap-2 text-xs">
                      <span className="text-[11px] text-muted font-mono">
                        Emitida: {gc.createdAt}
                        {gc.redeemedAt && ` • Canjeada: ${gc.redeemedAt}`}
                      </span>

                      <div className="flex items-center gap-2">
                        {shareUrl && (
                          <a
                            href={shareUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-condensed font-bold uppercase transition-colors"
                          >
                            WhatsApp
                          </a>
                        )}

                        <button
                          onClick={() => handleToggleRedeemed(gc.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-condensed font-bold uppercase transition-colors ${
                            gc.status === "activo"
                              ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                              : "bg-surface-raised text-muted hover:text-foreground"
                          }`}
                        >
                          {gc.status === "activo"
                            ? "Marcar Canjeado"
                            : "Reactivar"}
                        </button>

                        <button
                          onClick={() => handleDelete(gc.id)}
                          className="p-1 text-muted hover:text-rose-400"
                          title="Eliminar"
                          aria-label="Eliminar gift card"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
