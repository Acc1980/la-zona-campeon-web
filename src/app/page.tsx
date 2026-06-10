import Link from "next/link";
import Image from "next/image";
import { TextAnimate } from "@/components/ui/text-animate";
import { FadeIn } from "@/components/ui/fade-in";
import { GoldGlow } from "@/components/ui/gold-glow";

export const dynamic = "force-dynamic";

function isPromoActiva(): boolean {
  const ahora = new Date();
  const inicio = new Date("2026-05-08T05:00:00Z"); // medianoche Colombia 8 may
  const fin = new Date("2026-05-15T05:00:00Z");    // medianoche Colombia 15 may
  return ahora >= inicio && ahora < fin;
}

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
  precioOriginal?: string;
  cta: string;
  href: string;
  highlight: boolean;
};

export default function HomePage() {
  const promoActiva = isPromoActiva();

  const productos: Producto[] = [
    {
      nivel: "Nivel 1",
      tag: "$12.99",
      tagColor: "bg-gold-600",
      titulo: "Manuales Generales",
      desc: "Espiral negativa, concentración bajo presión, manejo de errores y más.",
      precio: "Desde $12.99",
      cta: "Ver Manuales",
      href: "/productos",
      highlight: false,
    },
    {
      nivel: "Nivel 2",
      tag: promoActiva ? "$14.99" : "$17.99",
      tagColor: "bg-gold-500",
      titulo: "Por Posición y Deporte",
      desc: "Lo que necesita un portero no es lo mismo que un base de baloncesto. Tu deporte, tu posición, tu manual.",
      precio: promoActiva ? "Desde $14.99" : "Desde $17.99",
      precioOriginal: promoActiva ? "Desde $17.99" : undefined,
      cta: "Ver Manuales",
      href: "/productos#nivel-2",
      highlight: true,
    },
    {
      nivel: "Nivel 3",
      tag: "Disponible",
      tagColor: "bg-gold-500 text-dark-900",
      titulo: "Manual 100% Personalizado",
      desc: "Generado según tu deporte, posición, fortalezas y áreas a mejorar.",
      precio: "$29.99",
      cta: "Generar Mi Manual",
      href: "/personalizado",
      highlight: false,
    },
  ];
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
            <FadeIn delay={0} direction="up" duration={0.5}>
              <p className="font-display text-gold-500 text-sm font-bold uppercase tracking-[0.3em] mb-5">
                Entrenamiento Mental para Deportistas
              </p>
            </FadeIn>
            <h1 className="heading-1 mb-6">
              <TextAnimate
                text="Tu juego cambia cuando"
                type="whipIn"
                className="inline"
              />
              {" "}
              <TextAnimate
                text="tu mente cambia"
                type="whipIn"
                className="inline text-gold-500"
              />
            </h1>
            <FadeIn delay={0.5} direction="up" duration={0.6}>
              <p className="text-dark-200 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
                Manuales y programas de entrenamiento mental en español. Herramientas prácticas para deportistas, entrenadores y padres que quieren resultados reales.
              </p>
            </FadeIn>
            <FadeIn delay={0.7} direction="up" duration={0.5}>
              <div className="relative z-10 flex flex-col sm:flex-row gap-4">
                <GoldGlow>
                  <Link href="/productos" className="btn-primary text-base">
                    Ver Productos
                  </Link>
                </GoldGlow>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Separador diagonal */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 md:h-16" fill="#0a0f1a">
            <polygon points="0,60 1440,0 1440,60" />
          </svg>
        </div>
      </section>

      {/* ── PRODUCTOS ──────────────────────────────────────────── */}
      <section id="productos" className="relative section-padding bg-dark-900">
        <div className="section-container">
          {promoActiva && (
            <div className="mb-10 bg-gold-500/10 border border-gold-500/60 rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-display font-black text-xs uppercase tracking-widest text-gold-500">⚡ Oferta por tiempo limitado</span>
                <p className="font-display font-bold text-white text-base mt-1 uppercase tracking-wide">
                  Manual por Posición —{" "}
                  <span className="line-through text-dark-400 font-normal text-sm">$17.99</span>{" "}
                  <span className="text-gold-500">$14.99</span>
                </p>
                <p className="text-dark-400 text-xs mt-0.5">Disponible por pocos días con descuento</p>
              </div>
              <Link href="/productos#nivel-2" className="btn-primary text-xs px-6 py-2.5 shrink-0">
                Ver manuales →
              </Link>
            </div>
          )}
          <div className="text-center mb-14">
            <FadeIn direction="up" duration={0.5}>
              <p className="heading-3 mb-3">Catálogo</p>
              <div className="gold-line mx-auto mb-6" />
            </FadeIn>
            <TextAnimate
              text="Elige tu nivel de transformación"
              type="whipIn"
              className="heading-2 justify-center"
            />
            <FadeIn delay={0.3} direction="up">
              <p className="text-dark-300 mt-4 max-w-xl mx-auto">
                Desde recursos gratuitos hasta programas completos. Empieza donde estás y sube cuando estés listo.
              </p>
            </FadeIn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productos.map((p, i) => (
              <FadeIn key={p.titulo} delay={i * 0.12} direction="up">
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
                  <div className="mb-4">
                    <p className={`font-display font-black text-xl ${p.cta === "Próximamente" ? "text-dark-400" : "text-gold-500"}`}>{p.precio}</p>
                    {p.precioOriginal && (
                      <p className="font-display text-dark-400 text-sm line-through">{p.precioOriginal}</p>
                    )}
                  </div>
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
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA QUIÉN ─────────────────────────────────────────── */}
      <section id="para-quien" className="section-padding bg-dark-900">
        <div className="section-container">
          <div className="text-center mb-14">
            <FadeIn direction="up" duration={0.5}>
              <p className="heading-3 mb-3">Para quién es</p>
              <div className="gold-line mx-auto mb-6" />
            </FadeIn>
            <TextAnimate
              text="Diseñado para quienes compiten en serio"
              type="whipIn"
              className="heading-2 max-w-2xl mx-auto justify-center"
            />
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
            ].map((a, i) => (
              <FadeIn key={a.titulo} delay={i * 0.1} direction="up">
              <div className="group relative rounded-xl overflow-hidden border border-dark-600 hover:border-gold-500/50 transition-all duration-300">
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
              </FadeIn>
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
            <FadeIn direction="up" duration={0.5}>
              <p className="heading-3 mb-3">Nuestro enfoque</p>
              <div className="gold-line mx-auto mb-6" />
            </FadeIn>
            <TextAnimate
              text="Los 4 Pilares del Campeón"
              type="whipIn"
              className="heading-2 justify-center"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pilares.map((p, i) => (
              <FadeIn key={p.num} delay={i * 0.12} direction="up">
              <div className="bg-dark-800/60 backdrop-blur-sm border border-dark-600 hover:border-gold-500/50 rounded-xl p-6 transition-all duration-300">
                <div className="font-display font-black text-5xl text-gold-500/25 mb-3 leading-none">{p.num}</div>
                <h3 className="font-display font-bold text-white uppercase tracking-wide text-sm mb-3">
                  {p.titulo}
                </h3>
                <p className="text-dark-300 text-sm leading-relaxed">{p.desc}</p>
              </div>
              </FadeIn>
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
            <FadeIn direction="up" duration={0.5}>
              <p className="heading-3 mb-3">Lo que dicen</p>
              <div className="gold-line mx-auto mb-6" />
            </FadeIn>
            <TextAnimate
              text="Resultados reales"
              type="whipIn"
              className="heading-2 justify-center"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonios.map((t, i) => (
              <FadeIn key={t.nombre} delay={i * 0.13} direction="up">
              <div className="bg-dark-700 border border-dark-600 hover:border-gold-500/30 rounded-xl p-7 transition-all duration-300 flex flex-col">
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
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────── */}
      <section className="relative section-padding overflow-hidden">
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
            <FadeIn direction="up" duration={0.5}>
              <p className="heading-3 mb-3">¿Listo para empezar?</p>
              <div className="gold-line mx-auto mb-6" />
            </FadeIn>
            <TextAnimate
              text="El manual personalizado para tu deporte y posición"
              type="whipIn"
              className="heading-2 mb-4 justify-center"
            />
            <FadeIn delay={0.3} direction="up">
              <p className="text-dark-300 mb-8 leading-relaxed">
                Generado con inteligencia artificial en base a tu perfil real como atleta. Te llega al correo en menos de 1 hora.
              </p>
            </FadeIn>
            <FadeIn delay={0.45} direction="up">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GoldGlow>
                  <Link href="/personalizado" className="btn-primary text-base px-8 py-4">
                    Generar Mi Manual — $29.99
                  </Link>
                </GoldGlow>
                <Link href="/productos" className="btn-secondary text-base px-8 py-4">
                  Ver todos los productos
                </Link>
              </div>
            </FadeIn>
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
