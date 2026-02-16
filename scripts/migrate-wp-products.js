#!/usr/bin/env node
/**
 * Migration script: WordPress XML catalog → products.ts + images
 * Run once: node scripts/migrate-wp-products.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const XML_PATH = path.join(
  ROOT,
  "public/wordpress/uploads 8/product-catalogs/main-product-catalog.xml"
);
const IMG_DEST = path.join(ROOT, "public/products");
const WP_UPLOADS = path.join(ROOT, "public/wordpress");

// ── Parse XML ──────────────────────────────────────────────
const xml = fs.readFileSync(XML_PATH, "utf8");
const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];

function getText(entry, tag) {
  const cdataRe = new RegExp(
    `<g:${tag}>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</g:${tag}>`
  );
  const m = entry.match(cdataRe);
  if (m) return m[1].trim();
  const plainRe = new RegExp(`<g:${tag}>([\\s\\S]*?)</g:${tag}>`);
  const m2 = entry.match(plainRe);
  return m2 ? m2[1].trim() : "";
}

function getAll(entry, tag) {
  const regex = new RegExp(`<g:${tag}>([\\s\\S]*?)</g:${tag}>`, "g");
  const results = [];
  let m;
  while ((m = regex.exec(entry)) !== null) {
    results.push(m[1].trim());
  }
  return results;
}

// ── Find local image matching a WP URL ─────────────────────
// URL pattern: https://www.lasromeas.com/wp-content/uploads/YYYY/MM/filename
// Local dirs: public/wordpress/uploads*/YYYY/MM/filename
const uploadDirs = fs
  .readdirSync(WP_UPLOADS)
  .filter((d) => d.startsWith("uploads"))
  .map((d) => path.join(WP_UPLOADS, d));

function findLocalImage(wpUrl) {
  const match = wpUrl.match(/\/uploads\/(\d{4})\/(\d{2})\/(.+)$/);
  if (!match) return null;
  const [, year, month, filename] = match;
  const subPath = path.join(year, month, filename);
  for (const dir of uploadDirs) {
    const candidate = path.join(dir, subPath);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

// ── Category mapping ────────────────────────────────────────
function categorize(title, slug) {
  const t = title.toUpperCase();

  // Packs y boxes siempre van a ediciones especiales
  if (t.includes("PACKGIFT") || t.startsWith("BOX ")) return "ediciones-especiales";
  // Festividades
  if (t.includes("HUEVO DE PASCUA") || t.includes("ROSCA DE PASCUA"))
    return "festividades";
  // Theobromas (Macalate, etc.)
  if (t.includes("MACALATE")) return "theobromas";
  // Barras AMANTHEO = Tree & Bean to Bar
  if (t.includes("AMANTHEO")) return "tree-bean";
  // Alfajores
  if (t.includes("ALFAJOR")) return "alfajores";
  // Tabletas rellenas vs tabletas simples
  if (
    t.startsWith("TABLETA RELLENA") ||
    (t.includes("TABLETA") && t.includes("RELLENA"))
  )
    return "tabletas-rellenas";
  if (
    t.startsWith("TABLETA LAS ROMEAS") ||
    t.startsWith("TABLETA DE CHOCOLATE") ||
    (t.includes("TABLETA") && !t.includes("RELLENA"))
  )
    return "tabletas-rellenas";
  // Trufas
  if (t.includes("TRUFA")) return "trufas";
  // Bombones
  if (t.includes("BOMBON") || t.includes("BOMBÓN")) return "bombones";
  // Pellizcos y frutos cubiertos
  if (t.includes("PELLIZCO")) return "pellizcos";
  if (
    t.includes("NARANJITA") ||
    t.includes("NUECES") ||
    t.includes("ALMENDRAS REBOZADAS") ||
    t.includes("AVELLANAS REBOZADAS")
  )
    return "pellizcos";
  // Derivados de cacao
  if (
    t.includes("HARINA DE CACAO") ||
    t.includes("CASCARILLA") ||
    t.includes("NIBS DE CACAO") ||
    t.includes("CACAO FINO TOSTADO")
  )
    return "derivados-cacao";
  // Turrones
  if (t.includes("TURRÓN") || t.includes("TURRON")) return "turrones";
  // Stollen y productos navideños
  if (t.includes("STOLLEN") || t.includes("PAN DE PASCUA"))
    return "festividades";
  return "novedades";
}

// ── Clean description ───────────────────────────────────────
function cleanDesc(raw) {
  return raw
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ── Slugify ─────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

// ── Title Case ──────────────────────────────────────────────
function titleCase(str) {
  const lower = ["de", "del", "y", "en", "con", "la", "el", "los", "las", "a", "al"];
  return str
    .split(" ")
    .map((w, i) => {
      const low = w.toLowerCase();
      if (i > 0 && lower.includes(low)) return low;
      return low.charAt(0).toUpperCase() + low.slice(1);
    })
    .join(" ");
}

// ── Process entries ─────────────────────────────────────────
if (!fs.existsSync(IMG_DEST)) fs.mkdirSync(IMG_DEST, { recursive: true });

const products = [];
let imagesFound = 0;
let imagesMissing = 0;

for (const entry of entries) {
  const wpId = getText(entry, "id");
  const rawTitle = getText(entry, "title");
  const rawDesc =
    getText(entry, "short_description") || getText(entry, "description");
  const link = getText(entry, "link");
  const availability = getText(entry, "availability");
  const priceStr = getText(entry, "price");
  const imageUrl = getText(entry, "image_link");

  // Derive slug from WP link or title
  let slug = link.split("/producto/")[1]?.replace(/\/$/, "") || "";
  if (!slug || /^\d+$/.test(slug)) slug = slugify(rawTitle);

  const price = parseInt(priceStr.replace(/[^\d]/g, ""), 10) || 0;
  const categoryId = categorize(rawTitle, slug);

  // Clean title: title case, remove excess whitespace
  const name = titleCase(
    rawTitle
      .replace(/\s{2,}/g, " ")
      .replace(/–/g, "–")
      .trim()
  );

  // Find and copy image
  let imagePath = "/products/placeholder.jpg";
  const localImg = findLocalImage(imageUrl);
  if (localImg) {
    const ext = path.extname(localImg);
    const destName = `${slug}${ext}`;
    const destPath = path.join(IMG_DEST, destName);
    try {
      fs.copyFileSync(localImg, destPath);
      imagePath = `/products/${destName}`;
      imagesFound++;
    } catch (e) {
      console.error(`  ✗ copy failed for ${slug}: ${e.message}`);
      imagesMissing++;
    }
  } else {
    imagesMissing++;
    console.log(`  ✗ image not found locally: ${slug} → ${imageUrl}`);
  }

  // Featured = solo productos "in stock" (marcamos abajo manualmente)
  const isFeatured = false;

  products.push({
    id: slug,
    slug,
    name,
    categoryId,
    price,
    currency: "ARS",
    image: imagePath,
    description: cleanDesc(rawDesc),
    availability,
    isFeatured: isFeatured || undefined,
  });
}

// ── Consolidate variant products ────────────────────
// Groups of products that are the same item in different sizes/weights
const variantGroups = [
  {
    // Nibs de Cacao Chuncho: 100g, 250g, 500g
    slugs: [
      "nibs-de-cacao-chuncho-quellouno-cuzco-peru-100g",
      "nibs-de-cacao-chuncho-quellouno-cuzco-peru-100g-2",
      "nibs-de-cacao-chuncho-quellouno-cuzco-peru-500g",
    ],
    mainSlug: "nibs-de-cacao-chuncho-quellouno-cuzco-peru",
    mainName: "Nibs de Cacao Chuncho - Quellouno, Cuzco, Perú",
    labels: ["100g", "250g", "500g"],
  },
  {
    // Cacao Fino Tostado: 100g, 250g, 500g, 1kg
    slugs: [
      "cacao-fino-tostado-100-g-mix-aromatico-tocache-san-martin-peru",
      "cacao-fino-tostado-250g-mix-aromatico-tocache-peru",
      "cacao-fino-tostado-500g-mix-aromatico-tocache-san-martin-peru",
      "cacao-fino-tostado-mix-aromatico-tocache-san-martin-peru",
    ],
    mainSlug: "cacao-fino-tostado-mix-aromatico-tocache-peru",
    mainName: "Cacao Fino Tostado - Mix Aromático, Tocache, Perú",
    labels: ["100g", "250g", "500g", "1kg"],
  },
  {
    // Packgift Mix Bombones: x8, x16, x24
    slugs: [
      "packgift-mix-bombones-x-8u",
      "packgifts-mix-bombones-x-16u",
      "packgifts-mix-bombones-x-24u",
    ],
    mainSlug: "packgift-mix-bombones",
    mainName: "Packgift Mix Bombones",
    labels: ["x 8u", "x 16u", "x 24u"],
  },
  {
    // Turrón Blanco de Almendras y Nibs: 100g, 300g
    slugs: [
      "almendras-tostadas-y-nibs-de-cacao-de-origen-amazonas-peru-garrapinados",
      "turron-blanco-duro-de-almendras-y-nibs-garrapinados",
    ],
    mainSlug: "turron-blanco-almendras-nibs-garrapinados",
    mainName: "Turrón Blanco de Almendras y Nibs Garrapiñados",
    labels: ["100g", "300g"],
  },
  {
    // Huevo de Pascuas Colección Clásica Ecuatorianas: 100g, 200g
    slugs: [
      "huevo-pascuas-blend-ecuatoriano-100",
      "huevo-de-pascuas-70-coleccion-clasica-blend-de-fincas-ecuatorianas",
    ],
    mainSlug: "huevo-de-pascuas-coleccion-clasica-ecuatorianas",
    mainName: "Huevo de Pascuas 70% - Colección Clásica - Blend de Fincas Ecuatorianas",
    labels: ["100g", "200g"],
  },
];

// Process variant groups: merge into one product with variants array
for (const group of variantGroups) {
  const variantProducts = group.slugs.map((s) =>
    products.find((p) => p.slug === s)
  ).filter(Boolean);

  if (variantProducts.length < 2) continue;

  // Build variants array
  const variants = variantProducts.map((vp, i) => ({
    label: group.labels[i],
    price: vp.price,
    availability: vp.availability || "in stock",
  }));

  // Use first variant as the base product
  const base = variantProducts[0];
  base.id = group.mainSlug;
  base.slug = group.mainSlug;
  base.name = group.mainName;
  base.variants = variants;
  // Price = lowest variant price
  base.price = Math.min(...variants.map((v) => v.price));

  // Remove all other variants from products array
  for (let i = 1; i < variantProducts.length; i++) {
    const idx = products.indexOf(variantProducts[i]);
    if (idx !== -1) products.splice(idx, 1);
  }
}

// ── Mark curated products as featured (8 variados) ──
const featuredSlugs = [
  "amantheo-quellouno-cuzco-80-40g",                // Tree & Bean - Perú
  "amantheo-bagua-grande-amazonas-peru-70-tree-to-bar", // Tree & Bean - Amazonas
  "alfajor-de-harina-de-cacao-ddl-y-cardamomo",     // Alfajor clásico
  "alfajor-de-harina-de-cacao-pistachos",           // Alfajor pistacho
  "tableta-rellena-crema-de-pistacho",              // Tableta rellena
  "trufas-de-chocolate-de-origen",                  // Trufas
  "turron-gianduia-chocolate-origen-beantobar-alicante-blando", // Turrón
  "cascarilla-de-cacao",                            // Derivados
];
for (const p of products) {
  if (featuredSlugs.includes(p.slug)) p.isFeatured = true;
}

console.log(`\n✓ Parsed ${products.length} products`);
console.log(`  Images found locally: ${imagesFound}`);
console.log(`  Images missing: ${imagesMissing}`);

// ── Group by category ───────────────────────────────────────
const cats = {};
for (const p of products) {
  if (!cats[p.categoryId]) cats[p.categoryId] = [];
  cats[p.categoryId].push(p);
}
console.log("\nCategories:");
for (const [cat, items] of Object.entries(cats).sort()) {
  console.log(`  ${cat}: ${items.length} products`);
}

// ── Generate products.ts ────────────────────────────────────
function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

let ts = `// ─────────────────────────────────────────────
// src/data/products.ts
// Auto-generated from WordPress catalog
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

/** Variante de un producto (distinto peso/presentación, mismo producto) */
export interface ProductVariant {
  /** Etiqueta visible: "100g", "250g", "x 8u", etc. */
  label: string;
  /** Precio de esta variante */
  price: number;
  /** Disponibilidad de esta variante */
  availability: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  /** Precio base (el menor si hay variantes) */
  price: number;
  currency: string;
  image: string;
  description?: string;
  isFeatured?: boolean;
  /** Estado de disponibilidad: "in stock", "out of stock", "preorder" */
  availability?: string;
  /** Variantes de peso/presentación (si aplica) */
  variants?: ProductVariant[];
  /** Ficha técnica (origen, % cacao, variedad, perfil, proceso, lote) */
  techSheet?: ProductTechSheet;
}

export const PRODUCTS: Product[] = [\n`;

// Group output by category for readability
const categoryOrder = [
  "tree-bean",
  "alfajores",
  "tabletas-rellenas",
  "trufas",
  "bombones",
  "pellizcos",
  "frutas",
  "ediciones-especiales",
  "festividades",
  "derivados-cacao",
  "turrones",
  "theobromas",
  "novedades",
];

const categoryLabels = {
  "tree-bean": "Barras Tree & Bean To Bar (AMANTHEO)",
  alfajores: "Alfajores con Harina de Cacao",
  "tabletas-rellenas": "Tabletas Rellenas & Tabletas Las Romeas",
  trufas: "Trufas",
  bombones: "Bombones",
  pellizcos: "Pellizcos & Frutos Cubiertos",
  frutas: "Frutas",
  "ediciones-especiales": "Packs, Boxes & Ediciones Especiales",
  festividades: "Festividades (Pascuas)",
  "derivados-cacao": "Derivados de Cacao",
  turrones: "Turrones",
  theobromas: "Theobromas",
  novedades: "Novedades",
};

for (const catId of categoryOrder) {
  const items = cats[catId];
  if (!items || items.length === 0) continue;

  ts += `  // ── ${categoryLabels[catId] || catId} ──\n`;
  for (const p of items) {
    ts += `  {\n`;
    ts += `    id: "${esc(p.id)}",\n`;
    ts += `    slug: "${esc(p.slug)}",\n`;
    ts += `    name: "${esc(p.name)}",\n`;
    ts += `    categoryId: "${esc(p.categoryId)}",\n`;
    ts += `    price: ${p.price},\n`;
    ts += `    currency: "${p.currency}",\n`;
    ts += `    image: "${esc(p.image)}",\n`;
    if (p.description) {
      ts += `    description:\n      "${esc(p.description)}",\n`;
    }
    if (p.availability && p.availability !== "in stock") {
      ts += `    availability: "${p.availability}",\n`;
    }
    if (p.variants && p.variants.length > 0) {
      ts += `    variants: [\n`;
      for (const v of p.variants) {
        ts += `      { label: "${esc(v.label)}", price: ${v.price}, availability: "${v.availability}" },\n`;
      }
      ts += `    ],\n`;
    }
    if (p.isFeatured) {
      ts += `    isFeatured: true,\n`;
    }
    ts += `  },\n`;
  }
}

ts += `];

// Productos destacados que aparecen en el home
export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.isFeatured);

// Helper: formatear precio
export function formatPrice(amount: number): string {
  return \`$\${amount.toLocaleString("es-AR")}\`;
}
`;

const productsPath = path.join(ROOT, "src/data/products.ts");
fs.writeFileSync(productsPath, ts, "utf8");
console.log(`\n✓ Written ${productsPath}`);

// ── Generate updated categories.ts ──────────────────────────
const categoriesTs = `// ─────────────────────────────────────────────
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
    image: "/products/${(cats["tree-bean"] || [{}])[0]?.image?.replace("/products/", "") || "placeholder.jpg"}",
  },
  {
    id: "alfajores",
    slug: "alfajores-con-harina-de-cacao",
    name: "Alfajores con Harina de Cacao",
    image: "/products/${(cats["alfajores"] || [{}])[0]?.image?.replace("/products/", "") || "placeholder.jpg"}",
  },
  {
    id: "tabletas-rellenas",
    slug: "tabletas-rellenas",
    name: "Tabletas",
    image: "/products/${(cats["tabletas-rellenas"] || [{}])[0]?.image?.replace("/products/", "") || "placeholder.jpg"}",
  },
  {
    id: "trufas",
    slug: "trufas",
    name: "Trufas",
    image: "/products/${(cats["trufas"] || [{}])[0]?.image?.replace("/products/", "") || "placeholder.jpg"}",
  },
  {
    id: "bombones",
    slug: "bombones",
    name: "Bombones",
    image: "/products/${(cats["bombones"] || [{}])[0]?.image?.replace("/products/", "") || "placeholder.jpg"}",
  },
  {
    id: "pellizcos",
    slug: "pellizcos",
    name: "Pellizcos & Frutos Cubiertos",
    image: "/products/${(cats["pellizcos"] || [{}])[0]?.image?.replace("/products/", "") || "placeholder.jpg"}",
  },
  {
    id: "ediciones-especiales",
    slug: "ediciones-especiales",
    name: "Packs & Boxes",
    image: "/products/${(cats["ediciones-especiales"] || [{}])[0]?.image?.replace("/products/", "") || "placeholder.jpg"}",
  },
  {
    id: "festividades",
    slug: "festividades",
    name: "Festividades",
    image: "/products/${(cats["festividades"] || [{}])[0]?.image?.replace("/products/", "") || "placeholder.jpg"}",
  },
  {
    id: "derivados-cacao",
    slug: "derivados-de-cacao",
    name: "Derivados de Cacao",
    image: "/products/${(cats["derivados-cacao"] || [{}])[0]?.image?.replace("/products/", "") || "placeholder.jpg"}",
  },
  {
    id: "turrones",
    slug: "turrones",
    name: "Turrones",
    image: "/products/${(cats["turrones"] || [{}])[0]?.image?.replace("/products/", "") || "placeholder.jpg"}",
  },
  {
    id: "theobromas",
    slug: "theobromas",
    name: "Theobromas",
    image: "/products/${(cats["theobromas"] || [{}])[0]?.image?.replace("/products/", "") || "placeholder.jpg"}",
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
`;

const categoriesPath = path.join(ROOT, "src/data/categories.ts");
fs.writeFileSync(categoriesPath, categoriesTs, "utf8");
console.log(`✓ Written ${categoriesPath}`);
