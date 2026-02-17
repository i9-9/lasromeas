"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

type ShippingMethod = "pickup" | "delivery";
type PaymentMethod = "mercadopago" | "card";

interface FormData {
  name: string;
  email: string;
  phone: string;
  dni: string;
  shippingMethod: ShippingMethod;
  street: string;
  city: string;
  province: string;
  zipCode: string;
  notes: string;
  paymentMethod: PaymentMethod;
  cardNumber: string;
  cardExpMonth: string;
  cardExpYear: string;
  cardCvv: string;
  cardHolder: string;
}

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  dni: "",
  shippingMethod: "pickup",
  street: "",
  city: "",
  province: "",
  zipCode: "",
  notes: "",
  paymentMethod: "mercadopago",
  cardNumber: "",
  cardExpMonth: "",
  cardExpYear: "",
  cardCvv: "",
  cardHolder: "",
};

/* Card brand detection */
function detectCardBrand(num: string): string {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^(30[0-5]|36|38)/.test(n)) return "Diners";
  if (/^6(?:011|5)/.test(n)) return "Discover";
  return "";
}

/* Payway payment_method_id by brand */
function getPaywayMethodId(brand: string): number {
  const map: Record<string, number> = {
    Visa: 1,
    Mastercard: 15,
    Amex: 65,
    Diners: 8,
    Discover: 22,
  };
  return map[brand] ?? 1;
}

/* Format card number with spaces */
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const cardBrand = detectCardBrand(form.cardNumber);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Ingresá tu nombre";
    if (!form.email.trim()) e.email = "Ingresá tu email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido";
    if (!form.phone.trim()) e.phone = "Ingresá tu teléfono";

    if (form.shippingMethod === "delivery") {
      if (!form.street.trim()) e.street = "Ingresá la dirección";
      if (!form.city.trim()) e.city = "Ingresá la localidad";
      if (!form.province.trim()) e.province = "Ingresá la provincia";
      if (!form.zipCode.trim()) e.zipCode = "Ingresá el código postal";
    }

    if (form.paymentMethod === "card") {
      const cardDigits = form.cardNumber.replace(/\s/g, "");
      if (!cardDigits || cardDigits.length < 13) e.cardNumber = "Número de tarjeta inválido";
      if (!form.cardExpMonth || !form.cardExpYear) e.cardExpMonth = "Fecha requerida";
      if (!form.cardCvv || form.cardCvv.length < 3) e.cardCvv = "CVV inválido";
      if (!form.cardHolder.trim()) e.cardHolder = "Nombre del titular requerido";
      if (!form.dni.trim()) e.dni = "DNI requerido para pago con tarjeta";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Build order payload
      const orderPayload = {
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          dni: form.dni || undefined,
        },
        shippingMethod: form.shippingMethod,
        shippingAddress:
          form.shippingMethod === "delivery"
            ? { street: form.street, city: form.city, province: form.province, zipCode: form.zipCode }
            : undefined,
        notes: form.notes || undefined,
        paymentMethod: form.paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          variantLabel: item.variantLabel,
          quantity: item.quantity,
          unitPrice: item.price,
          image: item.image,
        })),
        // Card data (only for Payway)
        ...(form.paymentMethod === "card"
          ? {
              card: {
                number: form.cardNumber.replace(/\s/g, ""),
                expMonth: form.cardExpMonth,
                expYear: form.cardExpYear,
                cvv: form.cardCvv,
                holderName: form.cardHolder,
                dni: form.dni,
                brand: cardBrand,
              },
            }
          : {}),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al crear el pedido");
      }

      const data = await res.json();

      // Save order number
      if (typeof window !== "undefined") {
        sessionStorage.setItem("lastOrderNumber", data.orderNumber);
      }

      clearCart();

      if (form.paymentMethod === "mercadopago") {
        // Redirect to MercadoPago
        const redirectUrl = data.init_point || data.sandbox_init_point;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          router.push(`/order/confirmation?ref=${data.orderNumber}&status=pending`);
        }
      } else {
        // Card payment was processed inline — go to confirmation
        const status = data.paymentStatus === "paid" ? "success" : data.paymentStatus === "failed" ? "failure" : "pending";
        router.push(`/order/confirmation?ref=${data.orderNumber}&status=${status}`);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setSubmitError(
        err instanceof Error ? err.message : "Error al procesar el pedido"
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Empty cart guard
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-page">
        <Navbar />
        <section className="py-24 px-8 text-center max-w-lg mx-auto">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-ink/20 mb-6">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <h1 className="text-ink text-2xl font-light mb-4" style={{ fontFamily: '"trajan-pro-3", serif' }}>
            Tu carrito está vacío
          </h1>
          <p className="text-ink/50 text-sm mb-6">Agregá productos antes de continuar con la compra.</p>
          <Link href="/shop" className="btn-gold text-sm">Ir al Shop</Link>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[28vh] min-h-[200px] flex items-end overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #FFFEFC, hsl(25, 15%, 94%))" }} />
        <div className="relative z-10 w-full px-8 md:px-8 pb-10">
          <p className="text-ink/50 text-xs tracking-[0.15em] uppercase mb-3">
            <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-gold">Checkout</span>
          </p>
          <h1 className="text-ink text-4xl md:text-5xl font-light" style={{ fontFamily: '"trajan-pro-3", serif' }}>
            Finalizar compra
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-6 md:px-8 py-12">
        <form
          onSubmit={handleSubmit}
          className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14"
        >
          {/* ── Left: Form ── */}
          <div className="lg:col-span-3 space-y-8">

            {/* Datos personales */}
            <fieldset className="space-y-4">
              <legend className="text-ink text-sm tracking-[0.2em] uppercase font-light border-b border-ink/20 pb-2 mb-4 w-full block">
                Datos de contacto
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Nombre completo *" value={form.name} onChange={(v) => set("name", v)} error={errors.name} autoComplete="name" />
                <InputField label="Email *" type="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email} autoComplete="email" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Teléfono *" type="tel" value={form.phone} onChange={(v) => set("phone", v)} error={errors.phone} autoComplete="tel" placeholder="Ej: 11 2345-6789" />
                <InputField label="DNI / CUIT" value={form.dni} onChange={(v) => set("dni", v)} error={errors.dni} placeholder={form.paymentMethod === "card" ? "Requerido para tarjeta" : "Opcional"} />
              </div>
            </fieldset>

            {/* Método de envío */}
            <fieldset className="space-y-4">
              <legend className="text-ink text-sm tracking-[0.2em] uppercase font-light border-b border-ink/20 pb-2 mb-4 w-full block">
                Método de entrega
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <OptionButton
                  label="Retiro en tienda"
                  description="Villa Crespo, Buenos Aires"
                  value="pickup"
                  selected={form.shippingMethod}
                  onChange={(v) => set("shippingMethod", v)}
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>}
                />
                <OptionButton
                  label="Envío a domicilio"
                  description="CABA y GBA"
                  value="delivery"
                  selected={form.shippingMethod}
                  onChange={(v) => set("shippingMethod", v)}
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>}
                />
              </div>

              {form.shippingMethod === "delivery" && (
                <div className="space-y-4 pt-2">
                  <InputField label="Dirección *" value={form.street} onChange={(v) => set("street", v)} error={errors.street} autoComplete="street-address" placeholder="Calle y número, piso, depto" />
                  <div className="grid grid-cols-3 gap-4">
                    <InputField label="Localidad *" value={form.city} onChange={(v) => set("city", v)} error={errors.city} autoComplete="address-level2" />
                    <InputField label="Provincia *" value={form.province} onChange={(v) => set("province", v)} error={errors.province} autoComplete="address-level1" />
                    <InputField label="Código postal *" value={form.zipCode} onChange={(v) => set("zipCode", v)} error={errors.zipCode} autoComplete="postal-code" />
                  </div>
                </div>
              )}
            </fieldset>

            {/* Medio de pago */}
            <fieldset className="space-y-4">
              <legend className="text-ink text-sm tracking-[0.2em] uppercase font-light border-b border-ink/20 pb-2 mb-4 w-full block">
                Medio de pago
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <OptionButton
                  label="Mercado Pago"
                  description="Tarjeta, efectivo, QR"
                  value="mercadopago"
                  selected={form.paymentMethod}
                  onChange={(v) => set("paymentMethod", v)}
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  }
                />
                <OptionButton
                  label="Tarjeta de crédito / débito"
                  description="Visa, Mastercard, Amex"
                  value="card"
                  selected={form.paymentMethod}
                  onChange={(v) => set("paymentMethod", v)}
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" />
                      <path d="M1 10h22" />
                      <path d="M6 16h4" />
                    </svg>
                  }
                />
              </div>

              {/* Card form (Payway) */}
              {form.paymentMethod === "card" && (
                <div className="space-y-4 pt-2 border-t border-ink/10 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <span className="text-emerald-600 text-[11px] tracking-[0.06em]">
                      Pago seguro — tus datos están protegidos
                    </span>
                  </div>

                  {/* Card number */}
                  <div className="space-y-1">
                    <label className="block text-ink/60 text-[11px] tracking-[0.1em] uppercase">
                      Número de tarjeta *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formatCardNumber(form.cardNumber)}
                        onChange={(e) => set("cardNumber", e.target.value.replace(/\D/g, "").slice(0, 16))}
                        placeholder="0000 0000 0000 0000"
                        autoComplete="cc-number"
                        className={`w-full px-4 py-3 bg-ink/5 border text-ink text-sm font-mono
                                   placeholder-ink/40 outline-none transition-colors duration-200 pr-20
                                   ${errors.cardNumber ? "border-red-400 focus:border-red-500" : "border-ink/20 focus:border-gold"}`}
                      />
                      {cardBrand && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-xs font-medium tracking-wider">
                          {cardBrand}
                        </span>
                      )}
                    </div>
                    {errors.cardNumber && <p className="text-red-500 text-[11px]">{errors.cardNumber}</p>}
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-ink/60 text-[11px] tracking-[0.1em] uppercase">Mes *</label>
                      <select
                        value={form.cardExpMonth}
                        onChange={(e) => set("cardExpMonth", e.target.value)}
                        className={`w-full px-4 py-3 bg-ink/5 border text-ink text-sm outline-none cursor-pointer
                                   transition-colors duration-200
                                   ${errors.cardExpMonth ? "border-red-400" : "border-ink/20 focus:border-gold"}`}
                      >
                        <option value="">MM</option>
                        {Array.from({ length: 12 }, (_, i) => {
                          const m = String(i + 1).padStart(2, "0");
                          return <option key={m} value={m}>{m}</option>;
                        })}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-ink/60 text-[11px] tracking-[0.1em] uppercase">Año *</label>
                      <select
                        value={form.cardExpYear}
                        onChange={(e) => set("cardExpYear", e.target.value)}
                        className={`w-full px-4 py-3 bg-ink/5 border text-ink text-sm outline-none cursor-pointer
                                   transition-colors duration-200
                                   ${errors.cardExpMonth ? "border-red-400" : "border-ink/20 focus:border-gold"}`}
                      >
                        <option value="">AA</option>
                        {Array.from({ length: 10 }, (_, i) => {
                          const y = String(new Date().getFullYear() + i).slice(-2);
                          return <option key={y} value={y}>{y}</option>;
                        })}
                      </select>
                      {errors.cardExpMonth && <p className="text-red-500 text-[11px]">{errors.cardExpMonth}</p>}
                    </div>
                    <InputField
                      label="CVV *"
                      value={form.cardCvv}
                      onChange={(v) => set("cardCvv", v.replace(/\D/g, "").slice(0, 4))}
                      error={errors.cardCvv}
                      placeholder="123"
                      autoComplete="cc-csc"
                    />
                  </div>

                  {/* Cardholder name */}
                  <InputField
                    label="Titular de la tarjeta *"
                    value={form.cardHolder}
                    onChange={(v) => set("cardHolder", v.toUpperCase())}
                    error={errors.cardHolder}
                    placeholder="Como figura en la tarjeta"
                    autoComplete="cc-name"
                  />
                </div>
              )}
            </fieldset>

            {/* Notas */}
            <fieldset className="space-y-4">
              <legend className="text-ink text-sm tracking-[0.2em] uppercase font-light border-b border-ink/20 pb-2 mb-4 w-full block">
                Notas
              </legend>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={3}
                placeholder="¿Alguna indicación especial? (opcional)"
                className="w-full px-4 py-3 bg-ink/5 border border-ink/20 text-ink text-sm
                           placeholder-ink/40 outline-none focus:border-gold transition-colors duration-200 resize-none"
              />
            </fieldset>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 bg-ink/[0.03] border border-ink/10 p-6 space-y-5">
              <h2 className="text-ink text-sm tracking-[0.2em] uppercase font-light border-b border-ink/20 pb-2">
                Resumen ({totalItems} {totalItems === 1 ? "item" : "items"})
              </h2>

              <ul className="space-y-4 max-h-[40vh] overflow-y-auto">
                {items.map((item) => {
                  const key = item.variantLabel ? `${item.productId}::${item.variantLabel}` : item.productId;
                  return (
                    <li key={key} className="flex gap-3">
                      <div className="relative w-14 h-14 shrink-0 border border-ink/10 bg-ink/5 overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                        <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-ink/80 text-xs tracking-[0.04em] line-clamp-2 leading-relaxed">{item.name}</p>
                        {item.variantLabel && (
                          <p className="text-ink/40 text-[10px] tracking-[0.06em] uppercase mt-0.5">{item.variantLabel}</p>
                        )}
                      </div>
                      <p className="text-ink/80 text-xs font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</p>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-ink/10 pt-4 space-y-2">
                <div className="flex justify-between text-ink/60 text-xs">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-ink/60 text-xs">
                  <span>Envío</span>
                  <span className="text-ink/40">
                    {form.shippingMethod === "pickup" ? "Gratis (retiro)" : "A calcular"}
                  </span>
                </div>
                <div className="flex justify-between text-ink text-base font-semibold pt-2 border-t border-ink/10">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={`btn-gold w-full text-sm text-center ${submitting ? "opacity-60 cursor-wait" : ""}`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Procesando...
                  </span>
                ) : form.paymentMethod === "mercadopago" ? (
                  "Pagar con Mercado Pago"
                ) : (
                  `Pagar ${formatPrice(totalPrice)}`
                )}
              </button>

              <p className="text-ink/30 text-[10px] text-center tracking-[0.04em] leading-relaxed">
                {form.paymentMethod === "mercadopago"
                  ? "Serás redirigido a Mercado Pago para completar el pago de forma segura."
                  : "Tu pago será procesado de forma segura a través de Payway (Decidir)."}
              </p>

              <Link
                href="/shop"
                className="block text-center text-ink/40 text-[11px] tracking-[0.08em] uppercase hover:text-ink/70 transition-colors"
              >
                ← Seguir comprando
              </Link>
            </div>
          </div>
        </form>
      </section>

      <Footer />
    </div>
  );
}

/* ── Reusable components ── */

function InputField({
  label, value, onChange, error, type = "text", placeholder, autoComplete,
}: {
  label: string; value: string; onChange: (v: string) => void; error?: string;
  type?: string; placeholder?: string; autoComplete?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-ink/60 text-[11px] tracking-[0.1em] uppercase">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full px-4 py-3 bg-ink/5 border text-ink text-sm placeholder-ink/40 outline-none transition-colors duration-200
                   ${error ? "border-red-400 focus:border-red-500" : "border-ink/20 focus:border-gold"}`}
      />
      {error && <p className="text-red-500 text-[11px] mt-0.5">{error}</p>}
    </div>
  );
}

function OptionButton({
  label, description, value, selected, onChange, icon,
}: {
  label: string; description: string; value: string; selected: string;
  onChange: (v: string) => void; icon: React.ReactNode;
}) {
  const isActive = selected === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`flex items-center gap-3 p-4 border transition-all duration-200 text-left
                 ${isActive ? "border-gold bg-gold/5 text-gold" : "border-ink/20 text-ink/60 hover:border-gold/40"}`}
    >
      <span className={isActive ? "text-gold" : "text-ink/40"}>{icon}</span>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[11px] opacity-60">{description}</p>
      </div>
    </button>
  );
}
