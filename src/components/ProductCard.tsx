"use client";

import Link from "next/link";
import Image from "next/image";
import { Product, formatPrice } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: Product;
}

function getCategorySlug(categoryId: string): string {
  return CATEGORIES.find((c) => c.id === categoryId)?.slug ?? categoryId;
}

export default function ProductCard({ product }: ProductCardProps) {
  const catSlug = getCategorySlug(product.categoryId);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const isOutOfStock = product.availability === "out of stock";
  const inWishlist = isInWishlist(product.id);

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

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      slug: product.slug,
      categorySlug: catSlug,
    });
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
            className={`object-cover ${isOutOfStock ? "opacity-60 grayscale-[30%]" : ""}`}
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        </div>

        {/* Badge out of stock */}
        {isOutOfStock && (
          <div className="absolute top-2 left-2 bg-ink/80 text-page text-[9px] tracking-[0.18em] uppercase px-2 py-1 z-10">
            Sin stock
          </div>
        )}

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
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/shop/${catSlug}/${product.slug}`}
            className="text-ink/90 text-sm md:text-base tracking-[0.06em] uppercase font-light
                       hover:text-gold transition-colors duration-200 line-clamp-2 leading-snug flex-1"
          >
            {product.shortName}
          </Link>

          {/* Wishlist heart button */}
          <button
            onClick={handleWishlist}
            aria-label={inWishlist ? "Quitar de favoritos" : "Agregar a favoritos"}
            className={`flex-shrink-0 mt-0.5 transition-colors duration-300 ${
              inWishlist ? "text-gold" : "text-ink/25 hover:text-gold/70"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={inWishlist ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {product.subtitle && (
          <p className="text-ink/45 text-[11px] tracking-[0.03em] leading-snug line-clamp-1">
            {product.subtitle}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-1">
          <p className={`text-sm font-semibold ${isOutOfStock ? "text-ink/40" : "text-gold"}`}>
            {isOutOfStock ? (
              <span className="text-xs font-normal tracking-[0.1em] uppercase">Sin stock</span>
            ) : product.variants && product.variants.length > 0 ? (
              <><span className="text-ink/40 text-xs font-normal">Desde </span>{formatPrice(product.price)}</>
            ) : (
              formatPrice(product.price)
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
