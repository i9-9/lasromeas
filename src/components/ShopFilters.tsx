"use client";

import { useState, useMemo } from "react";
import { PRODUCTS, type Product } from "@/data/products";
import { CATEGORIES } from "@/data/categories";

/* ─── Types ───────────────────────────────────── */
export interface FilterState {
  category: string;
  grainTypes: string[];
  originCountries: string[];
  cacaoPercents: number[];
  chocolateTypes: string[];
  isLimited: boolean;
}

export const EMPTY_FILTERS: FilterState = {
  category: "all",
  grainTypes: [],
  originCountries: [],
  cacaoPercents: [],
  chocolateTypes: [],
  isLimited: false,
};

/* ─── Helpers: extract all available filter options from data ── */
function extractOptions(products: Product[]) {
  const grains = new Map<string, number>();
  const origins = new Map<string, number>();
  const pcts = new Map<number, number>();
  const types = new Map<string, number>();
  let limitedCount = 0;

  for (const p of products) {
    p.grainTypes?.forEach((g) => grains.set(g, (grains.get(g) ?? 0) + 1));
    p.originCountries?.forEach((o) => origins.set(o, (origins.get(o) ?? 0) + 1));
    p.cacaoPercents?.forEach((n) => pcts.set(n, (pcts.get(n) ?? 0) + 1));
    p.chocolateTypes?.forEach((t) => types.set(t, (types.get(t) ?? 0) + 1));
    if (p.isLimited) limitedCount++;
  }

  return {
    grains: [...grains.entries()].sort((a, b) => a[0].localeCompare(b[0], "es")),
    origins: [...origins.entries()].sort((a, b) => a[0].localeCompare(b[0], "es")),
    pcts: [...pcts.entries()].sort((a, b) => a[0] - b[0]),
    types: [...types.entries()].sort((a, b) => a[0].localeCompare(b[0], "es")),
    limitedCount,
  };
}

/* ─── Collapsible filter section ──────────────── */
function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-ink/10 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2 group"
      >
        <span className="text-ink/70 text-[11px] tracking-[0.2em] uppercase font-medium">
          {title}
        </span>
        <svg
          className={`w-3 h-3 text-ink/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="mt-1 space-y-0.5">{children}</div>}
    </div>
  );
}

/* ─── Checkbox list with "Show more" ─────────── */
function CheckboxList({
  items,
  selected,
  onToggle,
  initialVisible = 8,
}: {
  items: [string, number][];
  selected: string[];
  onToggle: (value: string) => void;
  initialVisible?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, initialVisible);
  const hasMore = items.length > initialVisible;

  return (
    <>
      {visible.map(([value, count]) => (
        <label
          key={value}
          className="flex items-center gap-2.5 py-1 cursor-pointer group"
        >
          <input
            type="checkbox"
            checked={selected.includes(value)}
            onChange={() => onToggle(value)}
            className="w-3.5 h-3.5 rounded-sm border-ink/30 text-gold
                       focus:ring-gold/30 focus:ring-1 accent-[#C9A96E] cursor-pointer"
          />
          <span
            className={`text-xs tracking-[0.03em] transition-colors duration-150
                       ${selected.includes(value) ? "text-gold" : "text-ink/60 group-hover:text-ink/80"}`}
          >
            {value}
          </span>
          <span className="text-ink/25 text-[10px] ml-auto">{count}</span>
        </label>
      ))}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-gold/70 hover:text-gold text-[11px] tracking-[0.08em] mt-1 transition-colors"
        >
          {showAll ? "Mostrar menos" : `Mostrar ${items.length - initialVisible} más`}
        </button>
      )}
    </>
  );
}

/* ─── Number checkbox list ───────────────────── */
function NumberCheckboxList({
  items,
  selected,
  onToggle,
}: {
  items: [number, number][];
  selected: number[];
  onToggle: (value: number) => void;
}) {
  return (
    <>
      {items.map(([value, count]) => (
        <label
          key={value}
          className="flex items-center gap-2.5 py-1 cursor-pointer group"
        >
          <input
            type="checkbox"
            checked={selected.includes(value)}
            onChange={() => onToggle(value)}
            className="w-3.5 h-3.5 rounded-sm border-ink/30 text-gold
                       focus:ring-gold/30 focus:ring-1 accent-[#C9A96E] cursor-pointer"
          />
          <span
            className={`text-xs tracking-[0.03em] transition-colors duration-150
                       ${selected.includes(value) ? "text-gold" : "text-ink/60 group-hover:text-ink/80"}`}
          >
            {value}%
          </span>
          <span className="text-ink/25 text-[10px] ml-auto">{count}</span>
        </label>
      ))}
    </>
  );
}

/* ─── Main Filter Sidebar ────────────────────── */
export default function ShopFilters({
  filters,
  onChange,
  activeCount,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  activeCount: number;
}) {
  const options = useMemo(() => extractOptions(PRODUCTS), []);

  const toggleArray = <T extends string | number>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.grainTypes.length > 0 ||
    filters.originCountries.length > 0 ||
    filters.cacaoPercents.length > 0 ||
    filters.chocolateTypes.length > 0 ||
    filters.isLimited;

  return (
    <div className="space-y-4">
      {/* ── Clear all ── */}
      {hasActiveFilters && (
        <button
          onClick={() => onChange(EMPTY_FILTERS)}
          className="text-gold/70 hover:text-gold text-[11px] tracking-[0.12em] uppercase
                     transition-colors duration-200 flex items-center gap-1.5"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Limpiar filtros ({activeCount})
        </button>
      )}

      {/* ── Categorías ── */}
      <FilterSection title="Categorías" defaultOpen={true}>
        <label className="flex items-center gap-2.5 py-1 cursor-pointer group">
          <input
            type="radio"
            name="category"
            checked={filters.category === "all"}
            onChange={() => onChange({ ...filters, category: "all" })}
            className="w-3.5 h-3.5 accent-[#C9A96E] cursor-pointer"
          />
          <span
            className={`text-xs tracking-[0.03em] ${filters.category === "all" ? "text-gold" : "text-ink/60 group-hover:text-ink/80"}`}
          >
            Todos
          </span>
          <span className="text-ink/25 text-[10px] ml-auto">{PRODUCTS.length}</span>
        </label>
        {CATEGORIES.map((cat) => {
          const count = PRODUCTS.filter((p) => p.categoryId === cat.id).length;
          return (
            <label key={cat.id} className="flex items-center gap-2.5 py-1 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.id}
                onChange={() => onChange({ ...filters, category: cat.id })}
                className="w-3.5 h-3.5 accent-[#C9A96E] cursor-pointer"
              />
              <span
                className={`text-xs tracking-[0.03em] ${filters.category === cat.id ? "text-gold" : "text-ink/60 group-hover:text-ink/80"}`}
              >
                {cat.name}
              </span>
              <span className="text-ink/25 text-[10px] ml-auto">{count}</span>
            </label>
          );
        })}
      </FilterSection>

      {/* ── Ediciones Limitadas ── */}
      {options.limitedCount > 0 && (
        <FilterSection title="Ediciones Limitadas" defaultOpen={false}>
          <label className="flex items-center gap-2.5 py-1 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.isLimited}
              onChange={() => onChange({ ...filters, isLimited: !filters.isLimited })}
              className="w-3.5 h-3.5 rounded-sm border-ink/30 text-gold
                         focus:ring-gold/30 focus:ring-1 accent-[#C9A96E] cursor-pointer"
            />
            <span
              className={`text-xs tracking-[0.03em] ${filters.isLimited ? "text-gold" : "text-ink/60 group-hover:text-ink/80"}`}
            >
              Sí
            </span>
            <span className="text-ink/25 text-[10px] ml-auto">{options.limitedCount}</span>
          </label>
        </FilterSection>
      )}

      {/* ── Grano de Cacao ── */}
      {options.grains.length > 0 && (
        <FilterSection title="Grano de Cacao" defaultOpen={false}>
          <CheckboxList
            items={options.grains}
            selected={filters.grainTypes}
            onToggle={(v) => onChange({ ...filters, grainTypes: toggleArray(filters.grainTypes, v) })}
            initialVisible={8}
          />
        </FilterSection>
      )}

      {/* ── Orígenes / Terroir ── */}
      {options.origins.length > 0 && (
        <FilterSection title="Orígenes / Terroir" defaultOpen={false}>
          <CheckboxList
            items={options.origins}
            selected={filters.originCountries}
            onToggle={(v) => onChange({ ...filters, originCountries: toggleArray(filters.originCountries, v) })}
          />
        </FilterSection>
      )}

      {/* ── Porcentaje de Cacao ── */}
      {options.pcts.length > 0 && (
        <FilterSection title="Porcentaje de Cacao" defaultOpen={false}>
          <NumberCheckboxList
            items={options.pcts}
            selected={filters.cacaoPercents}
            onToggle={(v) => onChange({ ...filters, cacaoPercents: toggleArray(filters.cacaoPercents, v) })}
          />
        </FilterSection>
      )}

      {/* ── Tipo de Chocolate ── */}
      {options.types.length > 0 && (
        <FilterSection title="Tipo de Chocolate" defaultOpen={false}>
          <CheckboxList
            items={options.types}
            selected={filters.chocolateTypes}
            onToggle={(v) => onChange({ ...filters, chocolateTypes: toggleArray(filters.chocolateTypes, v) })}
          />
        </FilterSection>
      )}
    </div>
  );
}

/* ─── Filter logic ────────────────────────────── */
export function applyFilters(products: Product[], filters: FilterState, searchQuery: string): Product[] {
  let items = [...products];

  if (filters.category !== "all") {
    items = items.filter((p) => p.categoryId === filters.category);
  }

  if (filters.isLimited) {
    items = items.filter((p) => p.isLimited);
  }

  if (filters.grainTypes.length > 0) {
    items = items.filter((p) =>
      p.grainTypes?.some((g) => filters.grainTypes.includes(g))
    );
  }

  if (filters.originCountries.length > 0) {
    items = items.filter((p) =>
      p.originCountries?.some((o) => filters.originCountries.includes(o))
    );
  }

  if (filters.cacaoPercents.length > 0) {
    items = items.filter((p) =>
      p.cacaoPercents?.some((n) => filters.cacaoPercents.includes(n))
    );
  }

  if (filters.chocolateTypes.length > 0) {
    items = items.filter((p) =>
      p.chocolateTypes?.some((t) => filters.chocolateTypes.includes(t))
    );
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortName.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q)
    );
  }

  return items;
}
