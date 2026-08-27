"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  direction?: "up" | "scale" | "fade" | "left" | "right";
  delay?: number;
}

export default function RevealOnScroll({
  children,
  className = "",
  style = {},
  direction = "up",
  delay,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Si ya está en la vista inicial al cargar la página, mostrar inmediatamente
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 30) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      {
        // Anticipar 60px antes de que entre al viewport para que la animación empiece suavemente
        rootMargin: "0px 0px 60px 0px",
        threshold: 0.01,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const directionClass =
    direction === "scale"
      ? "reveal-scale"
      : direction === "fade"
        ? "reveal-fade"
        : direction === "left"
          ? "reveal-left"
          : direction === "right"
            ? "reveal-right"
            : "";

  const combinedStyle: CSSProperties = {
    ...style,
    ...(delay ? { transitionDelay: `${delay}ms` } : {}),
  };

  return (
    <div
      ref={ref}
      className={`reveal ${directionClass} ${className}`}
      style={combinedStyle}
    >
      {children}
    </div>
  );
}
