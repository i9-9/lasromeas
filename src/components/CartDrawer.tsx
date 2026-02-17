"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    totalItems,
    totalPrice,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  /* Lock body scroll when open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`
          fixed inset-0 z-[90] bg-ink/40 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        ref={drawerRef}
        className={`
          fixed top-0 right-0 z-[100] h-full w-full max-w-md
          bg-page border-l border-ink/15 shadow-2xl
          flex flex-col
          transition-transform duration-400 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        aria-label="Carrito de compras"
      >
        {/* ── Header ──────────────────────── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink/15">
          <h2
            className="text-ink text-base tracking-[0.15em] uppercase font-light"
            style={{ fontFamily: '"trajan-pro-3", serif' }}
          >
            Carrito
            {totalItems > 0 && (
              <span className="ml-2 text-gold text-sm">({totalItems})</span>
            )}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="text-ink/60 hover:text-gold transition-colors duration-200"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Items list ──────────────────── */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-ink/20">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <p className="text-ink/50 text-sm tracking-[0.05em]">Tu carrito está vacío</p>
            <button
              onClick={closeCart}
              className="btn-outline text-xs mt-2"
            >
              Seguir comprando
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <ul className="divide-y divide-ink/10">
              {items.map((item) => {
                const key = item.variantLabel
                  ? `${item.productId}::${item.variantLabel}`
                  : item.productId;
                return (
                  <li key={key} className="px-6 py-4 flex gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 shrink-0 border border-ink/10 bg-ink/5 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <p className="text-ink/90 text-xs tracking-[0.06em] uppercase leading-relaxed line-clamp-2">
                        {item.name}
                      </p>
                      {item.variantLabel && (
                        <p className="text-ink/50 text-[11px] tracking-[0.08em] uppercase">
                          {item.variantLabel}
                        </p>
                      )}
                      <p className="text-gold text-sm font-semibold mt-auto">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1, item.variantLabel)
                          }
                          className="w-7 h-7 flex items-center justify-center
                                     border border-ink/20 text-ink/60
                                     hover:border-gold hover:text-gold
                                     transition-colors text-sm"
                          aria-label="Reducir cantidad"
                        >
                          −
                        </button>
                        <span className="text-ink/90 text-sm w-6 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1, item.variantLabel)
                          }
                          className="w-7 h-7 flex items-center justify-center
                                     border border-ink/20 text-ink/60
                                     hover:border-gold hover:text-gold
                                     transition-colors text-sm"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.productId, item.variantLabel)}
                          className="ml-auto text-ink/30 hover:text-red-500 transition-colors"
                          aria-label="Eliminar"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* ── Footer ──────────────────────── */}
        {items.length > 0 && (
          <div className="border-t border-ink/15 px-6 py-5 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-ink/60 text-xs tracking-[0.12em] uppercase">Subtotal</span>
              <span className="text-gold text-lg font-semibold">{formatPrice(totalPrice)}</span>
            </div>

            <p className="text-ink/40 text-[11px] tracking-[0.04em]">
              Envío calculado al finalizar la compra
            </p>

            {/* Checkout button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-gold w-full text-sm text-center block"
            >
              Finalizar compra
            </Link>

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="w-full text-center text-ink/40 text-[11px] tracking-[0.08em] uppercase
                         hover:text-ink/70 transition-colors py-1"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
