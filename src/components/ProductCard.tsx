"use client";

import Link from "next/link";
import { Product, formatPrice } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col bg-ink/5 border border-ink/15
                    hover:border-gold/40 transition-all duration-500 overflow-hidden">
      {/* ── Imagen ──────────────────────────── */}
      <Link href={`/shop/${product.categoryId}/${product.slug}`} className="relative aspect-square overflow-hidden">
        {/* Placeholder visual — reemplazar con <Image> real */}
        <div
          className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          style={{
            background: `linear-gradient(145deg, hsl(25, 15%, 92%), hsl(20, 12%, 88%))`,
          }}
        >
          {/* Ícono placeholder */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28" stroke="#C9A96E" strokeWidth="1" />
              <path d="M32 18c-8 0-14 6-14 14s6 14 14 14 14-6 14-14-6-14-14-14z" stroke="#C9A96E" strokeWidth="1" fill="none" />
            </svg>
          </div>
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
          href={`/shop/${product.categoryId}/${product.slug}`}
          className="text-ink/90 text-xs md:text-sm tracking-[0.1em] uppercase
                     hover:text-gold transition-colors duration-200 line-clamp-2 leading-relaxed"
        >
          {product.name}
        </Link>
        <p className="text-gold text-sm font-semibold mt-auto">
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  );
}
