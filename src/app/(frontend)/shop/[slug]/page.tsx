"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/products";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const category = useMemo(
    () => CATEGORIES.find((c) => c.slug === slug),
    [slug]
  );

  const products = useMemo(
    () => (category ? PRODUCTS.filter((p) => p.categoryId === category.id) : []),
    [category]
  );

  // Si no se encuentra la categoría, mostrar algo genérico
  const title = category?.name ?? "Categoría";

  return (
    <div className="min-h-screen bg-page">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[36vh] min-h-[260px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, #FFFEFC, hsl(25, 15%, 94%))" }}
        />
        <div className="overlay-hero" />
        <div className="relative z-10 w-full px-8 md:px-8 pb-14">
          {/* Breadcrumb */}
          <p className="text-ink/50 text-xs tracking-[0.15em] uppercase mb-3">
            <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <span className="mx-2 text-ink/50">/</span>
            <span className="text-gold">{title}</span>
          </p>
          <h1 className="text-ink text-4xl md:text-5xl font-light" style={{ fontFamily: '"trajan-pro-3", serif' }}>
            {title}
          </h1>
        </div>
      </section>

      {/* Grid de productos */}
      <section className="py-16 px-8 md:px-8">
        <div className="w-full">
          <div className="flex items-center justify-between mb-8">
            <p className="text-ink/50 text-xs tracking-[0.15em] uppercase">
              {products.length} producto{products.length !== 1 ? "s" : ""}
            </p>
            <Link href="/shop" className="text-gold text-xs tracking-[0.15em] uppercase hover:underline">
              ← Volver al shop
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <p className="text-ink/50 text-sm">
                No hay productos en esta categoría por el momento.
              </p>
              <Link href="/shop" className="btn-outline">
                Ver todos los productos
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
