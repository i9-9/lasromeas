#!/usr/bin/env node
/**
 * Generates shortName, subtitle and badge for every product.
 * Based on bean-to-bar industry benchmark (Dick Taylor, Marou, Pump Street, Raaka, Fruition).
 *
 * Rules:
 *   - % goes FIRST in shortName for bars (e.g., "70% Bagua Grande")
 *   - Brand/line names become badges, NOT part of the title
 *   - "Chocolate Oscuro/Blanco" becomes a type indicator, not in subtitle
 *   - Subtitle focuses on variety, tasting notes, or descriptive info
 */

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'products.ts'), 'utf8');
const products = [];
const regex = /\{\s*id:\s*"([^"]+)",\s*slug:\s*"[^"]+",\s*name:\s*"([^"]+)",[\s\S]*?categoryId:\s*"([^"]+)"/g;
let m;
while ((m = regex.exec(src)) !== null) {
  products.push({ id: m[1], name: m[2], categoryId: m[3] });
}
console.error(`Found ${products.length} products\n`);

const O = {
  // ══════════════════════════════════════════════════════
  //  TREE-BEAN (AMANTHEO) — badge: "AMANTHEO"
  //  Format: "% Ciudad" or "% Descriptor"
  // ══════════════════════════════════════════════════════
  'amantheo-quellouno-cuzco-80-40g': {
    shortName: '80% Quellouno', subtitle: 'Mix de Chunchos', badge: 'AMANTHEO',
  },
  'amantheo-bagua-grande-amazonas-peru-70-tree-to-bar': {
    shortName: '70% Bagua Grande', subtitle: 'Cacao Nativo Amazónico', badge: 'AMANTHEO',
  },
  'tableta-amantheo-amazonico-bagua-grande-90': {
    shortName: '90% Bagua Grande', subtitle: 'Cacao Nativo Amazónico', badge: 'AMANTHEO',
  },
  'tableta-amantheo-grano-chuncho-70-40g': {
    shortName: '70% Quellouno', subtitle: 'Mix de Chunchos', badge: 'AMANTHEO',
  },
  'tableta-barra-amantheo-punta-de-lanza-70-40g': {
    shortName: '70% Punta de Lanza', subtitle: 'Quellouno, Cuzco', badge: 'AMANTHEO',
  },
  'tableta-amantheo-punta-de-lanza-80': {
    shortName: '80% Punta de Lanza', subtitle: 'Quellouno, Cuzco', badge: 'AMANTHEO',
  },
  'tableta-amantheo-tocache-70': {
    shortName: '70% Tocache', subtitle: 'Mix Aromático · San Martín, Perú', badge: 'AMANTHEO',
  },
  'tableta-amantheo-chocolate-blanco-con-nibs-40-manteca-de-cacao-origen-cremoso': {
    shortName: '40% Quellouno + Nibs', subtitle: 'Cacao Chuncho', badge: 'AMANTHEO · BLANCO',
  },
  'chocolateblancofrutilla': {
    shortName: '40% Quellouno Frutilla', subtitle: 'Cacao Chuncho', badge: 'AMANTHEO · BLANCO',
  },
  'amantheo-chuncho-40g-singleorigin-alimento-coco-vegano': {
    shortName: '40% Chuncho Coco', subtitle: 'Con Leche de Coco · Vegano', badge: 'AMANTHEO',
  },
  'amantheo-40-con-leche-de-avena-vegano': {
    shortName: '40% Mix Aromático Avena', subtitle: 'Con Leche de Avena · Vegano', badge: 'AMANTHEO',
  },
  'amantheo-kriskawas-70-waslala-nicaragua': {
    shortName: '70% Waslala', subtitle: 'Kriskawas · Nicaragua', badge: 'AMANTHEO',
  },
  'amantheo-kriskawas-80-waslala-nicaragua': {
    shortName: '80% Waslala', subtitle: 'Kriskawas · Nicaragua', badge: 'AMANTHEO',
  },
  'amantheo-grano-amazonico-100-bagua-grande-amazonas-peru': {
    shortName: '100% Bagua Grande', subtitle: 'Cacao Nativo Amazónico', badge: 'AMANTHEO',
  },
  'amantheo-chuncho-senorita-80-quellouno-cuzco-peru': {
    shortName: '80% Chuncho Señorita', subtitle: 'Quellouno, Cuzco', badge: 'AMANTHEO',
  },
  'amantheo-chuncho-senorita-70-quellouno-cuzco-peru': {
    shortName: '70% Chuncho Señorita', subtitle: 'Quellouno, Cuzco', badge: 'AMANTHEO',
  },
  'amantheo-chuncho-100-quellouno-cuzco-peru': {
    shortName: '100% Quellouno', subtitle: 'Mix de Chunchos', badge: 'AMANTHEO',
  },
  'amantheo-grano-nacional-70-san-mateo-esmeraldas-ecuador': {
    shortName: '70% Esmeraldas', subtitle: 'Grano Nacional · Ecuador', badge: 'AMANTHEO',
  },
  'amantheo-grano-krislala-100-waslala-costa-caribe-norte-nicaragua': {
    shortName: '100% Waslala', subtitle: 'Grano Krislala · Nicaragua', badge: 'AMANTHEO',
  },
  'chocolate-blanco-40-con-nibs-amantheo-bagua-grande-amazonas-peru-cacao-nativo-amazonico': {
    shortName: '40% Bagua Grande + Nibs', subtitle: 'Cacao Nativo Amazónico', badge: 'AMANTHEO · BLANCO',
  },
  'chocolate-oscuro-amantheo-ilheus-brasil-80-cacao-catongo': {
    shortName: '80% Ilhéus', subtitle: 'Cacao Catongo · Brasil', badge: 'AMANTHEO',
  },
  'chocolate-oscuro-amantheo-agua-fria-honduras-70-cacao-trinitario': {
    shortName: '70% Agua Fría', subtitle: 'Cacao Trinitario · Honduras', badge: 'AMANTHEO',
  },
  'chocolate-oscuro-amantheo-isla-bioko-guinea-ecuatorial-africa-70-cacao-amelonado': {
    shortName: '70% Isla Bioko', subtitle: 'Cacao Amelonado · Guinea Ecuatorial', badge: 'AMANTHEO',
  },
  'chocolate-amantheo-blanco-con-leche-tostada-quellouno-cuzco-peru-40-con-nibs-garrapinados-del-mismo-origen': {
    shortName: '40% Leche Tostada + Nibs', subtitle: 'Nibs Garrapiñados · Quellouno, Cuzco', badge: 'AMANTHEO · BLANCO',
  },
  'chocolate-oscuro-amantheo-cajaruro-amazonas-peru-75-cacao-nativo-amazonico': {
    shortName: '75% Cajaruro', subtitle: 'Cacao Nativo Amazónico', badge: 'AMANTHEO',
  },
  'chocolate-oscuro-amantheo-flavio-alfaro-ecuador-con-mucilago-de-cacao-200-cacao-nacional': {
    shortName: 'Flavio Alfaro + Mucílago', subtitle: 'Cacao Nacional · Ecuador', badge: 'AMANTHEO',
  },
  'chocolate-oscuro-amantheo-union-ashaninka-cuzco-peru-75-cacao-bellavista': {
    shortName: '75% Unión Ashaninka', subtitle: 'Cacao Bellavista · Cuzco', badge: 'AMANTHEO',
  },
  'chocolate-amantheo-75-la-pareja-piura-peru-blanco-de-piura-gran-blanco': {
    shortName: '75% La Pareja', subtitle: 'Blanco de Piura / Gran Blanco', badge: 'AMANTHEO',
  },
  'chocolate-amantheo-70-jaen-cajamarca-peru-nacional-del-maranon-e-hibridos': {
    shortName: '70% Jaén', subtitle: 'Nacional del Marañón e Híbridos · Cajamarca', badge: 'AMANTHEO',
  },
  'chocolate-amantheo-70-jaen-cajamarca-peru-nacional-del-maranon-e-hibridos-2': {
    shortName: '70% Ocumare', subtitle: 'Blend Ocumare y Chuao · Venezuela', badge: 'AMANTHEO',
  },
  'chocolate-oscuro-amantheo-san-carlos-santa-cruz-bolivia-cacao-silvestre-y-ccn51': {
    shortName: 'San Carlos, Bolivia', subtitle: 'Cacao Silvestre y CCN51', badge: 'AMANTHEO',
  },
  'chocolate-oscuro-amantheo-maceo-antioquia-colombia-80-cacao-criollos-modernos': {
    shortName: '80% Maceo', subtitle: 'Cacao Criollos Modernos · Colombia', badge: 'AMANTHEO',
  },
  'chocolate-blanco-nibs-amantheo-esmeraldas-ecuador-40-cacao-nacional': {
    shortName: '40% Esmeraldas + Nibs', subtitle: 'Cacao Nacional · Ecuador', badge: 'AMANTHEO · BLANCO',
  },
  'chocolate-oscuro-amantheo-quillabamba-cuzco-peru-80-cacao-chuncho-cascara-de-huevo': {
    shortName: '80% Quillabamba', subtitle: 'Chuncho Cáscara de Huevo · Cuzco', badge: 'AMANTHEO',
  },
  'tuereamazonas-brasil': {
    shortName: '75% Tuere', subtitle: 'Amelonado y Catongo · Brasil', badge: 'AMANTHEO',
  },

  // ══════════════════════════════════════════════════════
  //  ALFAJORES — badge: "ALFAJOR"
  // ══════════════════════════════════════════════════════
  'alfajor-de-harina-de-cacao-ddl-y-cardamomo': {
    shortName: 'DDL y Cardamomo', subtitle: 'Con Harina de Cacao', badge: 'ALFAJOR',
  },
  'alfajor-de-harina-de-cacao-pistachos': {
    shortName: 'Pistacho', subtitle: 'Con Harina de Cacao', badge: 'ALFAJOR',
  },
  'alfajor-de-harina-de-cacao-de-chocolate-oscuro-60-y-nibs': {
    shortName: 'Chocolate Oscuro y Nibs', subtitle: 'Con Harina de Cacao', badge: 'ALFAJOR',
  },
  'alfajor-de-harina-de-cacao-chocolate-blanco-y-nibs': {
    shortName: 'Chocolate Blanco y Nibs', subtitle: 'Con Harina de Cacao', badge: 'ALFAJOR',
  },
  'alfajor-de-harina-de-cacao-marroc': {
    shortName: 'Marroc', subtitle: 'Con Harina de Cacao', badge: 'ALFAJOR',
  },

  // ══════════════════════════════════════════════════════
  //  TABLETAS — badge: "LAS ROMEAS" or "TABLETA RELLENA"
  //  Format: "% Ciudad/Inclusión"
  // ══════════════════════════════════════════════════════
  'barra-de-chocolate-con-leche-50-con-leche-tocache-san-martiin-peru-con-crumble-de-avellanas-y-nuez-moscada': {
    shortName: '47% Moxos con Leche', subtitle: 'Crumble de Avellanas y Nuez Moscada · Bolivia', badge: 'LAS ROMEAS',
  },
  'barra-de-chocolate-60-blend-de-granos-trinitarios-colombianos-con-inclusiones-de-jengibre-y-cardamomo': {
    shortName: '60% Colombia', subtitle: 'Jengibre y Cardamomo · Granos Trinitarios', badge: 'LAS ROMEAS',
  },
  'barra-de-chocolate-oscuro-bahia-brasil-70-relleno-de-coulis-reduccion-de-cerezas': {
    shortName: '70% Bahía Rellena', subtitle: 'Coulis / Reducción de Cerezas · Brasil', badge: 'LAS ROMEAS',
  },
  'tableta-blend-peruano-42-con-leche-avellanas-y-cafe': {
    shortName: '42% con Leche', subtitle: 'Avellanas y Café · Blend Peruano', badge: 'LAS ROMEAS',
  },
  'tableta-manabi-72': {
    shortName: '72% Manabí', subtitle: 'Ecuador', badge: 'LAS ROMEAS',
  },
  'tableta-amazonico-70-c-arandanos': {
    shortName: '70% Arándanos', subtitle: 'Arándanos Entrerrianos · Blend Peruano', badge: 'LAS ROMEAS',
  },
  'tableta-bahia-superior-brasil-70-c-avellanas-y-cafe': {
    shortName: '70% Bahía Superior', subtitle: 'Avellanas y Café · Brasil', badge: 'LAS ROMEAS',
  },
  'tableta-blend-de-leche-c-almendras-y-nibs': {
    shortName: 'Con Leche, Almendras y Nibs', subtitle: 'Blend Colombiano', badge: 'LAS ROMEAS',
  },
  'tableta-carenero-superior-venezuela-70-c-nibs-y-almendras': {
    shortName: '70% Carenero Superior', subtitle: 'Nibs y Almendras · Venezuela', badge: 'LAS ROMEAS',
  },
  'tableta-guayas-ecuador-100': {
    shortName: '100% Guayas', subtitle: 'Ecuador', badge: 'LAS ROMEAS',
  },
  'tableta-rellena-crema-de-pistacho': {
    shortName: '60% Pistachos', subtitle: 'Crema de Pistachos · Blend Peruano', badge: 'TABLETA RELLENA',
  },
  'tableta-rellena-ddl-y-cardamomo': {
    shortName: '60% DDL y Cardamomo', subtitle: 'Dulce de Leche y Cardamomo · Blend Peruano', badge: 'TABLETA RELLENA',
  },
  'tableta-rellena-marroc-y-miso': {
    shortName: '60% Marroc y Miso', subtitle: 'Blend de Granos Peruanos', badge: 'TABLETA RELLENA',
  },
  'tableta-las-romeas-70-tumaco-costa-pacifica-colombia': {
    shortName: '70% Tumaco', subtitle: 'Con Nibs · Costa Pacífica, Colombia', badge: 'LAS ROMEAS',
  },

  // ══════════════════════════════════════════════════════
  //  TRUFAS
  // ══════════════════════════════════════════════════════
  'trufas-de-chocolate-de-origen': {
    shortName: '70% Blend Peruano', subtitle: 'Rebozadas en Cacao Natural del Mismo Origen', badge: 'TRUFAS',
  },
  'trufas-con-chocolate-bagua-grande-amazonas-peru-70-con-cacao-natural-del-mismo-origen': {
    shortName: '70% Bagua Grande', subtitle: 'Cubiertas en Chocolate 100% del Mismo Origen', badge: 'TRUFAS',
  },

  // ══════════════════════════════════════════════════════
  //  BOMBONES
  // ══════════════════════════════════════════════════════
  'bombon-de-mucilago-de-cacao-2u': {
    shortName: 'Mucílago de Cacao', subtitle: '2 unidades', badge: 'BOMBÓN',
  },

  // ══════════════════════════════════════════════════════
  //  PELLIZCOS & FRUTOS CUBIERTOS
  // ══════════════════════════════════════════════════════
  'naranjitas-cubiertas-en-chocolate-tocache-san-martin-peru-60': {
    shortName: 'Naranjitas 60%', subtitle: 'Cubiertas en Chocolate · Tocache, Perú', badge: '',
  },
  'nueces-con-dulce-de-leche-y-cardamomo-con-chocolate-60-tocache-peru': {
    shortName: 'Nueces DDL y Cardamomo', subtitle: 'Con Chocolate 60% · Tocache, Perú', badge: '',
  },
  'avellanas-caramelizadas-rebozadas-en-cacao-natural-de-origen-100': {
    shortName: 'Avellanas en Cacao', subtitle: 'Rebozadas en Cacao Natural · Tocache, Perú', badge: '',
  },
  'almendras-caramelizadas-rebozadas-en-cacao-amargo-de-origen-100': {
    shortName: 'Almendras en Cacao', subtitle: 'Rebozadas en Cacao Natural · Bagua Grande', badge: '',
  },

  // ══════════════════════════════════════════════════════
  //  PACKS & BOXES
  // ══════════════════════════════════════════════════════
  'packgift-mini-alfajores-hc-x-7u-ddl-y-cardamomo': {
    shortName: 'Alfajores Petit x7', subtitle: 'Mixtos con Harina de Cacao', badge: 'PACKGIFT',
  },
  'packgift-mix-bombones': {
    shortName: 'Mix Bombones', subtitle: '', badge: 'PACKGIFT',
  },
  'packgift-alfajores-petit-bombon-edicion-limitada': {
    shortName: 'Petit Bombón', subtitle: 'Alfajores · Edición Limitada', badge: 'PACKGIFT',
  },
  'box-pellizcos-dulce-de-leche-ron-y-harina-de-cacao': {
    shortName: 'Pellizcos Oscuros y Blancos', subtitle: '', badge: 'BOX',
  },
  'box-pellizcos-dulce-de-leche-ron-y-harina-de-cacao-2': {
    shortName: 'Pellizcos DDL y Ron', subtitle: 'Con Harina de Cacao · Chocolate Oscuro', badge: 'BOX',
  },
  'box-pellizcos-dulce-de-leche-nuez-nibs-y-harina-de-cacao': {
    shortName: 'Pellizcos DDL y Nuez', subtitle: 'Con Nibs y Harina de Cacao · Choc. Blanco', badge: 'BOX',
  },

  // ══════════════════════════════════════════════════════
  //  FESTIVIDADES (PASCUAS)
  // ══════════════════════════════════════════════════════
  'rosca-de-pascuas-con-harina-de-cacao-y-chocolate-ecuatoriano': {
    shortName: 'Rosca de Pascuas', subtitle: 'Harina de Cacao y Chocolate Ecuatoriano', badge: 'PASCUAS',
  },
  'huevo-de-pascuas-coleccion-origen-version-bagua': {
    shortName: 'Origen Bagua', subtitle: 'Colección Origen', badge: 'PASCUAS',
  },
  'huevo-de-pascuas-coleccion-origen-version-cuzco': {
    shortName: 'Origen Cuzco', subtitle: 'Colección Origen', badge: 'PASCUAS',
  },
  'huevo-de-pascuas-coleccion-origen-version-tocache': {
    shortName: 'Origen Tocache 250g', subtitle: 'Colección Origen', badge: 'PASCUAS',
  },
  'huevo-pascuas-blanco-100': {
    shortName: 'Blanco + Nibs 100g', subtitle: 'Colección Clásica · Blend Peruano', badge: 'PASCUAS',
  },
  'huevo-blanco-chocolate-nibs-200': {
    shortName: 'Blanco + Nibs 200g', subtitle: 'Colección Clásica · Blend Peruano', badge: 'PASCUAS',
  },
  'huevo-marroc-mani-bombones-250': {
    shortName: 'Marroc con Maní', subtitle: 'Chocolate con Leche · Crocante de Maní', badge: 'PASCUAS',
  },
  'huevo-de-pascuas-coleccion-clasica-ecuatorianas': {
    shortName: '70% Ecuatoriano', subtitle: 'Colección Clásica · Blend Ecuatoriano', badge: 'PASCUAS',
  },
  'huevo-de-pascuas-chocolate-con-leche-coleccion-clasica-blend-de-fincas-colombianas-250g': {
    shortName: 'Con Leche 200g', subtitle: 'Colección Clásica · Blend Colombiano', badge: 'PASCUAS',
  },
  'huevo-de-pascuas-chocolate-con-leche-coleccion-clasica-blend-de-fincas-colombianas-100g-con-bombones-surtidos': {
    shortName: 'Con Leche 100g + Bombones', subtitle: 'Colección Clásica · Blend Colombiano', badge: 'PASCUAS',
  },
  'huevo-de-pascuas-blanco-con-nibs-tocache-peru-coleccion-clasica-blend-peruano-200g-con-bombones-surtidos': {
    shortName: 'Blanco 200g + Bombones', subtitle: 'Colección Clásica · Tocache · Blend Peruano', badge: 'PASCUAS',
  },
  'huevo-de-pascuas-con-cremas-de-frutos-secos': {
    shortName: 'Cremas de Frutos Secos', subtitle: 'Pistacho y Avellanas · 380g', badge: 'PASCUAS',
  },

  // ══════════════════════════════════════════════════════
  //  DERIVADOS DE CACAO
  // ══════════════════════════════════════════════════════
  'stollen-harina-de-cacao-limoncello-mora': {
    shortName: 'Stollen Limoncello y Mora', subtitle: 'Con Harina de Cacao', badge: '',
  },
  'stollen-con-harina-de-cacao-y-licor-de-naranja': {
    shortName: 'Stollen Licor de Naranja', subtitle: 'Con Harina de Cacao', badge: '',
  },
  'nibs-de-cacao-chuncho-quellouno-cuzco-peru': {
    shortName: 'Nibs de Cacao Chuncho', subtitle: 'Quellouno, Cuzco, Perú', badge: '',
  },
  'cacao-fino-tostado-mix-aromatico-tocache-peru': {
    shortName: 'Cacao Fino Tostado', subtitle: 'Mix Aromático · Tocache, Perú', badge: '',
  },
  'cascarilla-de-cacao': {
    shortName: 'Cascarilla de Cacao', subtitle: 'De Origen · 250g', badge: '',
  },
  'harina-de-cacao-de-origen-250g': {
    shortName: 'Harina de Cacao', subtitle: 'De Origen · 250g', badge: '',
  },

  // ══════════════════════════════════════════════════════
  //  TURRONES
  // ══════════════════════════════════════════════════════
  'turron-de-mani-cubierto-con-chocolate-peruano-al-70-nibs-porciones-pote-surtidos-variedad': {
    shortName: 'Mix en Porciones', subtitle: 'Porciones Surtidas', badge: 'TURRÓN',
  },
  'turron-de-chocolate': {
    shortName: 'Deli de Chocolate 70%', subtitle: 'Avellanas, Mandarina y Naranja · 100g', badge: 'TURRÓN',
  },
  'turron-de-mani-y-nibs-garrapinados-de-esmeraldas-ecuador': {
    shortName: 'Marroc Marmolado', subtitle: 'Con Nibs · Quellouno, Perú · 300g', badge: 'TURRÓN',
  },
  'turron-gianduia-chocolate-origen-beantobar-alicante-blando': {
    shortName: 'Gianduia', subtitle: 'Avellanas, Mandarina y Naranja · 300g', badge: 'TURRÓN',
  },
  'chocolate-de-origen-ashanti-region-ghana-70-frambuesa-mora-almendras-y-pistachos': {
    shortName: 'Negro Pistacho y Almendras', subtitle: 'Frutos Rojos y Chocolate de Origen · 300g', badge: 'TURRÓN',
  },
  'estilo-jijona-nibs-almendras': {
    shortName: 'Estilo Jijona', subtitle: 'Nibs de Origen y Almendras · 300g', badge: 'TURRÓN',
  },
  'turron-blanco-almendras-nibs-garrapinados': {
    shortName: 'Blanco de Almendras', subtitle: 'Con Nibs Garrapiñados', badge: 'TURRÓN',
  },

  // ══════════════════════════════════════════════════════
  //  THEOBROMAS
  // ══════════════════════════════════════════════════════
  'macalate-amantheo-100-chazuta-tarapoto-peru-theobroma-bicolor-majambo': {
    shortName: '100% Chazuta', subtitle: 'Theobroma Bicolor · Majambo · Tarapoto, Perú', badge: 'MACALATE',
  },
};

// Verify all products have overrides
const results = {};
let missing = 0;
for (const p of products) {
  if (O[p.id]) {
    results[p.id] = O[p.id];
  } else {
    console.error(`✗ Missing override: ${p.id} [${p.categoryId}] "${p.name}"`);
    results[p.id] = { shortName: p.name.substring(0, 40), subtitle: '', badge: '' };
    missing++;
  }
}

console.log(JSON.stringify(results, null, 2));

const lengths = Object.values(results).map(r => r.shortName.length);
console.error(`\n✓ Generated ${Object.keys(results).length} (${missing} missing overrides)`);
console.error(`  Avg: ${Math.round(lengths.reduce((a,b)=>a+b,0)/lengths.length)} chars`);
console.error(`  Max: ${Math.max(...lengths)} chars`);
console.error(`  Min: ${Math.min(...lengths)} chars`);
