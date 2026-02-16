import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

const contactInfo = [
  {
    title: "Teléfono",
    value: "+54 9 11 5126 6396",
    href: "https://wa.me/5491151266396?text=Hola%20Las%20Romeas!",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    note: "WhatsApp disponible",
  },
  {
    title: "Email",
    value: "chocolate@lasromeas.com",
    href: "mailto:chocolate@lasromeas.com",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    note: "Respondemos en 24h",
  },
  {
    title: "Ubicación",
    value: "Villa Crespo – CABA",
    href: null,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    note: "Buenos Aires, Argentina",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-page">
      <Navbar />

      {/* ── Hero ─────────────────────── */}
      <section className="relative h-[38vh] min-h-[280px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, #FFFEFC, hsl(25, 15%, 94%))" }}
        />
        <div className="overlay-hero" />
        <div className="relative z-10 w-full px-8 md:px-8 pb-14">
          <p className="label-section mb-3">Comunicarse</p>
          <div className="divider-gold mb-4" style={{ marginLeft: 0, marginRight: "auto" }} />
          <h1 className="text-ink text-5xl md:text-6xl font-light" style={{ fontFamily: '"trajan-pro-3", serif' }}>
            Contact
          </h1>
        </div>
      </section>

      {/* ── Cuerpo ───────────────────── */}
      <section className="py-16 px-8 md:px-8">
        <div className="w-full">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12">

            {/* ── Columna izquierda: info ── */}
            <div className="space-y-10">
              <div>
                <p className="label-section mb-3">Hablemos</p>
                <div className="divider-gold mb-5" style={{ marginLeft: 0, marginRight: "auto" }} />
                <h2 className="text-ink text-3xl font-light" style={{ fontFamily: '"trajan-pro-3", serif' }}>
                  ¿Tenés alguna consulta?
                </h2>
                <p className="text-ink/60 text-base leading-relaxed mt-3 max-w-sm">
                  Escribinos y te responderemos lo antes posible. Estamos acá para ayudarte.
                </p>
              </div>

              {/* Cards de contacto */}
              <div className="space-y-5">
                {contactInfo.map((info) => (
                  <div
                    key={info.title}
                    className="flex gap-4 p-4 border border-ink/15 hover:border-gold/40
                               transition-colors duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center
                                    border border-ink/20 rounded-sm">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-ink/50 text-xs tracking-[0.2em] uppercase mb-0.5">
                        {info.title}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          target={info.href.startsWith("mailto") ? undefined : "_blank"}
                          rel="noopener noreferrer"
                          className="text-ink text-sm hover:text-gold transition-colors duration-200"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-ink text-sm">{info.value}</p>
                      )}
                      <p className="text-ink/40 text-xs mt-0.5">{info.note}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Redes sociales mini */}
              <div>
                <p className="text-ink/50 text-xs tracking-[0.2em] uppercase mb-3">
                  Seguinos
                </p>
                <div className="flex gap-3">
                  {["Instagram", "Facebook", "WhatsApp"].map((red) => (
                    <a
                      key={red}
                      href="#"
                      aria-label={red}
                      className="w-9 h-9 flex items-center justify-center
                                 border border-ink/20 text-ink/60
                                 hover:border-gold hover:text-gold
                                 transition-colors duration-300 text-xs tracking-wider"
                    >
                      {red[0]}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Columna derecha: formulario ── */}
            <div className="bg-ink/5 border border-ink/15 p-8 md:p-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
