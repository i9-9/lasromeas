"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/data/categories";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  /* Efecto scroll → sombra en navbar al hacer scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Focus search input al abrirse */
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  /* Cerrar search con Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navLinks = [
    { label: "About us", href: "/about" },
    { label: "Shop", href: "/shop", hasDropdown: true },
    { label: "INFO", href: "/info" },
    { label: "PRESS", href: "/about#press" },
    { label: "CONTACT", href: "/contact" },
  ];

  return (
    <>
      {/* ─── Navbar principal ─────────────────── */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50
          bg-page
          transition-shadow duration-500 ease-out
          ${scrolled ? "shadow-lg shadow-ink/10" : ""}
        `}
      >
        <div className="w-full px-8 md:px-8">
          <div className="flex items-center justify-between h-16 py-3">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo/LOGOFINAL2.png"
                alt="Las Romeas"
                width={220}
                height={73}
                className="h-14 w-auto md:h-16"
              />
            </Link>

            {/* Links desktop */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => link.hasDropdown && setShopOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setShopOpen(false)}
                >
                  <Link
                    href={link.href}
                    className="text-ink/90 text-sm tracking-[0.2em] uppercase
                               hover:text-gold transition-colors duration-300
                               relative pb-1"
                  >
                    {link.label}
                    {/* underline animated */}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                  </Link>

                  {/* Dropdown shop: pt-3 en el wrapper evita que se cierre al bajar el mouse (sin hueco) */}
                  {link.hasDropdown && shopOpen && (
                    <div className="absolute top-full left-0 pt-3">
                      <div className="w-64 bg-page border border-ink/20 shadow-2xl shadow-ink/15
                                    py-3 animate-fade-in">
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/shop/${cat.slug}`}
                            className="block px-5 py-2 text-ink/80 text-xs tracking-[0.15em] uppercase
                                       hover:text-gold hover:bg-ink/10
                                       transition-colors duration-200"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Iconos derecha */}
            <div className="flex items-center gap-4">
              {/* Buscar */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Buscar"
                className="text-ink/90 hover:text-gold transition-colors duration-300"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>

              {/* Carrito */}
              <button aria-label="Carrito" className="text-ink/90 hover:text-gold transition-colors duration-300 relative">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {/* Badge count — placeholder */}
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-ink
                                 text-[10px] font-bold flex items-center justify-center rounded-full">
                  0
                </span>
              </button>

              {/* Menu hamburger (mobile) */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menú"
                className="lg:hidden text-ink/90 hover:text-gold transition-colors duration-300"
              >
                <div className="flex flex-col gap-1.5 w-6">
                  <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
                  <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
                  <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ─── Menú mobile ──────────────────── */}
        <div
          className={`
            lg:hidden overflow-hidden transition-all duration-500 ease-out
            ${mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}
            bg-page/98 backdrop-blur-md border-t border-ink/15
          `}
        >
          <div className="px-6 py-5 space-y-1">
            <Link href="/about" onClick={() => setMobileOpen(false)} className="block text-ink/90 text-sm tracking-[0.2em] uppercase py-3 border-b border-ink/15 hover:text-gold transition-colors">
              About us
            </Link>

            {/* Shop con accordion */}
            <div>
              <button
                onClick={() => setShopOpen(!shopOpen)}
                className="w-full text-left text-ink/90 text-sm tracking-[0.2em] uppercase py-3 border-b border-ink/15 hover:text-gold transition-colors flex justify-between items-center"
              >
                Shop
                <svg width="12" height="12" viewBox="0 0 12 12" className={`transition-transform duration-300 ${shopOpen ? "rotate-180" : ""}`}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {shopOpen && (
                <div className="pl-4 py-2 space-y-0">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop/${cat.slug}`}
                      onClick={() => { setMobileOpen(false); setShopOpen(false); }}
                      className="block text-ink/70 text-xs tracking-[0.15em] uppercase py-2 hover:text-gold transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/info" onClick={() => setMobileOpen(false)} className="block text-ink/90 text-sm tracking-[0.2em] uppercase py-3 border-b border-ink/15 hover:text-gold transition-colors">
              INFO
            </Link>
            <Link href="/about#press" onClick={() => setMobileOpen(false)} className="block text-ink/90 text-sm tracking-[0.2em] uppercase py-3 border-b border-ink/15 hover:text-gold transition-colors">
              PRESS
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block text-ink/90 text-sm tracking-[0.2em] uppercase py-3 hover:text-gold transition-colors">
              CONTACT
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Modal de búsqueda ────────────────── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col"
          onClick={() => setSearchOpen(false)}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />

          {/* Panel búsqueda */}
          <div
            className="relative z-10 bg-page/98 border-b border-ink/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos…"
                className="flex-1 bg-transparent text-ink text-lg outline-none placeholder-ink/50
                           border-none focus:ring-0"
                style={{ fontFamily: '"trajan-pro-3", serif' }}
              />
              <button onClick={() => setSearchOpen(false)} className="text-ink/60 hover:text-gold transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
