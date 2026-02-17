"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelatedProducts from "@/components/RelatedProducts";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS, formatPrice, type CacaoOrigin, type CacaoProcess } from "@/data/products";
import { useCart } from "@/context/CartContext";

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
  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <ProductDetailContent
      product={product}
      category={category}
      categorySegment={categorySegment}
      categoryName={categoryName}
      hasVariants={!!hasVariants}
      techSheet={t}
    />
  );
}

function ProductDetailContent({
  product,
  category,
  categorySegment,
  categoryName,
  hasVariants,
  techSheet: t,
}: {
  product: NonNullable<ReturnType<typeof PRODUCTS.find>>;
  category: ReturnType<typeof CATEGORIES.find>;
  categorySegment: string;
  categoryName: string;
  hasVariants: boolean;
  techSheet: NonNullable<ReturnType<typeof PRODUCTS.find>>["techSheet"];
}) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const activePrice = hasVariants
    ? product.variants![selectedVariant].price
    : product.price;

  const activeAvailability = hasVariants
    ? product.variants![selectedVariant].availability
    : product.availability;

  const isAvailable = activeAvailability !== "out of stock";

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: activePrice,
      variantLabel: hasVariants ? product.variants![selectedVariant].label : undefined,
      quantity,
    });
    setQuantity(1);
  };

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
            <span className="text-gold">{product.shortName}</span>
          </p>
          {product.badge && (
            <span className="inline-block text-gold/80 text-xs tracking-[0.25em] uppercase font-medium mb-2">
              {product.badge}
            </span>
          )}
          <h1 className="text-ink text-3xl md:text-4xl font-light" style={{ fontFamily: '"trajan-pro-3", serif' }}>
            {product.shortName}
          </h1>
          {product.subtitle && (
            <p className="text-ink/55 text-sm md:text-base tracking-[0.08em] mt-2">
              {product.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Contenido: imagen + ficha técnica */}
      <section className="py-12 md:py-16 px-8 md:px-8">
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* Imagen */}
            <div className="lg:col-span-2">
              <div className="relative aspect-square w-full max-w-md mx-auto lg:max-w-none rounded-sm overflow-hidden border border-ink/15">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              </div>
              {/* Nombre completo + descripción */}
              <div className="mt-6 space-y-3">
                {product.name !== product.shortName && (
                  <p className="text-ink/60 text-xs tracking-[0.06em] leading-relaxed italic">
                    {product.name}
                  </p>
                )}
                {product.description && (
                  <p className="text-ink/80 text-sm leading-relaxed tracking-[0.02em]">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Selector de variantes */}
              {hasVariants && (
                <div className="mt-6">
                  <p className="label-section mb-3">Presentación</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants!.map((v, i) => (
                      <button
                        key={v.label}
                        onClick={() => setSelectedVariant(i)}
                        className={`
                          text-xs tracking-[0.12em] uppercase px-4 py-2.5 border
                          transition-all duration-200
                          ${selectedVariant === i
                            ? "border-gold text-gold bg-gold/10"
                            : v.availability === "out of stock"
                              ? "border-ink/15 text-ink/30 line-through cursor-not-allowed"
                              : "border-ink/25 text-ink/60 hover:border-gold/60 hover:text-gold"
                          }
                        `}
                        disabled={v.availability === "out of stock"}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <p className="text-gold text-xl font-semibold">{formatPrice(activePrice)}</p>
                {isAvailable ? (
                  <div className="flex items-center gap-3">
                    {/* Quantity selector */}
                    <div className="flex items-center border border-ink/20">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-9 h-9 flex items-center justify-center text-ink/60
                                   hover:text-gold hover:border-gold transition-colors text-sm"
                        aria-label="Reducir cantidad"
                      >
                        −
                      </button>
                      <span className="w-9 h-9 flex items-center justify-center text-ink text-sm tabular-nums border-x border-ink/20">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-ink/60
                                   hover:text-gold hover:border-gold transition-colors text-sm"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="btn-gold text-sm"
                      onClick={handleAddToCart}
                    >
                      Añadir al carrito
                    </button>
                  </div>
                ) : (
                  <span className="text-ink/40 text-xs tracking-[0.12em] uppercase">
                    Sin stock
                  </span>
                )}
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
