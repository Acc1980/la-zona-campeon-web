"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/links") return null;
  return (
    <footer className="bg-dark-900 border-t border-dark-700">
      {/* Guía gratis — para quien scrolleó todo y aún no se decidió */}
      <div className="border-b border-dark-700 bg-dark-800/60">
        <div className="section-container py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display font-black text-xs uppercase tracking-widest text-gold-500 mb-1">
              ¿Prefieres empezar gratis?
            </p>
            <p className="font-display font-bold text-white text-base uppercase tracking-wide">
              Descarga la Guía — Los 5 Hábitos Mentales del Campeón
            </p>
          </div>
          <Link
            href="/gratis"
            className="btn-secondary text-xs px-6 py-2.5 shrink-0"
          >
            Descargar gratis →
          </Link>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <span className="font-display font-black text-xl uppercase tracking-wider">
              <span className="text-gold-500">La Zona</span>
              <span className="text-white"> Campeón</span>
            </span>
            <p className="mt-3 text-dark-300 text-sm leading-relaxed">
              Entrenamiento mental para deportistas. Herramientas prácticas para desbloquear tu máximo potencial.
            </p>
            <p className="mt-4 text-gold-500 text-sm font-display font-semibold italic">
              "Tu juego cambia cuando tu mente cambia."
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-gold-500 mb-4">
              Navegación
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Inicio", href: "/" },
                { label: "Productos", href: "/productos" },
                { label: "Guía Gratis", href: "/gratis" },
                { label: "Política de Privacidad", href: "/privacidad" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-dark-300 hover:text-gold-500 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-gold-500 mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:info@lazonacampeon.com" className="text-dark-300 hover:text-gold-500 text-sm transition-colors flex items-center gap-2">
                  <span className="text-gold-500">✉</span> info@lazonacampeon.com
                </a>
              </li>
              <li>
                <a href="https://instagram.com/lazonacampeon" target="_blank" rel="noopener noreferrer" className="text-dark-300 hover:text-gold-500 text-sm transition-colors flex items-center gap-2">
                  <span className="text-gold-500">📸</span> Instagram DM @lazonacampeon
                </a>
              </li>
              <li>
                <a href="https://tiktok.com/@lazonacampeon" target="_blank" rel="noopener noreferrer" className="text-dark-300 hover:text-gold-500 text-sm transition-colors flex items-center gap-2">
                  <span className="text-gold-500">▶</span> TikTok @lazonacampeon
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-dark-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-dark-400 text-xs">
          <span>© {new Date().getFullYear()} La Zona Campeón. Todos los derechos reservados.</span>
          <Link href="/privacidad" className="hover:text-gold-500 transition-colors">Política de Privacidad</Link>
        </div>
      </div>
    </footer>
  );
}
