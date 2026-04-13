import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Productos",
  description: "Manuales y programas de entrenamiento mental por posición, deporte y problema mental. Psicología deportiva aplicada en español.",
};

const manualesIndividuales = [
  { titulo: "La Mente del Lateral Derecho", deporte: "Fútbol", desc: "Expansión ofensiva, identidad completa, proyección. 52 páginas.", precio: "$9.99", disponible: true },
  { titulo: "La Mente del Portero", deporte: "Fútbol", desc: "Concentración, liderazgo desde atrás, recuperación de goles.", precio: "$9.99", disponible: false },
  { titulo: "La Mente del Delantero Centro", deporte: "Fútbol", desc: "Sequías de gol, presión, instinto anotador.", precio: "$9.99", disponible: false },
  { titulo: "La Mente del Mediocampista", deporte: "Fútbol", desc: "Creatividad bajo presión, liderazgo técnico, decisión en 1 segundo.", precio: "$9.99", disponible: false },
  { titulo: "La Mente del Base", deporte: "Básquetbol", desc: "Liderazgo en cancha, decisión bajo presión, visión de juego.", precio: "$9.99", disponible: false },
  { titulo: "Domina la Ansiedad Pre-Partido", deporte: "Todos", desc: "Para cualquier deporte. Protocolo completo anti-ansiedad.", precio: "$9.99", disponible: false },
];

const packs = [
  {
    titulo: "Pack Completo Fútbol",
    desc: "Los 5 manuales de posición del fútbol (lateral, portero, central, mediocampista y delantero) en un solo pack.",
    precio: "$39.99",
    ahorro: "Ahorras $10 vs individual",
    disponible: false,
  },
  {
    titulo: "Kit del Entrenador",
    desc: "10+ manuales con licencia de uso para trabajar con tu equipo o academia. Incluye guía de implementación.",
    precio: "$59.99",
    ahorro: "Licencia de uso grupal",
    disponible: false,
  },
  {
    titulo: "Kit para Padres",
    desc: "Manual padre/madre-hijo + guía de acompañamiento mental para apoyar a tu hijo sin presionarlo.",
    precio: "$24.99",
    ahorro: "Para la familia completa",
    disponible: false,
  },
];

const libros = [
  {
    titulo: "La Mente del Campeón — Libro Completo",
    desc: "Los 10 capítulos + epílogo completos. Más de 100 páginas de psicología deportiva aplicada, traducida y adaptada al español.",
    precio: "$37",
    disponible: false,
  },
  {
    titulo: "Programa 21 Días de Entrenamiento Mental",
    desc: "Un ejercicio diario durante 21 días para construir los hábitos mentales de un campeón. Ideal para empezar.",
    precio: "$47",
    disponible: false,
  },
];

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span className={`inline-block text-xs font-display font-bold uppercase tracking-widest px-3 py-1 rounded-full ${color}`}>
      {text}
    </span>
  );
}

export default function ProductosPage() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-16 bg-dark-900 text-center">
        <div className="section-container">
          <p className="heading-3 mb-3">Catálogo completo</p>
          <div className="gold-line mx-auto mb-6" />
          <h1 className="heading-1 max-w-3xl mx-auto mb-4">Todos Nuestros Productos</h1>
          <p className="text-dark-300 text-lg max-w-xl mx-auto">
            Herramientas de psicología deportiva por posición, deporte y problema mental. Todo en español.
          </p>
        </div>
      </section>

      {/* Manuales Individuales */}
      <section className="section-padding bg-dark-800">
        <div className="section-container">
          <div className="mb-10">
            <p className="heading-3 mb-2">Nivel 2 · $5 – $20</p>
            <h2 className="heading-2">Manuales Individuales</h2>
            <p className="text-dark-300 mt-3">Un manual específico para tu posición y deporte. Ideal para tu primera compra.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {manualesIndividuales.map((m) => (
              <div key={m.titulo} className={`card-dark flex flex-col ${!m.disponible ? "opacity-70" : ""}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge text={m.deporte} color="bg-dark-600 text-dark-200" />
                  {!m.disponible && <Badge text="Próximamente" color="bg-dark-600 text-dark-300" />}
                </div>
                <h3 className="font-display font-bold text-white text-sm uppercase tracking-wide mb-2">{m.titulo}</h3>
                <p className="text-dark-300 text-sm leading-relaxed flex-1 mb-4">{m.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-display font-black text-gold-500 text-xl">{m.precio}</span>
                  {m.disponible ? (
                    <a href="#" className="btn-primary text-xs px-5 py-2.5">Comprar</a>
                  ) : (
                    <Link href="/gratis" className="btn-secondary text-xs px-5 py-2.5">Avísame</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packs */}
      <section className="section-padding bg-dark-900">
        <div className="section-container">
          <div className="mb-10">
            <p className="heading-3 mb-2">Nivel 2-3 · $25 – $60</p>
            <h2 className="heading-2">Packs y Kits</h2>
            <p className="text-dark-300 mt-3">Más valor por tu inversión. Bundles pensados para distintos perfiles.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packs.map((p) => (
              <div key={p.titulo} className="card-dark flex flex-col opacity-70">
                <Badge text="Próximamente" color="bg-dark-600 text-dark-300" />
                <h3 className="font-display font-bold text-white text-sm uppercase tracking-wide mt-3 mb-2">{p.titulo}</h3>
                <p className="text-dark-300 text-sm leading-relaxed flex-1 mb-3">{p.desc}</p>
                <p className="text-gold-500/70 text-xs mb-4">{p.ahorro}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-display font-black text-gold-500 text-xl">{p.precio}</span>
                  <Link href="/gratis" className="btn-secondary text-xs px-5 py-2.5">Avísame</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Libros y Programas */}
      <section className="section-padding bg-dark-800">
        <div className="section-container">
          <div className="mb-10">
            <p className="heading-3 mb-2">Nivel 3 · $20 – $97</p>
            <h2 className="heading-2">Libro Completo y Programas</h2>
            <p className="text-dark-300 mt-3">Transformación profunda. El sistema completo de entrenamiento mental.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {libros.map((l) => (
              <div key={l.titulo} className="card-dark flex flex-col opacity-70">
                <Badge text="Próximamente" color="bg-dark-600 text-dark-300" />
                <h3 className="font-display font-bold text-white text-sm uppercase tracking-wide mt-3 mb-2">{l.titulo}</h3>
                <p className="text-dark-300 text-sm leading-relaxed flex-1 mb-4">{l.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-display font-black text-gold-500 text-xl">{l.precio}</span>
                  <Link href="/gratis" className="btn-secondary text-xs px-5 py-2.5">Avísame</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gold-500 text-center">
        <div className="section-container">
          <h2 className="font-display font-black text-2xl md:text-3xl text-dark-800 uppercase tracking-wide mb-4">
            Empieza gratis hoy
          </h2>
          <p className="text-dark-700 mb-6">Descarga la guía de los 5 hábitos mentales y empieza ahora.</p>
          <Link href="/gratis" className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-dark-800 text-gold-500 font-display font-black text-sm uppercase tracking-wider hover:bg-dark-700 transition-colors">
            Descargar Gratis
          </Link>
        </div>
      </section>
    </div>
  );
}
