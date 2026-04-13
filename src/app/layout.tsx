import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-opensans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "La Zona Campeón — Entrenamiento Mental para Deportistas",
    template: "%s | La Zona Campeón",
  },
  description:
    "Manuales, guías y programas de entrenamiento mental para deportistas, entrenadores y padres. Desbloquea tu máximo potencial con psicología deportiva aplicada.",
  keywords: [
    "entrenamiento mental deportivo",
    "psicología deportiva",
    "manuales deportivos",
    "mentalidad ganadora",
    "rendimiento deportivo",
    "psicología para futbolistas",
    "entrenamiento mental futbol",
  ],
  alternates: {
    canonical: "https://lazonacampeon.com",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "La Zona Campeón",
    title: "La Zona Campeón — Entrenamiento Mental para Deportistas",
    description:
      "Manuales y programas de psicología deportiva. Herramientas prácticas para deportistas, entrenadores y padres.",
  },
  twitter: {
    card: "summary_large_image",
    title: "La Zona Campeón — Entrenamiento Mental para Deportistas",
    description: "Manuales y programas de psicología deportiva aplicada.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="font-sans antialiased">
        <a href="#main-content" className="skip-nav">
          Saltar al contenido
        </a>
        <Header />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
