"use client";

import { useEffect, useRef } from "react";

/**
 * Observa el elemento y agrega la clase "visible" cuando entra al viewport.
 * Uso: <div ref={fadeRef} className="fade-up">…</div>
 */
export function useFadeUp(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

/**
 * Observa un contenedor y aplica "visible" a todos los hijos con clase "fade-up"
 * con un delay escalonado (stagger).
 */
export function useStaggerFadeUp(staggerMs = 100, threshold = 0.15) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = Array.from(
      container.querySelectorAll<HTMLElement>(".fade-up")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            children.forEach((child, i) => {
              setTimeout(() => {
                child.classList.add("visible");
              }, i * staggerMs);
            });
          }
        });
      },
      { threshold }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [staggerMs, threshold]);

  return containerRef;
}
