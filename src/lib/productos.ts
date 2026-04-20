export interface Producto {
  title: string;
  price: number;
  description: string;
  manualUrl: string; // ruta relativa al public/
  planUrl?: string;  // plan de 4 semanas (solo N3)
}

export const PRODUCTOS: Record<string, Producto> = {
  // ── NIVEL 2 — $9.99 ──────────────────────────────────────────────────────
  "n2-espiral-negativa": {
    title: "La Espiral Negativa",
    price: 9.99,
    description: "Cómo detener el ciclo de errores, frustración y más errores. Manual N2 — 5 capítulos.",
    manualUrl: "/n2-rev-c3a8f1/01-espiral-negativa.html",
    planUrl: "/n2-rev-c3a8f1/espiral-negativa-4-semanas.html",
  },
  "n2-concentracion": {
    title: "Concentración Bajo Presión",
    price: 9.99,
    description: "Técnicas para mantener el foco cuando el partido está en juego. Manual N2.",
    manualUrl: "/n2-rev-c3a8f1/02-concentracion-bajo-presion.html",
    planUrl: "/n2-rev-c3a8f1/concentracion-4-semanas.html",
  },
  "n2-confianza": {
    title: "Confianza y Autoestima Deportiva",
    price: 9.99,
    description: "Construye una confianza que no depende de los resultados. Manual N2.",
    manualUrl: "/n2-rev-c3a8f1/03-confianza-autoestima.html",
    planUrl: "/n2-rev-c3a8f1/confianza-4-semanas.html",
  },
  "n2-errores": {
    title: "Manejo de Errores y Fracasos",
    price: 9.99,
    description: "Procesa los errores rápido y vuelve al juego sin que te destruyan. Manual N2.",
    manualUrl: "/n2-rev-c3a8f1/04-manejo-errores-fracasos.html",
    planUrl: "/n2-rev-c3a8f1/errores-fracasos-4-semanas.html",
  },
  "n2-liderazgo": {
    title: "Liderazgo y Comunicación en Equipo",
    price: 9.99,
    description: "Influye positivamente en tu equipo sin necesitar la banda de campeón. Manual N2.",
    manualUrl: "/n2-rev-c3a8f1/05-liderazgo-comunicacion.html",
    planUrl: "/n2-rev-c3a8f1/liderazgo-4-semanas.html",
  },

  // ── NIVEL 3 — $19.99 ─────────────────────────────────────────────────────
  "mente-portero": {
    title: "La Mente del Portero",
    price: 19.99,
    description: "Concentración extrema, liderazgo desde atrás, recuperación mental tras goles. Manual N3.",
    manualUrl: "/n3-pos-f4c9d2/01-portero.html",
    planUrl: "/n3-pos-f4c9d2/portero-4-semanas.html",
  },
  "mente-defensa-central": {
    title: "La Mente del Defensa Central",
    price: 19.99,
    description: "Liderazgo defensivo, anticipación y calma en los momentos decisivos. Manual N3.",
    manualUrl: "/n3-pos-f4c9d2/02-defensa-central.html",
    planUrl: "/n3-pos-f4c9d2/defensa-central-4-semanas.html",
  },
  "mente-lateral": {
    title: "La Mente del Lateral",
    price: 19.99,
    description: "Expansión ofensiva, identidad completa y proyección al ataque. Manual N3.",
    manualUrl: "/n3-pos-f4c9d2/03-lateral.html",
    planUrl: "/n3-pos-f4c9d2/lateral-4-semanas.html",
  },
  "mente-mediocampista": {
    title: "La Mente del Mediocampista",
    price: 19.99,
    description: "Creatividad bajo presión, liderazgo técnico y toma de decisiones. Manual N3.",
    manualUrl: "/n3-pos-f4c9d2/04-mediocampista.html",
    planUrl: "/n3-pos-f4c9d2/mediocampista-4-semanas.html",
  },
  "mente-extremo": {
    title: "La Mente del Extremo",
    price: 19.99,
    description: "Velocidad mental, desborde y decisión en el uno contra uno. Manual N3.",
    manualUrl: "/n3-pos-f4c9d2/05-extremo.html",
    planUrl: "/n3-pos-f4c9d2/extremo-4-semanas.html",
  },
  "mente-delantero-centro": {
    title: "La Mente del Delantero Centro",
    price: 19.99,
    description: "Sequías de gol, presión del equipo e instinto anotador. Manual N3.",
    manualUrl: "/n3-pos-f4c9d2/06-delantero-centro.html",
    planUrl: "/n3-pos-f4c9d2/delantero-centro-4-semanas.html",
  },
};
