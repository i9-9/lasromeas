// ─────────────────────────────────────────────
// src/data/categories.ts
// Categorías del shop — espejo de lasromeas.com
// ─────────────────────────────────────────────

export interface Category {
  id: string;
  slug: string;
  name: string;
  /** imagen placeholder — reemplazar con ruta real */
  image: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "tree-bean",
    slug: "tree-bean",
    name: "Barras Tree & Bean To Bar",
    image: "/placeholder-collection-1.jpg",
  },
  {
    id: "alfajores",
    slug: "alfajores-con-harina-de-cacao",
    name: "Alfajores con Harina de Cacao",
    image: "/placeholder-collection-2.jpg",
  },
  {
    id: "tabletas-rellenas",
    slug: "tabletas-rellenas",
    name: "Tabletas Rellenas",
    image: "/placeholder-collection-3.jpg",
  },
  {
    id: "bombones",
    slug: "bombones",
    name: "Bombones",
    image: "/placeholder-collection-4.jpg",
  },
  {
    id: "frutas",
    slug: "frutas",
    name: "Frutas",
    image: "/placeholder-collection-5.jpg",
  },
  {
    id: "pellizcos",
    slug: "pellizcos",
    name: "Pellizcos",
    image: "/placeholder-collection-6.jpg",
  },
  {
    id: "experiencias",
    slug: "experiencias",
    name: "Experiencias",
    image: "/placeholder-collection-7.jpg",
  },
  {
    id: "festividades",
    slug: "festividades",
    name: "Festividades",
    image: "/placeholder-collection-8.jpg",
  },
  {
    id: "ediciones-especiales",
    slug: "ediciones-especiales",
    name: "Ediciones Especiales",
    image: "/placeholder-collection-9.jpg",
  },
  {
    id: "derivados-cacao",
    slug: "derivados-de-cacao",
    name: "Derivados de Cacao",
    image: "/placeholder-collection-10.jpg",
  },
  {
    id: "theobromas",
    slug: "theobromas",
    name: "Theobromas",
    image: "/placeholder-collection-11.jpg",
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
    "alfajores",
    "bombones",
    "tree-bean",
    "tabletas-rellenas",
    "pellizcos",
    "experiencias",
  ].includes(c.id)
);
