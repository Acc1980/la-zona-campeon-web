import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ManualesPosicion from "@/components/ManualesPosicion";
import ManualesGenerales from "@/components/ManualesGenerales";

export const metadata: Metadata = {
  title: "Productos",
  description: "Manuales de entrenamiento mental por posición, deporte y perfil. Todo en español.",
};


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
      <section className="relative py-28 text-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&q=80&fit=crop"
          alt="Atleta entrenando"
          fill
          priority
          unoptimized
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/90 via-dark-900/80 to-dark-900/95" />
        <div className="relative section-container">
          <div className="gold-line mx-auto mb-6" />
          <h1 className="heading-1 max-w-3xl mx-auto mb-4">Empieza Gratis. Avanza a tu Ritmo.</h1>
          <p className="text-dark-300 text-lg max-w-xl mx-auto">
            Cuatro niveles de entrenamiento mental. Desde recursos gratuitos hasta tu manual 100% personalizado.
          </p>
        </div>
      </section>

      {/* QUIZ CTA */}
      <section className="py-10 bg-dark-700 border-y border-gold-500/20">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-display font-black text-xs text-gold-500 uppercase tracking-widest mb-1">
                ¿No sabes por dónde empezar?
              </p>
              <h2 className="font-display font-black text-xl text-white uppercase tracking-wide">
                Encuentra tu manual en 3 preguntas
              </h2>
              <p className="text-dark-300 text-sm mt-1">
                Deporte · Posición · Desafíos mentales → recomendación exacta para ti.
              </p>
            </div>
            <Link href="/quiz" className="btn-primary text-sm px-8 py-3 shrink-0">
              Hacer el test →
            </Link>
          </div>
        </div>
      </section>

      {/* NIVEL 1 - GRATIS */}
      <section id="nivel-1" className="section-padding bg-dark-800">
        <div className="section-container">
          <NivelHeader
            nivel="Nivel 1"
            rango="Gratis"
            titulo="Recursos Gratuitos"
            desc="El mejor punto de partida. Sin costo, sin excusas. Empieza a entrenar tu mente hoy."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Guía */}
            <div className="card-dark flex flex-col border border-gold-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-display font-black text-gold-500 text-xs uppercase tracking-widest">01</span>
                <Badge text="Disponible" color="bg-gold-500/20 text-gold-400" />
              </div>
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-wide mb-2">
                Guía — Los 5 Hábitos Mentales del Campeón
              </h3>
              <p className="text-dark-300 text-sm leading-relaxed flex-1 mb-4">
                Los 5 hábitos que separan a los deportistas que ganan de los que solo participan.
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-display font-black text-gold-500 text-xl">Gratis</span>
                <Link href="/gratis" className="btn-primary text-xs px-5 py-2.5">Descargar</Link>
              </div>
            </div>

            {/* 2. Calendario 21 días */}
            <div className="card-dark flex flex-col border border-gold-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-display font-black text-gold-500 text-xs uppercase tracking-widest">02</span>
                <Badge text="Disponible" color="bg-gold-500/20 text-gold-400" />
              </div>
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-wide mb-2">
                Calendario — 21 Días de Implementación
              </h3>
              <p className="text-dark-300 text-sm leading-relaxed flex-1 mb-4">
                Un reto mental de 3 semanas. Una acción diaria concreta para construir el hábito de entrenar tu mente.
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-display font-black text-gold-500 text-xl">Gratis</span>
                <a href="/calendario-21-dias.html" target="_blank" rel="noopener noreferrer" className="btn-primary text-xs px-5 py-2.5">Ver calendario</a>
              </div>
            </div>

            {/* 3. Frases activadoras */}
            <div className="card-dark flex flex-col border border-gold-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-display font-black text-gold-500 text-xs uppercase tracking-widest">03</span>
                <Badge text="Disponible" color="bg-gold-500/20 text-gold-400" />
              </div>
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-wide mb-2">
                Frases Activadoras del Día
              </h3>
              <p className="text-dark-300 text-sm leading-relaxed flex-1 mb-4">
                Una frase nueva cada día para encender tu mente antes de competir. Compártela en redes.
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
      <section id="nivel-2" className="section-padding bg-dark-900">
        <div className="section-container">
          <NivelHeader
            nivel="Nivel 2"
            rango="$9.99"
            titulo="Manuales de Temas Generales"
            desc="Problemas mentales que afectan a todos los deportistas sin importar el deporte o la posición."
          />
          <ManualesGenerales />
        </div>
      </section>

      {/* NIVEL 3 - MANUALES POR POSICIÓN */}
      <section id="nivel-3" className="section-padding bg-dark-800">
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
      <section id="nivel-4" className="section-padding bg-dark-900">
        <div className="section-container">
          <NivelHeader
            nivel="Nivel 4"
            rango="$49"
            titulo="Tu Manual 100% Personalizado"
            desc="El nivel más avanzado. Un manual generado específicamente para ti: tu deporte, tu posición, tus fortalezas y los aspectos que quieres mejorar."
          />
          <div className="max-w-2xl">
            <div className="card-dark border border-gold-500/30">
              <Badge text="Disponible" color="bg-gold-500/20 text-gold-400" />
              <h3 className="font-display font-bold text-white text-lg uppercase tracking-wide mt-4 mb-3">
                Manual 100% Personalizado
              </h3>
              <p className="text-dark-300 text-sm leading-relaxed mb-6">
                Respondes un perfil completo — deporte, posición, fortalezas y desafíos mentales — y nuestro sistema especializado genera un manual único para ti con diagnóstico, estrategias, plan de 4 semanas y herramientas de seguimiento.
              </p>
              <ul className="space-y-2 text-sm text-dark-300 mb-6">
                {["Tu nombre, deporte, posición y categoría", "Tu autoevaluación mental (fortalezas + desafíos)", "La perspectiva de tu técnico (opcional)", "La perspectiva de tus padres (opcional)", "Diagnóstico + estrategias + plan de 4 semanas", "Registro diario y autoevaluación semanal"].map(item => (
                  <li key={item} className="flex gap-2"><span className="text-gold-500">→</span>{item}</li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <span className="font-display font-black text-gold-500 text-2xl">$49</span>
                <Link href="/personalizado" className="btn-primary text-xs px-5 py-2.5">
                  Generar mi manual →
                </Link>
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
