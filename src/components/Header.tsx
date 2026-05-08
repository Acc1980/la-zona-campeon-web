"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname === "/links") return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-dark-800/95 backdrop-blur-md shadow-lg shadow-black/30" : "bg-transparent"
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-[72px] md:h-[80px]">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-icon.png" alt="La Zona Campeón" width={60} height={60} />
            <span className="font-display font-black text-lg md:text-xl uppercase tracking-wider">
              <span className="text-gold-500">La Zona</span>
              <span className="text-white"> Campeón</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/productos" className="text-sm font-display font-semibold uppercase tracking-wider text-dark-200 hover:text-gold-500 transition-colors">
              Productos
            </Link>
            <Link href="/quiz" className="text-sm font-display font-semibold uppercase tracking-wider text-dark-200 hover:text-gold-500 transition-colors">
              ¿Qué manual necesito?
            </Link>
            <Link href="/frases" className="text-sm font-display font-semibold uppercase tracking-wider text-dark-200 hover:text-gold-500 transition-colors">
              Frase del Día
            </Link>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-white"
            aria-label="Menú"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-dark-800 border-t border-dark-600 py-4 flex flex-col gap-4">
            <Link href="/productos" onClick={() => setMenuOpen(false)} className="px-4 text-sm font-display font-semibold uppercase tracking-wider text-dark-200 hover:text-gold-500 transition-colors">
              Productos
            </Link>
            <Link href="/quiz" onClick={() => setMenuOpen(false)} className="px-4 text-sm font-display font-semibold uppercase tracking-wider text-dark-200 hover:text-gold-500 transition-colors">
              ¿Qué manual necesito?
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
