import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-700">
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
              Redes sociales
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Instagram", href: "https://instagram.com/lazonacampeon" },
                { label: "TikTok", href: "https://tiktok.com/@lazonacampeon" },
                { label: "YouTube", href: "https://youtube.com/@lazonacampeon" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-dark-300 hover:text-gold-500 text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-dark-700 text-center text-dark-400 text-xs">
          © {new Date().getFullYear()} La Zona Campeón. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
