import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FEATURED_PRODUCTS } from "@/data/products";
import { HOME_COLLECTIONS } from "@/data/categories";
import Link from "next/link";
import Image from "next/image";

/* Imágenes de categorías para la grilla Colecciones (public/categorias) */
const CATEGORY_IMAGES = [
  "/categorias/Frame-11.png",
  "/categorias/Frame-12-1.png",
  "/categorias/Frame-13.png",
  "/categorias/Frame-153.png",
  "/categorias/Frame-73.png",
  "/categorias/Frame-11.png",
];

/* ────────────────────────────────────────────────
   Sección: valores de la marca
   ──────────────────────────────────────────────── */
const VALUES = [
  {
    label: "SINGLE ORIGIN",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="#C9A96E" strokeWidth="1" />
        <path d="M20 6 C20 6 28 14 28 22 C28 27 24.5 30 20 30 C15.5 30 12 27 12 22 C12 14 20 6 20 6Z" stroke="#C9A96E" strokeWidth="1" fill="none" />
      </svg>
    ),
  },
  {
    label: "CACAO FINO",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="#C9A96E" strokeWidth="1" />
        <path d="M14 26 L20 10 L26 26 Z" stroke="#C9A96E" strokeWidth="1" fill="none" strokeLinejoin="round" />
        <line x1="20" y1="10" x2="20" y2="8" stroke="#C9A96E" strokeWidth="1" />
      </svg>
    ),
  },
  {
    label: "SUPERFOOD",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="#C9A96E" strokeWidth="1" />
        <path d="M20 10 L22.5 16.5 L30 17 L24 22 L26 29 L20 25 L14 29 L16 22 L10 17 L17.5 16.5 Z" stroke="#C9A96E" strokeWidth="1" fill="none" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "COMERCIO JUSTO",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="#C9A96E" strokeWidth="1" />
        <path d="M15 28 L15 18 M20 28 L20 14 M25 28 L25 20" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "ECONOMÍA CIRCULAR",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="#C9A96E" strokeWidth="1" />
        <path d="M20 10 A10 10 0 0 1 30 20 A10 10 0 0 1 20 30 A10 10 0 0 1 10 20 A10 10 0 0 1 20 10" stroke="#C9A96E" strokeWidth="1" fill="none" strokeDasharray="4 3" />
        <path d="M20 15 L20 25 M15 20 L25 20" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-page">
      <Navbar />

      {/* ── Hero Slider ──────────────────── */}
      <HeroSlider />

      {/* ── Productos Destacados ─────────── */}
      <section className="py-16 px-8 md:px-8 bg-page">
        <div className="w-full">
          {/* Header */}
          <div className="text-center mb-12 space-y-3">
            <div className="divider-gold" />
            <h2 className="title-section">Descubrí el Universo de Las Romeas</h2>
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* CTA ver todos */}
          <div className="text-center mt-10">
            <Link href="/shop" className="btn-outline">
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>

      {/* ── Colecciones ──────────────────── */}
      <section className="py-16 px-8 md:px-8 bg-ink/5">
        <div className="w-full">
          <div className="text-center mb-12 space-y-3">
            <div className="divider-gold" />
            <h2 className="title-section">Colecciones</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {HOME_COLLECTIONS.map((cat, index) => (
              <Link
                key={cat.id}
                href={`/shop/${cat.slug}`}
                className="group relative aspect-[4/3] overflow-hidden border border-ink/15
                           hover:border-gold/50 transition-all duration-500"
              >
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                  <Image
                    src={CATEGORY_IMAGES[index] ?? CATEGORY_IMAGES[0]}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-page/90 via-transparent to-transparent" />
                {/* Texto */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <h3 className="text-ink text-sm md:text-base font-light tracking-[0.15em] uppercase group-hover:text-gold transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <span className="block w-0 h-px bg-gold mt-2 group-hover:w-8 transition-all duration-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tree & Bean to Bar ───────────── */}
      <section className="py-20 px-8 md:px-8 bg-page relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-ink/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-ink/5 blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="w-full relative z-10">
          <div className="text-center mb-14 space-y-3">
            <p className="label-section">Filosofía</p>
            <div className="divider-gold" />
            <h2 className="title-section text-4xl md:text-5xl">Tree &amp; Bean to Bar</h2>
          </div>

          {/* Contenido en dos columnas */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Columna texto */}
            <div className="space-y-5 text-ink/75 text-base leading-relaxed">
              <p>
                El <strong className="text-ink">Bean to Bar</strong> —de la semilla a la barra— surge como una respuesta
                a la necesidad de recuperar los orígenes y los sabores verdaderos
                del cacao fino, regresando a procesos cuidados que respeten la
                identidad de la semilla en toda la cadena de valor.
              </p>
              <p>
                El <strong className="text-ink">Tree to Bar</strong> —del árbol de cacao hasta la barra de chocolate—
                nació en América Latina, en países productores de cacao. Hay
                trazabilidad de proceso desde la plantación.
              </p>
              <p>
                En ambas filosofías, en nuestro caso,{" "}
                <strong className="text-gold">estamos comprometidos con los productores
                y su labor con el cacao.</strong> Incluso plantar nuevos árboles,
                acompañar su crecimiento y cuidado, generar proyectos de sustentabilidad y
                de intercambios comerciales y de conocimientos.
              </p>
            </div>

            {/* Columna texto 2 */}
            <div className="space-y-5 text-ink/75 text-base leading-relaxed">
              <p>
                Luego del seguimiento en cosecha, poscosecha, fermentación, secado
                y almacenado, y habiendo seleccionado microlotes y lotes en origen,
                importamos el cacao seco y ya en fábrica estudiamos nuevamente el grano
                y desarrollamos las <strong className="text-ink">curvas de tostado especiales</strong> para
                cada grano, planteando así el proceso de molienda, descascarillado,
                refinado y conchado para obtener{" "}
                <strong className="text-gold">nuestro propio chocolate con un desarrollo con &quot;alma mater&quot; y buenas
                prácticas, sin agregados ni conservantes, manteniendo al máximo sus propiedades nutritivas.</strong>
              </p>
              <p>
                Nuestra meta es llegar a ustedes con cacao y chocolate de calidad,
                y que disfrutes tanto como nosotros, el mundo sensorial que despierta un cacao fino de aroma
                y una barra de chocolate que lleva consigo la identidad de un terroir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Strip de valores ─────────────── */}
      <section className="py-16 px-8 md:px-8 bg-ink/5 border-y border-ink/15">
        <div className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
            {VALUES.map((v) => (
              <div key={v.label} className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full border border-ink/25 flex items-center justify-center
                                hover:border-gold/60 transition-colors duration-400">
                  {v.icon}
                </div>
                <p className="text-ink-dark/80 text-xs tracking-[0.2em] uppercase">
                  {v.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
