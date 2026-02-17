#!/usr/bin/env node
/**
 * Generates filter metadata for each product.
 * Outputs JSON: { [productId]: { grainTypes, originCountries, cacaoPercents, chocolateTypes, isLimited } }
 */

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'products.ts'), 'utf8');
const products = [];
const regex = /\{\s*id:\s*"([^"]+)",\s*slug:\s*"[^"]+",\s*name:\s*"([^"]+)",[\s\S]*?subtitle:\s*"([^"]*)",[\s\S]*?badge:\s*"([^"]*)",[\s\S]*?categoryId:\s*"([^"]+)"/g;
let m;
while ((m = regex.exec(src)) !== null) {
  products.push({ id: m[1], name: m[2], subtitle: m[3], badge: m[4], categoryId: m[5] });
}
console.error(`Found ${products.length} products\n`);

const GRAIN_PATTERNS = [
  [/Amelonado/i, 'Amelonado'],
  [/Bellavista/i, 'Bellavista'],
  [/Blanco de Piura/i, 'Blanco de Piura'],
  [/Catongo/i, 'Catongo'],
  [/CCN51/i, 'CCN51'],
  [/Ocumare|Chuao/i, 'Ocumare / Chuao'],
  [/Chuncho.*Cáscara/i, 'Chuncho Cáscara de Huevo'],
  [/Chuncho.*Punta de Lanza|Punta de Lanza/i, 'Chuncho Punta de Lanza'],
  [/Chuncho.*Señorita|Señorita/i, 'Chuncho Señorita'],
  [/Criollos Modernos/i, 'Criollos Modernos'],
  [/Kriskawas/i, 'Kriskawas'],
  [/Krislala/i, 'Krislala'],
  [/Mix Aromático/i, 'CRA / Mix Aromático'],
  [/Mix de Chunchos|Mix Chunchos/i, 'Mix de Chunchos'],
  [/Nacional del Marañón|Marañón/i, 'Nacional del Marañón'],
  [/Grano Nacional|Cacao Nacional/i, 'Nacional'],
  [/Nativo Amazónico/i, 'Nativo Amazónico'],
  [/Silvestre/i, 'Silvestre'],
  [/Trinitario/i, 'Trinitario'],
  [/Theobroma Bicolor|Majambo/i, 'Theobroma Bicolor'],
];

const COUNTRIES = [
  'Bolivia', 'Brasil', 'Colombia', 'Ecuador', 'Guinea Ecuatorial',
  'Honduras', 'Nicaragua', 'Perú', 'Venezuela',
];

const locationMap = {
  'Quellouno': 'Perú', 'Bagua Grande': 'Perú', 'Tocache': 'Perú',
  'Cajaruro': 'Perú', 'Quillabamba': 'Perú', 'Jaén': 'Perú',
  'Unión Ashaninka': 'Perú', 'La Pareja': 'Perú', 'Piura': 'Perú',
  'Chazuta': 'Perú', 'Tarapoto': 'Perú', 'San Martín': 'Perú',
  'Cuzco': 'Perú',
  'Waslala': 'Nicaragua',
  'Esmeraldas': 'Ecuador', 'Flavio Alfaro': 'Ecuador', 'Manabí': 'Ecuador', 'Guayas': 'Ecuador',
  'Ilhéus': 'Brasil', 'Bahía': 'Brasil', 'Tuere': 'Brasil',
  'Isla Bioko': 'Guinea Ecuatorial',
  'Agua Fría': 'Honduras',
  'San Carlos': 'Bolivia', 'Moxos': 'Bolivia',
  'Maceo': 'Colombia', 'Tumaco': 'Colombia',
  'Ocumare': 'Venezuela',
};

/* ─── Manual overrides for complex products ─── */
const OVERRIDES = {
  // Trufas
  'trufas-de-chocolate-de-origen': {
    originCountries: ['Perú'],
    cacaoPercents: [70],
    chocolateTypes: ['Oscuros'],
  },
  'trufas-con-chocolate-bagua-grande-amazonas-peru-70-con-cacao-natural-del-mismo-origen': {
    originCountries: ['Perú'],
    grainTypes: ['Nativo Amazónico'],
    cacaoPercents: [70],
    chocolateTypes: ['Oscuros'],
  },
  // Pellizcos
  'naranjitas-cubiertas-en-chocolate-tocache-san-martin-peru-60': {
    originCountries: ['Perú'],
    cacaoPercents: [60],
    chocolateTypes: ['Oscuros'],
  },
  'nueces-con-dulce-de-leche-y-cardamomo-con-chocolate-60-tocache-peru': {
    originCountries: ['Perú'],
    cacaoPercents: [60],
    chocolateTypes: ['Oscuros'],
  },
  'avellanas-caramelizadas-rebozadas-en-cacao-natural-de-origen-100': {
    originCountries: ['Perú'],
    cacaoPercents: [100],
    chocolateTypes: ['Oscuros'],
  },
  'almendras-caramelizadas-rebozadas-en-cacao-amargo-de-origen-100': {
    originCountries: ['Perú'],
    cacaoPercents: [100],
    chocolateTypes: ['Oscuros'],
  },
  // Bombón
  'bombon-de-mucilago-de-cacao-2u': {
    chocolateTypes: ['Oscuros'],
  },
  // Festividades
  'rosca-de-pascuas-con-harina-de-cacao-y-chocolate-ecuatoriano': {
    originCountries: ['Ecuador'],
    chocolateTypes: ['Oscuros'],
  },
  'huevo-de-pascuas-coleccion-origen-version-bagua': {
    originCountries: ['Perú'],
    grainTypes: ['Nativo Amazónico'],
    chocolateTypes: ['Oscuros'],
  },
  'huevo-de-pascuas-coleccion-origen-version-cuzco': {
    originCountries: ['Perú'],
    grainTypes: ['Mix de Chunchos'],
    chocolateTypes: ['Oscuros'],
  },
  'huevo-de-pascuas-coleccion-origen-version-tocache': {
    originCountries: ['Perú'],
    grainTypes: ['CRA / Mix Aromático'],
    chocolateTypes: ['Oscuros'],
  },
  'huevo-marroc-mani-bombones-250': {
    chocolateTypes: ['Oscuros'],
  },
  'huevo-de-pascuas-coleccion-clasica-ecuatorianas': {
    originCountries: ['Ecuador'],
    cacaoPercents: [70],
    chocolateTypes: ['Oscuros'],
  },
  'huevo-de-pascuas-chocolate-con-leche-coleccion-clasica-blend-de-fincas-colombianas-250g': {
    originCountries: ['Colombia'],
    chocolateTypes: ['Oscuros'],
  },
  'huevo-de-pascuas-chocolate-con-leche-coleccion-clasica-blend-de-fincas-colombianas-100g-con-bombones-surtidos': {
    originCountries: ['Colombia'],
    chocolateTypes: ['Oscuros'],
  },
  'huevo-de-pascuas-con-cremas-de-frutos-secos': {
    chocolateTypes: ['Oscuros'],
  },
  // Derivados de cacao
  'nibs-de-cacao-chuncho-quellouno-cuzco-peru': {
    originCountries: ['Perú'],
    grainTypes: ['Mix de Chunchos'],
  },
  'cacao-fino-tostado-mix-aromatico-tocache-peru': {
    originCountries: ['Perú'],
    grainTypes: ['CRA / Mix Aromático'],
  },
  'cascarilla-de-cacao': {},
  'harina-de-cacao-de-origen-250g': {},
  'stollen-harina-de-cacao-limoncello-mora': {},
  'stollen-con-harina-de-cacao-y-licor-de-naranja': {},
  'macalate-amantheo-100-chazuta-tarapoto-peru-theobroma-bicolor-majambo': {
    originCountries: ['Perú'],
    grainTypes: ['Theobroma Bicolor'],
    cacaoPercents: [100],
    chocolateTypes: ['Oscuros'],
  },
  // Turrones
  'turron-de-mani-cubierto-con-chocolate-peruano-al-70-nibs-porciones-pote-surtidos-variedad': {
    originCountries: ['Perú'],
    cacaoPercents: [70],
    chocolateTypes: ['Oscuros'],
  },
  'turron-de-chocolate': {
    cacaoPercents: [70],
    chocolateTypes: ['Oscuros'],
  },
  'turron-de-mani-y-nibs-garrapinados-de-esmeraldas-ecuador': {
    originCountries: ['Perú'],
    chocolateTypes: ['Oscuros'],
  },
  'turron-gianduia-chocolate-origen-beantobar-alicante-blando': {
    chocolateTypes: ['Oscuros'],
  },
  'chocolate-de-origen-ashanti-region-ghana-70-frambuesa-mora-almendras-y-pistachos': {
    cacaoPercents: [70],
    chocolateTypes: ['Oscuros'],
  },
  'estilo-jijona-nibs-almendras': {
    chocolateTypes: ['Oscuros'],
  },
  // Packs
  'packgift-mini-alfajores-hc-x-7u-ddl-y-cardamomo': {},
  'packgift-mix-bombones': {
    chocolateTypes: ['Oscuros'],
  },
  'packgift-alfajores-petit-bombon-edicion-limitada': {
    isLimited: true,
    chocolateTypes: ['Oscuros'],
  },
  // Box pellizcos
  'box-pellizcos-250g': {
    originCountries: ['Perú'],
    chocolateTypes: ['Oscuros'],
  },
  'box-pellizcos-500g': {
    originCountries: ['Perú'],
    chocolateTypes: ['Oscuros'],
  },
  'box-pellizcos-1kg': {
    originCountries: ['Perú'],
    chocolateTypes: ['Oscuros'],
  },
  // Alfajores - they use cacao flour, not a specific bean type
  'alfajor-de-harina-de-cacao-ddl-y-cardamomo': {},
  'alfajor-de-harina-de-cacao-pistachos': {},
  'alfajor-de-harina-de-cacao-marroc': {},
  'alfajor-de-harina-de-cacao-chocolate-blanco-y-nibs': {
    chocolateTypes: ['Blancos'],
  },
  'alfajor-de-harina-de-cacao-de-chocolate-oscuro-60-y-nibs': {
    cacaoPercents: [60],
    chocolateTypes: ['Oscuros'],
  },
};

const results = {};

for (const p of products) {
  const combined = `${p.name} ${p.subtitle} ${p.badge}`;
  const override = OVERRIDES[p.id];

  // ── Grain types ──
  let grainTypes = [];
  for (const [pattern, label] of GRAIN_PATTERNS) {
    if (pattern.test(combined)) grainTypes.push(label);
  }
  if (override?.grainTypes) {
    for (const g of override.grainTypes) {
      if (!grainTypes.includes(g)) grainTypes.push(g);
    }
  }

  // ── Origin countries ──
  let originCountries = [];
  for (const country of COUNTRIES) {
    if (combined.includes(country)) originCountries.push(country);
  }
  for (const [loc, country] of Object.entries(locationMap)) {
    if (combined.includes(loc) && !originCountries.includes(country)) {
      originCountries.push(country);
    }
  }
  if (override?.originCountries) {
    for (const o of override.originCountries) {
      if (!originCountries.includes(o)) originCountries.push(o);
    }
  }

  // ── Cacao % ──
  let cacaoPercents = [];
  const pctMatches = p.name.match(/(\d+)%/g);
  if (pctMatches) {
    for (const m of pctMatches) {
      const n = parseInt(m);
      if (n >= 40 && n <= 200) cacaoPercents.push(n);
    }
  }
  if (override?.cacaoPercents) {
    for (const n of override.cacaoPercents) {
      if (!cacaoPercents.includes(n)) cacaoPercents.push(n);
    }
  }

  // ── Chocolate types ──
  let chocolateTypes = [];
  if (/Chocolate Blanco|BLANCO/i.test(combined)) chocolateTypes.push('Blancos');
  if (/Chocolate Oscuro/i.test(p.name) || (p.categoryId === 'tree-bean' && !chocolateTypes.includes('Blancos'))) {
    chocolateTypes.push('Oscuros');
  }
  if (/Vegano|Leche de Coco|Avena/i.test(combined)) chocolateTypes.push('Veganos');
  if (p.categoryId === 'tabletas-rellenas' && !chocolateTypes.length) chocolateTypes.push('Oscuros');
  if (override?.chocolateTypes) {
    for (const t of override.chocolateTypes) {
      if (!chocolateTypes.includes(t)) chocolateTypes.push(t);
    }
  }

  // ── Limited edition ──
  let isLimited = /Edición Limitada|Edicion Limitada|limited/i.test(combined) || override?.isLimited || false;

  results[p.id] = {
    grainTypes: grainTypes.length ? grainTypes : undefined,
    originCountries: originCountries.length ? originCountries : undefined,
    cacaoPercents: cacaoPercents.length ? [...new Set(cacaoPercents)].sort((a,b)=>a-b) : undefined,
    chocolateTypes: chocolateTypes.length ? [...new Set(chocolateTypes)] : undefined,
    isLimited: isLimited || undefined,
  };
}

console.log(JSON.stringify(results, null, 2));

// Summary
let withGrain = 0, withOrigin = 0, withPct = 0, withType = 0, limited = 0, noData = 0;
for (const r of Object.values(results)) {
  if (r.grainTypes) withGrain++;
  if (r.originCountries) withOrigin++;
  if (r.cacaoPercents) withPct++;
  if (r.chocolateTypes) withType++;
  if (r.isLimited) limited++;
  if (!r.grainTypes && !r.originCountries && !r.cacaoPercents && !r.chocolateTypes && !r.isLimited) noData++;
}
console.error(`\n✓ Filter metadata generated`);
console.error(`  With grain: ${withGrain}, origin: ${withOrigin}, %: ${withPct}, type: ${withType}, limited: ${limited}`);
console.error(`  Products with NO filter data: ${noData}`);
