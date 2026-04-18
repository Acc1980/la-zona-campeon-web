import Link from "next/link";
import Image from "next/image";
import LeadMagnetForm from "@/components/LeadMagnetForm";

const testimonios = [
  {
    texto: "Antes del partido grande me bloqueaba. Con las herramientas del manual aprendí a usar los nervios a mi favor. Fue un cambio total.",
    nombre: "Andrés M.",
    rol: "Futbolista, 19 años",
    inicial: "A",
  },
  {
    texto: "Como entrenador llevaba años buscando algo práctico para trabajar la mente con mis jugadores. Esto es exactamente lo que necesitaba.",
    nombre: "Carlos R.",
    rol: "Entrenador, categoría juvenil",
    inicial: "C",
  },
  {
    texto: "Mi hijo cambiaba de actitud en los partidos cuando se equivocaba. Después de leer el manual juntos, eso desapareció.",
    nombre: "Patricia G.",
    rol: "Madre de deportista",
    inicial: "P",
  },
];

const pilares = [
  { num: "01", titulo: "Mentalidad Ganadora", desc: "Confianza, diálogo interno, visualización e identidad deportiva." },
  { num: "02", titulo: "Rendimiento Bajo Presión", desc: "Ansiedad, concentración, nervios y recuperación de errores." },
  { num: "03", titulo: "Liderazgo Deportivo", desc: "Comunicación, lenguaje corporal y energía de equipo." },
  { num: "04", titulo: "Expansión de Juego", desc: "Salir de la zona de confort y romper creencias limitantes." },
];

type Producto = {
  nivel: string;
  tag: string;
  tagColor: string;
  titulo: string;
  desc: string;
  items?: string[];
  precio: string;
  cta: string;
  href: string;
  highlight: boolean;
};

const productos: Producto[] = [
  {
    nivel: "Nivel 1",
    tag: "GRATIS",
    tagColor: "bg-green-600",
    titulo: "Recursos Gratuitos",
    desc: "",
    items: ["Guía — Los 5 Hábitos Mentales del Campeón", "Calendario — 21 Días de Implementación", "Frases Activadoras del Día"],
    precio: "GRATIS",
    cta: "Ver recursos",
    href: "/productos#nivel-1",
    highlight: false,
  },
  {
    nivel: "Nivel 2",
    tag: "$9.99",
    tagColor: "bg-gold-600",
    titulo: "Manuales Generales",
    desc: "Espiral negativa, concentración bajo presión, manejo de errores y más.",
    precio: "Desde $9.99",
    cta: "Ver Manuales",
    href: "/productos#nivel-2",
    highlight: false,
  },
  {
    nivel: "Nivel 3",
    tag: "$19.99",
    tagColor: "bg-gold-500",
    titulo: "Por Posición y Deporte",
    desc: "Lo que necesita un portero no es lo mismo que un base de baloncesto. Tu deporte, tu posición, tu manual.",
    precio: "Desde $19.99",
    cta: "Ver Manuales",
    href: "/productos#nivel-3",
    highlight: true,
  },
  {
    nivel: "Nivel 4",
    tag: "Próximamente",
    tagColor: "bg-dark-600",
    titulo: "Manual 100% Personalizado",
    desc: "Generado según tu deporte, posición, fortalezas y áreas a mejorar.",
    precio: "Próximamente",
    cta: "Próximamente",
    href: "/productos#nivel-4",
    highlight: false,
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Imagen de fondo */}
        <Image
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80&fit=crop"
          alt="Atleta entrenando"
          fill
          priority
          unoptimized
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Overlay oscuro degradado */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/80 to-dark-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-dark-900/30" />

        <div className="relative section-container w-full pt-28 pb-36 md:pb-20">
          <div className="max-w-2xl">
            <p className="font-display text-gold-500 text-sm font-bold uppercase tracking-[0.3em] mb-5">
              Entrenamiento Mental para Deportistas
            </p>
            <h1 className="heading-1 mb-6">
              Tu juego cambia cuando{" "}
              <span className="text-gold-500">tu mente cambia</span>
            </h1>
            <p className="text-dark-200 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              Manuales y programas de entrenamiento mental en español. Herramientas prácticas para deportistas, entrenadores y padres que quieren resultados reales.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4">
              <Link href="/gratis" className="btn-primary text-base">
                Descarga la Guía Gratis
              </Link>
              <Link href="/productos" className="btn-secondary text-base">
                Ver Productos
              </Link>
            </div>
          </div>
        </div>

        {/* Separador diagonal */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 md:h-16" fill="#0a0f1a">
            <polygon points="0,60 1440,0 1440,60" />
          </svg>
        </div>
      </section>

      {/* ── PARA QUIÉN ─────────────────────────────────────────── */}
      <section id="para-quien" className="section-padding bg-dark-900">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="heading-3 mb-3">Para quién es</p>
            <div className="gold-line mx-auto mb-6" />
            <h2 className="heading-2 max-w-2xl mx-auto">
              Diseñado para quienes compiten en serio
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80&fit=crop",
                titulo: "Deportistas",
                desc: "Amateur o semiprofesional. Quieres mejorar tu mentalidad, rendir bajo presión y superar tus límites.",
              },
              {
                img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80&fit=crop",
                titulo: "Entrenadores",
                desc: "Buscas herramientas para transmitirle a tu equipo y diferenciarte con una metodología mental sólida.",
              },
              {
                img: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=600&q=80&fit=crop",
                titulo: "Padres",
                desc: "Quieres apoyar a tu hijo deportista en el aspecto mental sin presionarlo ni ser invasivo.",
              },
              {
                img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80&fit=crop",
                titulo: "Academias y Clubes",
                desc: "Necesitan programas estructurados de formación mental para implementar con sus equipos.",
              },
            ].map((a) => (
              <div key={a.titulo} className="group relative rounded-xl overflow-hidden border border-dark-600 hover:border-gold-500/50 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={a.img}
                    alt={a.titulo}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
                </div>
                <div className="p-5 bg-dark-900">
                  <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide mb-2">
                    {a.titulo}
                  </h3>
                  <p className="text-dark-300 text-sm leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PILARES ────────────────────────────────────────────── */}
      <section className="relative section-padding overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1520420097861-e4959843b682?w=1920&q=80&fit=crop"
          alt="Estadio"
          fill
          unoptimized
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-dark-900/88" />

        <div className="relative section-container">
          <div className="text-center mb-14">
            <p className="heading-3 mb-3">Nuestro enfoque</p>
            <div className="gold-line mx-auto mb-6" />
            <h2 className="heading-2">Los 4 Pilares del Campeón</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pilares.map((p) => (
              <div key={p.num} className="bg-dark-800/60 backdrop-blur-sm border border-dark-600 hover:border-gold-500/50 rounded-xl p-6 transition-all duration-300">
                <div className="font-display font-black text-5xl text-gold-500/25 mb-3 leading-none">{p.num}</div>
                <h3 className="font-display font-bold text-white uppercase tracking-wide text-sm mb-3">
                  {p.titulo}
                </h3>
                <p className="text-dark-300 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Separador hacia testimonios (dark-800) */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 md:h-16" fill="#2c2f3a">
            <polygon points="0,60 1440,0 1440,60" />
          </svg>
        </div>
      </section>

      {/* ── TESTIMONIOS ────────────────────────────────────────── */}
      <section className="section-padding bg-dark-800">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="heading-3 mb-3">Lo que dicen</p>
            <div className="gold-line mx-auto mb-6" />
            <h2 className="heading-2">Resultados reales</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonios.map((t) => (
              <div key={t.nombre} className="bg-dark-700 border border-dark-600 hover:border-gold-500/30 rounded-xl p-7 transition-all duration-300 flex flex-col">
                {/* Comillas */}
                <div className="text-gold-500 text-5xl font-serif leading-none mb-4">&ldquo;</div>
                <p className="text-dark-200 text-sm leading-relaxed flex-1 mb-6">{t.texto}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-dark-600">
                  <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center font-display font-black text-dark-800 text-lg shrink-0">
                    {t.inicial}
                  </div>
                  <div>
                    <p className="font-display font-bold text-white text-sm">{t.nombre}</p>
                    <p className="text-dark-400 text-xs">{t.rol}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Separador hacia productos (dark-900) */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 md:h-16" fill="#16171e">
            <polygon points="1440,60 0,0 0,60" />
          </svg>
        </div>
      </section>

      {/* ── PRODUCTOS ──────────────────────────────────────────── */}
      <section id="productos" className="relative section-padding bg-dark-900">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="heading-3 mb-3">Catálogo</p>
            <div className="gold-line mx-auto mb-6" />
            <h2 className="heading-2">Elige tu nivel de transformación</h2>
            <p className="text-dark-300 mt-4 max-w-xl mx-auto">
              Desde recursos gratuitos hasta programas completos. Empieza donde estás y sube cuando estés listo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.map((p) => (
              <div
                key={p.titulo}
                className={`relative flex flex-col rounded-xl p-6 border transition-all duration-300 ${
                  p.highlight
                    ? "bg-dark-700 border-gold-500 shadow-xl shadow-gold-500/10"
                    : "bg-dark-800 border-dark-600 hover:border-gold-500/50"
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-dark-800 text-xs font-display font-black uppercase tracking-widest px-4 py-1 rounded-full whitespace-nowrap">
                    Más popular
                  </div>
                )}
                <div className="mb-4">
                  <span className={`text-xs font-display font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white ${p.tagColor}`}>
                    {p.tag}
                  </span>
                  <p className="text-dark-400 text-xs uppercase tracking-wider mt-2">{p.nivel}</p>
                </div>
                <h3 className="font-display font-bold text-white text-base uppercase tracking-wide mb-3">
                  {p.titulo}
                </h3>
                {p.items ? (
                  <ul className="space-y-2 mb-6 flex-1">
                    {p.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-dark-300 text-sm">
                        <span className="text-gold-500 font-bold shrink-0">{i + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-dark-300 text-sm leading-relaxed mb-6 flex-1">{p.desc}</p>
                )}
                <div className="mt-auto">
                  <p className={`font-display font-black text-xl mb-4 ${p.cta === "Próximamente" ? "text-dark-400" : "text-gold-500"}`}>{p.precio}</p>
                  {p.cta === "Próximamente" ? (
                    <span className="flex w-full justify-center text-sm px-5 py-2.5 rounded-lg border border-dark-600 text-dark-400 font-display font-bold uppercase tracking-wider cursor-not-allowed">
                      Próximamente
                    </span>
                  ) : (
                    <Link href={p.href} className={p.highlight ? "btn-primary w-full justify-center text-sm" : "btn-secondary w-full justify-center text-sm"}>
                      {p.cta}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEAD MAGNET ────────────────────────────────────────── */}
      <section className="relative section-padding overflow-hidden ">
        <Image
          src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1920&q=80&fit=crop"
          alt="Atleta concentrado"
          fill
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-dark-900/90" />
        <div className="relative section-container">
          <div className="max-w-xl mx-auto text-center">
            <p className="heading-3 mb-3">100% Gratis</p>
            <div className="gold-line mx-auto mb-6" />
            <h2 className="heading-2 mb-4">
              Los 5 Hábitos Mentales del Campeón
            </h2>
            <p className="text-dark-300 mb-8 leading-relaxed">
              Descarga la guía gratuita y empieza a entrenar tu mente como los atletas de élite. Sin excusas.
            </p>
            <div className="bg-dark-800/80 backdrop-blur-sm border border-dark-600 rounded-xl p-8">
              <LeadMagnetForm fuente="home-section" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FRASE FINAL ────────────────────────────────────────── */}
      <section className="py-16 bg-gold-500">
        <div className="section-container text-center">
          <p className="font-display font-black text-2xl md:text-3xl text-dark-800 uppercase tracking-wide">
            &ldquo;El campeón se construye desde adentro.&rdquo;
          </p>
          <p className="font-display text-dark-700 mt-2 font-semibold">
            — La Zona Campeón
          </p>
        </div>
      </section>
    </>
  );
}
