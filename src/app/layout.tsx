import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const GA_ID = "G-1XNSES9N1R";

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
    "Manuales, guías y programas de entrenamiento mental para deportistas, entrenadores y padres. Desbloquea tu máximo potencial con entrenamiento mental aplicado.",
  keywords: [
    "entrenamiento mental deportivo",
    "entrenamiento mental",
    "manuales deportivos",
    "mentalidad ganadora",
    "rendimiento deportivo",
    "control mental para futbolistas",
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
      "Manuales y programas de entrenamiento mental. Herramientas prácticas para deportistas, entrenadores y padres.",
  },
  twitter: {
    card: "summary_large_image",
    title: "La Zona Campeón — Entrenamiento Mental para Deportistas",
    description: "Manuales y programas de entrenamiento mental aplicado.",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${openSans.variable}`}>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
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
