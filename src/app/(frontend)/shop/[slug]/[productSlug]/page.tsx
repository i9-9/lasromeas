"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelatedProducts from "@/components/RelatedProducts";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS, formatPrice, type CacaoOrigin, type CacaoProcess } from "@/data/products";

function formatOrigin(origin: CacaoOrigin): string {
  const parts = [origin.country, origin.region, origin.farm].filter(Boolean);
  return parts.join(", ");
}

function FichaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-3 border-b border-ink/10 last:border-0">
      <dt className="label-section shrink-0 w-full sm:w-40">{label}</dt>
      <dd className="text-ink/90 text-sm tracking-[0.05em]">{value ?? "—"}</dd>
    </div>
  );
}

export default function ProductPage() {
  const params = useParams<{ slug: string; productSlug: string }>();
  const { slug: categorySegment, productSlug } = params;

  // First segment can be category id or category slug (links use both)
  const category = useMemo(
    () => CATEGORIES.find((c) => c.id === categorySegment || c.slug === categorySegment),
    [categorySegment]
  );

  const product = useMemo(
    () =>
      category
        ? PRODUCTS.find((p) => p.categoryId === category.id && p.slug === productSlug)
        : undefined,
    [category, productSlug]
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-page">
        <Navbar />
        <section className="py-24 px-8 text-center">
          <h1 className="text-ink text-2xl font-light mb-4">Producto no encontrado</h1>
          <Link href="/shop" className="btn-outline">Volver al shop</Link>
        </section>
        <Footer />
      </div>
    );
  }

  const t = product.techSheet;
  const categoryName = category?.name ?? "Shop";

  return (
    <div className="min-h-screen bg-page">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[32vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, #FFFEFC, hsl(25, 15%, 94%))" }}
        />
        <div className="relative z-10 w-full px-8 md:px-8 pb-12 pt-24">
          <p className="text-ink/50 text-xs tracking-[0.15em] uppercase mb-3">
            <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <span className="mx-2">/</span>
            <Link href={`/shop/${category?.slug ?? categorySegment}`} className="hover:text-gold transition-colors">
              {categoryName}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gold">{product.name}</span>
          </p>
          <h1 className="text-ink text-3xl md:text-4xl font-light" style={{ fontFamily: '"trajan-pro-3", serif' }}>
            {product.name}
          </h1>
        </div>
      </section>

      {/* Contenido: imagen + ficha técnica */}
      <section className="py-12 md:py-16 px-8 md:px-8">
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* Imagen */}
            <div className="lg:col-span-2">
              <div
                className="aspect-square w-full max-w-md mx-auto lg:max-w-none rounded-sm overflow-hidden border border-ink/15"
                style={{
                  background: "linear-gradient(145deg, hsl(25, 15%, 92%), hsl(20, 12%, 88%))",
                }}
              >
                <div className="w-full h-full flex items-center justify-center opacity-20">
                  <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="28" stroke="#C9A96E" strokeWidth="1" />
                    <path d="M32 18c-8 0-14 6-14 14s6 14 14 14 14-6 14-14-6-14-14-14z" stroke="#C9A96E" strokeWidth="1" fill="none" />
                  </svg>
                </div>
              </div>
              {product.description && (
                <p className="mt-6 text-ink/80 text-sm leading-relaxed tracking-[0.02em]">
                  {product.description}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <p className="text-gold text-xl font-semibold">{formatPrice(product.price)}</p>
                <button
                  type="button"
                  className="btn-gold text-sm"
                  onClick={() => alert(`Añadido al carrito: ${product.name}`)}
                >
                  Añadir al carrito
                </button>
              </div>
            </div>

            {/* Ficha técnica */}
            <div className="lg:col-span-3">
              <h2 className="text-ink text-lg font-light tracking-[0.2em] uppercase mb-6 border-b border-ink/20 pb-2">
                Ficha técnica
              </h2>
              <dl className="space-y-0">
                <FichaRow
                  label="Origen del cacao"
                  value={t?.origin ? formatOrigin(t.origin) : undefined}
                />
                <FichaRow
                  label="% cacao"
                  value={t?.cacaoPercent != null ? `${t.cacaoPercent}%` : undefined}
                />
                <FichaRow
                  label="Variedad"
                  value={t?.variety}
                />
                <FichaRow
                  label="Perfil sensorial"
                  value={t?.sensoryProfile?.length ? t.sensoryProfile.join(" / ") : undefined}
                />
                <FichaRow
                  label="Proceso"
                  value={
                    t?.process ? (
                      <span className="space-y-1.5 block">
                        {t.process.fermentation && (
                          <span className="block">Fermentación: {t.process.fermentation}</span>
                        )}
                        {t.process.roasting && (
                          <span className="block">Tostado: {t.process.roasting}</span>
                        )}
                        {t.process.conching && (
                          <span className="block">Conchado: {t.process.conching}</span>
                        )}
                      </span>
                    ) : undefined
                  }
                />
                <FichaRow
                  label="Lote / batch"
                  value={t?.batch}
                />
              </dl>
              {!t && (
                <p className="text-ink/50 text-sm mt-4 italic">
                  Ficha técnica disponible para barras Tree & Bean to Bar.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts currentProduct={product} />

      <Footer />
    </div>
  );
}
