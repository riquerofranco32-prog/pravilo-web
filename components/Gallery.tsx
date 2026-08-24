"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";

type GalleryImg = { src: string; alt: string };

export default function Gallery({
  images,
}: {
  images: GalleryImg[];
  gridClassName?: string;
  aspectClassName?: string;
  isMasonry?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prevModal = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i - 1 + images.length) % images.length,
      ),
    [images.length],
  );
  const nextModal = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );

  const scrollToSlide = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const slideWidth = container.offsetWidth * 0.82; // approximate item width
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
    const nextIdx = Math.min(images.length - 1, currentIndex + 1);
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
      if (newIdx !== currentIndex && newIdx >= 0 && newIdx < images.length) {
        setCurrentIndex(newIdx);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex, images.length]);

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
        {/* Controles de Carrusel */}
        <div className="mb-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              {currentIndex + 1} / {images.length}
            </span>
            <span className="text-muted/40">·</span>
            <span className="text-xs text-muted">Deslizá para explorar</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Foto anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-lg text-foreground transition-colors hover:border-accent hover:text-accent-text disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
            >
              ←
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= images.length - 1}
              aria-label="Foto siguiente"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-lg text-foreground transition-colors hover:border-accent hover:text-accent-text disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
            >
              →
            </button>
          </div>
        </div>

        {/* Contenedor Carrusel Horizontal */}
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 pt-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {images.map((img, i) => (
            <div
              key={img.src}
              className="w-[82vw] shrink-0 snap-center sm:w-[50vw] md:w-[38vw] lg:w-[28vw]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`Ver foto ${i + 1} en grande`}
                className="group relative block aspect-3/4 w-full cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-background shadow-md transition-all duration-300 hover:border-accent/50 hover:shadow-[0_8px_30px_-10px_var(--accent)]"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 28vw, (min-width: 768px) 38vw, (min-width: 640px) 50vw, 82vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="truncate pr-2">{img.alt}</span>
                  <span className="shrink-0 rounded-full border border-white/30 bg-black/40 px-2.5 py-0.5 text-[10px] uppercase backdrop-blur-sm">
                    Ampliar ↗
                  </span>
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Indicadores de puntos */}
        <div className="mt-2 flex justify-center gap-1.5 overflow-x-auto py-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToSlide(i)}
              aria-label={`Ir a foto ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === i
                  ? "w-6 bg-accent"
                  : "w-1.5 bg-border hover:bg-muted"
              }`}
            />
          ))}
        </div>
      </RevealOnScroll>

      {/* Lightbox / Modal a pantalla completa */}
      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar vista completa"
            className="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-2xl text-white transition-colors hover:border-white/50 hover:bg-black/70"
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
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-2xl text-white transition-colors hover:border-white/50 hover:bg-black/70 md:left-8"
          >
            &lsaquo;
          </button>
          <div
            className="relative flex max-h-[88vh] max-w-5xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[80vh] w-auto">
              <Image
                src={images[openIndex].src}
                alt={images[openIndex].alt}
                width={1200}
                height={1600}
                sizes="95vw"
                className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl"
              />
            </div>
            <p className="mt-3 text-center text-sm font-medium text-white/80">
              {images[openIndex].alt} ({openIndex + 1} de {images.length})
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextModal();
            }}
            aria-label="Imagen siguiente"
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-2xl text-white transition-colors hover:border-white/50 hover:bg-black/70 md:right-8"
          >
            &rsaquo;
          </button>
        </div>
      )}
    </>
  );
}