import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "La Zona Campeón — Links",
  description: "Todos los recursos de La Zona Campeón en un solo lugar.",
};

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="#e2bc8e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="url(#ig-gradient)">
      <defs>
        <radialGradient id="ig-gradient" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.73a4.85 4.85 0 0 1-1.01-.04z" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="#888" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

const links = [
  {
    href: "https://lazonacampeon.com/productos",
    label: "Ver los manuales por posición",
    sub: "Portero, defensa, mediocampista y más",
    gold: false,
    icon: <IconBook />,
    iconBg: null,
  },
  {
    href: "https://www.instagram.com/lazonacampeon",
    label: "Instagram",
    sub: "@lazonacampeon",
    gold: false,
    icon: <IconInstagram />,
    iconBg: null,
  },
  {
    href: "https://www.tiktok.com/@lazonacampeon",
    label: "TikTok",
    sub: "@lazonacampeon",
    gold: false,
    icon: <IconTikTok />,
    iconBg: null,
  },
  {
    href: "https://lazonacampeon.com",
    label: "lazonacampeon.com",
    sub: "Entrenamiento mental para deportistas",
    gold: false,
    icon: <IconGlobe />,
    iconBg: null,
  },
];

export default function LinksPage() {
  return (
    <main className="min-h-screen bg-[#16171e] flex flex-col items-center justify-start py-16 px-4">
      <div className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 rounded-full border-2 border-[#e2bc8e] overflow-hidden mb-4 flex items-center justify-center bg-[#16171e]">
          <Image src="/logo.png" alt="La Zona Campeón" width={96} height={96} className="object-contain w-full h-full" />
        </div>
        <h1 className="font-display font-black text-white text-xl tracking-wide uppercase">
          La Zona Campeón
        </h1>
        <p className="text-[#888] text-sm mt-1 text-center">
          Entrenamiento mental para deportistas
        </p>
      </div>

      <div className="w-full max-w-md flex flex-col gap-3">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-4 w-full px-5 py-4 rounded-xl border transition-all duration-200 ${
              link.gold
                ? "bg-[#e2bc8e] border-[#e2bc8e] text-[#0a0a0a] hover:bg-[#d4b83a]"
                : "bg-[#2c2f3a] border-[#474a54] text-white hover:border-[#e2bc8e]/60 hover:bg-[#353840]"
            }`}
          >
            <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center">
              {link.icon}
            </span>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm uppercase tracking-wide">
                {link.label}
              </span>
              <span className={`text-xs mt-0.5 ${link.gold ? "text-[#0a0a0a]/70" : "text-[#888]"}`}>
                {link.sub}
              </span>
            </div>
          </a>
        ))}
      </div>

      <p className="mt-12 text-[#444] text-xs">lazonacampeon.com</p>
    </main>
  );
}
