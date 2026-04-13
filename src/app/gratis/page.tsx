import type { Metadata } from "next";
import LeadMagnetForm from "@/components/LeadMagnetForm";

export const metadata: Metadata = {
  title: "Guía Gratis — 5 Hábitos Mentales del Campeón",
  description: "Descarga gratis la guía de los 5 hábitos mentales que practican los atletas de élite. PDF descargable al instante.",
};

const habitos = [
  { num: "01", titulo: "Diálogo Interno Ganador", desc: "Cómo hablar contigo mismo antes, durante y después del partido." },
  { num: "02", titulo: "Visualización Deportiva", desc: "La técnica que usan los olímpicos para preparar su mente antes de competir." },
  { num: "03", titulo: "Rutina Pre-Partido", desc: "El protocolo de 5 minutos para entrar en zona competitiva con confianza." },
  { num: "04", titulo: "Reset Mental Post-Error", desc: "La regla de los 10 segundos para olvidar los errores y seguir compitiendo." },
  { num: "05", titulo: "Anclaje de Confianza", desc: "Cómo activar tu mejor versión en cualquier momento del juego." },
];

export default function GratisPage() {
  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <p className="heading-3 mb-3">100% Gratis</p>
            <div className="gold-line mb-6" />
            <h1 className="heading-1 mb-4">
              Los 5 Hábitos Mentales del{" "}
              <span className="text-gold-500">Campeón</span>
            </h1>
            <p className="text-dark-200 text-lg leading-relaxed mb-8">
              Descarga ahora la guía gratuita y descubre los hábitos mentales que separan a los atletas buenos de los grandes. Aplicables a cualquier deporte, desde hoy.
            </p>
            <ul className="space-y-4">
              {habitos.map((h) => (
                <li key={h.num} className="flex gap-4 items-start">
                  <span className="font-display font-black text-gold-500 text-xl min-w-[2.5rem]">{h.num}</span>
                  <div>
                    <p className="font-display font-bold text-white text-sm uppercase tracking-wide">{h.titulo}</p>
                    <p className="text-dark-300 text-sm mt-0.5">{h.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Form */}
          <div>
            <div className="bg-dark-800 border border-dark-600 rounded-2xl p-8">
              <h2 className="font-display font-black text-white text-xl uppercase tracking-wide mb-2">
                Recibe la guía en tu email
              </h2>
              <p className="text-dark-300 text-sm mb-6">
                Completa el formulario y recibe el PDF de inmediato. Sin spam.
              </p>
              <LeadMagnetForm fuente="gratis-page" dark />
            </div>
            <div className="mt-6 flex flex-col gap-3">
              {[
                "PDF descargable al instante",
                "Aplicable a cualquier deporte",
                "Basado en psicología deportiva real",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-dark-300 text-sm">
                  <span className="text-gold-500 font-bold">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
