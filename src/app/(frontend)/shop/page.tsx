"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopFilters, {
  EMPTY_FILTERS,
  applyFilters,
  type FilterState,
} from "@/components/ShopFilters";
import { PRODUCTS } from "@/data/products";

export default function ShopPage() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">(
    "name"
  );

  /* Pre-populate search from navbar navigation (?q=...) */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setSearchQuery(q);
  }, []);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  /* Filtrado + búsqueda + ordenamiento */
  const filtered = useMemo(() => {
    const items = applyFilters(PRODUCTS, filters, searchQuery);

    items.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name, "es");
    });

    return items;
  }, [filters, searchQuery, sortBy]);

  const activeFilterCount = [
    filters.category !== "all" ? 1 : 0,
    filters.grainTypes.length,
    filters.originCountries.length,
    filters.cacaoPercents.length,
    filters.chocolateTypes.length,
    filters.isLimited ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-page">
      <Navbar />

      {/* ── Hero de página ─────────────── */}
      <section className="relative h-[38vh] min-h-[280px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, #FFFEFC, hsl(25, 15%, 94%))",
          }}
        />
        <div className="overlay-hero" />
        <div className="relative z-10 w-full px-8 md:px-8 pb-14">
          <p className="label-section mb-3">Catálogo</p>
          <div
            className="divider-gold mb-4"
            style={{ marginLeft: 0, marginRight: "auto" }}
          />
          <h1
            className="text-ink text-5xl md:text-6xl font-light"
            style={{ fontFamily: '"trajan-pro-3", serif' }}
          >
            Shop
          </h1>
        </div>
      </section>

      {/* ── Layout: sidebar + grid ────── */}
      <div className="w-full px-6 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* ── Sidebar filtros (desktop) ── */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <ShopFilters
              filters={filters}
              onChange={setFilters}
              activeCount={activeFilterCount}
            />
          </aside>

          {/* ── Contenido principal ─────── */}
          <div className="flex-1 min-w-0">
            {/* Barra búsqueda + filtro mobile + sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
              {/* Search input */}
              <div className="relative flex-1 w-full sm:max-w-xs">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
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
                className="lg:hidden btn-outline text-xs px-4 py-2.5 relative"
              >
                Filtros
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {activeFilterCount}
                  </span>
                )}
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

            {/* Filtros mobile panel */}
            {mobileFilterOpen && (
              <div className="lg:hidden mb-6 p-5 bg-ink/5 border border-ink/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-ink/70 text-xs tracking-[0.15em] uppercase font-medium">
                    Filtros
                  </span>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="text-ink/40 hover:text-ink/70 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ShopFilters
                  filters={filters}
                  onChange={setFilters}
                  activeCount={activeFilterCount}
                />
              </div>
            )}

            {/* Active filters tags */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.category !== "all" && (
                  <FilterTag
                    label={`Cat: ${filters.category}`}
                    onRemove={() => setFilters({ ...filters, category: "all" })}
                  />
                )}
                {filters.isLimited && (
                  <FilterTag
                    label="Edición Limitada"
                    onRemove={() => setFilters({ ...filters, isLimited: false })}
                  />
                )}
                {filters.grainTypes.map((g) => (
                  <FilterTag
                    key={g}
                    label={g}
                    onRemove={() =>
                      setFilters({
                        ...filters,
                        grainTypes: filters.grainTypes.filter((v) => v !== g),
                      })
                    }
                  />
                ))}
                {filters.originCountries.map((o) => (
                  <FilterTag
                    key={o}
                    label={o}
                    onRemove={() =>
                      setFilters({
                        ...filters,
                        originCountries: filters.originCountries.filter(
                          (v) => v !== o
                        ),
                      })
                    }
                  />
                ))}
                {filters.cacaoPercents.map((n) => (
                  <FilterTag
                    key={n}
                    label={`${n}%`}
                    onRemove={() =>
                      setFilters({
                        ...filters,
                        cacaoPercents: filters.cacaoPercents.filter(
                          (v) => v !== n
                        ),
                      })
                    }
                  />
                ))}
                {filters.chocolateTypes.map((t) => (
                  <FilterTag
                    key={t}
                    label={t}
                    onRemove={() =>
                      setFilters({
                        ...filters,
                        chocolateTypes: filters.chocolateTypes.filter(
                          (v) => v !== t
                        ),
                      })
                    }
                  />
                ))}
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
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  className="mx-auto opacity-30"
                >
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#C9A96E"
                    strokeWidth="1"
                  />
                  <path
                    d="M24 14v10l6 4"
                    stroke="#C9A96E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-ink/50 text-sm">
                  No se encontraron productos.
                </p>
                <button
                  onClick={() => {
                    setFilters(EMPTY_FILTERS);
                    setSearchQuery("");
                  }}
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

/* ─── Filter tag pill ────────────────────────── */
function FilterTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/20 text-gold text-[11px] tracking-[0.06em] px-2.5 py-1">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-gold/80 transition-colors"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}
