import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ManualesPosicion from "@/components/ManualesPosicion";
import ManualesGenerales from "@/components/ManualesGenerales";
import PersonalizadoCard from "@/components/PersonalizadoCard";
import NivelAccordion from "@/components/NivelAccordion";

export const metadata: Metadata = {
  title: "Productos",
  description: "Manuales de entrenamiento mental por posición, deporte y perfil. Todo en español.",
};

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
          <h1 className="heading-1 max-w-3xl mx-auto mb-4">Entrena tu mente. Gana cuando más importa.</h1>
          <p className="text-dark-300 text-lg max-w-xl mx-auto">
            Manuales de entrenamiento mental para deportistas, entrenadores y padres. Elige el nivel que necesitas.
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

      {/* NIVELES — acordeón */}
      <div>
        <NivelAccordion
          id="nivel-1"
          nivel="Nivel 1"
          titulo="Manuales de Temas Generales"
          rango="$12.99 USD"
          bgClass="bg-dark-900"
        >
          <p className="text-dark-300 mb-8 max-w-xl">
            Problemas mentales que afectan a todos los deportistas sin importar el deporte o la posición.
          </p>
          <ManualesGenerales />
        </NivelAccordion>

        <NivelAccordion
          id="nivel-2"
          nivel="Nivel 2"
          titulo="Manuales por Posición y Deporte"
          rango="$17.99 USD"
          bgClass="bg-dark-800"
        >
          <p className="text-dark-300 mb-8 max-w-xl">
            Entrenamiento mental específico para tu posición. Lo que un delantero necesita no es lo mismo que un portero.
          </p>
          <ManualesPosicion />
        </NivelAccordion>

        <NivelAccordion
          id="nivel-3"
          nivel="Nivel 3"
          titulo="Tu Manual 100% Personalizado"
          rango="$29.99 USD"
          bgClass="bg-dark-900"
        >
          <p className="text-dark-300 mb-8 max-w-xl">
            El nivel más avanzado. Un manual generado específicamente para ti: tu deporte, tu posición, tus fortalezas y los aspectos que quieres mejorar.
          </p>
          <div className="max-w-2xl">
            <PersonalizadoCard />
          </div>
        </NivelAccordion>
      </div>

      {/* CTA */}
      <section className="py-16 bg-gold-500 text-center">
        <div className="section-container">
          <h2 className="font-display font-black text-2xl md:text-3xl text-dark-800 uppercase tracking-wide mb-4">
            El manual que nadie más tiene igual al tuyo
          </h2>
          <p className="text-dark-700 mb-6">Generado para tu deporte, tu posición y tus desafíos reales. Te llega al correo en menos de 1 hora.</p>
          <Link href="/personalizado" className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-dark-800 text-gold-500 font-display font-black text-sm uppercase tracking-wider hover:bg-dark-700 transition-colors">
            Generar Mi Manual — $29.99
          </Link>
        </div>
      </section>
    </div>
  );
}
