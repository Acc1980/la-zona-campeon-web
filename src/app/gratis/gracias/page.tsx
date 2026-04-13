import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "¡Gracias! Revisa tu email",
  robots: { index: false, follow: false },
};

export default function GraciasPage() {
  return (
    <div className="pt-20 min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="section-container py-16 text-center max-w-xl">
        <div className="text-6xl mb-6">🏆</div>
        <p className="heading-3 mb-3">¡Excelente decisión!</p>
        <div className="gold-line mx-auto mb-6" />
        <h1 className="heading-1 mb-4">Revisa tu email</h1>
        <p className="text-dark-300 text-lg mb-8 leading-relaxed">
          Te enviamos la guía <strong className="text-gold-500">"Los 5 Hábitos Mentales del Campeón"</strong> a tu correo. Revisa tu bandeja de entrada (y también el spam, por si acaso).
        </p>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 mb-8 text-left">
          <p className="font-display font-bold text-white text-sm uppercase tracking-wide mb-3">Mientras tanto...</p>
          <ul className="space-y-2 text-dark-300 text-sm">
            <li className="flex gap-2"><span className="text-gold-500">→</span> Explora nuestros manuales por posición</li>
            <li className="flex gap-2"><span className="text-gold-500">→</span> Síguenos en Instagram para contenido diario</li>
            <li className="flex gap-2"><span className="text-gold-500">→</span> Comparte la guía con un compañero de equipo</li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/productos" className="btn-primary">Ver Productos</Link>
          <Link href="/" className="btn-secondary">Volver al Inicio</Link>
        </div>
      </div>
    </div>
  );
}
