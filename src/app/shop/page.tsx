"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  /* Filtrado + búsqueda + ordenamiento */
  const filtered = useMemo(() => {
    let items = [...PRODUCTS];

    // Filtro categoría
    if (activeCategory !== "all") {
      items = items.filter((p) => p.categoryId === activeCategory);
    }

    // Búsqueda por nombre
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Ordenamiento
    items.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name, "es");
    });

    return items;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-page">
      <Navbar />

      {/* ── Hero de página ─────────────── */}
      <section className="relative h-[38vh] min-h-[280px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, #FFFEFC, hsl(25, 15%, 94%))" }}
        />
        <div className="overlay-hero" />
        <div className="relative z-10 w-full px-8 md:px-8 pb-14">
          <p className="label-section mb-3">Catálogo</p>
          <div className="divider-gold mb-4" style={{ marginLeft: 0, marginRight: "auto" }} />
          <h1 className="text-ink text-5xl md:text-6xl font-light" style={{ fontFamily: '"trajan-pro-3", serif' }}>
            Shop
          </h1>
        </div>
      </section>

      {/* ── Layout: sidebar + grid ────── */}
      <div className="w-full px-8 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Sidebar filtros (desktop) ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0 space-y-6">
            <div>
              <p className="label-section mb-4">Categorías</p>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`w-full text-left text-xs tracking-[0.15em] uppercase py-2 px-3
                                transition-colors duration-200
                                ${activeCategory === "all"
                                  ? "text-gold border-l-2 border-gold bg-ink/10"
                                  : "text-ink/60 hover:text-gold border-l-2 border-transparent"
                                }`}
                  >
                    Todos
                  </button>
                </li>
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full text-left text-xs tracking-[0.15em] uppercase py-2 px-3
                                  transition-colors duration-200
                                  ${activeCategory === cat.id
                                    ? "text-gold border-l-2 border-gold bg-ink/10"
                                    : "text-ink/60 hover:text-gold border-l-2 border-transparent"
                                  }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ── Contenido principal ─────── */}
          <div className="flex-1 min-w-0">
            {/* Barra búsqueda + filtro mobile + sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
              {/* Search input */}
              <div className="relative flex-1 w-full sm:max-w-xs">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos…"
                  className="w-full pl-9 pr-4 py-2.5 bg-ink/5 border border-ink/20
                             focus:border-gold text-ink text-sm placeholder-ink/40 outline-none
                             transition-colors duration-300"
                />
              </div>

              {/* Filtro mobile */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden btn-outline text-xs px-4 py-2.5"
              >
                Filtros
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-ink/5 border border-ink/20 text-ink/80
                           text-xs tracking-[0.1em] uppercase px-4 py-2.5 outline-none
                           focus:border-gold transition-colors duration-300 cursor-pointer"
              >
                <option value="name">Nombre</option>
                <option value="price-asc">Precio: Bajo → Alto</option>
                <option value="price-desc">Precio: Alto → Bajo</option>
              </select>

              {/* Contador resultados */}
              <span className="text-ink/40 text-xs ml-auto">
                {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Filtros mobile accordion */}
            {mobileFilterOpen && (
              <div className="lg:hidden mb-6 p-4 bg-ink/5 border border-ink/20">
                <p className="label-section mb-3">Categorías</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setActiveCategory("all"); setMobileFilterOpen(false); }}
                    className={`text-xs tracking-[0.12em] uppercase px-3 py-1.5 border transition-colors duration-200
                                ${activeCategory === "all"
                                  ? "border-gold text-gold bg-gold/10"
                                  : "border-ink/25 text-ink/60 hover:border-gold/60"
                                }`}
                  >
                    Todos
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveCategory(cat.id); setMobileFilterOpen(false); }}
                      className={`text-xs tracking-[0.12em] uppercase px-3 py-1.5 border transition-colors duration-200
                                  ${activeCategory === cat.id
                                    ? "border-gold text-gold bg-gold/10"
                                    : "border-ink/25 text-ink/60 hover:border-gold/60"
                                  }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Grid de productos */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto opacity-30">
                  <circle cx="24" cy="24" r="20" stroke="#C9A96E" strokeWidth="1" />
                  <path d="M24 14v10l6 4" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-ink/50 text-sm">No se encontraron productos.</p>
                <button
                  onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
                  className="text-gold text-xs tracking-[0.15em] uppercase hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
