import type { Metadata } from "next";
import Link from "next/link";
import ManualesPosicion from "@/components/ManualesPosicion";

export const metadata: Metadata = {
  title: "Productos",
  description: "Manuales de entrenamiento mental por posición, deporte y perfil. Todo en español.",
};

const manualesGenerales = [
  { titulo: "La Espiral Negativa", desc: "Cómo detener el ciclo de errores, frustración y más errores. El problema mental más común en deportistas.", precio: "$9.99", disponible: false },
  { titulo: "Concentración Bajo Presión", desc: "Técnicas para mantener el foco cuando el partido está en juego y el ambiente se pone difícil.", precio: "$9.99", disponible: false },
  { titulo: "Confianza y Autoestima Deportiva", desc: "Construye una confianza que no depende de los resultados. Para deportistas que dudan de sí mismos.", precio: "$9.99", disponible: false },
  { titulo: "Manejo de Errores y Fracasos", desc: "Aprende a procesar los errores rápido y volver al juego sin que te destruyan por dentro.", precio: "$9.99", disponible: false },
  { titulo: "Liderazgo y Comunicación en Equipo", desc: "Para deportistas que quieren influir positivamente en su equipo sin tener el gafete de capitán.", precio: "$9.99", disponible: false },
];


function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span className={`inline-block text-xs font-display font-bold uppercase tracking-widest px-3 py-1 rounded-full ${color}`}>
      {text}
    </span>
  );
}

function NivelHeader({ nivel, rango, titulo, desc }: { nivel: string; rango: string; titulo: string; desc: string }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-2">
        <span className="font-display font-black text-xs uppercase tracking-widest text-gold-500 border border-gold-500/40 px-3 py-1 rounded-full">
          {nivel}
        </span>
        <span className="text-dark-300 text-sm font-display">{rango}</span>
      </div>
      <h2 className="heading-2">{titulo}</h2>
      <p className="text-dark-300 mt-3 max-w-xl">{desc}</p>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-16 bg-dark-900 text-center">
        <div className="section-container">
          <p className="heading-3 mb-3">Escalera de valor</p>
          <div className="gold-line mx-auto mb-6" />
          <h1 className="heading-1 max-w-3xl mx-auto mb-4">Empieza Gratis. Avanza a tu Ritmo.</h1>
          <p className="text-dark-300 text-lg max-w-xl mx-auto">
            Cuatro niveles de entrenamiento mental. Desde recursos gratuitos hasta tu manual 100% personalizado.
          </p>
        </div>
      </section>

      {/* NIVEL 1 - GRATIS */}
      <section className="section-padding bg-dark-800">
        <div className="section-container">
          <NivelHeader
            nivel="Nivel 1"
            rango="Gratis"
            titulo="Recursos Gratuitos"
            desc="El mejor punto de partida. Sin costo, sin excusas. Empieza a entrenar tu mente hoy."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="card-dark flex flex-col border border-gold-500/30">
              <Badge text="Disponible ahora" color="bg-gold-500/20 text-gold-400" />
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-wide mt-3 mb-2">
                Los 5 Hábitos Mentales del Campeón
              </h3>
              <p className="text-dark-300 text-sm leading-relaxed flex-1 mb-4">
                La guía de entrada. Los 5 hábitos que separan a los deportistas que ganan de los que solo participan.
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-display font-black text-gold-500 text-xl">Gratis</span>
                <Link href="/gratis" className="btn-primary text-xs px-5 py-2.5">Descargar</Link>
              </div>
            </div>
            <div className="card-dark flex flex-col border border-gold-500/30">
              <Badge text="Disponible ahora" color="bg-gold-500/20 text-gold-400" />
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-wide mt-3 mb-2">
                Tu Frase Activadora del Día
              </h3>
              <p className="text-dark-300 text-sm leading-relaxed flex-1 mb-4">
                100 frases para encender tu mente antes de competir. Una aleatoria cada vez que entras. Compártela en Instagram.
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-display font-black text-gold-500 text-xl">Gratis</span>
                <Link href="/frases" className="btn-primary text-xs px-5 py-2.5">Ver frases</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NIVEL 2 - MANUALES GENERALES */}
      <section className="section-padding bg-dark-900">
        <div className="section-container">
          <NivelHeader
            nivel="Nivel 2"
            rango="$9.99"
            titulo="Manuales de Temas Generales"
            desc="Problemas mentales que afectan a todos los deportistas sin importar el deporte o la posición."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {manualesGenerales.map((m) => (
              <div key={m.titulo} className="card-dark flex flex-col opacity-70">
                <Badge text="Próximamente" color="bg-dark-600 text-dark-300" />
                <h3 className="font-display font-bold text-white text-sm uppercase tracking-wide mt-3 mb-2">{m.titulo}</h3>
                <p className="text-dark-300 text-sm leading-relaxed flex-1 mb-4">{m.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-display font-black text-gold-500 text-xl">{m.precio}</span>
                  <Link href="/gratis" className="btn-secondary text-xs px-5 py-2.5">Avísame</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NIVEL 3 - MANUALES POR POSICIÓN */}
      <section className="section-padding bg-dark-800">
        <div className="section-container">
          <NivelHeader
            nivel="Nivel 3"
            rango="$19.99"
            titulo="Manuales por Posición y Deporte"
            desc="Entrenamiento mental específico para tu posición. Lo que un delantero necesita no es lo mismo que un portero."
          />
          <ManualesPosicion />
        </div>
      </section>

      {/* NIVEL 4 - MANUAL PERSONALIZADO */}
      <section className="section-padding bg-dark-900">
        <div className="section-container">
          <NivelHeader
            nivel="Nivel 4"
            rango="$67 – $97"
            titulo="Tu Manual 100% Personalizado"
            desc="El nivel más avanzado. Un manual generado específicamente para ti: tu deporte, tu posición, tus fortalezas y los aspectos que quieres mejorar."
          />
          <div className="max-w-2xl">
            <div className="card-dark border border-gold-500/30 opacity-70">
              <Badge text="Próximamente" color="bg-dark-600 text-dark-300" />
              <h3 className="font-display font-bold text-white text-lg uppercase tracking-wide mt-4 mb-3">
                Manual Personalizado con IA
              </h3>
              <p className="text-dark-300 text-sm leading-relaxed mb-6">
                Respondes un perfil completo — deporte, posición, habilidades actuales y áreas a mejorar — y recibes un manual único generado para ti. Acceso web con progreso guardado para que puedas avanzar a tu ritmo y retomar cuando quieras.
              </p>
              <ul className="space-y-2 text-sm text-dark-300 mb-6">
                {["Manual generado según tu perfil exacto", "Acceso web con progreso guardado", "Ejercicios adaptados a tu posición y deporte", "Puedes retomar donde lo dejaste"].map(item => (
                  <li key={item} className="flex gap-2"><span className="text-gold-500">→</span>{item}</li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <span className="font-display font-black text-gold-500 text-2xl">$67</span>
                <Link href="/gratis" className="btn-secondary text-xs px-5 py-2.5">Avísame</Link>
              </div>
            </div>
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
