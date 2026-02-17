"use client";

import Link from "next/link";
import Image from "next/image";
import { Product, formatPrice } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

function getCategorySlug(categoryId: string): string {
  return CATEGORIES.find((c) => c.id === categoryId)?.slug ?? categoryId;
}

export default function ProductCard({ product }: ProductCardProps) {
  const catSlug = getCategorySlug(product.categoryId);
  const { addItem } = useCart();

  const isOutOfStock = product.availability === "out of stock";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;

    if (product.variants && product.variants.length > 0) {
      const firstAvailable = product.variants.find((v) => v.availability !== "out of stock");
      if (!firstAvailable) return;
      addItem({
        productId: product.id,
        name: product.name,
        image: product.image,
        price: firstAvailable.price,
        variantLabel: firstAvailable.label,
      });
    } else {
      addItem({
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
      });
    }
  };

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
          {!isOutOfStock && (
            <button
              className="opacity-0 group-hover:opacity-100
                         translate-y-2 group-hover:translate-y-0
                         transition-all duration-400 ease-out
                         btn-gold text-xs px-4 py-2"
              onClick={handleAddToCart}
            >
              Añadir al carrito
            </button>
          )}
        </div>
      </Link>

      {/* ── Info ────────────────────────────── */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        {product.badge && (
          <span className="text-gold/70 text-[10px] tracking-[0.2em] uppercase font-medium">
            {product.badge}
          </span>
        )}
        <Link
          href={`/shop/${catSlug}/${product.slug}`}
          className="text-ink/90 text-sm md:text-base tracking-[0.06em] uppercase font-light
                     hover:text-gold transition-colors duration-200 line-clamp-2 leading-snug"
        >
          {product.shortName}
        </Link>
        {product.subtitle && (
          <p className="text-ink/45 text-[11px] tracking-[0.03em] leading-snug line-clamp-1">
            {product.subtitle}
          </p>
        )}
        <p className="text-gold text-sm font-semibold mt-auto pt-1">
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
