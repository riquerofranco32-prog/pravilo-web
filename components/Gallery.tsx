"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";

type GalleryImg = { src: string; alt: string };

export default function Gallery({
  images,
  gridClassName = "sm:grid-cols-2",
  aspectClassName = "aspect-4/3",
}: {
  images: GalleryImg[];
  gridClassName?: string;
  aspectClassName?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i - 1 + images.length) % images.length,
      ),
    [images.length],
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, prev, next]);

  return (
    <>
      <div className={`mt-10 grid gap-4 ${gridClassName}`}>
        {images.map((img, i) => (
          <RevealOnScroll key={img.src}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Ver imagen: ${img.alt}`}
              className={`group relative ${aspectClassName} h-full w-full cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-background`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
                <span className="rounded-full border border-white/30 bg-black/40 px-4 py-1.5 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
                  Ver ↗
                </span>
              </span>
            </button>
          </RevealOnScroll>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-2xl text-foreground/80 transition-colors hover:border-white/40 hover:text-foreground"
          >
            ×
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Imagen anterior"
            className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-2xl text-foreground/80 transition-colors hover:border-white/40 hover:text-foreground md:left-8"
          >
            ‹
          </button>
          <div
            className="relative aspect-4/3 w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[openIndex].src}
              alt={images[openIndex].alt}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Imagen siguiente"
            className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-2xl text-foreground/80 transition-colors hover:border-white/40 hover:text-foreground md:right-8"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
