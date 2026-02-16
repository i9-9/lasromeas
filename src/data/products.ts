// ─────────────────────────────────────────────
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

export const PRODUCTS: Product[] = [
  // ── Barras Tree & Bean To Bar (AMANTHEO) ──
  {
    id: "amantheo-quellouno-cuzco-80-40g",
    slug: "amantheo-quellouno-cuzco-80-40g",
    name: "Chocolate Oscuro Amantheo - Quellouno, Cuzco, Perú 80% - Cacao Mix de Chunchos",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/amantheo-quellouno-cuzco-80-40g.jpg",
    description:
      "Barra de chocolate Bean to Bar Origen: Quellouno, Cuzco, Perú Grano: Mix Chunchos 40G",
    isFeatured: true,
  },
  {
    id: "amantheo-bagua-grande-amazonas-peru-70-tree-to-bar",
    slug: "amantheo-bagua-grande-amazonas-peru-70-tree-to-bar",
    name: "Chocolate Oscuro Amantheo - Bagua Grande, Amazonas, Perú 70% - Cacao Nativo Amazónico",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/amantheo-bagua-grande-amazonas-peru-70-tree-to-bar.jpg",
    description:
      "Barra de chocolate Bean to Bar Origen: Jahuanga, Bagua Grande, Amazonas-Perú Grano: Grano nativo amazónico Ingredientes: pasta de cacao 70%, azúcar 30% Producto libre de conservantes y aditivos Producto apto vegano 40g",
    isFeatured: true,
  },
  {
    id: "tableta-amantheo-amazonico-bagua-grande-90",
    slug: "tableta-amantheo-amazonico-bagua-grande-90",
    name: "Chocolate Oscuro Amantheo - Bagua Grande, Amazonas, Perú 90% - Cacao Nativo Amazónico",
    categoryId: "tree-bean",
    price: 13000,
    currency: "ARS",
    image: "/products/tableta-amantheo-amazonico-bagua-grande-90.jpg",
    description:
      "Barra de chocolate Bean to Bar Origen: Jahuanga, Bagua Grande, Amazonas, Perú Grano: Grano nativo amazónico Ingredientes: Pasta de cacao 90% y azúcar. Producto libre de conservantes y aditivos Producto apto vegano 40g",
  },
  {
    id: "tableta-amantheo-grano-chuncho-70-40g",
    slug: "tableta-amantheo-grano-chuncho-70-40g",
    name: "Chocolate Oscuro Amantheo - Quellouno, Cuzco, Perú 70% - Cacao Mix de Chunchos",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/tableta-amantheo-grano-chuncho-70-40g.jpg",
    description:
      "Barra de chocolate Tree to Bar 70% Origen: Quellouno, Cuzco, Perú Grano: Mix de Chunchos Peso: 40g.",
  },
  {
    id: "tableta-barra-amantheo-punta-de-lanza-70-40g",
    slug: "tableta-barra-amantheo-punta-de-lanza-70-40g",
    name: "Chocolate Oscuro Amantheo - Quellouno, Cuzco, Perú 70% - Cacao Punta de Lanza",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/tableta-barra-amantheo-punta-de-lanza-70-40g.jpg",
    description:
      "Barra de chocolate Bean to Bar 70% Origen: Quellouno, Cuzco, Perú Grano: Punta de Lanza Producto libre de conservantes y aditivos 40G",
  },
  {
    id: "tableta-amantheo-punta-de-lanza-80",
    slug: "tableta-amantheo-punta-de-lanza-80",
    name: "Chocolate Oscuro Amantheo - Quellouno, Cuzco, Perú 80% - Cacao Chuncho Punta de Lanza",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/tableta-amantheo-punta-de-lanza-80.jpg",
    description:
      "Barra de chocolate Bean to Bar Origen: Quellouno, Cuzco, Perú Grano: Punta de Lanza Ingredientes: Pasta de cacao 80%, azúcar 20% Producto libre de conservantes y aditivos Producto apto vegano 40g.",
  },
  {
    id: "tableta-amantheo-tocache-70",
    slug: "tableta-amantheo-tocache-70",
    name: "Chocolate Oscuro Amantheo - Tocache, San Martín, Perú 70% - Grano Cra/ Mix Aromatico",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/tableta-amantheo-tocache-70.jpg",
    description:
      "Barra de chocolate Bean to Bar Origen: Tocache, San Martín, Perú Grano: Mix Aromático o CRA Ingredientes: Pasta de cacao 70%, azúcar 30% Producto libre de conservantes y aditivos Producto apto vegano 40G",
  },
  {
    id: "tableta-amantheo-chocolate-blanco-con-nibs-40-manteca-de-cacao-origen-cremoso",
    slug: "tableta-amantheo-chocolate-blanco-con-nibs-40-manteca-de-cacao-origen-cremoso",
    name: "Chocolate Blanco 40% + Nibs Amantheo - Quellouno, Cuzco, Perú - Cacao Chuncho",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/tableta-amantheo-chocolate-blanco-con-nibs-40-manteca-de-cacao-origen-cremoso.png",
    description:
      "Barra de chocolate blanco 40% con nibs Tree to Bar Origen: Quellouno, Cuzco, Perú Grano: Chuncho Ingredientes: Manteca de cacao 40%, Azúcar, leche de vaca y nibs de grano chuncho, Producto libre de conservantes y aditivos Peso: 25g",
    availability: "preorder",
  },
  {
    id: "chocolateblancofrutilla",
    slug: "chocolateblancofrutilla",
    name: "Chocolate Blanco 40% con Frutilla Amantheo Quellouno, Cuzco, Perú 40% - Cacao Chuncho",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/chocolateblancofrutilla.jpg",
    description:
      "Barra de chocolate Tree to Bar Chocolate blanco de granos chunchos 40% con frutilla Quellouno, Cuzco, Perú Producto libre de conservantes y aditivos 25g",
    availability: "preorder",
  },
  {
    id: "amantheo-chuncho-40g-singleorigin-alimento-coco-vegano",
    slug: "amantheo-chuncho-40g-singleorigin-alimento-coco-vegano",
    name: "Amantheo - Chuncho - 40% con Leche de Coco - Quellouno, Cuzco, Perú",
    categoryId: "tree-bean",
    price: 9500,
    currency: "ARS",
    image: "/products/amantheo-chuncho-40g-singleorigin-alimento-coco-vegano.jpeg",
    description:
      "Barra de chocolate Tree to Bar Origen: Quellouno, Cuzco, Perú Grano: Chuncho Ingredientes: Manteca de cacao 40%, azúcar 30%, leche de coco 30% Producto libre de conservantes y aditivos Producto apto vegano 40G",
    availability: "out of stock",
  },
  {
    id: "amantheo-40-con-leche-de-avena-vegano",
    slug: "amantheo-40-con-leche-de-avena-vegano",
    name: "Amantheo - Mix Aromático - 40% con Leche de Avena - Tocache, San Martín, Perú",
    categoryId: "tree-bean",
    price: 9500,
    currency: "ARS",
    image: "/products/amantheo-40-con-leche-de-avena-vegano.jpeg",
    description:
      "Barra de chocolate Bean to Bar Origen:Tocache, San Martín, Perú Grano: Mix Aromático Ingredientes: Manteca de cacao 40%, azúcar 30%, leche de avena 30% Producto libre de conservantes y aditivos Producto apto vegano 40G",
    availability: "out of stock",
  },
  {
    id: "amantheo-kriskawas-70-waslala-nicaragua",
    slug: "amantheo-kriskawas-70-waslala-nicaragua",
    name: "Chocolate Oscuro Amantheo - Waslala, Nicaragua 70% - Kriskawas",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/amantheo-kriskawas-70-waslala-nicaragua.jpg",
    description:
      "Barra de chocolate 70% Waslala, Nicaragua. Grano de cacao Kriskawas. Fermentación con levaduras agregadas. 25g",
    availability: "out of stock",
  },
  {
    id: "amantheo-kriskawas-80-waslala-nicaragua",
    slug: "amantheo-kriskawas-80-waslala-nicaragua",
    name: "Chocolate Oscuro Amantheo – Waslala, Nicaragua 80% – Kriskawas",
    categoryId: "tree-bean",
    price: 9500,
    currency: "ARS",
    image: "/products/amantheo-kriskawas-80-waslala-nicaragua.jpeg",
    description:
      "Barra de chooclate con 80% de pasta de cacao de grano Kriskawas Waslala,Nicaragua y 20% de azúcar. Esta variedad ofrece un perfil maravilloso, donde la notas a cacao intenso,nueces,oliva,especias envuelven el paladar. Sin conservantes. Sin aditivos. Sin vainilla agregada. Este producto es considerado un superalimento por la utiilización de buenas prácticas en los procesos y conservación de esta manera de la mayor cantidad de propiedades que tiene la semilla de cacao además de la experiencia a nivel organoléptico.",
    availability: "out of stock",
  },
  {
    id: "amantheo-grano-amazonico-100-bagua-grande-amazonas-peru",
    slug: "amantheo-grano-amazonico-100-bagua-grande-amazonas-peru",
    name: "Chocolate Oscuro Amantheo - Bagua Grande, Amazonas, Perú 100%- Cacao Nativo Amazónico",
    categoryId: "tree-bean",
    price: 13000,
    currency: "ARS",
    image: "/products/amantheo-grano-amazonico-100-bagua-grande-amazonas-peru.jpg",
    description:
      "Barra de chocolate fino de aroma. Origen y genotipo de grano determinado. AMANTHEO FUNDO QUYA, BAGUA GRANDE, AMAZONAS, PERÚ 100% Pasta de cacao 100%, azúcar 0%. 25g",
  },
  {
    id: "amantheo-chuncho-senorita-80-quellouno-cuzco-peru",
    slug: "amantheo-chuncho-senorita-80-quellouno-cuzco-peru",
    name: "Chocolate Oscuro Amantheo - Quellouno, Cuzco, Perú - Chuncho Señorita 80%",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/amantheo-chuncho-senorita-80-quellouno-cuzco-peru.jpg",
    description:
      "Barra de origen- Bean to Bar AMANTHEO, QUELLOUNO, CUZCO, PERÚ 80% Tipo de grano de cacao: Chuncho Señorita Ingredientes: Pasta de cacao 80%, azúcar 20% 40g",
  },
  {
    id: "amantheo-chuncho-senorita-70-quellouno-cuzco-peru",
    slug: "amantheo-chuncho-senorita-70-quellouno-cuzco-peru",
    name: "Chocolate Oscuro Amantheo - Quellouno, Cuzco, Perú - Chuncho Señorita 70%",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/amantheo-chuncho-senorita-70-quellouno-cuzco-peru.jpg",
    description:
      "Barra de chocolate fino de aroma. Origen y genotipo de grano determinado. AMANTHEO CHUNCHO SEÑORITA QUELLOUNO, CUZCO, PERÚ 70% 40g",
  },
  {
    id: "amantheo-chuncho-100-quellouno-cuzco-peru",
    slug: "amantheo-chuncho-100-quellouno-cuzco-peru",
    name: "Chocolate Oscuro Amantheo - Quellouno, Cuzco, Perú 100% - Mix Chunchos",
    categoryId: "tree-bean",
    price: 13000,
    currency: "ARS",
    image: "/products/amantheo-chuncho-100-quellouno-cuzco-peru.jpg",
    description:
      "Barra de chocolate fino de aroma. Origen y genotipo de grano determinado. AMANTHEO - 100% - QUELLOUNO, CUZCO, PERÚ FINCA PAYTITI Tipo de cacao: MIX DE CHUNCHOS 40g",
  },
  {
    id: "amantheo-grano-nacional-70-san-mateo-esmeraldas-ecuador",
    slug: "amantheo-grano-nacional-70-san-mateo-esmeraldas-ecuador",
    name: "Chocolate Oscuro Amantheo - San Mateo de las Esmeraldas, Ecuador 70% - Grano Nacional",
    categoryId: "tree-bean",
    price: 10500,
    currency: "ARS",
    image: "/products/amantheo-grano-nacional-70-san-mateo-esmeraldas-ecuador.jpeg",
    description:
      "AMANTHEO - GRANO NACIONAL - 70% - SAN MATEO, ESMERALDAS,ECUADOR Componentes Pasta de cacao 70%, azúcar 30% Nota de cata: Nuez, fruta roja pasa, leve ahumado. Acidez suave. Leve astringencia. Temperatura de guarda: 16°c - 20°c *Producto vegano Producto natural, sin agregados de grasas ajenas al cacao Sin agregados de conservantes o aditivos.",
    availability: "out of stock",
  },
  {
    id: "amantheo-grano-krislala-100-waslala-costa-caribe-norte-nicaragua",
    slug: "amantheo-grano-krislala-100-waslala-costa-caribe-norte-nicaragua",
    name: "Chocolate Oscuro Amantheo - Waslala, Costa Caribe Norte, Nicaragua 100% - Grano Krislala",
    categoryId: "tree-bean",
    price: 11000,
    currency: "ARS",
    image: "/products/amantheo-grano-krislala-100-waslala-costa-caribe-norte-nicaragua.jpeg",
    description:
      "AMANTHEO - GRANO KRISLALA - 100% - WASLALA, COSTA CARIBE NORTE, NICARAGUA Componentes Pasta de cacao 100%, azúcar 0% Nota de cata: Acidez citrica equilibrada, fruta fresca tropical, dulzor, amargor bajo. Temperatura de guarda: 16°c - 20°c *Producto vegano Producto natural, sin agregados de grasas ajenas al cacao Sin agregados de conservantes o aditivos.",
    availability: "out of stock",
  },
  {
    id: "chocolate-blanco-40-con-nibs-amantheo-bagua-grande-amazonas-peru-cacao-nativo-amazonico",
    slug: "chocolate-blanco-40-con-nibs-amantheo-bagua-grande-amazonas-peru-cacao-nativo-amazonico",
    name: "Chocolate Blanco 40% + Nibs Amantheo – Bagua Grande, Amazonas, Perú – Cacao Nativo Amazónico",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/chocolate-blanco-40-con-nibs-amantheo-bagua-grande-amazonas-peru-cacao-nativo-amazonico.jpg",
    description:
      "Barra Bean to Bar single origen Bagua Grande, Amazonas, Perú Chocolate Blanco 40% producido con manteca natural de cacaos nativos amazónicos con nibs del mismo origen. 25g",
    availability: "preorder",
  },
  {
    id: "chocolate-oscuro-amantheo-ilheus-brasil-80-cacao-catongo",
    slug: "chocolate-oscuro-amantheo-ilheus-brasil-80-cacao-catongo",
    name: "Chocolate Oscuro Amantheo – Ilhéus, Brasil 80% – Cacao Catongo",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/chocolate-oscuro-amantheo-ilheus-brasil-80-cacao-catongo.jpg",
    description:
      "Barra Bean to Bar con cacao fino de aroma Ilhéus, Brasil 80% - Finca Bonanza Tipo de grano: Catongo",
  },
  {
    id: "chocolate-oscuro-amantheo-agua-fria-honduras-70-cacao-trinitario",
    slug: "chocolate-oscuro-amantheo-agua-fria-honduras-70-cacao-trinitario",
    name: "Chocolate Oscuro Amantheo – Agua Fría, Honduras 70% – Cacao Trinitario",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/chocolate-oscuro-amantheo-agua-fria-honduras-70-cacao-trinitario.jpg",
    description:
      "Barra de chocolate oscuro de origen 70% desarrollada con cacao fino de aroma trinitario de origen Agua Fría, Departamento de Comayagua, Honduras.",
    availability: "out of stock",
  },
  {
    id: "chocolate-oscuro-amantheo-isla-bioko-guinea-ecuatorial-africa-70-cacao-amelonado",
    slug: "chocolate-oscuro-amantheo-isla-bioko-guinea-ecuatorial-africa-70-cacao-amelonado",
    name: "Chocolate Oscuro Amantheo – Isla Bioko, Guinea Ecuatorial, África 70% – Cacao Amelonado",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/chocolate-oscuro-amantheo-isla-bioko-guinea-ecuatorial-africa-70-cacao-amelonado.jpg",
    description:
      "Barra de chocolate de origen AMANTHEO: MALABO, ISLA BIOKO, GUINEA ECUATORIAL, ÁFRICA 70% Finca Sampaka Tipo de grano de cacao: Amelonado 25g",
  },
  {
    id: "chocolate-amantheo-blanco-con-leche-tostada-quellouno-cuzco-peru-40-con-nibs-garrapinados-del-mismo-origen",
    slug: "chocolate-amantheo-blanco-con-leche-tostada-quellouno-cuzco-peru-40-con-nibs-garrapinados-del-mismo-origen",
    name: "Chocolate Blanco con Leche Tostada Amantheo - Quellouno, Cuzco, Perú 40% - con Nibs Garrapiñados del Mismo Origen",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/chocolate-amantheo-blanco-con-leche-tostada-quellouno-cuzco-peru-40-con-nibs-garrapinados-del-mismo-origen.jpg",
    description:
      "Chocolate Blanco 40% con leche de vaca tostada producido con manteca natural prensada a bajas temperaturas y nibs garrapiñados de grano chuncho, Origen: Quellouno, Cuzco, Perú- Tipo de cacao: Chuncho 25g",
  },
  {
    id: "chocolate-oscuro-amantheo-cajaruro-amazonas-peru-75-cacao-nativo-amazonico",
    slug: "chocolate-oscuro-amantheo-cajaruro-amazonas-peru-75-cacao-nativo-amazonico",
    name: "Chocolate Oscuro Amantheo – Cajaruro, Amazonas, Perú 75% – Cacao Nativo Amazónico",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/chocolate-oscuro-amantheo-cajaruro-amazonas-peru-75-cacao-nativo-amazonico.jpg",
    description:
      "Barra de chocolate fino de aroma. Origen y genotipo de grano determinado. AMANTHEO FINCA EL EUCALIPTO, CAJARURO, AMAZONAS, PERÚ 75% Tipo de Cacao: Nativo Amazónico 25g",
  },
  {
    id: "chocolate-oscuro-amantheo-flavio-alfaro-ecuador-con-mucilago-de-cacao-200-cacao-nacional",
    slug: "chocolate-oscuro-amantheo-flavio-alfaro-ecuador-con-mucilago-de-cacao-200-cacao-nacional",
    name: "Chocolate Oscuro Amantheo – Flavio Alfaro, Ecuador con Mucílago de Cacao 200% – Cacao Nacional",
    categoryId: "tree-bean",
    price: 13000,
    currency: "ARS",
    image: "/products/chocolate-oscuro-amantheo-flavio-alfaro-ecuador-con-mucilago-de-cacao-200-cacao-nacional.jpg",
    description:
      "Barra de chocolate de origen- Bean to bar CHOCOLATE OSCURO AMANTHEO – FLAVIO ALFARO, ECUADOR CON MUCÍLAGO DE CACAO 200% – Ingredientes: Cacao (Pasta de Cacao) + Cacao (mucílago) Tipo de cacao: NACIONAL 25g",
  },
  {
    id: "chocolate-oscuro-amantheo-union-ashaninka-cuzco-peru-75-cacao-bellavista",
    slug: "chocolate-oscuro-amantheo-union-ashaninka-cuzco-peru-75-cacao-bellavista",
    name: "Chocolate Oscuro Amantheo – Unión Ashaninka, Cuzco, Perú 75% – Cacao Bellavista",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/chocolate-oscuro-amantheo-union-ashaninka-cuzco-peru-75-cacao-bellavista.jpg",
    description:
      "Barra single origen Bean to Bar CHOCOLATE OSCURO AMANTHEO – UNIÓN ASHANINKA, CUZCO, PERÚ 75% – Tipo de Cacao: BELLAVISTA Edición Limitada 25g",
  },
  {
    id: "chocolate-amantheo-75-la-pareja-piura-peru-blanco-de-piura-gran-blanco",
    slug: "chocolate-amantheo-75-la-pareja-piura-peru-blanco-de-piura-gran-blanco",
    name: "Chocolate Oscuro Amantheo – la Pareja, Piura, Perú 75% - Blanco de Piura/ Gran Blanco",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/chocolate-amantheo-75-la-pareja-piura-peru-blanco-de-piura-gran-blanco.jpg",
    description:
      "Barra de chocolate fino de aroma. Origen y genotipo de grano determinado. AMANTHEO LA PAREJA, PIURA, PERÚ 75% Tipo de Grano: Gran Blanco y Blanco de Piura 25g",
  },
  {
    id: "chocolate-amantheo-70-jaen-cajamarca-peru-nacional-del-maranon-e-hibridos",
    slug: "chocolate-amantheo-70-jaen-cajamarca-peru-nacional-del-maranon-e-hibridos",
    name: "Chocolate Oscuro Amantheo – 70% – Jaén, Cajamarca, Perú- Nacional del Marañon E Híbridos",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/chocolate-amantheo-70-jaen-cajamarca-peru-nacional-del-maranon-e-hibridos.jpg",
    description:
      "Barra de chocolate fino de aroma. Origen y genotipo de grano determinado. BELLAVISTA, JAÉN, CAJAMARCA, PERÚ 80% FINCA VIRGEN DE GUADALUPE Cacao Nacional del Marañón e híbridos Edición Limitada 25g",
    availability: "preorder",
  },
  {
    id: "chocolate-amantheo-70-jaen-cajamarca-peru-nacional-del-maranon-e-hibridos-2",
    slug: "chocolate-amantheo-70-jaen-cajamarca-peru-nacional-del-maranon-e-hibridos-2",
    name: "Chocolate Oscuro Amantheo – 70% – Ocumare, Venezuela- Blend Ocumare y Chuao",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/chocolate-amantheo-70-jaen-cajamarca-peru-nacional-del-maranon-e-hibridos-2.jpg",
    description:
      "Barra de chocolate fino de aroma. Origen y genotipo de grano determinado. AMANTHEO OCUMARE, VENEZUELA 70% HACIENDA LAS BROMELIAS Cacao Ocumare 60 y 61 y Chuao 120 Edición Limitada 25g",
  },
  {
    id: "chocolate-oscuro-amantheo-san-carlos-santa-cruz-bolivia-cacao-silvestre-y-ccn51",
    slug: "chocolate-oscuro-amantheo-san-carlos-santa-cruz-bolivia-cacao-silvestre-y-ccn51",
    name: "Chocolate Oscuro Amantheo – San Carlos, Santa Cruz, Bolivia - Cacao Silvestre y Ccn51",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/chocolate-oscuro-amantheo-san-carlos-santa-cruz-bolivia-cacao-silvestre-y-ccn51.jpg",
    description:
      "Barra single origen - Bean to bar AMANTHEO - SAN CARLOS, SANTA CRUZ, BOLIVIA 70% Cacao silvestre domesticado y cacao CCN51 25g",
  },
  {
    id: "chocolate-oscuro-amantheo-maceo-antioquia-colombia-80-cacao-criollos-modernos",
    slug: "chocolate-oscuro-amantheo-maceo-antioquia-colombia-80-cacao-criollos-modernos",
    name: "Chocolate Oscuro Amantheo- Maceo, Antioquia, Colombia 80% - Cacao Criollos Modernos",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/chocolate-oscuro-amantheo-maceo-antioquia-colombia-80-cacao-criollos-modernos.jpg",
    description:
      "Barra de chocolate de origen único- Bean to bar AMANTHEO: MACEO, ANTIOQUIA, COLOMBIA Tipo de grano de cacao: Criollos modernos",
    availability: "out of stock",
  },
  {
    id: "chocolate-blanco-nibs-amantheo-esmeraldas-ecuador-40-cacao-nacional",
    slug: "chocolate-blanco-nibs-amantheo-esmeraldas-ecuador-40-cacao-nacional",
    name: "Chocolate Blanco + Nibs Amantheo - Esmeraldas, Ecuador 40% - Cacao Nacional",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/chocolate-blanco-nibs-amantheo-esmeraldas-ecuador-40-cacao-nacional.jpg",
    description:
      "Barra de chocolate blanco de origen único con nibs del mismo origen AMANTHEO: ESMERALDAS, ECUADOR 40% Tipo de cacao: NACIONAL 25g",
  },
  {
    id: "chocolate-oscuro-amantheo-quillabamba-cuzco-peru-80-cacao-chuncho-cascara-de-huevo",
    slug: "chocolate-oscuro-amantheo-quillabamba-cuzco-peru-80-cacao-chuncho-cascara-de-huevo",
    name: "Chocolate Oscuro Amantheo - Quillabamba, Cuzco, Perú 80% - Cacao Chuncho Cáscara de Huevo",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/chocolate-oscuro-amantheo-quillabamba-cuzco-peru-80-cacao-chuncho-cascara-de-huevo.jpg",
    description:
      "Barra de origen único - Bean to Bar AMANTHEO: QUILLABAMBA, CUZCO, PERÚ 80% - Comunidad Machiguenga- Productores Ubal y Nosh Tipo de cacao: CHUNCHO CÁSCARA DE HUEVO 25g",
    availability: "out of stock",
  },
  {
    id: "tuereamazonas-brasil",
    slug: "tuereamazonas-brasil",
    name: "Chocolate Oscuro Amantheo - Tuere, Amazonas, Brasil 75% - Amelonado y Catongo",
    categoryId: "tree-bean",
    price: 12000,
    currency: "ARS",
    image: "/products/tuereamazonas-brasil.png",
    description:
      "Barra único origen - Bean to Bar- Edición Limitada AMANTHEO: TUERE, PARÁ, AMAZONAS, BRASIL Tipo de cacao: Catongo y amelonado 25g",
    availability: "preorder",
  },
  // ── Alfajores con Harina de Cacao ──
  {
    id: "alfajor-de-harina-de-cacao-ddl-y-cardamomo",
    slug: "alfajor-de-harina-de-cacao-ddl-y-cardamomo",
    name: "Alfajor de Harina de Cacao - Dulce de Leche y Cardamomo",
    categoryId: "alfajores",
    price: 8000,
    currency: "ARS",
    image: "/products/alfajor-de-harina-de-cacao-ddl-y-cardamomo.jpg",
    description:
      "Alfajor c0n Harina de Cacao de selección de granos peruanos, relleno de dulce de leche casero y cardamomo. Nuestro primer alfajor desarrollado. Nuestro clásico. Cubierto con chocolate 65% origen Tocache, San Martín, Perú ( Tipo de grano de cacao: Mix aromático/ 497 msnm) Peso aprox. 80g",
    isFeatured: true,
  },
  {
    id: "alfajor-de-harina-de-cacao-pistachos",
    slug: "alfajor-de-harina-de-cacao-pistachos",
    name: "Alfajor de Harina Cacao - Pistacho",
    categoryId: "alfajores",
    price: 8000,
    currency: "ARS",
    image: "/products/alfajor-de-harina-de-cacao-pistachos.jpg",
    description:
      "Alfajor con Harina de Cacao de selección de granos peruanos, relleno de crema de pistachos naturales. Cubierto con chocolate 65% origen Tocache, San Martín, Perú (Tipo de grano de cacao: Mix aromático / 497 msnm) y lluvia de trocitos de pistachos. Peso aprox. 80g",
    availability: "preorder",
    isFeatured: true,
  },
  {
    id: "alfajor-de-harina-de-cacao-de-chocolate-oscuro-60-y-nibs",
    slug: "alfajor-de-harina-de-cacao-de-chocolate-oscuro-60-y-nibs",
    name: "Alfajor de Harina de Cacao - Chocolate Oscuro y Nibs",
    categoryId: "alfajores",
    price: 8000,
    currency: "ARS",
    image: "/products/alfajor-de-harina-de-cacao-de-chocolate-oscuro-60-y-nibs.jpg",
    description:
      "Alfajor c0n Harina de Cacao de selección de granos peruanos, relleno de pasta de chocolate y nibs de cacao. Cubierto con chocolate 65% origen Tocache, San Martín, Perú y crocante de nibs del mismo origen ( Tipo de grano de cacao: Miz aromático/ 497 msnm) Peso aprox 80G",
  },
  {
    id: "alfajor-de-harina-de-cacao-chocolate-blanco-y-nibs",
    slug: "alfajor-de-harina-de-cacao-chocolate-blanco-y-nibs",
    name: "Alfajor de Harina de Cacao - Chocolate Blanco y Nibs",
    categoryId: "alfajores",
    price: 8000,
    currency: "ARS",
    image: "/products/alfajor-de-harina-de-cacao-chocolate-blanco-y-nibs.jpg",
    description:
      "Alfajor con Harina de Cacao de selección de granos peruanos, relleno de pasta de chocolate y nibs de cacao. Cubierto con chocolate blanco 40% cacao, de origen Tocache, San Martín, Perú y nibs de cacao del mismo origen ( Tipo de grano de cacao: Mix aromático/ 497 msnm) Peso aprox. 80g",
  },
  {
    id: "alfajor-de-harina-de-cacao-marroc",
    slug: "alfajor-de-harina-de-cacao-marroc",
    name: "Alfajor de Harina de Cacao - Marroc",
    categoryId: "alfajores",
    price: 8000,
    currency: "ARS",
    image: "/products/alfajor-de-harina-de-cacao-marroc.jpg",
    description:
      "Alfajor de Harina de Cacao de granos peruanos, relleno de marroc. Cubierto con chocolate con leche de blend peruano con maní tostado. Peso aprox. 80g",
  },
  // ── Tabletas Rellenas & Tabletas Las Romeas ──
  {
    id: "barra-de-chocolate-con-leche-50-con-leche-tocache-san-martiin-peru-con-crumble-de-avellanas-y-nuez-moscada",
    slug: "barra-de-chocolate-con-leche-50-con-leche-tocache-san-martiin-peru-con-crumble-de-avellanas-y-nuez-moscada",
    name: "Tableta las Romeas - 47% - con Crumble de Avellanas y Nuez Moscada - Moxos, Bolivia",
    categoryId: "tabletas-rellenas",
    price: 2400,
    currency: "ARS",
    image: "/products/barra-de-chocolate-con-leche-50-con-leche-tocache-san-martiin-peru-con-crumble-de-avellanas-y-nuez-moscada.jpeg",
    description:
      "Barra de Chocolate elaborada con cacao al 47% de Tocache, San Martín, Perú con leche e inclusiones de crumble de avellanas y nuez moscada. (Grano CRA-497 msnm) 80G",
    availability: "out of stock",
  },
  {
    id: "barra-de-chocolate-60-blend-de-granos-trinitarios-colombianos-con-inclusiones-de-jengibre-y-cardamomo",
    slug: "barra-de-chocolate-60-blend-de-granos-trinitarios-colombianos-con-inclusiones-de-jengibre-y-cardamomo",
    name: "Tableta las Romeas - 60% - con Jengibre y Cardamomo - Blend de Granos Trinitarios Colombianos",
    categoryId: "tabletas-rellenas",
    price: 2400,
    currency: "ARS",
    image: "/products/barra-de-chocolate-60-blend-de-granos-trinitarios-colombianos-con-inclusiones-de-jengibre-y-cardamomo.jpeg",
    description:
      "Tableta de chocolate al 60% elaborada con blend de granos trinitarios colombianos, con inclusiones de jengibre y cardamomo. 80g",
    availability: "out of stock",
  },
  {
    id: "barra-de-chocolate-oscuro-bahia-brasil-70-relleno-de-coulis-reduccion-de-cerezas",
    slug: "barra-de-chocolate-oscuro-bahia-brasil-70-relleno-de-coulis-reduccion-de-cerezas",
    name: "Tableta de Chocolate Oscuro Bahía Brasil 70% Relleno de Coulis/ Reducción de Cerezas",
    categoryId: "tabletas-rellenas",
    price: 2500,
    currency: "ARS",
    image: "/products/barra-de-chocolate-oscuro-bahia-brasil-70-relleno-de-coulis-reduccion-de-cerezas.jpeg",
    description:
      "Barra de Chocolate oscuro Bahía Brasil 70% (tipo de grano: amelonado) relleno de coulis/ reducción de cerezas 80g",
    availability: "out of stock",
  },
  {
    id: "tableta-blend-peruano-42-con-leche-avellanas-y-cafe",
    slug: "tableta-blend-peruano-42-con-leche-avellanas-y-cafe",
    name: "Tableta las Romeas - 42% con Leche - con Avellanas y Café - Blend de Granos Peruanos",
    categoryId: "tabletas-rellenas",
    price: 2100,
    currency: "ARS",
    image: "/products/tableta-blend-peruano-42-con-leche-avellanas-y-cafe.jpeg",
    description:
      "Tableta Las Romeas elaborada con blend de granos colombianos al 42% con leche de vaca. Con inclusiones de avellanas y café. 80g",
    availability: "out of stock",
  },
  {
    id: "tableta-manabi-72",
    slug: "tableta-manabi-72",
    name: "Tableta las Romeas - 72% - Manabí, Ecuador",
    categoryId: "tabletas-rellenas",
    price: 2400,
    currency: "ARS",
    image: "/products/tableta-manabi-72.jpeg",
    description:
      "Tableta de chocolate con selección de granos de cacao de la provincia de Manabí. 72% de pasta de cacao. 80g",
    availability: "out of stock",
  },
  {
    id: "tableta-amazonico-70-c-arandanos",
    slug: "tableta-amazonico-70-c-arandanos",
    name: "Tableta las Romeas - 70% - con Arándanos Entrerrianos - Blend de Granos Peruanos",
    categoryId: "tabletas-rellenas",
    price: 2400,
    currency: "ARS",
    image: "/products/tableta-amazonico-70-c-arandanos.jpeg",
    description:
      "Tableta de chocolate 70% elaborada con blend de granos peruanos con arándanos. 80g",
    availability: "out of stock",
  },
  {
    id: "tableta-bahia-superior-brasil-70-c-avellanas-y-cafe",
    slug: "tableta-bahia-superior-brasil-70-c-avellanas-y-cafe",
    name: "Tableta las Romeas - 70% - con Avellanas y Café - Bahía Superior, Brasil",
    categoryId: "tabletas-rellenas",
    price: 2100,
    currency: "ARS",
    image: "/products/tableta-bahia-superior-brasil-70-c-avellanas-y-cafe.jpeg",
    description:
      "Tableta Bahia Superior Brasil 70% con Avellanas del sur argentino y Café de selección. 80g",
    availability: "out of stock",
  },
  {
    id: "tableta-blend-de-leche-c-almendras-y-nibs",
    slug: "tableta-blend-de-leche-c-almendras-y-nibs",
    name: "Tableta de Chocolate Blend Colombiano con Leche con Nibs y Almendras",
    categoryId: "tabletas-rellenas",
    price: 2400,
    currency: "ARS",
    image: "/products/tableta-blend-de-leche-c-almendras-y-nibs.jpeg",
    description:
      "Tableta Blend Colombiano con Leche con Almendras mendocinas y nibs de cacao colombiano",
    availability: "out of stock",
  },
  {
    id: "tableta-carenero-superior-venezuela-70-c-nibs-y-almendras",
    slug: "tableta-carenero-superior-venezuela-70-c-nibs-y-almendras",
    name: "Tableta las Romeas - 70% - con Almendras y Nibs - Manabí, Ecuador",
    categoryId: "tabletas-rellenas",
    price: 2100,
    currency: "ARS",
    image: "/products/tableta-carenero-superior-venezuela-70-c-nibs-y-almendras.jpeg",
    description:
      "Tableta elaborada con cacao de Manabí, Ecuador al 70% con inclusiones de nibs ecuatorianos y almendras mendocinas. 80G",
    availability: "out of stock",
  },
  {
    id: "tableta-guayas-ecuador-100",
    slug: "tableta-guayas-ecuador-100",
    name: "Tableta las Romeas - 100% - Guayas, Ecuador",
    categoryId: "tabletas-rellenas",
    price: 2400,
    currency: "ARS",
    image: "/products/tableta-guayas-ecuador-100.jpeg",
    description:
      "Tableta de selección de granos de origen Guayas, Ecuador. Sin azúcar agregada. 80G",
    availability: "out of stock",
  },
  {
    id: "tableta-rellena-crema-de-pistacho",
    slug: "tableta-rellena-crema-de-pistacho",
    name: "Tableta Rellena - 60% - con Crema de Pistachos - Blend de Granos Peruanos",
    categoryId: "tabletas-rellenas",
    price: 19000,
    currency: "ARS",
    image: "/products/tableta-rellena-crema-de-pistacho.jpg",
    description:
      "Barra de chocolate Blend de distritos peruanos. Pasta de cacao al 60% rellena de crema de pistacho 80G",
    availability: "preorder",
    isFeatured: true,
  },
  {
    id: "tableta-rellena-ddl-y-cardamomo",
    slug: "tableta-rellena-ddl-y-cardamomo",
    name: "Tableta Rellena - 60% - con Dulce de Leche y Cardamomo - Blend de Granos Peruanos",
    categoryId: "tabletas-rellenas",
    price: 16000,
    currency: "ARS",
    image: "/products/tableta-rellena-ddl-y-cardamomo.jpg",
    description:
      "Barra de chocolate elaborada con blend de cacaos de distintos terroirs peruanos. Chocolate 60% relleno de dulce de leche y cardamomo. 80g",
    availability: "preorder",
  },
  {
    id: "tableta-rellena-marroc-y-miso",
    slug: "tableta-rellena-marroc-y-miso",
    name: "Tableta Rellena - 60% - con Marroc y Miso - Blend de Granos Peruanos",
    categoryId: "tabletas-rellenas",
    price: 18000,
    currency: "ARS",
    image: "/products/tableta-rellena-marroc-y-miso.jpg",
    description:
      "Barra de chocolate Blend de diversos terroirs peruanos. Pasta de cacao al 60% relleno de marroc + caramelo de miso. 80g",
    availability: "preorder",
  },
  {
    id: "tableta-las-romeas-70-tumaco-costa-pacifica-colombia",
    slug: "tableta-las-romeas-70-tumaco-costa-pacifica-colombia",
    name: "Tableta las Romeas - 70% Tumaco con Nibs- Costa Pacifica, Colombia",
    categoryId: "tabletas-rellenas",
    price: 2400,
    currency: "ARS",
    image: "/products/tableta-las-romeas-70-tumaco-costa-pacifica-colombia.jpeg",
    description:
      "Tableta Tumaco 70% , Costa Pacifica, Colombia",
    availability: "out of stock",
  },
  // ── Trufas ──
  {
    id: "trufas-de-chocolate-de-origen",
    slug: "trufas-de-chocolate-de-origen",
    name: "Trufas de Chocolate 70% Blend Peruano Rebozadas en Cacao Natural del Mismo Origen",
    categoryId: "trufas",
    price: 23000,
    currency: "ARS",
    image: "/products/trufas-de-chocolate-de-origen.jpg",
    description:
      "Trufas de chocolate Blend Peruano 70%, rebozadas en cacao natural de origen Bagua Grande, Amazonas, Perú. La presentación varía entre box cartón, box blanco o envase de vidrio. 80g",
    availability: "preorder",
    isFeatured: true,
  },
  {
    id: "trufas-con-chocolate-bagua-grande-amazonas-peru-70-con-cacao-natural-del-mismo-origen",
    slug: "trufas-con-chocolate-bagua-grande-amazonas-peru-70-con-cacao-natural-del-mismo-origen",
    name: "Trufas de Chocolate 70% Bagua Grande, Amazonas, Perú- Cubiertas en Chocolate 100% Mismo Origen",
    categoryId: "trufas",
    price: 23000,
    currency: "ARS",
    image: "/products/trufas-con-chocolate-bagua-grande-amazonas-peru-70-con-cacao-natural-del-mismo-origen.jpeg",
    description:
      "Trufas de chocolate 70% Bagua Grande, Amazonas, Perú cubiertas en chocolate 100% del mismo origen - (Tipo de Grano: Nativo Amazónico/ 522 msnm) Envase de vidrio o box de cartón 80g",
    availability: "out of stock",
  },
  // ── Bombones ──
  {
    id: "bombon-de-mucilago-de-cacao-2u",
    slug: "bombon-de-mucilago-de-cacao-2u",
    name: "Bombón de Mucílago de Cacao- 2u",
    categoryId: "bombones",
    price: 5000,
    currency: "ARS",
    image: "/products/bombon-de-mucilago-de-cacao-2u.jpg",
    description:
      "Bombón de fruta con la pulpa del cacao 20g cada pieza",
    availability: "preorder",
  },
  // ── Pellizcos & Frutos Cubiertos ──
  {
    id: "naranjitas-cubiertas-en-chocolate-tocache-san-martin-peru-60",
    slug: "naranjitas-cubiertas-en-chocolate-tocache-san-martin-peru-60",
    name: "Naranjitas Cubiertas en Chocolate Tocache, San Martín, Perú 60%",
    categoryId: "pellizcos",
    price: 9500,
    currency: "ARS",
    image: "/products/naranjitas-cubiertas-en-chocolate-tocache-san-martin-peru-60.png",
    description:
      "Naranjitas bañadas con chocolate oscuro 60% cacao de origen Tocache, San Martín, Perú ( Mix de granos aromáticos- 497 msnm)",
    availability: "out of stock",
  },
  {
    id: "nueces-con-dulce-de-leche-y-cardamomo-con-chocolate-60-tocache-peru",
    slug: "nueces-con-dulce-de-leche-y-cardamomo-con-chocolate-60-tocache-peru",
    name: "Nueces con Dulce de Leche y Cardamomo con Chocolate 60% Tocache, Perú",
    categoryId: "pellizcos",
    price: 16000,
    currency: "ARS",
    image: "/products/nueces-con-dulce-de-leche-y-cardamomo-con-chocolate-60-tocache-peru.jpeg",
    description:
      "Box de Nueces con dulce de leche y cardamomo, cubiertas por chocolate de origen 60% Tocache, San Martín, Perú 80g",
    availability: "preorder",
  },
  {
    id: "avellanas-caramelizadas-rebozadas-en-cacao-natural-de-origen-100",
    slug: "avellanas-caramelizadas-rebozadas-en-cacao-natural-de-origen-100",
    name: "Avellanas Rebozadas en Cacao Natural de Origen Tocache, Perú",
    categoryId: "pellizcos",
    price: 16000,
    currency: "ARS",
    image: "/products/avellanas-caramelizadas-rebozadas-en-cacao-natural-de-origen-100.jpeg",
    description:
      "Almendras caramelizadas, chocolatadas, rebozadas en cacao natural 100% de origen Bagua Grande, Amazonas, Perú",
    availability: "preorder",
  },
  {
    id: "almendras-caramelizadas-rebozadas-en-cacao-amargo-de-origen-100",
    slug: "almendras-caramelizadas-rebozadas-en-cacao-amargo-de-origen-100",
    name: "Almendras Rebozadas en Cacao Natural Bagua Grande, Perú",
    categoryId: "pellizcos",
    price: 16000,
    currency: "ARS",
    image: "/products/almendras-caramelizadas-rebozadas-en-cacao-amargo-de-origen-100.jpeg",
    description:
      "Almendras caramelizadas, chocolatadas, rebozadas en cacao natural 100% de origen Bagua Grande, Amazonas, Perú.",
    availability: "preorder",
  },
  // ── Packs, Boxes & Ediciones Especiales ──
  {
    id: "packgift-mini-alfajores-hc-x-7u-ddl-y-cardamomo",
    slug: "packgift-mini-alfajores-hc-x-7u-ddl-y-cardamomo",
    name: "Packgift Alfajores Petit Mixtos con Harina de Cacao X 7u",
    categoryId: "ediciones-especiales",
    price: 32000,
    currency: "ARS",
    image: "/products/packgift-mini-alfajores-hc-x-7u-ddl-y-cardamomo.jpeg",
    description:
      "Este box degusatción por 7 unidades incluye nuestras 5 variedades de alfajores con Harina de Caaco en versión petit: Dulce de leche y cardamomo Crema de Pistacho Marroc Chocolate Blanco con Nibs de Cacao Chocolate Oscuro con Nibs de Cacao Peso aprox de cada alfajor: 40g Box blanco o negro según stock",
  },
  {
    id: "packgift-mix-bombones",
    slug: "packgift-mix-bombones",
    name: "Packgift Mix Bombones",
    categoryId: "ediciones-especiales",
    price: 32000,
    currency: "ARS",
    image: "/products/packgift-mix-bombones-x-8u.jpg",
    description:
      "Box de bombones surtidos con rellenos naturales. Sin conservantes agregados Todos los chocolate son desarrollados desde distintos tipos de granos de cacao seleccionados de diversos orígenes y fincas produciendo nuestra propia materia prima para los bombones y tabletas: Oscuros, Leche, Blancos y Blancos Veganos Producto con entregas solo en Capital Federal y algunas zonas aledañas.",
    availability: "out of stock",
    variants: [
      { label: "x 8u", price: 32000, availability: "out of stock" },
      { label: "x 16u", price: 55000, availability: "preorder" },
      { label: "x 24u", price: 82000, availability: "preorder" },
    ],
  },
  {
    id: "packgift-alfajores-petit-bombon-edicion-limitada",
    slug: "packgift-alfajores-petit-bombon-edicion-limitada",
    name: "Packgift Alfajores Petit Bombón Edición Limitada",
    categoryId: "ediciones-especiales",
    price: 15000,
    currency: "ARS",
    image: "/products/packgift-alfajores-petit-bombon-edicion-limitada.jpeg",
    description:
      "Packgift de Alfajores Petit Bombón Edición Limitada con rellenos únicos surtidos x 6 unidades: Variedades: *Huacatay y Piña con chocolate oscuro *Mentol con chocolate oscuro *Frutilla con chocolate de frutilla *Chocolate con almendras y nibs con chocolate oscuro *Dulce de leche de búfala y nuez con chocolate blanco *Marroc y miso con chocolate con leche *Pistacho y Mora con chocolate oscuro *Maracuyá con sablé de avellanas con chocolate oscuro",
    availability: "out of stock",
  },
  {
    id: "box-pellizcos-dulce-de-leche-ron-y-harina-de-cacao",
    slug: "box-pellizcos-dulce-de-leche-ron-y-harina-de-cacao",
    name: "Box Pellizcos Oscuros y Blancos",
    categoryId: "ediciones-especiales",
    price: 35000,
    currency: "ARS",
    image: "/products/box-pellizcos-dulce-de-leche-ron-y-harina-de-cacao.jpg",
    description:
      "Box con dos variedades de Pellizco, 9 unidades. -Dulce de leche y ron, cubierto con chocolate oscuro 60%. El chocolate es un blend y es producido desde granos de cacao mix aromáticos y nativos amazónicos. -Dulce de leche y nuez, cubierto con chocolate blanco 35% y nibs de cacao. El chocolate blanco es producido con granos de cacoa nativos amazónicos y chunchos del Perú. Base sablé con harina de cacao",
    availability: "preorder",
  },
  {
    id: "box-pellizcos-dulce-de-leche-ron-y-harina-de-cacao-2",
    slug: "box-pellizcos-dulce-de-leche-ron-y-harina-de-cacao-2",
    name: "Box Pellizcos Dulce de Leche, Ron y Harina de Cacao- Chocolate Oscuro",
    categoryId: "ediciones-especiales",
    price: 35000,
    currency: "ARS",
    image: "/products/box-pellizcos-dulce-de-leche-ron-y-harina-de-cacao-2.jpg",
    description:
      "Box Pellizcos, 9 unidades. -Dulce de leche y ron, cubierto con chocolate oscuro 60%. El chocolate es un blend y es producido desde granos de cacao mix aromáticos y nativos amazónicos. Base sablé con harina de cacao",
    availability: "preorder",
  },
  {
    id: "box-pellizcos-dulce-de-leche-nuez-nibs-y-harina-de-cacao",
    slug: "box-pellizcos-dulce-de-leche-nuez-nibs-y-harina-de-cacao",
    name: "Box Pellizcos Dulce de Leche, Nuez, Nibs y Harina de Cacao- Chocolate Blanco",
    categoryId: "ediciones-especiales",
    price: 35000,
    currency: "ARS",
    image: "/products/box-pellizcos-dulce-de-leche-nuez-nibs-y-harina-de-cacao.jpg",
    description:
      "Box Pellizcos -Dulce de leche y nuez, cubierto con chocolate blanco 35% y nibs de cacao. El chocolate blanco es producido con granos de cacoa nativos amazónicos y chunchos del Perú. Base sablé con harina de cacao 9 unidades en box",
    availability: "preorder",
  },
  // ── Festividades (Pascuas) ──
  {
    id: "rosca-de-pascuas-con-harina-de-cacao-y-chocolate-ecuatoriano",
    slug: "rosca-de-pascuas-con-harina-de-cacao-y-chocolate-ecuatoriano",
    name: "Rosca de Pascuas con Harina de Cacao y Chocolate Ecuatoriano",
    categoryId: "festividades",
    price: 49000,
    currency: "ARS",
    image: "/products/rosca-de-pascuas-con-harina-de-cacao-y-chocolate-ecuatoriano.jpg",
    description:
      "ROSCA DE PASCUA de ORIGEN, con HARINA DE CACAO. Vuelven las Roscas con Harina de Cacao y podés reservarlas hasta el 111 de abril Utilizamos harinas orgánicas, y chocolates que fabricamos desde granos de cacaos seleccionados. La harina de cacao que utilizamos la producimos mediante un proyecto de economía circular. -Sentir los sabores de un buen chocolate en toda preparación es una experiencia única! Contiene 3 mini huevitos de chocolate 70% y crema pastelera intensa de chocolate de blend de granos de fincas colombianas. Solo con venta anticipada y envío a domicilio. Entregas de las roscas durante semana santa, se concertará con el comprador.",
    availability: "out of stock",
  },
  {
    id: "huevo-de-pascuas-coleccion-origen-version-bagua",
    slug: "huevo-de-pascuas-coleccion-origen-version-bagua",
    name: "Huevo de Pascuas -colección Origen- Versión Bagua",
    categoryId: "festividades",
    price: 95000,
    currency: "ARS",
    image: "/products/huevo-de-pascuas-coleccion-origen-version-bagua.jpg",
    description:
      "HUEVO DE PASCUAS COLECCIÓN ORIGEN VERSIÓN BAGUA 250 gr. Solo con pre-venta hasta el 10 de abril o hasta agotar stock CHOCOLATES 2 huevos (uno dentro de otro) y bombones surtidos 250g. Solo con reserva.",
    availability: "out of stock",
  },
  {
    id: "huevo-de-pascuas-coleccion-origen-version-cuzco",
    slug: "huevo-de-pascuas-coleccion-origen-version-cuzco",
    name: "Huevo de Pascuas -colección Origen - Versión Cuzco",
    categoryId: "festividades",
    price: 95000,
    currency: "ARS",
    image: "/products/huevo-de-pascuas-coleccion-origen-version-cuzco.jpg",
    description:
      "HUEVO DE PASCUAS COLECCIÓN ORIGEN VERSIÓN CUZCO Solo con venta anticipada hasta el 11 de abril 2025 o hasta agotar stock 250g Contiene A. HUEVO PRINCIPAL CHOCOLATES OSCUROS MEDALLA: SEÑORITA 70% FRENTE: MIX DE CHUNCHO 70% DORSO: PUNTA DE LANZA 70% BASE: MIX DE CHUNCHO 80% B. SEGUNDO HUEVO CHOCOLATE BLANCO COMPLETO: BLANCO 40% CON NIBS MIX DE CHUNCHOS C.TERCER HUEVO COMPLETO: SEÑORITA 70% D. TESORO INCA BLEND DE CHUNCHOS DETALLE TELA COMESTIBLE CON CHOCOLATE GRANO PUNTA DE LANZA NOTA DE CATA: FRUTAS TROPICALES. DURAZNO MADURO. SEGUNDAS NOTAS: FRUTOS SECOS, CAFÉ. ACIDEZ CÍTRICA, EQUILIBRADA, AMARGOR LEVE, ASTRINGENCIA BAJA. CREMOSO. GRANO MIX DE CHUNCHOS NOTA DE CATA: LIMA AMARILLA, FLORAL, FRUTAS TROPICALES, EVOLUCIÓN: FRUTOS SECOS, BANANA. ACIDEZ CÍTRICA EQUILIBRADA, BAJO AMARGOR Y ASTRINGENCIA BAJA. CREMOSO Y LARGO EN BOCA. GRANO SEÑORITA NOTA DE CATA: FRESCO, HERBAL, HIERBA BUENA, MENTA. ACIDEZ CÍTRICA EQUILIBRADA,, BAJO AMARGOR Y ASTRINGENCIA BAJA. CREMOSO Y LARGO EN BOCA. CHOCOLATE BLANCO ALTA CREMOSIDAD, FINAL DE BOCA LIMPIA. MANTECA DE CACAO FRESCA. ORIGEN: QUELLOUNO, CUZCO, PERÚ LATITUD: 12° 38' 11'' S / LONGITUD: 72° 33' 25'' W 800-1000 MSNM- CACAO FERMENTADO Y SECADO POR JOSÉ FELICIANO TUPAYACHI CARDENAS DE FINCA PAYTITI (PERÚ) DESARROLLO DE FORMULACIÓN DEL CHOCOLATE POR LORENA GALASSO (ARGENTINA)",
    availability: "out of stock",
  },
  {
    id: "huevo-de-pascuas-coleccion-origen-version-tocache",
    slug: "huevo-de-pascuas-coleccion-origen-version-tocache",
    name: "Huevo de Pascuas 250g -colección Origen- Versión Tocache",
    categoryId: "festividades",
    price: 95000,
    currency: "ARS",
    image: "/products/huevo-de-pascuas-coleccion-origen-version-tocache.jpg",
    description:
      "HUEVO DE PASCUAS -COLECCIÓN ORIGEN- VERSIÓN TOCACHE 2 huevos en 1 + bombones Solo con venta anticipada hasta el 11 de abril 2025 o hasta agotar stock 250g A. HUEVO PRINCIPAL CHOCOLATES OSCUROS MEDALLA: BLANCO 40% FRENTE: MIX AROMÁTICO 70% DORSO: MIX AROMÁTICO 70% BASE: MIX AROMÁTICO 70% B. SEGUNDO HUEVO CHOCOLATE CON LECHE COMPLETO: CRA 50% CON LECHE C. BOMBONES SURTIDOS DEL MISMO ORIGEN GRANO MIX AROMÁTICO ACIDEZ FRUTAL LÁCTICA, CREMOSIDAD TIPO YOGURT, NOTA A COROZO, FRUTA TROPICAL DE UNA PALMERA AMAZÓNICA, FINAL FRUTAL SOSTENIDO. ASTRINGENCIA MEDIA. LEVE AMARGOR. TRAZABILIDAD ORIGEN: TOCACHE, SAN MARTÍN, PERÚ LATITUD: 8° 11' 19” S / LONGITUD: 76° 30' 37” W 497 MSNM- COSECHA JUNIO 2020 CACAO FERMENTADO Y SECADO CENTRO DE BENEFICIO KATO SAC, ING. MARIO CRAVERO (PERÚ) DESARROLLO DE FORMULACIÓN DEL CHOCOLATE POR LORENA GALASSO (ARGENTINA)",
    availability: "out of stock",
  },
  {
    id: "huevo-pascuas-blanco-100",
    slug: "huevo-pascuas-blanco-100",
    name: "Huevo de Pascuas -colección Clásica- Blanco+nibs Blend Peruano",
    categoryId: "festividades",
    price: 20000,
    currency: "ARS",
    image: "/products/huevo-pascuas-blanco-100.jpg",
    description:
      "HUEVO DE PASCUAS -COLECCIÓN CLÁSICA- BLANCO+NIBS BLEND MIX DE GRANOS PERUANOS NIBS de origen TOCACHE, SAN MARTÍN, PERÚ PACK: BOX BLANCO 100g",
    availability: "preorder",
  },
  {
    id: "huevo-blanco-chocolate-nibs-200",
    slug: "huevo-blanco-chocolate-nibs-200",
    name: "Huevo de Pascuas -colección Clásica- Blanco+nibs Blend Mix de Granos Peruanos",
    categoryId: "festividades",
    price: 29000,
    currency: "ARS",
    image: "/products/huevo-blanco-chocolate-nibs-200.jpg",
    description:
      "HUEVO DE PASCUAS -COLECCIÓN CLÁSICA- BLANCO+NIBS BLEND MIX DE GRANOS PERUANOS NIBS de origen TOCACHE, SAN MARTÍN, PERÚ PACK: BOX BLANCO CON BOMBONES SURTIIDOS EN SU INTERIOR 100g Solo con reserva.",
    availability: "out of stock",
  },
  {
    id: "huevo-marroc-mani-bombones-250",
    slug: "huevo-marroc-mani-bombones-250",
    name: "Huevo de Pascuas Marroc - Chocolate con Leche con Crocante de Maní",
    categoryId: "festividades",
    price: 71000,
    currency: "ARS",
    image: "/products/huevo-marroc-mani-bombones-250.jpg",
    description:
      "HUEVO DE PASCUAS DE MARROC Y CROCANTE DE MANÍ Stock limitado Huevo de Pascuas chocolate con leche con crocante de maní y bombones de marroc 250g Solo con reserva.",
    availability: "out of stock",
  },
  {
    id: "huevo-de-pascuas-coleccion-clasica-ecuatorianas",
    slug: "huevo-de-pascuas-coleccion-clasica-ecuatorianas",
    name: "Huevo de Pascuas 70% - Colección Clásica - Blend de Fincas Ecuatorianas",
    categoryId: "festividades",
    price: 29000,
    currency: "ARS",
    image: "/products/huevo-pascuas-blend-ecuatoriano-100.jpg",
    description:
      "HUEVO DE PASCUAS 70% -COLECCIÓN CLÁSICA- BLEND DE FINCAS ECUATORIANAS- 100g Solo con reserva.",
    availability: "out of stock",
    variants: [
      { label: "100g", price: 29000, availability: "out of stock" },
      { label: "200g", price: 52000, availability: "out of stock" },
    ],
  },
  {
    id: "huevo-de-pascuas-chocolate-con-leche-coleccion-clasica-blend-de-fincas-colombianas-250g",
    slug: "huevo-de-pascuas-chocolate-con-leche-coleccion-clasica-blend-de-fincas-colombianas-250g",
    name: "Huevo de Pascuas Chocolate con Leche -colección Clásica- Blend de Fincas Colombianas-200g",
    categoryId: "festividades",
    price: 52000,
    currency: "ARS",
    image: "/products/huevo-de-pascuas-chocolate-con-leche-coleccion-clasica-blend-de-fincas-colombianas-250g.jpg",
    description:
      "HUEVO DE PASCUAS CHOCOLATE CON LECHE -COLECCIÓN CLÁSICA- BLEND DE FINCAS COLOMBIANAS-200g Solo con reserva.",
    availability: "out of stock",
  },
  {
    id: "huevo-de-pascuas-chocolate-con-leche-coleccion-clasica-blend-de-fincas-colombianas-100g-con-bombones-surtidos",
    slug: "huevo-de-pascuas-chocolate-con-leche-coleccion-clasica-blend-de-fincas-colombianas-100g-con-bombones-surtidos",
    name: "Huevo de Pascuas Chocolate con Leche -colección Clásica- Blend de Fincas Colombianas-100g con Bombones Surtidos",
    categoryId: "festividades",
    price: 29000,
    currency: "ARS",
    image: "/products/huevo-de-pascuas-chocolate-con-leche-coleccion-clasica-blend-de-fincas-colombianas-100g-con-bombones-surtidos.jpg",
    description:
      "HUEVO DE PASCUAS CHOCOLATE CON LECHE -COLECCIÓN CLÁSICA- BLEND DE FINCAS COLOMBIANAS-100g con bombones surtidos Solo con reserva.",
    availability: "out of stock",
  },
  {
    id: "huevo-de-pascuas-blanco-con-nibs-tocache-peru-coleccion-clasica-blend-peruano-200g-con-bombones-surtidos",
    slug: "huevo-de-pascuas-blanco-con-nibs-tocache-peru-coleccion-clasica-blend-peruano-200g-con-bombones-surtidos",
    name: "Huevo de Pascuas Blanco con Nibs Tocache, Perú -colección Clásica- Blend Peruano-200g con Bombones Surtidos",
    categoryId: "festividades",
    price: 52000,
    currency: "ARS",
    image: "/products/huevo-de-pascuas-blanco-con-nibs-tocache-peru-coleccion-clasica-blend-peruano-200g-con-bombones-surtidos.jpg",
    description:
      "HUEVO DE PASCUAS BLANCO CON NIBS TOCACHE, PERÚ -COLECCIÓN CLÁSICA- BLEND PERUANO-200g con bombones surtidos",
    availability: "out of stock",
  },
  {
    id: "huevo-de-pascuas-con-cremas-de-frutos-secos",
    slug: "huevo-de-pascuas-con-cremas-de-frutos-secos",
    name: "Huevo de Pascuas con Cremas de Pistacho y Avellanas 380g",
    categoryId: "festividades",
    price: 49000,
    currency: "ARS",
    image: "/products/huevo-de-pascuas-con-cremas-de-frutos-secos.jpg",
    description:
      "Huevo de chocolate más exclusivo para que te des un lujazo más que merecido Elaborado por expertos chocolateros con los ingredientes finos y trazables. 100% desde el grano de cacao y 100% frutos secos. Lujo chocolatoso. Una cara de chocolate oscuro 70% con crema de pasta de pistacho, una cara con chocolate con leche 45% con crema de pasta de avellanas , y adentro del huevo de chocolate: bombones con crema de frutos secos COLECCIÓN ANCESTRO 380gr SOLO CON RESERVAS",
    availability: "out of stock",
  },
  // ── Derivados de Cacao ──
  {
    id: "stollen-harina-de-cacao-limoncello-mora",
    slug: "stollen-harina-de-cacao-limoncello-mora",
    name: "Stollen Limoncello con Harina de Cacao y Mora",
    categoryId: "derivados-cacao",
    price: 36000,
    currency: "ARS",
    image: "/products/stollen-harina-de-cacao-limoncello-mora.jpeg",
    description:
      "Stollen Limoncello con harina de cacao. Contiene Limón confitado, frutos secos y corazón de moras. 500g",
    availability: "preorder",
  },
  {
    id: "stollen-con-harina-de-cacao-y-licor-de-naranja",
    slug: "stollen-con-harina-de-cacao-y-licor-de-naranja",
    name: "Stollen con Harina de Cacao y Licor de Naranja",
    categoryId: "derivados-cacao",
    price: 36000,
    currency: "ARS",
    image: "/products/stollen-con-harina-de-cacao-y-licor-de-naranja.jpeg",
    description:
      "Stollen con harina de cacao y licor de naranja Contiene naranjas confitadas y frutos secos",
    availability: "preorder",
  },
  {
    id: "nibs-de-cacao-chuncho-quellouno-cuzco-peru",
    slug: "nibs-de-cacao-chuncho-quellouno-cuzco-peru",
    name: "Nibs de Cacao Chuncho - Quellouno, Cuzco, Perú",
    categoryId: "derivados-cacao",
    price: 15000,
    currency: "ARS",
    image: "/products/nibs-de-cacao-chuncho-quellouno-cuzco-peru-100g.jpg",
    description:
      "NIBS DE CACAO ( interior del grano de cacao partido) 100g Tipo de Grano: Mix de Chunchos Quellouno, Cuzco, Perú",
    variants: [
      { label: "100g", price: 15000, availability: "in stock" },
      { label: "250g", price: 32000, availability: "in stock" },
      { label: "500g", price: 58000, availability: "in stock" },
    ],
  },
  {
    id: "cacao-fino-tostado-mix-aromatico-tocache-peru",
    slug: "cacao-fino-tostado-mix-aromatico-tocache-peru",
    name: "Cacao Fino Tostado - Mix Aromático, Tocache, Perú",
    categoryId: "derivados-cacao",
    price: 11500,
    currency: "ARS",
    image: "/products/cacao-fino-tostado-100-g-mix-aromatico-tocache-san-martin-peru.jpg",
    description:
      "Origen: Tocache, San Martín, Perú Tipo de grano de Cacao: Mix aromático Grano de cacao fino de aroma tostado 100g",
    variants: [
      { label: "100g", price: 11500, availability: "in stock" },
      { label: "250g", price: 23000, availability: "in stock" },
      { label: "500g", price: 45000, availability: "in stock" },
      { label: "1kg", price: 85000, availability: "in stock" },
    ],
  },
  {
    id: "cascarilla-de-cacao",
    slug: "cascarilla-de-cacao",
    name: "Cascarilla de Cacao de Origen / 250g",
    categoryId: "derivados-cacao",
    price: 7000,
    currency: "ARS",
    image: "/products/cascarilla-de-cacao.jpg",
    description:
      "Cáscara tostada del grano de cacao fino de aroma. Orígenes disponibles: Tocache, San Martín, Perú Blend Antioquia, Colombia *Todas nuestras cáscaras son libres de metales pesados y toxinas* 250g",
    isFeatured: true,
  },
  {
    id: "harina-de-cacao-de-origen-250g",
    slug: "harina-de-cacao-de-origen-250g",
    name: "Harina de Cacao de Origen/ 250g",
    categoryId: "derivados-cacao",
    price: 9000,
    currency: "ARS",
    image: "/products/harina-de-cacao-de-origen-250g.jpg",
    description:
      "Harina de Cacao fino de.aroma Orígenes disponibles: Tocache, San Martín, Perú Blend Antioquia, Colombia Podés disfrutarlas en diversas preparaciones tanto saladas como dulces. Todas nuestras cáscaras son libres de metales pesados y toxinas. 250g",
  },
  // ── Turrones ──
  {
    id: "turron-de-mani-cubierto-con-chocolate-peruano-al-70-nibs-porciones-pote-surtidos-variedad",
    slug: "turron-de-mani-cubierto-con-chocolate-peruano-al-70-nibs-porciones-pote-surtidos-variedad",
    name: "Mix de Turrones en Porciones",
    categoryId: "turrones",
    price: 29000,
    currency: "ARS",
    image: "/products/turron-de-mani-cubierto-con-chocolate-peruano-al-70-nibs-porciones-pote-surtidos-variedad.jpeg",
    description:
      "Turrón de Maní cubierto con chocolate Peruano al 70% + nibs garrapinnados y maní Turrón de Maní marmolado con nibs de cacao Turrón de chocolate 90% Bagua Grande, Amazonas, Perú, cubierto con chocolate del mismo origen. Pistachos, avellanas, almendras y árandanos Turrón de chocolate 90% Bagua Grande, Amazonas, Perú, con pistachos, avellanas, almendras y árandanos",
    availability: "out of stock",
  },
  {
    id: "turron-de-chocolate",
    slug: "turron-de-chocolate",
    name: "Turrón Deli de Chocolate 70% y Avellanas, Mandarina y Naranja 100g",
    categoryId: "turrones",
    price: 16000,
    currency: "ARS",
    image: "/products/turron-de-chocolate.png",
    description:
      "TURRÓN DELI DE AVELLANAS, CHOCOLATE GUADALCANAL, ISLAS SALOMON, OCEANIA 70%, MANDARINA Y NARANJA",
    availability: "preorder",
  },
  {
    id: "turron-de-mani-y-nibs-garrapinados-de-esmeraldas-ecuador",
    slug: "turron-de-mani-y-nibs-garrapinados-de-esmeraldas-ecuador",
    name: "Turrón de Marroc- Marmolado y Nibs Quellouno, Perú 300g",
    categoryId: "turrones",
    price: 35000,
    currency: "ARS",
    image: "/products/turron-de-mani-y-nibs-garrapinados-de-esmeraldas-ecuador.jpeg",
    description:
      "Turrón de maní y chocolate con nibs garrapiñados de origen Quellouno, Perú 300 gramos",
    availability: "preorder",
  },
  {
    id: "turron-gianduia-chocolate-origen-beantobar-alicante-blando",
    slug: "turron-gianduia-chocolate-origen-beantobar-alicante-blando",
    name: "Turrón Gianduia, Avellanas Chocolatadas, Mandarina y Naranja 300g",
    categoryId: "turrones",
    price: 42000,
    currency: "ARS",
    image: "/products/turron-gianduia-chocolate-origen-beantobar-alicante-blando.png",
    description:
      "Delicioso turrón blando de avellanas tostadas, gianduia, naranja, mandarina y chocolate con leche de cacao de origen Tocache, Perú Aprox 300g",
    isFeatured: true,
  },
  {
    id: "chocolate-de-origen-ashanti-region-ghana-70-frambuesa-mora-almendras-y-pistachos",
    slug: "chocolate-de-origen-ashanti-region-ghana-70-frambuesa-mora-almendras-y-pistachos",
    name: "Turrón Negro Pistacho, Almendras, Frutos Rojos y Chocolate de Origen 300g",
    categoryId: "turrones",
    price: 45000,
    currency: "ARS",
    image: "/products/chocolate-de-origen-ashanti-region-ghana-70-frambuesa-mora-almendras-y-pistachos.jpg",
    description:
      "Chocolate de origen Ashanti Region, Ghana 70% Frambuesa, mora almendras y Pistachos 300g",
    availability: "preorder",
  },
  {
    id: "estilo-jijona-nibs-almendras",
    slug: "estilo-jijona-nibs-almendras",
    name: "Turrón de Cacao- Estilo Jijona- Nibs de Origen y Almendras 300g",
    categoryId: "turrones",
    price: 42000,
    currency: "ARS",
    image: "/products/estilo-jijona-nibs-almendras.png",
    description:
      "-Estilo Jijona- Nibs de cacao de origen Tuerê, Brasil y almendras tostadas 300g",
    availability: "preorder",
  },
  {
    id: "turron-blanco-almendras-nibs-garrapinados",
    slug: "turron-blanco-almendras-nibs-garrapinados",
    name: "Turrón Blanco de Almendras y Nibs Garrapiñados",
    categoryId: "turrones",
    price: 16000,
    currency: "ARS",
    image: "/products/almendras-tostadas-y-nibs-de-cacao-de-origen-amazonas-peru-garrapinados.png",
    description:
      "Almendras tostadas y nibs de cacao de origen Amazonas, Perú garrapiñados 100 g",
    variants: [
      { label: "100g", price: 16000, availability: "in stock" },
      { label: "300g", price: 42000, availability: "preorder" },
    ],
  },
  // ── Theobromas ──
  {
    id: "macalate-amantheo-100-chazuta-tarapoto-peru-theobroma-bicolor-majambo",
    slug: "macalate-amantheo-100-chazuta-tarapoto-peru-theobroma-bicolor-majambo",
    name: "Macalate Amantheo 100%- Chazuta, Tarapoto, Perú- Theobroma Bicolor- Majambo",
    categoryId: "theobromas",
    price: 13000,
    currency: "ARS",
    image: "/products/macalate-amantheo-100-chazuta-tarapoto-peru-theobroma-bicolor-majambo.jpg",
    description:
      "Barra de origen de Theobroma Bicolor CHAZUTA, TARAPOTO, PERU 100% Este Theobroma que es un superalimento, es tambien llamado MAJAMBO, MACAMBO o PATAXTE EDICIÓN LIMITADA 25g",
  },
];

// Productos destacados que aparecen en el home
export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.isFeatured);

// Helper: formatear precio
export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString("es-AR")}`;
}
