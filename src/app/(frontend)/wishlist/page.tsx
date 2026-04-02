"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { PRODUCTS } from "@/data/products";

export default function WishlistPage() {
  const { items } = useWishlist();

  const wishlistProducts = PRODUCTS.filter((p) =>
    items.some((i) => i.productId === p.id)
  );

  return (
    <div className="min-h-screen bg-page">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[28vh] min-h-[200px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, #FFFEFC, hsl(25, 15%, 94%))" }}
        />
        <div className="overlay-hero" />
        <div className="relative z-10 w-full px-8 pb-12">
          <p className="label-section mb-2">Mi lista</p>
          <div className="divider-gold mb-3" style={{ marginLeft: 0, marginRight: "auto" }} />
          <h1
            className="text-ink text-4xl md:text-5xl font-light"
            style={{ fontFamily: '"trajan-pro-3", serif' }}
          >
            Favoritos
          </h1>
        </div>
      </section>

      <section className="py-12 px-8 md:px-8">
        {wishlistProducts.length > 0 ? (
          <div className="w-full">
            <p className="text-ink/50 text-sm mb-8">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? "producto" : "productos"}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {wishlistProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-24 text-center gap-6">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C9A96E"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-40"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <div className="space-y-2">
              <p className="text-ink/60 text-base">Tu lista de favoritos está vacía.</p>
              <p className="text-ink/40 text-sm">Guardá los productos que más te gusten.</p>
            </div>
            <Link href="/shop" className="btn-outline">
              Explorar productos
            </Link>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
