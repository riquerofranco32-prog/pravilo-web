"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LAYERS = [
  { selector: '[data-layer="glow"]', yPercent: 35 },
  { selector: '[data-layer="photo"]', yPercent: 18 },
  { selector: '[data-layer="axis"]', yPercent: -45 },
  { selector: '[data-layer="content"]', yPercent: 6 },
];

export default function ParallaxHero({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
      LAYERS.forEach((layer, i) => {
        tl.to(
          layer.selector,
          { yPercent: layer.yPercent, ease: "none" },
          i === 0 ? undefined : "<",
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative overflow-hidden">
      <div
        data-layer="glow"
        className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(circle_at_50%_0%,rgba(230,41,74,0.22),transparent_60%)]"
      />
      <div
        data-layer="photo"
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 opacity-25"
      >
        <Image
          src="/images/espacio-completo.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
      </div>
      <div
        data-layer="axis"
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-accent/40 to-transparent"
      >
        <span className="absolute top-1/3 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_16px_4px_rgba(230,41,74,0.6)]" />
      </div>
      <div data-layer="content">{children}</div>
    </div>
  );
}
