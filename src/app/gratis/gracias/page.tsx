import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "¡Guía Lista para Descargar!",
  description: "Descarga tu guía gratuita de los 5 hábitos mentales del campeón.",
  robots: { index: false, follow: false },
};

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full text-center">

        {/* Ícono */}
        <div className="w-20 h-20 rounded-full bg-gold-500/20 border-2 border-gold-500/40 flex items-center justify-center mx-auto mb-8">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-gold-500">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <p className="font-display font-bold text-xs tracking-widest uppercase text-gold-500 mb-4">
          ¡Todo listo!
        </p>
        <h1 className="font-display font-black text-3xl md:text-4xl uppercase text-white mb-4 leading-tight">
          Tu guía está<br /><span className="text-gold-500">lista para descargar</span>
        </h1>
        <p className="text-dark-300 text-base mb-10 leading-relaxed">
          Haz clic en el botón para abrir los 5 Hábitos Mentales del Campeón. Léela antes de tu próximo entrenamiento.
        </p>

        <a
          href="/guia-5-habitos.html"
          target="_blank"
          className="btn-primary text-base px-10 py-4 font-display font-black uppercase tracking-wider inline-flex items-center gap-3 mb-6"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Abrir Guía Gratis
        </a>

        <div className="mt-10 pt-8 border-t border-dark-700">
          <p className="text-dark-400 text-sm mb-4">Mientras tanto, activa tu mente:</p>
          <Link
            href="/frases"
            className="text-gold-500 font-display font-bold text-sm uppercase tracking-wider hover:text-gold-400 transition-colors"
          >
            → Ver tu frase activadora del día
          </Link>
        </div>

      </div>
    </div>
  );
}
