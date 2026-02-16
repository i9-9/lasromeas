import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const sections = [
  {
    id: "asesoramientos",
    label: "Asesoramientos y capacitaciones",
    title: "ASESORAMIENTOS Y CAPACITACIONES",
    body: "Asesoramientos y capacitaciones personalizados sobre cacao y chocolate de Lorena Galasso. Si tenés un restaurante, chocolatería o empresa del sector y estás interesado en incursionar más profundamente en el mundo del cacao y chocolate, procesos y know hows, podés contactarte al mail cacao@lasromeas.com",
  },
  {
    id: "cursos",
    label: "Cursos",
    title: "CV LORENA GALASSO – CURSOS",
    body: "Lorena Galasso, junto a su equipo, ha desarrollado el curso «CACAO DE LA A A LA Z» en tres versiones: con fechas específicas, personalizadas y en modalidad presencial en Buenos Aires. Además, ofrece una versión online y una experiencia de inmersión en fincas cacaoteras de Perú, que lleva más de tres temporadas y se expandirá próximamente a otros países.",
  },
  {
    id: "laboratorio",
    label: "Laboratorio",
    title: "LABORATORIO",
    body: "Somos un espacio que investiga, desarrolla e innova sobre el CACAO. Hemos procesado más de 70 muestras de cacao para evaluar, mejorar su calidad o procesos de poscosecha y promover la protección de bosques nativos en Bolivia y Perú, en colaboración con ONGs, o para compra de granos para producción propia. También investigamos cada parte del cacao desarrollando nuevos productos. Si sos productor o empresario, contactanos a cacao@lasromeas.com",
  },
  {
    id: "empresas",
    label: "Empresas",
    title: "EVENTOS CORPORATIVOS",
    body: "Despierta los sentidos a través de experiencias con Cacao y Chocolate. Un mundo ancestral, cultural, gastronómico y místico, que abrirá las puertas a experiencias de disfrute, conocimiento e interacción y sorprenderá en cada momento, con un entorno dinámico y lúdico. Estas iniciativas promueven la Salud, el Bienestar, Compromiso y la Felicidad de las personas y los equipos. Acompañamos y asesoramos en el Diseño, Desarrollo y ejecución de la propuesta integral personalizada para que el evento sea único, exclusivo e irrepetible. Consultá las distintas propuestas que se pueden personalizar en función de los objetivos de las empresas, además de las opciones en regalos empresariales, al mail experiencias@lasromeas.com",
  },
  {
    id: "mayoristas",
    label: "Ventas mayoristas",
    title: "VENTAS MAYORISTAS",
    body: "Consultá por ventas mayoristas y propuestas para empresas al mail chocolate@lasromeas.com",
  },
  {
    id: "puntos-venta",
    label: "Puntos de venta",
    title: "PUNTOS DE VENTA",
    body: "Consultá nuestros puntos de venta y dónde encontrar nuestros productos. Contactanos a chocolate@lasromeas.com",
  },
  {
    id: "news",
    label: "News",
    title: "NEWS",
    body: "Suscribite a nuestra newsletter para recibir novedades, fechas de cursos y experiencias. Escribinos a chocolate@lasromeas.com",
  },
];

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-page">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[30vh] min-h-[220px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, #FFFEFC, hsl(25, 15%, 94%))" }}
        />
        <div className="overlay-hero" />
        <div className="relative z-10 w-full px-8 md:px-8 pb-14">
          <p className="label-section mb-2">Info</p>
          <div className="divider-gold mb-3" style={{ marginLeft: 0, marginRight: "auto" }} />
          <h1
            className="text-ink text-4xl md:text-5xl font-light"
            style={{ fontFamily: '"trajan-pro-3", serif' }}
          >
            INFO
          </h1>
        </div>
      </section>

      {/* Secciones */}
      <section className="py-16 px-8 md:px-8">
        <div className="w-full space-y-10">
          {sections.map((block) => (
            <div key={block.id} id={block.id} className="space-y-3">
              <p className="label-section">{block.label}</p>
              <h2
                className="text-ink text-xl md:text-2xl font-light"
                style={{ fontFamily: '"trajan-pro-3", serif' }}
              >
                {block.title}
              </h2>
              <div className="w-10 h-px bg-gold" />
              <p className="text-ink/80 text-sm leading-relaxed">{block.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contacto rápido */}
      <section className="py-16 px-8 md:px-8 bg-ink/5 border-y border-ink/15">
        <div className="w-full">
          <h3 className="label-section mb-4">CONTACTANOS</h3>
          <ul className="space-y-2 text-ink/80 text-sm">
            <li>
              <a href="https://wa.me/5491151266396" className="hover:text-gold transition-colors">
                +54 9 11 5126 6396
              </a>
            </li>
            <li>
              <a href="mailto:chocolate@lasromeas.com" className="hover:text-gold transition-colors">
                chocolate@lasromeas.com
              </a>
            </li>
            <li>Villa Crespo – CABA</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/info#cursos" className="text-ink/70 text-xs tracking-[0.15em] uppercase hover:text-gold transition-colors">
              Cursos
            </Link>
            <Link href="/info#puntos-venta" className="text-ink/70 text-xs tracking-[0.15em] uppercase hover:text-gold transition-colors">
              Puntos de venta
            </Link>
            <Link href="/info#news" className="text-ink/70 text-xs tracking-[0.15em] uppercase hover:text-gold transition-colors">
              News
            </Link>
            <Link href="/contact" className="text-ink/70 text-xs tracking-[0.15em] uppercase hover:text-gold transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
