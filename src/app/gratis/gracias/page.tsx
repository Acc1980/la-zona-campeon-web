import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "¡Guía Lista para Descargar!",
  description: "Descarga tu guía gratuita de los 5 hábitos mentales del campeón.",
  robots: { index: false, follow: false },
};

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-dark-900 px-6 py-24">
      <div className="max-w-lg w-full text-center mx-auto">

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
          Descarga tu guía y el calendario de seguimiento. Tienes todo lo que necesitas para empezar hoy.
        </p>

        <div className="flex flex-col gap-4 w-full mb-16">
          <a
            href="/guia-5-habitos.html"
            download="Guia-5-Habitos-Mentales-del-Campeon.html"
            className="btn-primary text-base px-8 py-4 font-display font-black uppercase tracking-wider inline-flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Descargar Guía 5 Hábitos
          </a>

        </div>

        {/* Upsell — Manual N4 */}
        <div className="border border-gold-500/40 rounded-2xl p-8 bg-dark-800 text-left mb-10">
          <p className="font-display font-bold text-xs tracking-widest uppercase text-gold-500 mb-3">
            ¿Quieres ir más profundo?
          </p>
          <h2 className="font-display font-black text-white text-xl uppercase tracking-wide leading-tight mb-3">
            Manual 100% Personalizado<br />para tu deporte y posición
          </h2>
          <p className="text-dark-300 text-sm leading-relaxed mb-6">
            La guía que descargaste es el primer paso. El manual personalizado va al detalle de tu deporte, tu posición, tus fortalezas y las áreas donde más necesitas trabajar la mente. Exactamente lo que necesitas tú, no uno genérico.
          </p>
          <ul className="space-y-2 mb-8">
            {[
              "Generado específicamente para tu deporte y posición",
              "Situaciones reales que vives en competencia",
              "Protocolos para antes, durante y después del partido",
              "Te llega al correo en menos de 1 hora",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-dark-200 text-sm">
                <span className="text-gold-500 font-bold shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="font-display font-black text-gold-500 text-2xl">$29.99 USD</p>
            <Link
              href="/personalizado"
              className="btn-primary text-sm px-6 py-3 font-display font-black uppercase tracking-wider"
            >
              Generar Mi Manual →
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-dark-700">
          <p className="text-dark-400 text-sm mb-4">Activa tu mente antes del partido:</p>
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
