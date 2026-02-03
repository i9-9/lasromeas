"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  cta?: { label: string; href: string };
  image: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "AMANTHEO",
    subtitle: "CHOCOLATE DEL GRANO A LA BARRA",
    cta: { label: "Descubrí", href: "/shop/tree-bean" },
    image: "/hero/11_15_Las-Romeas-8796-scaled.jpg.jpeg",
  },
  {
    id: 2,
    title: "NUEVAS TENDENCIAS",
    subtitle: "DISEÑO & VANGUARDIA",
    cta: { label: "Explorar", href: "/shop" },
    image: "/hero/3-3.png",
  },
  {
    id: 3,
    title: "ALFAJORES DE ORIGEN",
    subtitle: "HARINA DE CACAO",
    cta: { label: "Ver colección", href: "/shop/alfajores-con-harina-de-cacao" },
    image: "/hero/alfajor_home.png",
  },
  {
    id: 4,
    title: "TRABAJO DE CAMPO EN CACAOTALES",
    subtitle: "TERROIRS & GENOTIPOS – PERFILES SENSORIALES – TRAZABILIDAD DESDE FINCAS",
    cta: { label: "Conocer más", href: "/about" },
    image: "/hero/4-3.png",
  },
  {
    id: 5,
    title: "SORPRENDÉ CON CHOCOLATES",
    subtitle: "REGALOS EMPRESARIALES",
    cta: { label: "Contactar", href: "/contact" },
    image: "/hero/5-2.png",
  },
];

const INTERVAL = 5000; // ms entre slides

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % SLIDES.length),
    []
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length),
    []
  );

  /* Autoplay */
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", minHeight: "560px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slides ──────────────────────────── */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className={`
            absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}
          `}
        >
          {/* Imagen de fondo */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
            />
          </div>

          {/* Overlay */}
          <div className="overlay-hero" />

          {/* Contenido textual — abajo a la izquierda, texto blanco */}
          <div className="absolute inset-0 flex flex-col items-start justify-end text-left pb-20 md:pb-24 pl-6 md:pl-12 z-10">
            <p className="label-section mb-4 animate-pulse-slow text-white">
              {`0${slide.id}`}
            </p>
            <h1
              className="text-white text-5xl md:text-7xl font-light tracking-[-0.02em] mb-3
                         drop-shadow-lg"
              style={{ fontFamily: '"trajan-pro-3", serif' }}
            >
              {slide.title}
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-light tracking-[0.12em] uppercase mb-8 max-w-xl">
              {slide.subtitle}
            </p>
            {slide.cta && (
              <Link href={slide.cta.href} className="btn-gold">
                {slide.cta.label}
              </Link>
            )}
          </div>
        </div>
      ))}

      {/* ── Arrows ──────────────────────────── */}
      <button
        onClick={prev}
        aria-label="Slide anterior"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20
                   w-10 h-10 flex items-center justify-center
                   text-white hover:text-gold
                   transition-colors duration-300"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M17 6L9 14l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Siguiente slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20
                   w-10 h-10 flex items-center justify-center
                   text-white hover:text-gold
                   transition-colors duration-300"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M11 6l8 8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* ── Dots ────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Ir a slide ${i + 1}`}
            className={`
              rounded-full transition-all duration-500 ease-out
              ${i === current
                ? "w-8 h-1.5 bg-gold"
                : "w-1.5 h-1.5 bg-ink/40 hover:bg-ink/70"
              }
            `}
          />
        ))}
      </div>
    </section>
  );
}
