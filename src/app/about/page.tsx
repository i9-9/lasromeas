import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-page">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[32vh] min-h-[240px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, #FFFEFC, hsl(25, 15%, 94%))" }}
        />
        <div className="overlay-hero" />
        <div className="relative z-10 w-full px-8 md:px-8 pb-14">
          <p className="label-section mb-2">Sobre nosotros</p>
          <div className="divider-gold mb-3" style={{ marginLeft: 0, marginRight: "auto" }} />
          <h1
            className="text-ink text-4xl md:text-6xl font-light leading-tight"
            style={{ fontFamily: '"trajan-pro-3", serif' }}
          >
            About us
          </h1>
        </div>
      </section>

      {/* ¿Quiénes somos? */}
      <section className="py-16 px-8 md:px-8">
        <div className="w-full">
          <p className="label-section mb-2">Introducción</p>
          <div className="divider-gold mb-6" style={{ marginLeft: 0, marginRight: "auto" }} />
          <h2 className="title-section mb-6">¿Quiénes somos?</h2>
          <p className="text-ink/90 text-base leading-relaxed mb-6">
            Somos un equipo apasionado que crea experiencias sensoriales, donde el chocolate y el
            cacao fino de aroma se entrelazan con la innovación y el diseño creando las piezas más
            deliciosas. Nos hemos dedicado a transformar el cacao más excepcional en creaciones
            únicas que despiertan los sentidos y mantienen las propiedades nutritivas del cacao con
            la filosofía Tree & Bean to Bar (Del árbol & del grano de cacao a la barra de chocolate)
            y trazabilidad desde fincas de cacao.
          </p>
        </div>
      </section>

      {/* Las Romeas — Historia */}
      <section className="py-16 px-8 md:px-8 bg-ink/5">
        <div className="w-full">
          <p className="label-section mb-2">Nuestra historia</p>
          <div className="divider-gold mb-6" style={{ marginLeft: 0, marginRight: "auto" }} />
          <h2 className="title-section mb-6">Las Romeas</h2>
          <p className="text-ink/90 text-base leading-relaxed mb-6">
            Las Romeas creada en 2010 por Lorena Galasso, diseñadora, chocolate maker y especialista
            en cacao y derivados, es hoy una de las chocolaterías más vanguardistas. Con el corazón
            entre la estética y el chocolate, la creatividad, el diseño y el aprendizaje permanente
            sobre el producto y las tendencias, la curiosidad sumergió a Lorena junto con su partner
            Claudio Santarsieri, en la travesía apasionada del mundo del cacao fino de aroma,
            viajando a cacaotales, estableciendo vínculos con los productores, fortaleciendo la
            identidad del producto y la calidad de los procesos. Continuamos diariamente dedicando
            esfuerzos a la investigación y el desarrollo constante en este mundo que no deja de
            sorprendernos.
          </p>
        </div>
      </section>

      {/* Laboratorio e I+D+I */}
      <section className="py-16 px-8 md:px-8">
        <div className="w-full">
          <p className="label-section mb-2">Innovación</p>
          <div className="divider-gold mb-6" style={{ marginLeft: 0, marginRight: "auto" }} />
          <h2 className="title-section mb-6">Laboratorio de cacao Food design e I+D+I</h2>
          <p className="text-ink/90 text-base leading-relaxed mb-6">
            Hemos explorado y evaluado más de 85 variedades de cacao de distintos terroirs del mundo
            en nuestro laboratorio de cacao Food design e I+D+I, el corazón de la innovación, donde
            cada chocolate de origen cuenta su propia historia y te invita a ser parte de ella. Con
            diferentes propuestas, una altísima calidad en materia prima y belleza en la producción
            del producto final, nos divierte y desafía crear sensaciones y deleitar los paladares más
            exigentes, con packgifts e ideas que convierten a los chocolates en productos originales
            y constantemente renovados. Siempre a la vanguardia en sabores, técnicas e investigación
            sobre el producto.
          </p>
        </div>
      </section>

      {/* AMANTHEO — Origen y trazabilidad */}
      <section className="py-16 px-8 md:px-8 bg-ink/5">
        <div className="w-full">
          <p className="label-section mb-2">Origen</p>
          <div className="divider-gold mb-6" style={{ marginLeft: 0, marginRight: "auto" }} />
          <h2 className="title-section mb-6">AMANTHEO</h2>
          <p className="text-ink/90 text-base leading-relaxed">
            Desde hace más de 9 años decidimos que el camino era la selección minuciosa de la
            semilla, produciendo nuestra propia materia prima, capacitándonos en toda la cadena
            productiva, dando origen a &quot;AMANTHEO&quot; chocolates Tree y Bean to Bar de La Argentina que
            comienza con su primera selección de distintas zonas de Perú y Ecuador, expandiéndonos
            con granos de Nicaragua, Guatemala, México, Colombia, Venezuela, Brasil, Bolivia, Costa
            Rica, continuando un asiduo análisis de los tipos de granos y sus perfiles,
            proyectándonos en las geografías más diversas, más allá de Latinoamérica y África: Asia
            e islas exóticas de Oceanía en búsqueda de granos que detallen perfiles de terroir,
            genética y buenos procesos, manteniendo siempre la filosofía de comercio justo,
            cuidando la cadena productiva de calidad del cacao y preservación de bosques nativos.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
