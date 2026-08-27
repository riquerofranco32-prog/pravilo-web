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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      {
        rootMargin: "0px 0px -50px 0px",
        threshold: 0.05,
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
