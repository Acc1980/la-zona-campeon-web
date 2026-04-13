import Link from "next/link";
import LeadMagnetForm from "@/components/LeadMagnetForm";

const avatares = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 text-gold-500 mx-auto">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
    titulo: "Deportistas",
    desc: "Amateur o semiprofesional. Quieres mejorar tu mentalidad, rendir bajo presión y superar tus límites.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 text-gold-500 mx-auto">
        <rect x="2" y="2" width="20" height="14" rx="2"/><path d="M8 21h8M12 16v5"/><path d="M7 7h4M7 10h6M15 7l1.5 2-1.5 2"/>
      </svg>
    ),
    titulo: "Entrenadores",
    desc: "Buscas herramientas para transmitirle a tu equipo y diferenciarte con una metodología mental sólida.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 text-gold-500 mx-auto">
        <circle cx="9" cy="6" r="2.5"/><circle cx="15" cy="6" r="2.5"/><circle cx="12" cy="5" r="1.5"/>
        <path d="M2 20c0-3 2.5-5 5.5-5h.5"/><path d="M22 20c0-3-2.5-5-5.5-5h-.5"/><path d="M7 20c0-2.8 2.2-5 5-5s5 2.2 5 5"/>
      </svg>
    ),
    titulo: "Padres",
    desc: "Quieres apoyar a tu hijo deportista en el aspecto mental sin presionarlo ni ser invasivo.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 text-gold-500 mx-auto">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    titulo: "Academias y Clubes",
    desc: "Necesitan programas estructurados de formación mental para implementar con sus equipos.",
  },
];

const productos = [
  {
    nivel: "Nivel 1",
    tag: "GRATIS",
    tagColor: "bg-green-600",
    titulo: "Recursos Gratuitos",
    desc: "La guía '5 Hábitos Mentales del Campeón' + Tu Frase Activadora del día. Dos herramientas gratuitas para empezar a entrenar tu mente hoy.",
    precio: "GRATIS",
    cta: "Descargar Gratis",
    href: "/gratis",
    highlight: false,
  },
  {
    nivel: "Nivel 2",
    tag: "$9.99",
    tagColor: "bg-gold-600",
    titulo: "Manuales de Temas Generales",
    desc: "Problemas mentales que afectan a todos: la espiral negativa, concentración bajo presión, manejo de errores y más.",
    precio: "Desde $9.99",
    cta: "Ver Manuales",
    href: "/productos",
    highlight: false,
  },
  {
    nivel: "Nivel 3",
    tag: "$19.99",
    tagColor: "bg-gold-500",
    titulo: "Manuales por Posición y Deporte",
    desc: "Entrenamiento mental específico para tu posición. Lo que un portero necesita no es lo mismo que un delantero.",
    precio: "Desde $19.99",
    cta: "Ver Manuales",
    href: "/productos",
    highlight: true,
  },
  {
    nivel: "Nivel 4",
    tag: "$67 – $97",
    tagColor: "bg-rojo-500",
    titulo: "Tu Manual 100% Personalizado",
    desc: "Manual generado con IA según tu deporte, posición, fortalezas y áreas a mejorar. Progreso guardado en la web.",
    precio: "Desde $67",
    cta: "Próximamente",
    href: "/productos",
    highlight: false,
  },
];

const pilares = [
  { num: "01", titulo: "Mentalidad Ganadora", desc: "Confianza, diálogo interno, visualización e identidad deportiva." },
  { num: "02", titulo: "Rendimiento Bajo Presión", desc: "Ansiedad, concentración, nervios y recuperación de errores." },
  { num: "03", titulo: "Liderazgo Deportivo", desc: "Comunicación, lenguaje corporal y energía de equipo." },
  { num: "04", titulo: "Expansión de Juego", desc: "Salir de la zona de confort y romper creencias limitantes." },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-800">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-800" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 25% 50%, #C8AA32 0%, transparent 50%), radial-gradient(circle at 75% 50%, #C0392B 0%, transparent 50%)",
          }}
        />
        <div className="relative section-container text-center pt-24 pb-16">
          <p className="font-display text-gold-500 text-sm font-bold uppercase tracking-[0.3em] mb-6">
            Entrenamiento Mental para Deportistas
          </p>
          <h1 className="heading-1 max-w-4xl mx-auto mb-6">
            Tu juego cambia cuando{" "}
            <span className="text-gold-500">tu mente cambia</span>
          </h1>
          <p className="text-dark-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Manuales y programas de entrenamiento mental en español. Herramientas prácticas para deportistas, entrenadores y padres que quieren resultados reales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/gratis" className="btn-primary text-base">
              Descarga la Guía Gratis
            </Link>
            <Link href="/productos" className="btn-secondary text-base">
              Ver Productos
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { num: "10+", label: "Capítulos" },
              { num: "5+", label: "Deportes" },
              { num: "100%", label: "En Español" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display font-black text-3xl text-gold-500">{stat.num}</div>
                <div className="text-dark-300 text-sm uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA QUIÉN */}
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
            {avatares.map((a) => (
              <div key={a.titulo} className="card-dark text-center group">
                <div className="mb-4">{a.icon}</div>
                <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide mb-3">
                  {a.titulo}
                </h3>
                <p className="text-dark-300 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 PILARES */}
      <section className="section-padding bg-dark-800">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="heading-3 mb-3">Nuestro enfoque</p>
            <div className="gold-line mx-auto mb-6" />
            <h2 className="heading-2">Los 4 Pilares del Campeón</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pilares.map((p) => (
              <div key={p.num} className="card-dark">
                <div className="font-display font-black text-4xl text-gold-500/20 mb-2">{p.num}</div>
                <h3 className="font-display font-bold text-white uppercase tracking-wide text-sm mb-2">
                  {p.titulo}
                </h3>
                <p className="text-dark-300 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTOS */}
      <section id="productos" className="section-padding bg-dark-900">
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
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-dark-800 text-xs font-display font-black uppercase tracking-widest px-4 py-1 rounded-full">
                    Más popular
                  </div>
                )}
                <div className="mb-4">
                  <span className={`text-xs font-display font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white ${p.tagColor}`}>
                    {p.tag}
                  </span>
                  <p className="text-dark-400 text-xs uppercase tracking-wider mt-2">{p.nivel}</p>
                </div>
                <h3 className="font-display font-bold text-white text-base uppercase tracking-wide mb-3 flex-1">
                  {p.titulo}
                </h3>
                <p className="text-dark-300 text-sm leading-relaxed mb-6 flex-1">{p.desc}</p>
                <div className="mt-auto">
                  <p className="font-display font-black text-gold-500 text-xl mb-4">{p.precio}</p>
                  <Link href={p.href} className={p.highlight ? "btn-primary w-full justify-center text-sm" : "btn-secondary w-full justify-center text-sm"}>
                    {p.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD MAGNET */}
      <section className="section-padding bg-dark-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #C8AA32 0%, transparent 60%)" }}
        />
        <div className="relative section-container">
          <div className="max-w-xl mx-auto text-center">
            <p className="heading-3 mb-3">100% Gratis</p>
            <div className="gold-line mx-auto mb-6" />
            <h2 className="heading-2 mb-4">
              Los 5 Hábitos Mentales del Campeón
            </h2>
            <p className="text-dark-300 mb-8 leading-relaxed">
              Descarga ahora la guía gratuita y empieza a entrenar tu mente como los atletas de élite. Sin excusas.
            </p>
            <div className="bg-dark-700 border border-dark-600 rounded-xl p-8">
              <LeadMagnetForm fuente="home-section" />
            </div>
          </div>
        </div>
      </section>

      {/* FRASE FINAL */}
      <section className="py-16 bg-gold-500">
        <div className="section-container text-center">
          <p className="font-display font-black text-2xl md:text-3xl text-dark-800 uppercase tracking-wide">
            "El campeón se construye desde adentro."
          </p>
          <p className="font-display text-dark-700 mt-2 font-semibold">
            — La Zona Campeón
          </p>
        </div>
      </section>
    </>
  );
}
