"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";

export type GalleryImg = {
  src: string;
  alt: string;
  category?: "sesiones" | "estudio" | "equipamiento";
};

const CATEGORIES = [
  { id: "todas", label: "Todas las Fotos" },
  { id: "sesiones", label: "Sesiones & Ejercicios" },
  { id: "estudio", label: "El Estudio" },
  { id: "equipamiento", label: "Equipamiento & Detalles" },
];

export default function Gallery({
  images,
}: {
  images: GalleryImg[];
  gridClassName?: string;
  aspectClassName?: string;
  isMasonry?: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("todas");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredImages =
    activeCategory === "todas"
      ? images
      : images.filter((img) => img.category === activeCategory);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setCurrentIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const close = useCallback(() => setOpenIndex(null), []);
  const prevModal = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i - 1 + filteredImages.length) % filteredImages.length,
      ),
    [filteredImages.length],
  );
  const nextModal = useCallback(
    () =>
      setOpenIndex((i) => (i === null ? null : (i + 1) % filteredImages.length)),
    [filteredImages.length],
  );

  const scrollToSlide = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const slideWidth = container.offsetWidth * 0.82;
    container.scrollTo({
      left: index * slideWidth,
      behavior: "smooth",
    });
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    const nextIdx = Math.max(0, currentIndex - 1);
    scrollToSlide(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(filteredImages.length - 1, currentIndex + 1);
    scrollToSlide(nextIdx);
  };

  // Sync scroll position with current index
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const slideWidth = container.offsetWidth * 0.82;
      const newIdx = Math.round(scrollLeft / slideWidth);
      if (
        newIdx !== currentIndex &&
        newIdx >= 0 &&
        newIdx < filteredImages.length
      ) {
        setCurrentIndex(newIdx);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex, filteredImages.length]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prevModal();
      if (e.key === "ArrowRight") nextModal();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, prevModal, nextModal]);

  return (
    <>
      <RevealOnScroll className="mt-8">
        {/* Categorías / Filtros */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2 px-2">
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === "todas"
                ? images.length
                : images.filter((i) => i.category === cat.id).length;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-condensed font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-accent text-accent-foreground shadow-[0_0_20px_rgba(160,26,26,0.4)] scale-105"
                    : "border border-border bg-surface text-muted hover:border-accent/50 hover:text-foreground"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-surface-raised text-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controles de Carrusel */}
        <div className="mb-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-border bg-surface px-3 py-1 font-condensed text-xs font-bold uppercase tracking-wider text-accent-text">
              {currentIndex + 1} / {filteredImages.length}
            </span>
            <span className="hidden text-xs text-muted sm:inline-block">
              Deslizá horizontalmente para explorar las fotos
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Foto anterior"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-lg text-foreground shadow-sm transition-all hover:border-accent hover:bg-surface-raised hover:text-accent-text disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground"
            >
              ←
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= filteredImages.length - 1}
              aria-label="Foto siguiente"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-lg text-foreground shadow-sm transition-all hover:border-accent hover:bg-surface-raised hover:text-accent-text disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground"
            >
              →
            </button>
          </div>
        </div>

        {/* Contenedor Carrusel Horizontal */}
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 pt-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {filteredImages.map((img, i) => (
            <div
              key={img.src}
              className="w-[82vw] shrink-0 snap-center sm:w-[48vw] md:w-[36vw] lg:w-[27vw]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`Ver foto ${i + 1} en grande`}
                className="group relative block aspect-3/4 w-full cursor-zoom-in overflow-hidden rounded-3xl border border-border bg-surface shadow-lg transition-all duration-500 hover:border-accent/60 hover:shadow-[0_12px_40px_-10px_rgba(160,26,26,0.4)]"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 27vw, (min-width: 768px) 36vw, (min-width: 640px) 48vw, 82vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="truncate pr-2 text-xs font-semibold text-white">
                    {img.alt}
                  </span>
                  <span className="shrink-0 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-condensed font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    Ampliar ↗
                  </span>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Indicadores de puntos con barra expandible */}
        <div className="mt-4 flex justify-center gap-1.5 overflow-x-auto py-2">
          {filteredImages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToSlide(i)}
              aria-label={`Ir a foto ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === i
                  ? "w-8 bg-gradient-to-r from-accent to-accent-glow shadow-[0_0_10px_var(--accent)]"
                  : "w-2 bg-border hover:bg-muted"
              }`}
            />
          ))}
        </div>
      </RevealOnScroll>

      {/* Lightbox / Modal a pantalla completa */}
      {openIndex !== null && filteredImages[openIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl animate-fadeIn"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar vista completa"
            className="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-2xl text-white transition-all hover:border-white/60 hover:bg-black/80 hover:scale-110"
          >
            &times;
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevModal();
            }}
            aria-label="Imagen anterior"
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-2xl text-white transition-all hover:border-white/60 hover:bg-black/80 hover:scale-110 md:left-8"
          >
            &lsaquo;
          </button>
          <div
            className="relative flex max-h-[88vh] max-w-5xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[80vh] w-auto">
              <Image
                src={filteredImages[openIndex].src}
                alt={filteredImages[openIndex].alt}
                width={1200}
                height={1600}
                sizes="95vw"
                className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-[0_0_80px_rgba(0,0,0,0.9)]"
              />
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-5 py-2 backdrop-blur-md">
              <span className="text-xs font-condensed font-bold text-accent-text uppercase tracking-wider">
                {openIndex + 1} / {filteredImages.length}
              </span>
              <span className="text-white/40">·</span>
              <p className="text-xs font-medium text-white/90">
                {filteredImages[openIndex].alt}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextModal();
            }}
            aria-label="Imagen siguiente"
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-2xl text-white transition-all hover:border-white/60 hover:bg-black/80 hover:scale-110 md:right-8"
          >
            &rsaquo;
          </button>
        </div>
      )}
    </>
  );
}