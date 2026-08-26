"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { GalleryImageItem, DEFAULT_GALLERY_IMAGES } from "@/lib/gallery";

interface GaleriaTabProps {
  galleryImages: GalleryImageItem[];
  onSaveGallery: (images: GalleryImageItem[]) => Promise<boolean> | boolean;
  pin: string;
}

export function GaleriaTab({
  galleryImages,
  onSaveGallery,
  pin,
}: GaleriaTabProps) {
  const [images, setImages] = useState<GalleryImageItem[]>(() =>
    galleryImages && galleryImages.length > 0 ? galleryImages : DEFAULT_GALLERY_IMAGES,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);

  // Form State for new / edit image
  const [formSrc, setFormSrc] = useState("");
  const [formAlt, setFormAlt] = useState("");
  const [formPriority, setFormPriority] = useState(false);
  const [formVisible, setFormVisible] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const visibleCount = images.filter((img) => img.visible !== false).length;
  const priorityCount = images.filter((img) => img.priority && img.visible !== false).length;

  const handleSave = async (updatedList = images) => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const ok = await onSaveGallery(updatedList);
      if (ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisible = (id: string) => {
    const updated = images.map((img) =>
      img.id === id ? { ...img, visible: img.visible === false ? true : false } : img,
    );
    setImages(updated);
    handleSave(updated);
  };

  const handleTogglePriority = (id: string) => {
    const updated = images.map((img) =>
      img.id === id ? { ...img, priority: !img.priority } : img,
    );
    setImages(updated);
    handleSave(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setImages(updated);
    handleSave(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setImages(updated);
    handleSave(updated);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("¿Seguro que querés eliminar esta foto de la galería?")) return;
    const updated = images.filter((img) => img.id !== id);
    setImages(updated);
    handleSave(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor seleccioná un archivo de imagen válido (JPG, PNG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      setFormSrc(dataUrl);
      if (!formAlt) {
        setFormAlt(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSrc.trim()) {
      alert("Por favor cargá una imagen o ingresá una URL / ruta.");
      return;
    }

    const newImage: GalleryImageItem = {
      id: `gal-${Date.now()}`,
      src: formSrc.trim(),
      alt: formAlt.trim() || "Sesión de entrenamiento en PRAVILO ARG",
      priority: formPriority,
      visible: formVisible,
    };

    // If priority, insert near top
    let updated: GalleryImageItem[];
    if (formPriority) {
      updated = [newImage, ...images];
    } else {
      updated = [...images, newImage];
    }

    setImages(updated);
    handleSave(updated);
    setShowAddModal(false);
    setFormSrc("");
    setFormAlt("");
    setFormPriority(false);
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        "¿Restablecer la galería a las fotos oficiales predeterminadas? Se sobrescribirá el listado actual.",
      )
    ) {
      setImages(DEFAULT_GALLERY_IMAGES);
      handleSave(DEFAULT_GALLERY_IMAGES);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-surface-raised border border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent-text flex items-center justify-center text-xl">
              📸
            </div>
            <div>
              <h2 className="text-xl font-bold font-condensed uppercase tracking-wider text-foreground">
                Gestión de Galería & Fotos en Práctica
              </h2>
              <p className="text-xs text-muted font-sans">
                Agregá, ordená o desactivá las fotos que se muestran en el carrusel de la landing page.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3 text-xs font-condensed font-bold uppercase tracking-wider">
            <span className="px-3 py-1 rounded-full bg-surface border border-border text-foreground">
              Total: <strong className="text-accent-text">{images.length}</strong> fotos
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              Visibles en Landing: <strong>{visibleCount}</strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
              Prioritarias ⭐: <strong>{priorityCount}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setFormSrc("");
              setFormAlt("");
              setFormPriority(false);
              setFormVisible(true);
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-accent text-accent-foreground font-condensed font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:opacity-95 shadow-lg shadow-accent/25 transition-all"
          >
            <span>+</span>
            <span>Agregar Foto</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-xl bg-surface border border-border text-muted hover:text-foreground text-xs font-condensed font-bold uppercase tracking-wider transition-colors"
            title="Restaurar a las fotos oficiales iniciales"
          >
            Restablecer
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-condensed font-bold uppercase tracking-wider flex items-center gap-2 animate-in fade-in">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>¡Galería guardada y actualizada en la web en vivo!</span>
        </div>
      )}

      {/* Grid of Gallery Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {images.map((img, idx) => {
          const isVisible = img.visible !== false;
          const isPriority = !!img.priority;

          return (
            <div
              key={img.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between bg-surface-raised/80 ${
                !isVisible
                  ? "border-border/40 opacity-50 grayscale"
                  : isPriority
                  ? "border-amber-400/60 shadow-lg shadow-amber-400/10 ring-1 ring-amber-400/30"
                  : "border-border hover:border-accent/40"
              }`}
            >
              {/* Photo Preview Container */}
              <div className="relative aspect-3/4 w-full bg-surface overflow-hidden group">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badges on image */}
                <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-condensed font-bold uppercase tracking-wider text-white border border-white/10">
                    #{idx + 1}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isPriority && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-condensed font-black uppercase tracking-wider shadow-md">
                        ⭐ Prioridad
                      </span>
                    )}
                    {!isVisible && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/80 text-white text-[10px] font-condensed font-bold uppercase tracking-wider">
                        Oculta
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Photo Details & Actions */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground font-sans line-clamp-2" title={img.alt}>
                    {img.alt}
                  </p>
                  <p className="text-[10px] text-muted/60 truncate font-mono mt-1" title={img.src}>
                    {img.src.startsWith("data:") ? "Foto subida desde dispositivo" : img.src}
                  </p>
                </div>

                {/* Control Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-border">
                  {/* Priority & Visibility Toggles */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTogglePriority(img.id)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-condensed font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-1 ${
                        isPriority
                          ? "bg-amber-400/20 border-amber-400/40 text-amber-300"
                          : "bg-surface border-border text-muted hover:text-foreground"
                      }`}
                      title={isPriority ? "Quitar prioridad" : "Marcar como prioridad"}
                    >
                      <span>{isPriority ? "⭐ Prioritaria" : "☆ Normal"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleVisible(img.id)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-condensed font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-1 ${
                        isVisible
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                          : "bg-rose-500/15 border-rose-500/30 text-rose-400"
                      }`}
                      title={isVisible ? "Ocultar de la web" : "Mostrar en la web"}
                    >
                      <span>{isVisible ? "👁️ Visible" : "🚫 Oculta"}</span>
                    </button>
                  </div>

                  {/* Move Order & Delete */}
                  <div className="flex items-center justify-between gap-1 pt-1">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="w-7 h-7 rounded-lg bg-surface border border-border text-muted hover:text-foreground disabled:opacity-30 flex items-center justify-center text-xs"
                        title="Mover a la izquierda / antes"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === images.length - 1}
                        className="w-7 h-7 rounded-lg bg-surface border border-border text-muted hover:text-foreground disabled:opacity-30 flex items-center justify-center text-xs"
                        title="Mover a la derecha / después"
                      >
                        →
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(img.id)}
                      className="px-2.5 py-1 rounded-lg bg-surface hover:bg-rose-500/15 text-muted hover:text-rose-400 border border-border hover:border-rose-500/40 text-[11px] font-condensed font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                      title="Eliminar de la galería"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Borrar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Photo Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="relative w-full max-w-lg bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-2xl text-foreground space-y-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📸</span>
                <h3 className="text-xl font-bold font-condensed uppercase tracking-wider text-foreground">
                  Agregar Nueva Foto a la Galería
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-full bg-surface-raised text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Option 1: Upload File */}
              <div>
                <label className="block text-xs font-condensed font-bold uppercase tracking-wider text-muted mb-1.5">
                  1. Subir archivo desde tu dispositivo:
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 rounded-2xl border-2 border-dashed border-border hover:border-accent/60 bg-surface-raised cursor-pointer text-center transition-all group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="space-y-1">
                    <span className="text-3xl block group-hover:scale-110 transition-transform">📁</span>
                    <p className="text-xs font-condensed font-bold uppercase text-foreground">
                      Hacé clic acá para elegir foto
                    </p>
                    <p className="text-[11px] text-muted">Formatos JPG, PNG, WebP</p>
                  </div>
                </div>
              </div>

              {/* Option 2: Image URL / Path */}
              <div>
                <label className="block text-xs font-condensed font-bold uppercase tracking-wider text-muted mb-1.5">
                  O ingresar URL / Ruta directa:
                </label>
                <input
                  type="text"
                  value={formSrc}
                  onChange={(e) => setFormSrc(e.target.value)}
                  placeholder="/images/tu-foto.jpg o https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:border-accent focus:outline-none"
                />
              </div>

              {/* Preview if src present */}
              {formSrc && (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border bg-black">
                  <Image src={formSrc} alt="Previsualización" fill className="object-contain" />
                </div>
              )}

              {/* Title / Alt */}
              <div>
                <label className="block text-xs font-condensed font-bold uppercase tracking-wider text-muted mb-1.5">
                  Título / Descripción de la foto:
                </label>
                <input
                  type="text"
                  value={formAlt}
                  onChange={(e) => setFormAlt(e.target.value)}
                  placeholder="Ej: Ejercicio de descompresión en suspensión completa"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground text-xs font-sans focus:border-accent focus:outline-none"
                  required
                />
              </div>

              {/* Switches */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-condensed font-bold uppercase tracking-wider text-foreground">
                  <input
                    type="checkbox"
                    checked={formPriority}
                    onChange={(e) => setFormPriority(e.target.checked)}
                    className="w-4 h-4 accent-accent rounded"
                  />
                  <span>⭐ Ubicar cerca de las primeras (Prioridad)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface border border-border text-muted hover:text-foreground text-xs font-condensed font-bold uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-condensed font-bold uppercase tracking-wider shadow-lg shadow-accent/25 hover:opacity-95 disabled:opacity-50 transition-all"
                >
                  {isSaving ? "Guardando..." : "Guardar Foto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
