"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

function getCategorySlug(categoryId: string) {
  return CATEGORIES.find((c) => c.id === categoryId)?.slug ?? categoryId;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const { totalItems, toggleCart } = useCart();
  const { totalItems: wishlistTotal } = useWishlist();
  const router = useRouter();

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Focus search on open */
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  /* Escape closes panels */
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

  /* Live search results */
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.shortName && p.shortName.toLowerCase().includes(q)) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [searchQuery]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

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
          <div className="relative flex items-center justify-between h-16 py-3">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 relative z-10">
              <Image
                src="/logo/LOGOFINAL2.png"
                alt="Las Romeas"
                width={220}
                height={73}
                className="h-14 w-auto md:h-16"
              />
            </Link>

            {/* Links desktop */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => link.hasDropdown && setShopOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setShopOpen(false)}
                >
                  <Link
                    href={link.href}
                    className="text-ink/90 text-sm tracking-[0.08em] uppercase
                               hover:text-gold transition-colors duration-300
                               relative pb-1"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                  </Link>

                  {link.hasDropdown && shopOpen && (
                    <div className="absolute top-full left-0 pt-3">
                      <div className="w-64 bg-page border border-ink/20 shadow-2xl shadow-ink/15
                                    py-3 animate-fade-in">
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/shop/${cat.slug}`}
                            className="block px-5 py-2 text-ink/80 text-xs tracking-[0.06em] uppercase
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
            <div className="flex items-center gap-4 relative z-10">
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

              {/* Wishlist */}
              <Link
                href="/wishlist"
                aria-label="Favoritos"
                className="text-ink/90 hover:text-gold transition-colors duration-300 relative"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlistTotal > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-ink
                                   text-[10px] font-bold flex items-center justify-center rounded-full">
                    {wishlistTotal > 9 ? "9+" : wishlistTotal}
                  </span>
                )}
              </Link>

              {/* Carrito */}
              <button
                onClick={toggleCart}
                aria-label="Carrito"
                className="text-ink/90 hover:text-gold transition-colors duration-300 relative"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-ink
                                   text-[10px] font-bold flex items-center justify-center rounded-full
                                   animate-[scale-in_0.2s_ease-out]">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
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
            <Link href="/about" onClick={() => setMobileOpen(false)} className="block text-ink/90 text-sm tracking-[0.08em] uppercase py-3 border-b border-ink/15 hover:text-gold transition-colors">
              About us
            </Link>

            <div>
              <button
                onClick={() => setShopOpen(!shopOpen)}
                className="w-full text-left text-ink/90 text-sm tracking-[0.08em] uppercase py-3 border-b border-ink/15 hover:text-gold transition-colors flex justify-between items-center"
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
                      className="block text-ink/70 text-xs tracking-[0.06em] uppercase py-2 hover:text-gold transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/info" onClick={() => setMobileOpen(false)} className="block text-ink/90 text-sm tracking-[0.08em] uppercase py-3 border-b border-ink/15 hover:text-gold transition-colors">
              INFO
            </Link>
            <Link href="/about#press" onClick={() => setMobileOpen(false)} className="block text-ink/90 text-sm tracking-[0.08em] uppercase py-3 border-b border-ink/15 hover:text-gold transition-colors">
              PRESS
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block text-ink/90 text-sm tracking-[0.08em] uppercase py-3 hover:text-gold transition-colors">
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
          {/* Overlay oscuro debajo del panel */}
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" />

          {/* Panel de búsqueda — fondo oscuro para máximo contraste */}
          <div
            className="relative z-10 bg-ink shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Zona de input ── */}
            <form onSubmit={handleSearchSubmit}>
              <div className="max-w-3xl mx-auto px-6 h-20 flex items-center gap-4 border-b border-page/10">
                {/* Lupa */}
                <svg
                  width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  className="flex-shrink-0"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>

                {/* Input */}
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos…"
                  className="flex-1 bg-transparent text-page text-xl outline-none
                             border-none focus:ring-0 placeholder-page/35
                             font-sans tracking-wide"
                />

                {/* Limpiar */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Limpiar búsqueda"
                    className="flex-shrink-0 text-page/50 hover:text-gold transition-colors duration-200 p-1"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {/* ESC / Cerrar */}
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Cerrar búsqueda"
                  className="flex-shrink-0 flex items-center gap-1.5 text-page/50 hover:text-gold transition-colors duration-200"
                >
                  <span className="hidden sm:inline text-[10px] tracking-[0.2em] uppercase border border-page/20 px-1.5 py-0.5">
                    ESC
                  </span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </form>

            {/* ── Zona de resultados ── */}
            {searchQuery.trim().length >= 2 && (
              <div className="max-w-3xl mx-auto px-6 py-2 pb-5">
                {searchResults.length > 0 ? (
                  <>
                    {/* Etiqueta */}
                    <p className="text-page/35 text-[10px] tracking-[0.25em] uppercase pt-3 pb-2">
                      Resultados
                    </p>

                    <div className="divide-y divide-page/8">
                      {searchResults.map((product) => {
                        const catSlug = getCategorySlug(product.categoryId);
                        return (
                          <Link
                            key={product.id}
                            href={`/shop/${catSlug}/${product.slug}`}
                            onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                            className="flex items-center gap-4 py-3 group
                                       hover:bg-page/5 -mx-3 px-3 transition-colors duration-200"
                          >
                            {/* Thumbnail */}
                            <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden bg-page/10">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                sizes="48px"
                              />
                            </div>

                            {/* Nombre + subtítulo */}
                            <div className="flex-1 min-w-0">
                              <p className="text-page text-sm tracking-[0.05em] truncate
                                           group-hover:text-gold transition-colors duration-200">
                                {product.shortName ?? product.name}
                              </p>
                              {product.subtitle && (
                                <p className="text-page/55 text-xs mt-0.5 truncate">
                                  {product.subtitle}
                                </p>
                              )}
                            </div>

                            {/* Precio */}
                            <span className="text-gold text-sm font-semibold flex-shrink-0">
                              {formatPrice(product.price)}
                            </span>

                            {/* Flecha */}
                            <svg
                              width="14" height="14" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                              className="text-page/25 group-hover:text-gold/60 transition-colors flex-shrink-0"
                            >
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Ver todos */}
                    <button
                      onClick={handleSearchSubmit}
                      className="mt-4 flex items-center gap-2 text-page/50 text-xs
                                 tracking-[0.18em] uppercase hover:text-gold transition-colors duration-200"
                    >
                      <span>Ver todos los resultados</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <div className="py-6">
                    <p className="text-page/60 text-sm">
                      Sin resultados para{" "}
                      <span className="text-page font-medium">&ldquo;{searchQuery}&rdquo;</span>
                    </p>
                    <p className="text-page/35 text-xs mt-1">
                      Intentá con otro término o explorá el catálogo completo.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Hint cuando el input está vacío */}
            {searchQuery.trim().length === 0 && (
              <div className="max-w-3xl mx-auto px-6 py-4">
                <p className="text-page/30 text-xs tracking-[0.15em] uppercase">
                  Escribí al menos 2 caracteres para buscar
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
