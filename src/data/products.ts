// ─────────────────────────────────────────────
// src/data/products.ts
// ─────────────────────────────────────────────

/** Origen del cacao: país, región, finca (opcional). countryCode para mapa simple. */
export interface CacaoOrigin {
  country: string;
  region?: string;
  farm?: string;
  /** Código para posicionar en mapa simple (PE, EC, NI, etc.) */
  countryCode?: string;
}

/** Proceso: fermentación, tostado, conchado */
export interface CacaoProcess {
  fermentation?: string;
  roasting?: string;
  conching?: string;
}

/** Paso de proceso (3–4 pasos, sin romanticismo) */
export interface ProcessStep {
  title: string;
  detail: string;
}

/** Perfil de sabor: ej. ácido 2, frutal 5, amargo 3, dulce 1 (escala 1–5) */
export type SensoryScores = Record<string, number>;

/** Campos de ficha técnica (barras de chocolate) */
export interface ProductTechSheet {
  /** Origen del cacao */
  origin?: CacaoOrigin;
  /** Porcentaje de cacao */
  cacaoPercent?: number;
  /** Variedad: Criollo, Trinitario, Forastero, etc. */
  variety?: string;
  /** Perfil sensorial (etiquetas) */
  sensoryProfile?: string[];
  /** Perfil de sabor para radar/barras: clave → 1–5 */
  sensoryScores?: SensoryScores;
  /** Proceso (fermentación, tostado, conchado) */
  process?: CacaoProcess;
  /** Proceso en 3–4 pasos claros */
  processSteps?: ProcessStep[];
  /** Lote / batch */
  batch?: string;
  /** Para quién es (ej. "Quien toma café sin azúcar") */
  forWho?: string[];
  /** Para quién no es (ej. "No es para niños") */
  notForWho?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  price: number; // en ARS
  currency: string;
  image: string;
  description?: string;
  isFeatured?: boolean;
  /** Ficha técnica (origen, % cacao, variedad, perfil, proceso, lote) */
  techSheet?: ProductTechSheet;
}

export const PRODUCTS: Product[] = [
  // ── Alfajores (featured en home) ──
  {
    id: "alfajor-pistacho",
    slug: "alfajor-de-harina-de-cacao-pistachos",
    name: "Alfajor de Harina de Cacao – Pistacho",
    categoryId: "alfajores",
    price: 8000,
    currency: "ARS",
    image: "/placeholder-product-1.jpg",
    description:
      "Alfajor elaborado con nuestra exclusiva harina de cacao (100% cáscara del grano) y relleno de pistachio. Sin gluten. Libre de agregados artificiales.",
    isFeatured: true,
  },
  {
    id: "alfajor-ddl-cardamomo",
    slug: "alfajor-de-harina-de-cacao-ddl-y-cardamomo",
    name: "Alfajor de Harina de Cacao – Dulce de Leche y Cardamomo",
    categoryId: "alfajores",
    price: 8000,
    currency: "ARS",
    image: "/placeholder-product-2.jpg",
    description:
      "La combinación clásica del dulce de leche artesanal con la sutileza del cardamomo, envuelto en una galleta de harina de cacao.",
    isFeatured: true,
  },
  {
    id: "alfajor-choc-blanco-nibs",
    slug: "alfajor-de-harina-de-cacao-chocolate-blanco-nibs",
    name: "Alfajor de Harina de Cacao – Chocolate Blanco y Nibs",
    categoryId: "alfajores",
    price: 8000,
    currency: "ARS",
    image: "/placeholder-product-3.jpg",
    description:
      "Chocolate blanco bean-to-bar con crunch de nibs de cacao tostados. Texturas únicas en cada mordida.",
    isFeatured: true,
  },
  {
    id: "alfajor-choc-oscuro-nibs",
    slug: "alfajor-de-harina-de-cacao-chocolate-oscuro-nibs",
    name: "Alfajor de Harina de Cacao – Chocolate Oscuro y Nibs",
    categoryId: "alfajores",
    price: 8000,
    currency: "ARS",
    image: "/placeholder-product-4.jpg",
    description:
      "Chocolate oscuro 60% single origin con nibs de cacao. Profundidad de sabor en cada capa.",
    isFeatured: true,
  },

  // ── Tree & Bean to Bar ──
  {
    id: "barra-peru-origin",
    slug: "barra-peru-single-origin",
    name: "Barra Single Origin – Perú",
    categoryId: "tree-bean",
    price: 6500,
    currency: "ARS",
    image: "/placeholder-product-5.jpg",
    description:
      "Cacao de origen peruano, 70%. Notas afrutadas y florales con un finish suave y elegante.",
    techSheet: {
      origin: { country: "Perú", region: "San Martín", farm: "Finca Tocache", countryCode: "PE" },
      cacaoPercent: 70,
      variety: "Trinitario",
      sensoryProfile: ["frutal", "floral", "ácido suave"],
      sensoryScores: { ácido: 3, frutal: 5, amargo: 2, dulce: 1 },
      process: {
        fermentation: "5-6 días, caja",
        roasting: "Lento, 45 min",
        conching: "18 h",
      },
      processSteps: [
        { title: "Fermentación", detail: "5-6 días en caja." },
        { title: "Secado", detail: "Al sol, hasta humedad óptima." },
        { title: "Tostado", detail: "Lento, 45 min." },
        { title: "Conchado", detail: "18 h." },
      ],
      batch: "L-2401",
      forWho: ["Quien aprecia notas florales y afrutadas.", "Quien toma café sin azúcar."],
      notForWho: ["No es un chocolate dulce.", "No es para niños."],
    },
  },
  {
    id: "barra-ecuador-origin",
    slug: "barra-ecuador-single-origin",
    name: "Barra Single Origin – Ecuador",
    categoryId: "tree-bean",
    price: 7000,
    currency: "ARS",
    image: "/placeholder-product-6.jpg",
    description:
      "Cacao fino de aroma ecuatoriano, 75%. Perfil tropical con notas de fruta de la pasión.",
    techSheet: {
      origin: { country: "Ecuador", region: "Guayas", farm: "Hacienda La Victoria", countryCode: "EC" },
      cacaoPercent: 75,
      variety: "Nacional (Arriba)",
      sensoryProfile: ["frutal", "dulce", "floral"],
      sensoryScores: { ácido: 1, frutal: 5, amargo: 2, dulce: 4 },
      process: {
        fermentation: "4-5 días",
        roasting: "Medio, 35 min",
        conching: "20 h",
      },
      processSteps: [
        { title: "Fermentación", detail: "4-5 días." },
        { title: "Secado", detail: "Hasta humedad óptima." },
        { title: "Tostado", detail: "Medio, 35 min." },
        { title: "Conchado", detail: "20 h." },
      ],
      batch: "L-2402",
      forWho: ["Quien busca cacao fino de aroma.", "Quien toma café sin azúcar."],
      notForWho: ["No es un chocolate dulce.", "No es para niños."],
    },
  },
  {
    id: "barra-nicaragua-origin",
    slug: "barra-nicaragua-single-origin",
    name: "Barra Single Origin – Nicaragua",
    categoryId: "tree-bean",
    price: 7500,
    currency: "ARS",
    image: "/placeholder-product-7.jpg",
    description:
      "Terroir nicaragüense, 65%. Sabor redondo, dulce natural, con reminiscencias de nuez.",
    techSheet: {
      origin: { country: "Nicaragua", region: "Waslala", countryCode: "NI" },
      cacaoPercent: 65,
      variety: "Criollo",
      sensoryProfile: ["dulce", "amargo suave", "nuez"],
      sensoryScores: { ácido: 1, frutal: 2, amargo: 3, dulce: 4 },
      process: {
        fermentation: "6 días",
        roasting: "Bajo, 40 min",
        conching: "16 h",
      },
      processSteps: [
        { title: "Fermentación", detail: "6 días." },
        { title: "Secado", detail: "Hasta humedad óptima." },
        { title: "Tostado", detail: "Bajo, 40 min." },
        { title: "Conchado", detail: "16 h." },
      ],
      batch: "L-2403",
      forWho: ["Quien prefiere un perfil redondo y notas a nuez.", "Quien toma café sin azúcar."],
      notForWho: ["No es un chocolate dulce.", "No es para niños."],
    },
  },

  // ── Bombones ──
  {
    id: "bombon-passion-fruit",
    slug: "bombon-fruta-de-la-pasion",
    name: "Bombón – Fruta de la Pasión",
    categoryId: "bombones",
    price: 1200,
    currency: "ARS",
    image: "/placeholder-product-8.jpg",
    description: "Ganache de fruta de la pasión recubierte con chocolate 70% single origin.",
  },
  {
    id: "bombon-menta",
    slug: "bombon-menta-ecuatoriana",
    name: "Bombón – Menta Ecuatoriana",
    categoryId: "bombones",
    price: 1200,
    currency: "ARS",
    image: "/placeholder-product-9.jpg",
    description: "Menta fresca en ganache envuelta en chocolate oscuro bean-to-bar.",
  },

  // ── Tabletas Rellenas ──
  {
    id: "tableta-caramel-sal",
    slug: "tableta-caramel-sal-marina",
    name: "Tableta Rellena – Caramel y Sal Marina",
    categoryId: "tabletas-rellenas",
    price: 5500,
    currency: "ARS",
    image: "/placeholder-product-10.jpg",
    description: "Relleno de caramel artesanal con flakes de sal marina. Chocolate 55%.",
  },

  // ── Pellizcos ──
  {
    id: "pellizco-almendras",
    slug: "pellizco-almendras-tostadas",
    name: "Pellizco – Almendras Tostadas",
    categoryId: "pellizcos",
    price: 950,
    currency: "ARS",
    image: "/placeholder-product-11.jpg",
    description: "Almendras enteras tostadas recubiertas en chocolate oscuro single origin.",
  },

  // ── Experiencias ──
  {
    id: "experiencia-degustacion",
    slug: "experiencia-cata-de-chocolates",
    name: "Experiencia – Cata de Chocolates",
    categoryId: "experiencias",
    price: 15000,
    currency: "ARS",
    image: "/placeholder-product-12.jpg",
    description:
      "Sesión de cata guiada por Lorena. Conocer los terroirs, los procesos y los perfiles sensoriales del cacao fino.",
  },
];

// Productos destacados que aparecen en el home
export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.isFeatured);

// Helper: formatear precio
export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString("es-AR")}`;
}
