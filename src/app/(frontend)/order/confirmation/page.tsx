"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatPrice } from "@/data/products";

interface OrderData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingMethod: string;
  shippingAddress?: {
    street: string;
    city: string;
    province: string;
    zipCode: string;
  };
  items: {
    productName: string;
    variantLabel?: string;
    quantity: number;
    unitPrice: number;
  }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const ref = searchParams.get("ref");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const orderRef = ref || (typeof window !== "undefined" ? sessionStorage.getItem("lastOrderNumber") : null);

    if (!orderRef) {
      setError("No se encontró referencia del pedido");
      setLoading(false);
      return;
    }

    fetch(`/api/orders/${encodeURIComponent(orderRef)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Pedido no encontrado");
        return res.json();
      })
      .then((data) => {
        setOrder(data.order);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ref]);

  // Determine display status
  const paymentOk = status === "success" || order?.paymentStatus === "paid";
  const paymentPending = status === "pending" || order?.paymentStatus === "pending";
  const paymentFailed = status === "failure" || order?.paymentStatus === "failed";

  if (loading) {
    return (
      <div className="py-24 text-center">
        <svg className="animate-spin w-8 h-8 mx-auto text-gold mb-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-ink/50 text-sm">Cargando pedido...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-8">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-ink/20 mb-6">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <h2 className="text-ink text-xl font-light mb-3" style={{ fontFamily: '"trajan-pro-3", serif' }}>
          Pedido no encontrado
        </h2>
        <p className="text-ink/50 text-sm mb-6">{error}</p>
        <Link href="/shop" className="btn-gold text-sm">Ir al Shop</Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 md:px-8 max-w-3xl mx-auto">
      {/* Status banner */}
      {paymentOk && (
        <div className="bg-emerald-50 border border-emerald-200 p-6 mb-8 text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3">
            <circle cx="12" cy="12" r="10" stroke="#059669" strokeWidth="1.5" />
            <path d="M8 12l3 3 5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="text-emerald-800 text-lg font-medium mb-1">¡Pago confirmado!</h2>
          <p className="text-emerald-600 text-sm">Tu pedido fue recibido correctamente.</p>
        </div>
      )}

      {paymentPending && (
        <div className="bg-amber-50 border border-amber-200 p-6 mb-8 text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3">
            <circle cx="12" cy="12" r="10" stroke="#D97706" strokeWidth="1.5" />
            <path d="M12 8v4l3 3" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h2 className="text-amber-800 text-lg font-medium mb-1">Pago pendiente</h2>
          <p className="text-amber-600 text-sm">Estamos esperando la confirmación del pago. Te notificaremos por email.</p>
        </div>
      )}

      {paymentFailed && (
        <div className="bg-red-50 border border-red-200 p-6 mb-8 text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3">
            <circle cx="12" cy="12" r="10" stroke="#DC2626" strokeWidth="1.5" />
            <path d="M15 9l-6 6M9 9l6 6" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h2 className="text-red-800 text-lg font-medium mb-1">El pago no pudo completarse</h2>
          <p className="text-red-600 text-sm">Podés intentarlo nuevamente o contactarnos.</p>
        </div>
      )}

      {/* Order header */}
      <div className="border-b border-ink/15 pb-6 mb-8">
        <p className="text-ink/40 text-xs tracking-[0.15em] uppercase mb-2">
          Pedido
        </p>
        <h1
          className="text-ink text-2xl md:text-3xl font-light"
          style={{ fontFamily: '"trajan-pro-3", serif' }}
        >
          {order.orderNumber}
        </h1>
        <p className="text-ink/50 text-xs mt-2">
          {new Date(order.createdAt).toLocaleDateString("es-AR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Order details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Customer info */}
        <div>
          <h3 className="text-ink/60 text-[11px] tracking-[0.15em] uppercase mb-3">
            Datos de contacto
          </h3>
          <div className="space-y-1 text-sm text-ink/80">
            <p className="font-medium">{order.customerName}</p>
            <p>{order.customerEmail}</p>
            <p>{order.customerPhone}</p>
          </div>
        </div>

        {/* Shipping info */}
        <div>
          <h3 className="text-ink/60 text-[11px] tracking-[0.15em] uppercase mb-3">
            Entrega
          </h3>
          {order.shippingMethod === "pickup" ? (
            <div className="text-sm text-ink/80">
              <p className="font-medium">Retiro en tienda</p>
              <p>Villa Crespo, Buenos Aires</p>
            </div>
          ) : (
            <div className="text-sm text-ink/80 space-y-1">
              <p className="font-medium">Envío a domicilio</p>
              {order.shippingAddress && (
                <>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="border border-ink/10 mb-8">
        <div className="bg-ink/[0.03] px-5 py-3">
          <h3 className="text-ink/60 text-[11px] tracking-[0.15em] uppercase">
            Productos
          </h3>
        </div>
        <ul className="divide-y divide-ink/10">
          {order.items.map((item, idx) => (
            <li key={idx} className="px-5 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-ink/80 text-sm">{item.productName}</p>
                {item.variantLabel && (
                  <p className="text-ink/40 text-[11px] uppercase">{item.variantLabel}</p>
                )}
              </div>
              <p className="text-ink/50 text-xs shrink-0">×{item.quantity}</p>
              <p className="text-ink/80 text-sm font-semibold shrink-0 w-24 text-right">
                {formatPrice(item.unitPrice * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <div className="border-t border-ink/10 px-5 py-4 space-y-2">
          <div className="flex justify-between text-ink/50 text-xs">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.shippingCost > 0 && (
            <div className="flex justify-between text-ink/50 text-xs">
              <span>Envío</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
          )}
          <div className="flex justify-between text-ink text-base font-semibold pt-2 border-t border-ink/10">
            <span>Total</span>
            <span className="text-gold">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        <Link href="/shop" className="btn-gold text-sm">
          Seguir comprando
        </Link>
        <a
          href={`mailto:${order.customerEmail}?subject=Pedido ${order.orderNumber}`}
          className="btn-outline text-xs"
        >
          ¿Tenés dudas? Contactanos
        </a>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <Suspense
        fallback={
          <div className="py-24 text-center">
            <p className="text-ink/50 text-sm">Cargando...</p>
          </div>
        }
      >
        <ConfirmationContent />
      </Suspense>
      <Footer />
    </div>
  );
}
