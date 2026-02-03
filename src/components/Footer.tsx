import Link from "next/link";
import Image from "next/image";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/lasromeas",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com/lasromeas",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/5491151266396?text=Hola%20Las%20Romeas!",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-page border-t border-ink/15">
      {/* Línea decorativa superior */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px w-24 h-px bg-gold" />

      <div className="w-full px-8 md:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* ── Columna 1: Marca ──────────────── */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo/footer_logo2.png"
                alt="Las Romeas"
                width={180}
                height={168}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-ink/60 text-sm leading-relaxed">
              Chocolate de origen. Tree &amp; Bean to Bar.<br />
              Del grano a la barra.
            </p>
          </div>

          {/* ── Columna 2: Contacto ───────────── */}
          <div className="space-y-4">
            <h4 className="label-section mb-3">CONTACTANOS</h4>
            <ul className="space-y-2 text-ink/70 text-sm">
              <li>
                <a
                  href="https://wa.me/5491151266396?text=Hola%20Las%20Romeas!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors duration-200"
                >
                  +54 9 11 5126 6396
                </a>
              </li>
              <li>
                <a
                  href="mailto:chocolate@lasromeas.com"
                  className="hover:text-gold transition-colors duration-200"
                >
                  chocolate@lasromeas.com
                </a>
              </li>
              <li className="text-ink/50">Villa Crespo – CABA</li>
            </ul>
          </div>

          {/* ── Columna 3: Cursos, Puntos de venta, News ── */}
          <div className="space-y-5">
            <div>
              <h4 className="label-section mb-2">CURSOS</h4>
              <Link href="/info#cursos" className="text-ink/70 text-sm hover:text-gold transition-colors duration-200">
                Cursos
              </Link>
            </div>
            <div>
              <h4 className="label-section mb-2">PUNTOS DE VENTA</h4>
              <Link href="/info#puntos-venta" className="text-ink/70 text-sm hover:text-gold transition-colors duration-200">
                Puntos de venta
              </Link>
            </div>
            <div>
              <h4 className="label-section mb-2">NEWS</h4>
              <Link href="/info#news" className="text-ink/70 text-sm hover:text-gold transition-colors duration-200">
                News
              </Link>
            </div>
          </div>

          {/* ── Columna 4: Redes ──────────────── */}
          <div className="space-y-4">
            <h4 className="label-section mb-3">SEGUINOS</h4>
            <div className="flex gap-4">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="text-ink/60 hover:text-gold transition-colors duration-300
                             p-2 border border-ink/20 hover:border-gold/50
                             rounded-sm"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divisor ─────────────────────────── */}
        <div className="mt-14 pt-6 border-t border-ink/15 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-ink/40 text-xs tracking-[0.15em] uppercase">
            ©LAS ROMEAS 2025
          </p>
          <p className="text-ink/30 text-xs">
            Desarrollado con Next.js &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
