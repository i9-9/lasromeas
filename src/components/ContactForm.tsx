"use client";

import { useState, FormEvent } from "react";

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

export default function ContactForm() {
  const [data, setData] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    if (!data.nombre.trim()) e.nombre = "Nombre es obligatorio";
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      e.email = "Email válido es obligatorio";
    if (!data.telefono.trim()) e.telefono = "Teléfono es obligatorio";
    if (!data.mensaje.trim()) e.mensaje = "Mensaje es obligatorio";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // ── Aquí conectarías a tu API / servicio de email ──
    // Ejemplo: await fetch("/api/contact", { method: "POST", body: JSON.stringify(data) })
    await new Promise((r) => setTimeout(r, 1200)); // simulación
    setLoading(false);
    setSubmitted(true);
  };

  const inputClass = (field: keyof FormData) =>
    `w-full bg-ink/5 border ${
      errors[field] ? "border-red-400/60" : "border-ink/20"
    } focus:border-gold
     text-ink placeholder-ink/40
     px-4 py-3 text-sm outline-none
     transition-colors duration-300`;

  if (submitted) {
    return (
      <div className="text-center py-14 space-y-4">
        {/* Ícono check */}
        <div className="w-16 h-16 mx-auto rounded-full border border-gold flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-ink text-2xl" style={{ fontFamily: '"trajan-pro-3", serif' }}>
          ¡Gracias!
        </h3>
        <p className="text-ink/70 text-sm max-w-sm mx-auto leading-relaxed">
          Tu mensaje fue recibido correctamente. Te responderemos lo antes posible.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setData({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "" });
          }}
          className="btn-outline mt-4"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 max-w-xl mx-auto">
      {/* Nombre */}
      <div>
        <label className="block text-ink/60 text-xs tracking-[0.15em] uppercase mb-2">
          Nombre <span className="text-gold">*</span>
        </label>
        <input
          type="text"
          value={data.nombre}
          onChange={(e) => setData({ ...data, nombre: e.target.value })}
          placeholder="Tu nombre completo"
          className={inputClass("nombre")}
        />
        {errors.nombre && <p className="text-red-400/80 text-xs mt-1">{errors.nombre}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-ink/60 text-xs tracking-[0.15em] uppercase mb-2">
          Email <span className="text-gold">*</span>
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          placeholder="tu@correo.com"
          className={inputClass("email")}
        />
        {errors.email && <p className="text-red-400/80 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-ink/60 text-xs tracking-[0.15em] uppercase mb-2">
          Teléfono <span className="text-gold">*</span>
        </label>
        <input
          type="tel"
          value={data.telefono}
          onChange={(e) => setData({ ...data, telefono: e.target.value })}
          placeholder="+54 9 11 ..."
          className={inputClass("telefono")}
        />
        {errors.telefono && <p className="text-red-400/80 text-xs mt-1">{errors.telefono}</p>}
      </div>

      {/* Asunto */}
      <div>
        <label className="block text-ink/60 text-xs tracking-[0.15em] uppercase mb-2">
          Asunto
        </label>
        <input
          type="text"
          value={data.asunto}
          onChange={(e) => setData({ ...data, asunto: e.target.value })}
          placeholder="Ej: Pedido, Consulta, Evento…"
          className={inputClass("asunto")}
        />
      </div>

      {/* Mensaje */}
      <div>
        <label className="block text-ink/60 text-xs tracking-[0.15em] uppercase mb-2">
          Mensaje <span className="text-gold">*</span>
        </label>
        <textarea
          rows={5}
          value={data.mensaje}
          onChange={(e) => setData({ ...data, mensaje: e.target.value })}
          placeholder="Escribí tu mensaje…"
          className={`${inputClass("mensaje")} resize-none`}
        />
        {errors.mensaje && <p className="text-red-400/80 text-xs mt-1">{errors.mensaje}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
            </svg>
            Enviando…
          </span>
        ) : (
          "Enviar Mensaje"
        )}
      </button>
    </form>
  );
}
