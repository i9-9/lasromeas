"use client";

import { useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/data/products";
import type { Product } from "@/data/products";

interface RelatedProductsProps {
  /** Producto actual (se excluye de la lista) */
  currentProduct: Product;
  /** Cantidad máxima de productos a mostrar */
  maxItems?: number;
}

export default function RelatedProducts({ currentProduct, maxItems = 4 }: RelatedProductsProps) {
  const related = useMemo(() => {
    return PRODUCTS.filter(
      (p) => p.categoryId === currentProduct.categoryId && p.id !== currentProduct.id
    ).slice(0, maxItems);
  }, [currentProduct.categoryId, currentProduct.id, maxItems]);

  if (related.length === 0) return null;

  return (
    <section className="py-16 px-8 md:px-8 border-t border-ink/10">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-ink text-lg font-light tracking-[0.2em] uppercase mb-8">
          Productos relacionados
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {related.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
