// ─────────────────────────────────────────────
// src/data/categories.ts
// Categorías del shop — migradas desde lasromeas.com
// ─────────────────────────────────────────────

export interface Category {
  id: string;
  slug: string;
  name: string;
  /** imagen de la categoría */
  image: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "tree-bean",
    slug: "tree-bean",
    name: "Barras Tree & Bean To Bar",
    image: "/products/amantheo-quellouno-cuzco-80-40g.jpg",
  },
  {
    id: "alfajores",
    slug: "alfajores-con-harina-de-cacao",
    name: "Alfajores con Harina de Cacao",
    image: "/products/alfajor-de-harina-de-cacao-ddl-y-cardamomo.jpg",
  },
  {
    id: "tabletas-rellenas",
    slug: "tabletas-rellenas",
    name: "Tabletas",
    image: "/products/barra-de-chocolate-con-leche-50-con-leche-tocache-san-martiin-peru-con-crumble-de-avellanas-y-nuez-moscada.jpeg",
  },
  {
    id: "trufas",
    slug: "trufas",
    name: "Trufas",
    image: "/products/trufas-de-chocolate-de-origen.jpg",
  },
  {
    id: "bombones",
    slug: "bombones",
    name: "Bombones",
    image: "/products/bombon-de-mucilago-de-cacao-2u.jpg",
  },
  {
    id: "pellizcos",
    slug: "pellizcos",
    name: "Pellizcos & Frutos Cubiertos",
    image: "/products/naranjitas-cubiertas-en-chocolate-tocache-san-martin-peru-60.png",
  },
  {
    id: "ediciones-especiales",
    slug: "ediciones-especiales",
    name: "Packs & Boxes",
    image: "/products/packgift-mini-alfajores-hc-x-7u-ddl-y-cardamomo.jpeg",
  },
  {
    id: "festividades",
    slug: "festividades",
    name: "Festividades",
    image: "/products/rosca-de-pascuas-con-harina-de-cacao-y-chocolate-ecuatoriano.jpg",
  },
  {
    id: "derivados-cacao",
    slug: "derivados-de-cacao",
    name: "Derivados de Cacao",
    image: "/products/stollen-harina-de-cacao-limoncello-mora.jpeg",
  },
  {
    id: "turrones",
    slug: "turrones",
    name: "Turrones",
    image: "/products/turron-de-mani-cubierto-con-chocolate-peruano-al-70-nibs-porciones-pote-surtidos-variedad.jpeg",
  },
  {
    id: "theobromas",
    slug: "theobromas",
    name: "Theobromas",
    image: "/products/macalate-amantheo-100-chazuta-tarapoto-peru-theobroma-bicolor-majambo.jpg",
  },
  {
    id: "experiencias",
    slug: "experiencias",
    name: "Experiencias",
    image: "/placeholder-collection-7.jpg",
  },
  {
    id: "novedades",
    slug: "novedades",
    name: "Novedades",
    image: "/placeholder-collection-12.jpg",
  },
];

// Subconjunto que aparece en la grilla "COLECCIONES" del home
export const HOME_COLLECTIONS: Category[] = CATEGORIES.filter((c) =>
  [
    "tree-bean",
    "alfajores",
    "tabletas-rellenas",
    "trufas",
    "bombones",
    "pellizcos",
    "derivados-cacao",
    "turrones",
  ].includes(c.id)
);
