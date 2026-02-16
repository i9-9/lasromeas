"use client";

import Link from "next/link";
import Image from "next/image";
import { Product, formatPrice } from "@/data/products";
import { CATEGORIES } from "@/data/categories";

interface ProductCardProps {
  product: Product;
}

function getCategorySlug(categoryId: string): string {
  return CATEGORIES.find((c) => c.id === categoryId)?.slug ?? categoryId;
}

export default function ProductCard({ product }: ProductCardProps) {
  const catSlug = getCategorySlug(product.categoryId);

  return (
    <div className="group relative flex flex-col bg-ink/5 border border-ink/15
                    hover:border-gold/40 transition-all duration-500 overflow-hidden">
      {/* ── Imagen ──────────────────────────── */}
      <Link href={`/shop/${catSlug}/${product.slug}`} className="relative aspect-square overflow-hidden">
        <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        </div>

        {/* Overlay hover con botón "Añadir al carrito" */}
        <div className="absolute inset-0 bg-transparent group-hover:bg-ink/20
                        flex items-end justify-center pb-4
                        transition-all duration-500">
          <button
            className="opacity-0 group-hover:opacity-100
                       translate-y-2 group-hover:translate-y-0
                       transition-all duration-400 ease-out
                       btn-gold text-xs px-4 py-2"
            onClick={(e) => {
              e.preventDefault();
              // TODO: integrar lógica de carrito
              alert(`Añadido al carrito: ${product.name}`);
            }}
          >
            Añadir al carrito
          </button>
        </div>
      </Link>

      {/* ── Info ────────────────────────────── */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <Link
          href={`/shop/${catSlug}/${product.slug}`}
          className="text-ink/90 text-xs md:text-sm tracking-[0.1em] uppercase
                     hover:text-gold transition-colors duration-200 line-clamp-2 leading-relaxed"
        >
          {product.name}
        </Link>
        <p className="text-gold text-sm font-semibold mt-auto">
          {product.variants && product.variants.length > 0 ? (
            <><span className="text-ink/40 text-xs font-normal">Desde </span>{formatPrice(product.price)}</>
          ) : (
            formatPrice(product.price)
          )}
        </p>
      </div>
    </div>
  );
}
